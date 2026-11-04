/** Canal público da INDICA. Só a confirmação do servidor autoriza um sucesso. */
import { normalizarTelefone } from '@/lib/telefone';
import { migrarFormatoLegado } from '@/lib/formatos';
import type { PerfilCadastro, ReciboPublico, Candidatura, OrganizacaoExecutora, NovaOrganizacao, DadosPagamento, RascunhoProposta, ResumoRascunho, DadosRascunho, OfertaProposta, AnexoCandidatura, CategoriaAnexo, ConsultaAnexos } from '@/lib/types';
const DESTINO = (process.env.NEXT_PUBLIC_INDICA_API || process.env.NEXT_PUBLIC_TILT_API || '').replace(/\/+$/, '');
const LIMITE_MS = 30000;
export type MotivoEnvio = 'indisponivel' | 'rede' | 'recusado' | 'resposta' | 'perfil';
export class ErroEnvio extends Error {
    constructor(public motivo: MotivoEnvio, public status?: number) { super(motivo); this.name = 'ErroEnvio'; }
}
export function motivoDoErro(erro: unknown): MotivoEnvio {
    return erro instanceof ErroEnvio ? erro.motivo : 'rede';
}
export function canalAberto(): boolean { return DESTINO.length > 0; }
/** Mantido pelo formulário até receber confirmação, inclusive após timeout. */
export function novoEnvioId(): string {
    if (typeof crypto !== 'undefined' && crypto.randomUUID)
        return crypto.randomUUID();
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    bytes[6] = (bytes[6] & 15) | 64;
    bytes[8] = (bytes[8] & 63) | 128;
    const h = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
    return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}
async function requisitar(caminho: string, corpo?: unknown, token?: string, opcoes: {
    method?: 'PUT' | 'DELETE';
    keepalive?: boolean;
    timeoutMs?: number;
} = {}): Promise<Record<string, unknown>> {
    if (!canalAberto())
        throw new ErroEnvio('indisponivel');
    const controle = new AbortController();
    const multipart = typeof FormData !== 'undefined' && corpo instanceof FormData;
    const relogio = setTimeout(() => controle.abort(), opcoes.timeoutMs ?? LIMITE_MS);
    try {
        const resposta = await fetch(`${DESTINO}${caminho}`, {
            method: opcoes.method ?? (corpo === undefined ? 'GET' : 'POST'),
            keepalive: Boolean(!multipart && opcoes.keepalive && (corpo === undefined || new TextEncoder().encode(JSON.stringify(corpo)).length < 60000)),
            headers: { ...(corpo === undefined || multipart ? {} : { 'Content-Type': 'application/json' }), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
            ...(corpo === undefined ? {} : { body: multipart ? corpo as FormData : JSON.stringify(corpo) }),
            signal: controle.signal, cache: 'no-store', referrerPolicy: 'no-referrer',
        });
        if (!resposta.ok)
            throw new ErroEnvio('recusado', resposta.status);
        const json: unknown = await resposta.json().catch(() => null);
        if (!json || typeof json !== 'object' || Array.isArray(json))
            throw new ErroEnvio('resposta');
        return json as Record<string, unknown>;
    }
    catch (erro) {
        if (erro instanceof ErroEnvio)
            throw erro;
        throw new ErroEnvio('rede');
    }
    finally {
        clearTimeout(relogio);
    }
}
function texto(valor: unknown): string { return typeof valor === 'string' ? valor.trim() : ''; }
function identificador(valor: unknown): string {
    return typeof valor === 'number' && Number.isFinite(valor) ? String(valor) : texto(valor);
}
export function perfilParaEnvio(perfil: PerfilCadastro) {
    return {
        tipoCadastro: perfil.tipoCadastro ?? 'pf',
        nome: perfil.nome.trim(), email: perfil.email.trim().toLowerCase(),
        telefone: normalizarTelefone(perfil.telefone, perfil.pais), pais: perfil.pais,
        cidade: perfil.cidade.trim(), uf: perfil.uf.trim(), nichos: perfil.nichos,
        redes: perfil.redes.filter((rede) => rede.plataforma && rede.perfil).map((rede) => ({
            plataforma: rede.plataforma, perfil: rede.perfil.trim(),
            seguidores: Number.parseInt(rede.seguidores.replace(/\D/g, ''), 10) || 0,
        })),
    };
}
export async function enviarCadastro(perfil: PerfilCadastro): Promise<void> {
    const resposta = await requisitar('/tilt/publico/cadastro', { ...perfilParaEnvio(perfil), origem: 'site' });
    if (resposta.ok !== true)
        throw new ErroEnvio('resposta');
}
export async function enviarCandidatura(dados: {
    chamadaSlug: string;
    chamadaId?: string;
    envioId: string;
    organizacaoId: number | null;
    projeto: Record<string, string | number | string[]>;
    valorSolicitado: number;
    anexos?: string[];
}, token: string): Promise<{
    protocolo: string;
    chamadaId: string;
    reciboToken: string;
    pagamentoPendente?: boolean;
    simulacao?: boolean;
}> {
    const resposta = await requisitar('/tilt/publico/candidatura', dados, token);
    const protocolo = texto(resposta.protocolo), chamadaId = identificador(resposta.chamadaId), reciboToken = texto(resposta.reciboToken);
    if (!protocolo || !chamadaId || !reciboToken)
        throw new ErroEnvio('resposta');
    return { protocolo, chamadaId, reciboToken, pagamentoPendente: typeof resposta.pagamentoPendente === 'boolean' ? resposta.pagamentoPendente : undefined, simulacao: typeof resposta.simulacao === 'boolean' ? resposta.simulacao : undefined };
}
export async function enviarInscricaoCurso(cursoSlug: string, perfil: PerfilCadastro, envioId: string, token?: string) {
    const resposta = await requisitar('/tilt/publico/curso-inscricao', { cursoSlug, perfil: perfilParaEnvio(perfil), envioId }, token);
    const reciboToken = texto(resposta.reciboToken);
    if (resposta.ok !== true || !reciboToken || resposta.cursoSlug !== cursoSlug)
        throw new ErroEnvio('resposta');
    return { reciboToken, cursoSlug };
}
export async function consultarRecibo(reciboToken: string): Promise<ReciboPublico> {
    const resposta = await requisitar(`/tilt/publico/recibos/${encodeURIComponent(reciboToken)}`);
    const tipo = texto(resposta.tipo), referencia = identificador(resposta.referencia), estado = texto(resposta.estado);
    const titulo = texto(resposta.titulo), enviadaEm = texto(resposta.enviadaEm);
    if (!tipo || !referencia || !estado || !titulo || !enviadaEm)
        throw new ErroEnvio('resposta');
    return { tipo, referencia, estado, titulo, enviadaEm, protocolo: texto(resposta.protocolo) || undefined, reciboToken, pagamentoPendente: typeof resposta.pagamentoPendente === 'boolean' ? resposta.pagamentoPendente : undefined, simulacao: typeof resposta.simulacao === 'boolean' ? resposta.simulacao : undefined };
}
function objeto(v: unknown): Record<string, unknown> {
    return v && typeof v === 'object' && !Array.isArray(v) ? v as Record<string, unknown> : {};
}
function perfilRecebido(v: unknown): PerfilCadastro {
    const p = objeto(v);
    if (!texto(p.nome) || !texto(p.email))
        throw new ErroEnvio('resposta');
    return { tipoCadastro: p.tipoCadastro === 'pj' ? 'pj' : 'pf', nome: texto(p.nome), email: texto(p.email), telefone: texto(p.telefone), pais: texto(p.pais), cidade: texto(p.cidade), uf: texto(p.uf),
        nichos: Array.isArray(p.nichos) ? p.nichos.filter((x): x is string => typeof x === 'string') : [],
        redes: Array.isArray(p.redes) ? p.redes.map((v) => { const r = objeto(v); return { plataforma: texto(r.plataforma), perfil: texto(r.perfil), seguidores: identificador(r.seguidores) }; }) : [],
    };
}
function organizacaoRecebida(v: unknown): OrganizacaoExecutora {
    const o = objeto(v), id = Number(o.id);
    if (!Number.isSafeInteger(id) || id < 1 || !texto(o.cnpj) || !texto(o.razaoSocial))
        throw new ErroEnvio('resposta');
    return { id, cnpj: texto(o.cnpj), razaoSocial: texto(o.razaoSocial), nomeFantasia: texto(o.nomeFantasia), cidade: texto(o.cidade), uf: texto(o.uf), email: texto(o.email), telefone: texto(o.telefone) };
}
export interface ContaRecebida {
    participaBanco: boolean;
    perfil: PerfilCadastro;
    organizacoes: OrganizacaoExecutora[];
    candidaturas: Candidatura[];
    inscricoesCursos: ReciboPublico[];
    rascunhos: ResumoRascunho[];
}
function contaRecebida(r: Record<string, unknown>): ContaRecebida {
    const perfil = perfilRecebido(r.perfil);
    const organizacoes = Array.isArray(r.organizacoes) ? r.organizacoes.map(organizacaoRecebida) : [];
    const candidaturas = Array.isArray(r.candidaturas) ? r.candidaturas.map((v): Candidatura => {
        const c = objeto(v), p = objeto(c.projeto), responsavel = objeto(c.responsavel), protocolo = texto(c.protocolo);
        if (!protocolo)
            throw new ErroEnvio('resposta');
        return { id: protocolo, protocolo, chamadaId: identificador(c.chamadaId), reciboToken: texto(c.reciboToken) || undefined,
            editalSlug: texto(c.editalSlug) || texto(c.referencia), editalTitulo: texto(c.editalTitulo) || texto(c.titulo),
            projeto: texto(p.titulo), formato: texto(p.formato), formatos: Array.isArray(p.formatos) ? p.formatos.filter((v): v is string => typeof v === 'string') : undefined,
            formatoOutro: texto(p.formatoOutro), divulgacaoSite: texto(p.divulgacaoSite), descricao: texto(p.descricao), justificativa: texto(p.justificativa), alcance: texto(p.alcance), distribuicao: texto(p.distribuicao), linksPortfolio: texto(p.linksPortfolio),
            valorSolicitado: Number(c.valorSolicitado) || 0, status: texto(c.estado) as Candidatura['status'], enviadaEm: texto(c.enviadaEm),
            organizacaoId: c.organizacaoId == null ? null : Number(c.organizacaoId), organizacao: texto(objeto(c.organizacao).cnpj) ? organizacaoRecebida({ ...objeto(c.organizacao), id: objeto(c.organizacao).id ?? c.organizacaoId }) : c.organizacaoId == null ? undefined : organizacoes.find((o) => o.id === Number(c.organizacaoId)),
            proponente: { nome: texto(responsavel.nome) || perfil.nome, email: texto(responsavel.email) || perfil.email, telefone: texto(responsavel.telefone) || perfil.telefone, pais: texto(responsavel.pais) || perfil.pais, cidade: texto(responsavel.cidade) || perfil.cidade, uf: texto(responsavel.uf) || perfil.uf },
            pagamentoPendente: c.pagamentoPendente === true, pagamentoStatus: texto(c.pagamentoStatus), simulacao: c.simulacao === true,
            historico: Array.isArray(c.historico) ? c.historico.map(v => { const h = objeto(v); return { estado: texto(h.estado), em: texto(h.em) }; }).filter(h => h.estado && h.em) : [],
            oferta: c.oferta ? ofertaRecebida(c.oferta) : undefined };
    }) : [];
    const inscricoesCursos: ReciboPublico[] = Array.isArray(r.inscricoesCursos) ? r.inscricoesCursos.map(v => { const c = objeto(v); return { tipo: 'curso', referencia: texto(c.cursoSlug) || texto(c.referencia), titulo: texto(c.titulo), estado: texto(c.estado), enviadaEm: texto(c.enviadaEm), reciboToken: texto(c.reciboToken) }; }) : [];
    const rascunhos: ResumoRascunho[] = Array.isArray(r.rascunhos) ? r.rascunhos.map(v => { const d = objeto(v); return { chamadaSlug: texto(d.chamadaSlug), tituloChamada: texto(d.tituloChamada), tituloProjeto: texto(d.tituloProjeto), atualizadoEm: texto(d.atualizadoEm), versao: Number(d.versao), envioId: texto(d.envioId), organizacaoId: d.organizacaoId == null ? null : Number(d.organizacaoId), aceitaEnvio: d.aceitaEnvio === true }; }) : [];
    return { perfil, organizacoes, candidaturas, inscricoesCursos, rascunhos, participaBanco: r.participaBanco === true };
}
export async function cadastrarConta(perfil: PerfilCadastro, senha: string, organizacao?: NovaOrganizacao, participaBanco = false) {
    const r = await requisitar('/tilt/publico/conta/cadastro', { perfil: { ...perfil, tipoCadastro: perfil.tipoCadastro ?? 'pf', email: perfil.email.trim().toLowerCase(), telefone: normalizarTelefone(perfil.telefone, perfil.pais) }, senha, participaBanco, ...(organizacao ? { organizacao } : {}) });
    if (r.ok !== true || !texto(r.token))
        throw new ErroEnvio('resposta');
    return { ...contaRecebida(r), token: texto(r.token) };
}
export async function entrarConta(email: string, senha: string) {
    const r = await requisitar('/tilt/publico/conta/login', { email: email.trim().toLowerCase(), senha });
    if (r.ok !== true || !texto(r.token))
        throw new ErroEnvio('resposta');
    return { ...contaRecebida(r), token: texto(r.token) };
}
export async function consultarConta(token: string) { return contaRecebida(await requisitar('/tilt/publico/conta/me', undefined, token)); }
export async function sairConta(token: string) { await requisitar('/tilt/publico/conta/sair', {}, token); }
export async function enviarOrganizacao(dados: NovaOrganizacao, token: string) {
    const r = await requisitar('/tilt/publico/conta/organizacoes', dados, token);
    if (r.ok !== true || !Array.isArray(r.organizacoes))
        throw new ErroEnvio('resposta');
    return r.organizacoes.map(organizacaoRecebida);
}
export async function consultarPagamento(protocolo: string, token: string): Promise<{
    habilitado: boolean;
    recebido: boolean;
    dados?: DadosPagamento;
    titular: string;
    cnpj?: string;
    tipoPessoa: 'pf' | 'pj';
}> {
    const r = await requisitar(`/tilt/publico/conta/propostas/${encodeURIComponent(protocolo)}/pagamento`, undefined, token);
    if (typeof r.habilitado !== 'boolean' || typeof r.recebido !== 'boolean' || !texto(r.titular) || !['pf', 'pj'].includes(texto(r.tipoPessoa)) || (r.tipoPessoa === 'pj' && !texto(r.cnpj)))
        throw new ErroEnvio('resposta');
    // Apenas o formulário mantém estes dados em memória; nunca entram no contexto/cache.
    return { habilitado: r.habilitado, recebido: r.recebido, titular: texto(r.titular), cnpj: texto(r.cnpj) || undefined, tipoPessoa: r.tipoPessoa as 'pf' | 'pj', dados: r.dados ? objeto(r.dados) as unknown as DadosPagamento : undefined };
}
export async function enviarPagamento(protocolo: string, dados: DadosPagamento, token: string) {
    const r = await requisitar(`/tilt/publico/conta/propostas/${encodeURIComponent(protocolo)}/pagamento`, dados, token);
    if (r.ok !== true && !(r.recebido === true && typeof r.habilitado === 'boolean'))
        throw new ErroEnvio('resposta');
}
export async function atualizarPerfil(perfil: PerfilCadastro, token: string): Promise<PerfilCadastro> {
    const r = await requisitar('/tilt/publico/conta/perfil', { perfil }, token);
    if (r.ok !== true)
        throw new ErroEnvio('resposta');
    return perfilRecebido(r.perfil);
}
export const DADOS_RASCUNHO_VAZIOS: DadosRascunho = {
    projeto: '', descricao: '', formato: '', formatos: [], formatoOutro: '', divulgacaoSite: '', valor: '', justificativa: '', alcance: '', distribuicao: '', linksPortfolio: '',
};
function rascunhoRecebido(v: unknown): RascunhoProposta {
    const r = objeto(v), dados = objeto(r.dados), versao = Number(r.versao);
    if (!texto(r.chamadaSlug) || !texto(r.envioId) || !Number.isSafeInteger(versao) || versao < 1)
        throw new ErroEnvio('resposta');
    if (dados.formatos !== undefined && (!Array.isArray(dados.formatos) || dados.formatos.length > 20 || !dados.formatos.every(v => typeof v === 'string' && v.length <= 120)))
        throw new ErroEnvio('resposta');
    const campos = Object.fromEntries(Object.keys(DADOS_RASCUNHO_VAZIOS).filter(k => k !== 'formatos')
        .map(k => [k, typeof dados[k] === 'number' ? String(dados[k]) : typeof dados[k] === 'string' ? dados[k] : ''])) as Omit<DadosRascunho, 'formatos'>;
    let formatos = Array.isArray(dados.formatos) ? [...new Set(dados.formatos.map(v => (v as string).trim()).filter(Boolean))] : [];
    if (!formatos.length && !campos.formatoOutro.trim() && campos.formato.trim()) {
        const legado = migrarFormatoLegado(campos.formato);
        formatos = legado.formatos; campos.formatoOutro = legado.formatoOutro;
    }
    return { chamadaSlug: texto(r.chamadaSlug), envioId: texto(r.envioId), organizacaoId: r.organizacaoId == null ? null : Number(r.organizacaoId),
        dados: { ...campos, formatos },
        passo: Math.max(0, Math.min(2, Number(r.passo) || 0)), versao, atualizadoEm: texto(r.atualizadoEm) };
}
export async function consultarRascunho(slug: string, token: string) {
    const r = await requisitar(`/tilt/publico/conta/rascunhos/${encodeURIComponent(slug)}`, undefined, token);
    if (typeof r.aceitaEnvio !== 'boolean')
        throw new ErroEnvio('resposta');
    return { rascunho: r.rascunho ? rascunhoRecebido(r.rascunho) : null, aceitaEnvio: r.aceitaEnvio };
}
export type EnvioRascunho = Pick<RascunhoProposta, 'envioId' | 'organizacaoId' | 'dados' | 'passo'> & {
    versao: number | null;
};
export async function enviarRascunho(slug: string, dados: EnvioRascunho, token: string) {
    const r = await requisitar(`/tilt/publico/conta/rascunhos/${encodeURIComponent(slug)}`, dados, token, { method: 'PUT', keepalive: true });
    if (r.ok !== true)
        throw new ErroEnvio('resposta');
    return rascunhoRecebido(r.rascunho);
}
export async function excluirRascunho(slug: string, envioId: string, versao: number, token: string) {
    const r = await requisitar(`/tilt/publico/conta/rascunhos/${encodeURIComponent(slug)}`, { envioId, versao }, token, { method: 'DELETE' });
    if (r.ok !== true)
        throw new ErroEnvio('resposta');
}
const CATEGORIAS_ANEXO: CategoriaAnexo[] = ['identificacao', 'portfolio', 'midia-kit', 'proposta-orcamento'];
function anexoRecebido(valor: unknown): AnexoCandidatura {
    const a = objeto(valor), id = texto(a.id), tamanho = Number(a.tamanho);
    if (!/^[a-f0-9]{32}$/i.test(id) || !CATEGORIAS_ANEXO.includes(a.categoria as CategoriaAnexo)
        || !texto(a.nome) || !texto(a.mime) || !texto(a.criadoEm) || !Number.isSafeInteger(tamanho) || tamanho < 1
        || typeof a.pendente !== 'boolean' || !(a.propostaId === null || typeof a.propostaId === 'string'))
        throw new ErroEnvio('resposta');
    return { id, categoria: a.categoria as CategoriaAnexo, nome: texto(a.nome), mime: texto(a.mime), tamanho,
        criadoEm: texto(a.criadoEm), pendente: a.pendente, propostaId: a.propostaId as string | null };
}
export async function listarAnexos(slug: string, token: string): Promise<ConsultaAnexos> {
    if (!token) throw new ErroEnvio('perfil');
    const r = await requisitar(`/tilt/publico/conta/chamadas/${encodeURIComponent(slug)}/anexos`, undefined, token);
    const requisitos = objeto(r.requisitos), uso = objeto(r.uso);
    if (!Array.isArray(r.anexos) || !Array.isArray(requisitos.categorias) || !Array.isArray(requisitos.tiposPermitidos)
        || !requisitos.tiposPermitidos.every(v => typeof v === 'string' && /^\.[a-z0-9]+$/.test(v))
        || !['maxArquivoBytes', 'maxArquivos', 'maxTotalBytes'].every(k => Number.isSafeInteger(requisitos[k]) && Number(requisitos[k]) > 0)
        || !['arquivos', 'totalBytes'].every(k => Number.isSafeInteger(uso[k]) && Number(uso[k]) >= 0)
        || typeof requisitos.linksPortfolioObrigatorios !== 'boolean' || typeof r.aceitaEnvio !== 'boolean')
        throw new ErroEnvio('resposta');
    const categorias = requisitos.categorias.map(v => {
        const c = objeto(v);
        if (!CATEGORIAS_ANEXO.includes(c.id as CategoriaAnexo) || !texto(c.rotulo) || typeof c.obrigatoria !== 'boolean')
            throw new ErroEnvio('resposta');
        if (c.tiposPermitidos !== undefined && (!Array.isArray(c.tiposPermitidos) || !c.tiposPermitidos.every(v => typeof v === 'string' && /^\.[a-z0-9]+$/.test(v))))
            throw new ErroEnvio('resposta');
        return { id: c.id as CategoriaAnexo, rotulo: texto(c.rotulo), obrigatoria: c.obrigatoria,
            ...(c.tiposPermitidos === undefined ? {} : { tiposPermitidos: c.tiposPermitidos as string[] }) };
    });
    if (new Set(categorias.map(c => c.id)).size !== categorias.length) throw new ErroEnvio('resposta');
    const anexos = r.anexos.map(anexoRecebido);
    if (anexos.some(a => !a.pendente || a.propostaId !== null) || new Set(anexos.map(a => a.id)).size !== anexos.length)
        throw new ErroEnvio('resposta');
    return { anexos, requisitos: { categorias,
        maxArquivoBytes: Number(requisitos.maxArquivoBytes), maxArquivos: Number(requisitos.maxArquivos), maxTotalBytes: Number(requisitos.maxTotalBytes),
        tiposPermitidos: requisitos.tiposPermitidos as string[], linksPortfolioObrigatorios: requisitos.linksPortfolioObrigatorios },
        uso: { arquivos: Number(uso.arquivos), totalBytes: Number(uso.totalBytes) }, aceitaEnvio: r.aceitaEnvio };
}
export async function enviarAnexo(slug: string, categoria: CategoriaAnexo, arquivo: File, token: string): Promise<AnexoCandidatura> {
    if (!token) throw new ErroEnvio('perfil');
    const corpo = new FormData();
    corpo.append('arquivo', arquivo);
    corpo.append('categoria', categoria);
    const r = await requisitar(`/tilt/publico/conta/chamadas/${encodeURIComponent(slug)}/anexos`, corpo, token, { timeoutMs: 120000 });
    if (r.ok !== true) throw new ErroEnvio('resposta');
    const anexo = anexoRecebido(r.anexo);
    if (anexo.categoria !== categoria || !anexo.pendente || anexo.propostaId !== null) throw new ErroEnvio('resposta');
    return anexo;
}
export async function excluirAnexo(id: string, token: string): Promise<void> {
    if (!token) throw new ErroEnvio('perfil');
    const r = await requisitar(`/tilt/publico/conta/anexos/${encodeURIComponent(id)}`, undefined, token, { method: 'DELETE' });
    if (r.ok !== true) throw new ErroEnvio('resposta');
}
export async function obterArquivoAnexo(id: string, token: string): Promise<Blob> {
    if (!token) throw new ErroEnvio('perfil');
    if (!canalAberto()) throw new ErroEnvio('indisponivel');
    const controle = new AbortController(), relogio = setTimeout(() => controle.abort(), 120000);
    try {
        const resposta = await fetch(`${DESTINO}/tilt/publico/conta/anexos/${encodeURIComponent(id)}/arquivo`, {
            headers: { Authorization: `Bearer ${token}` }, cache: 'no-store', referrerPolicy: 'no-referrer', signal: controle.signal,
        });
        if (!resposta.ok) throw new ErroEnvio('recusado', resposta.status);
        const arquivo = await resposta.blob();
        if (!arquivo.size) throw new ErroEnvio('resposta');
        return arquivo;
    } catch (erro) {
        if (erro instanceof ErroEnvio) throw erro;
        throw new ErroEnvio('rede');
    } finally { clearTimeout(relogio); }
}
function ofertaRecebida(v: unknown): OfertaProposta {
    const o = objeto(v);
    if (!(typeof o.id === 'string' || typeof o.id === 'number') || !['pendente', 'aceita', 'recusada'].includes(texto(o.estado)) || !Number.isFinite(Number(o.valorOfertado)) || !Number.isSafeInteger(Number(o.versao)))
        throw new ErroEnvio('resposta');
    return { id: o.id, estado: texto(o.estado) as OfertaProposta['estado'], valorSolicitado: Number(o.valorSolicitado) || 0, valorOfertado: Number(o.valorOfertado), ressalva: texto(o.ressalva), criadaEm: texto(o.criadaEm), respondidaEm: texto(o.respondidaEm) || undefined, versao: Number(o.versao) };
}
export async function consultarOferta(protocolo: string, token: string) {
    const r = await requisitar(`/tilt/publico/conta/propostas/${encodeURIComponent(protocolo)}/oferta`, undefined, token);
    return r.oferta ? ofertaRecebida(r.oferta) : null;
}
export async function responderOferta(protocolo: string, oferta: OfertaProposta, aceitar: boolean, token: string) {
    const r = await requisitar(`/tilt/publico/conta/propostas/${encodeURIComponent(protocolo)}/oferta/resposta`, { ofertaId: oferta.id, versao: oferta.versao, aceitar }, token);
    if (r.ok !== true || !texto(r.estadoProposta))
        throw new ErroEnvio('resposta');
    return { oferta: ofertaRecebida(r.oferta), estadoProposta: texto(r.estadoProposta) };
}

export async function alterarParticipacaoBanco(participar: boolean, token: string): Promise<boolean> {
    const r = await requisitar('/tilt/publico/conta/banco', { participar }, token);
    if (r.ok !== true || typeof r.participaBanco !== 'boolean' || r.participaBanco !== participar)
        throw new ErroEnvio('resposta');
    return r.participaBanco;
}
