/** Canal público da INDICA. Só a confirmação do servidor autoriza um sucesso. */
import { normalizarTelefone } from '@/lib/telefone';
import type { PerfilCadastro, ReciboPublico, Candidatura, OrganizacaoExecutora, NovaOrganizacao, DadosPagamento } from '@/lib/types';

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
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 15) | 64;
  bytes[8] = (bytes[8] & 63) | 128;
  const h = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

async function requisitar(caminho: string, corpo?: unknown, token?: string): Promise<Record<string, unknown>> {
  if (!canalAberto()) throw new ErroEnvio('indisponivel');
  const controle = new AbortController();
  const relogio = setTimeout(() => controle.abort(), LIMITE_MS);
  try {
    const resposta = await fetch(`${DESTINO}${caminho}`, {
      method: corpo === undefined ? 'GET' : 'POST',
      headers: { ...(corpo === undefined ? {} : { 'Content-Type': 'application/json' }), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      ...(corpo === undefined ? {} : { body: JSON.stringify(corpo) }),
      signal: controle.signal, cache: 'no-store', referrerPolicy: 'no-referrer',
    });
    if (!resposta.ok) throw new ErroEnvio('recusado', resposta.status);
    const json: unknown = await resposta.json().catch(() => null);
    if (!json || typeof json !== 'object' || Array.isArray(json)) throw new ErroEnvio('resposta');
    return json as Record<string, unknown>;
  } catch (erro) {
    if (erro instanceof ErroEnvio) throw erro;
    throw new ErroEnvio('rede');
  } finally { clearTimeout(relogio); }
}
function texto(valor: unknown): string { return typeof valor === 'string' ? valor.trim() : ''; }
function identificador(valor: unknown): string {
  return typeof valor === 'number' && Number.isFinite(valor) ? String(valor) : texto(valor);
}
export function perfilParaEnvio(perfil: PerfilCadastro) {
  return {
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
  if (resposta.ok !== true) throw new ErroEnvio('resposta');
}
export async function enviarCandidatura(dados: {
  chamadaSlug: string; chamadaId?: string; envioId: string; organizacaoId: number;
  projeto: Record<string, string | number>; valorSolicitado: number;
}, token: string): Promise<{ protocolo: string; chamadaId: string; reciboToken: string; pagamentoPendente?:boolean; simulacao?:boolean }> {
  const resposta = await requisitar('/tilt/publico/candidatura', dados, token);
  const protocolo = texto(resposta.protocolo), chamadaId = identificador(resposta.chamadaId), reciboToken = texto(resposta.reciboToken);
  if (!protocolo || !chamadaId || !reciboToken) throw new ErroEnvio('resposta');
  return { protocolo, chamadaId, reciboToken, pagamentoPendente: typeof resposta.pagamentoPendente === 'boolean' ? resposta.pagamentoPendente : undefined, simulacao: typeof resposta.simulacao === 'boolean' ? resposta.simulacao : undefined };
}
export async function enviarInscricaoCurso(cursoSlug: string, perfil: PerfilCadastro, envioId: string, token?: string) {
  const resposta = await requisitar('/tilt/publico/curso-inscricao', { cursoSlug, perfil: perfilParaEnvio(perfil), envioId }, token);
  const reciboToken = texto(resposta.reciboToken);
  if (resposta.ok !== true || !reciboToken || resposta.cursoSlug !== cursoSlug) throw new ErroEnvio('resposta');
  return { reciboToken, cursoSlug };
}
export async function consultarRecibo(reciboToken: string): Promise<ReciboPublico> {
  const resposta = await requisitar(`/tilt/publico/recibos/${encodeURIComponent(reciboToken)}`);
  const tipo = texto(resposta.tipo), referencia = identificador(resposta.referencia), estado = texto(resposta.estado);
  const titulo = texto(resposta.titulo), enviadaEm = texto(resposta.enviadaEm);
  if (!tipo || !referencia || !estado || !titulo || !enviadaEm) throw new ErroEnvio('resposta');
  return { tipo, referencia, estado, titulo, enviadaEm, protocolo: texto(resposta.protocolo) || undefined, reciboToken, pagamentoPendente: typeof resposta.pagamentoPendente === 'boolean' ? resposta.pagamentoPendente : undefined, simulacao: typeof resposta.simulacao === 'boolean' ? resposta.simulacao : undefined };
}


function objeto(v: unknown): Record<string, unknown> {
  return v && typeof v === 'object' && !Array.isArray(v) ? v as Record<string, unknown> : {};
}
function perfilRecebido(v: unknown): PerfilCadastro {
  const p = objeto(v);
  if (!texto(p.nome) || !texto(p.email)) throw new ErroEnvio('resposta');
  return { nome: texto(p.nome), email: texto(p.email), telefone: texto(p.telefone), pais: texto(p.pais), cidade: texto(p.cidade), uf: texto(p.uf),
    nichos: Array.isArray(p.nichos) ? p.nichos.filter((x): x is string => typeof x === 'string') : [],
    redes: Array.isArray(p.redes) ? p.redes.map((v) => { const r = objeto(v); return { plataforma: texto(r.plataforma), perfil: texto(r.perfil), seguidores: identificador(r.seguidores) }; }) : [],
  };
}
function organizacaoRecebida(v: unknown): OrganizacaoExecutora {
  const o = objeto(v), id = Number(o.id);
  if (!Number.isSafeInteger(id) || id < 1 || !texto(o.cnpj) || !texto(o.razaoSocial)) throw new ErroEnvio('resposta');
  return { id, cnpj: texto(o.cnpj), razaoSocial: texto(o.razaoSocial), nomeFantasia: texto(o.nomeFantasia), cidade: texto(o.cidade), uf: texto(o.uf), email: texto(o.email), telefone: texto(o.telefone) };
}
export interface ContaRecebida { perfil: PerfilCadastro; organizacoes: OrganizacaoExecutora[]; candidaturas: Candidatura[]; inscricoesCursos:ReciboPublico[] }
function contaRecebida(r: Record<string, unknown>): ContaRecebida {
  const perfil = perfilRecebido(r.perfil);
  const organizacoes = Array.isArray(r.organizacoes) ? r.organizacoes.map(organizacaoRecebida) : [];
  const candidaturas = Array.isArray(r.candidaturas) ? r.candidaturas.map((v): Candidatura => {
    const c = objeto(v), p = objeto(c.projeto), responsavel = objeto(c.responsavel), protocolo = texto(c.protocolo);
    if (!protocolo) throw new ErroEnvio('resposta');
    return { id: protocolo, protocolo, chamadaId: identificador(c.chamadaId), reciboToken: texto(c.reciboToken) || undefined,
      editalSlug: texto(c.editalSlug) || texto(c.referencia), editalTitulo: texto(c.editalTitulo) || texto(c.titulo),
      projeto: texto(p.titulo), formato: texto(p.formato), descricao: texto(p.descricao), justificativa: texto(p.justificativa), alcance: texto(p.alcance), distribuicao: texto(p.distribuicao),
      valorSolicitado: Number(c.valorSolicitado) || 0, status: texto(c.estado) as Candidatura['status'], enviadaEm: texto(c.enviadaEm),
      organizacaoId: Number(c.organizacaoId), organizacao: c.organizacao ? organizacaoRecebida({...objeto(c.organizacao),id:objeto(c.organizacao).id??c.organizacaoId}) : organizacoes.find((o) => o.id === Number(c.organizacaoId)),
      proponente: { nome: texto(responsavel.nome) || perfil.nome, email: texto(responsavel.email) || perfil.email, telefone: texto(responsavel.telefone) || perfil.telefone, pais: perfil.pais, cidade: perfil.cidade, uf: perfil.uf },
      pagamentoPendente: c.pagamentoPendente === true, pagamentoStatus: texto(c.pagamentoStatus), simulacao: c.simulacao === true };
  }) : [];
  const inscricoesCursos:ReciboPublico[]=Array.isArray(r.inscricoesCursos)?r.inscricoesCursos.map(v=>{const c=objeto(v);return {tipo:'curso',referencia:texto(c.cursoSlug)||texto(c.referencia),titulo:texto(c.titulo),estado:texto(c.estado),enviadaEm:texto(c.enviadaEm),reciboToken:texto(c.reciboToken)};}):[];
  return { perfil, organizacoes, candidaturas, inscricoesCursos };
}
export async function cadastrarConta(perfil: PerfilCadastro, senha: string, organizacao?: NovaOrganizacao) {
  const r = await requisitar('/tilt/publico/conta/cadastro', { perfil: {...perfil,email:perfil.email.trim().toLowerCase(),telefone:normalizarTelefone(perfil.telefone,perfil.pais)}, senha, ...(organizacao ? { organizacao } : {}) });
  if (r.ok !== true || !texto(r.token)) throw new ErroEnvio('resposta');
  return { ...contaRecebida(r), token: texto(r.token) };
}
export async function entrarConta(email: string, senha: string) {
  const r = await requisitar('/tilt/publico/conta/login', { email: email.trim().toLowerCase(), senha });
  if (r.ok !== true || !texto(r.token)) throw new ErroEnvio('resposta');
  return { ...contaRecebida(r), token: texto(r.token) };
}
export async function consultarConta(token: string) { return contaRecebida(await requisitar('/tilt/publico/conta/me', undefined, token)); }
export async function sairConta(token: string) { await requisitar('/tilt/publico/conta/sair', {}, token); }
export async function enviarOrganizacao(dados: NovaOrganizacao, token: string) {
  const r = await requisitar('/tilt/publico/conta/organizacoes', dados, token);
  if (r.ok !== true || !Array.isArray(r.organizacoes)) throw new ErroEnvio('resposta');
  return r.organizacoes.map(organizacaoRecebida);
}
export async function consultarPagamento(protocolo: string, token: string): Promise<{ habilitado: boolean; recebido: boolean; dados?: DadosPagamento }> {
  const r = await requisitar(`/tilt/publico/conta/propostas/${encodeURIComponent(protocolo)}/pagamento`, undefined, token);
  if (typeof r.habilitado !== 'boolean' || typeof r.recebido !== 'boolean') throw new ErroEnvio('resposta');
  // Apenas o formulário mantém estes dados em memória; nunca entram no contexto/cache.
  return { habilitado: r.habilitado, recebido: r.recebido, dados: r.dados ? objeto(r.dados) as unknown as DadosPagamento : undefined };
}
export async function enviarPagamento(protocolo: string, dados: DadosPagamento, token: string) {
  const r = await requisitar(`/tilt/publico/conta/propostas/${encodeURIComponent(protocolo)}/pagamento`, dados, token);
  if (r.ok !== true && !(r.recebido === true && typeof r.habilitado === 'boolean')) throw new ErroEnvio('resposta');
}
