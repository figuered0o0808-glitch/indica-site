'use client';
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { Botao } from '@/components/Botao';
import { CampoArea, CampoSelecao, CampoTexto } from '@/components/Campo';
import { Passos } from '@/components/Passos';
import { Selo } from '@/components/Selo';
import { LoginConta } from '@/components/conta/LoginConta';
import { CadastroOrganizacao } from '@/components/conta/Organizacao';
import type { Idioma } from '@/i18n/idiomas';
import { textos } from '@/i18n/strings';
import { data, moeda } from '@/lib/format';
import { textoDaFaixa } from '@/lib/apoio';
import { motivoDoErro, ErroEnvio, type MotivoEnvio } from '@/lib/envio';
import { rota } from '@/lib/rotas';
import { useRascunho } from '@/components/conta/useRascunho';
import { StatusRascunho, CopiarRascunho } from '@/components/conta/RascunhoUI';
import { DADOS_RASCUNHO_VAZIOS } from '@/lib/envio';
import type { Candidatura, DadosRascunho } from '@/lib/types';
import { useApp } from '@/state/AppState';
export interface EditalResumo {
    slug: string;
    chamadaId?: string;
    titulo: string;
    faixaApoio: {
        min: number;
        max: number;
    } | null;
    simulacao?: boolean;
    aceitaEnvio?: boolean;
}
type Dados = DadosRascunho;
const VAZIO = DADOS_RASCUNHO_VAZIOS;
function Item({ rotulo, valor }: {
    rotulo: string;
    valor: ReactNode;
}) { return <div className="registro"><p className="registro__rotulo">{rotulo}</p><div style={{ whiteSpace: 'pre-line' }}>{valor}</div></div>; }
export function FormularioCandidatura({ idioma, edital }: {
    idioma: Idioma;
    edital: EditalResumo;
}) {
    const t = textos(idioma), tc = t.fluxos.candidatura;
    const { cadastrado, hidratado, carregandoConta, perfil, organizacoes, candidaturas, sessaoId, enviarCandidatura } = useApp();
    const rascunho = useRascunho(edital.slug, edital.aceitaEnvio !== false, organizacoes[0]?.id);
    const dados = rascunho.editor?.dados ?? VAZIO, passo = rascunho.editor?.passo ?? 0, organizacaoId = rascunho.editor?.organizacaoId ?? 0;
    const [adicionando, setAdicionando] = useState(false), [preparandoOutra, setPreparandoOutra] = useState(false);
    const [erros, setErros] = useState<Partial<Record<keyof Dados | 'organizacao', string>>>({}), [erroEnvio, setErroEnvio] = useState<MotivoEnvio>(), [busy, setBusy] = useState(false), [envioIncerto, setEnvioIncerto] = useState(false), [enviada, setEnviada] = useState<Candidatura | null>(null);
    const emVoo = useRef(false), topo = useRef<HTMLDivElement>(null), titulo = useRef<HTMLHeadingElement>(null), donoEnvio = useRef(sessaoId);
    useEffect(() => { if (rascunho.pronto && rascunho.editor?.aceitaEnvio && !organizacoes.some(o => o.id === organizacaoId) && organizacoes.length)
        rascunho.organizacao(organizacoes[0].id); }, [organizacoes, organizacaoId, rascunho.pronto, sessaoId]);
    useEffect(() => { titulo.current?.focus(); }, [passo, enviada]);
    useEffect(() => { setEnviada(null); setEnvioIncerto(false); setPreparandoOutra(false); setBusy(false); emVoo.current = false; donoEnvio.current = sessaoId; }, [sessaoId]);
    const org = organizacoes.find(o => o.id === organizacaoId);
    function atualizar(k: keyof Dados, v: string) { rascunho.campo(k, v); setErros(e => ({ ...e, [k]: undefined })); }
    function ir(p: number) { rascunho.passo(p); topo.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    function validar() { const e: typeof erros = {}; if (!org)
        e.organizacao = t.conta.empresaNecessaria; for (const k of Object.keys(VAZIO) as (keyof Dados)[])
        if (!dados[k].trim())
            e[k] = tc.erros.obrigatorio; const valor = Number(dados.valor); if (dados.valor && (!Number.isFinite(valor) || valor <= 0))
        e.valor = tc.erros.valorNumero;
    else if (edital.faixaApoio && (valor < edital.faixaApoio.min || valor > edital.faixaApoio.max))
        e.valor = `${tc.erros.valorFaixa} ${textoDaFaixa(idioma, edital.faixaApoio)}.`; return e; }
    async function enviar(e: FormEvent) {
        e.preventDefault();
        if (emVoo.current || !rascunho.editor?.aceitaEnvio || rascunho.status === 'conflito')
            return;
        if (passo === 0) {
            if (!org) {
                setErros({ organizacao: t.conta.empresaNecessaria });
                return;
            }
            ir(1);
            return;
        }
        const encontrados = validar();
        setErros(encontrados);
        if (Object.values(encontrados).some(Boolean)) {
            ir(encontrados.organizacao ? 0 : 1);
            return;
        }
        if (passo === 1) {
            ir(2);
            return;
        }
        emVoo.current = true;
        setBusy(true);
        setErroEnvio(undefined);
        try {
            if (!envioIncerto && !await rascunho.salvar(true)) {
                return;
            }
            rascunho.pausar();
            const nova = await enviarCandidatura({ editalSlug: edital.slug, chamadaId: edital.chamadaId, editalTitulo: edital.titulo, organizacaoId, projeto: dados.projeto.trim(), formato: dados.formato, valorSolicitado: Number(dados.valor), descricao: dados.descricao.trim(), justificativa: dados.justificativa.trim(), alcance: dados.alcance.trim(), distribuicao: dados.distribuicao.trim(), simulacao: edital.simulacao }, rascunho.editor.envioId);
            if (donoEnvio.current !== sessaoId)
                return;
            setEnviada(nova);
            setEnvioIncerto(false);
            topo.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        catch (e) {
            if (donoEnvio.current !== sessaoId)
                return;
            setErroEnvio(motivoDoErro(e));
            if (e instanceof ErroEnvio && e.status && e.status >= 400 && e.status < 500) {
                rascunho.retomar();
                setEnvioIncerto(false);
            }
            else
                setEnvioIncerto(true);
        }
        finally {
            if (donoEnvio.current === sessaoId) {
                emVoo.current = false;
                setBusy(false);
            }
        }
    }
    if (!hidratado || carregandoConta)
        return <p role="status">{t.conta.carregando}</p>;
    if (!cadastrado && edital.aceitaEnvio === false)
        return null;
    if (!cadastrado)
        return <LoginConta idioma={idioma} retorno={edital.slug}/>;
    if (enviada)
        return <div ref={topo} className="pilha--g"><section className="cartao"><h2 tabIndex={-1} ref={titulo}>{tc.confirmacao.titulo}</h2><Item rotulo={tc.confirmacao.protocolo} valor={enviada.protocolo}/><Item rotulo={tc.confirmacao.edital} valor={enviada.editalTitulo}/><Item rotulo={tc.confirmacao.projeto} valor={enviada.projeto}/><Item rotulo={t.conta.executora} valor={org?.razaoSocial}/><Item rotulo={tc.confirmacao.enviadaEm} valor={data(enviada.enviadaEm.slice(0, 10), idioma)}/><Item rotulo={tc.confirmacao.valor} valor={moeda(enviada.valorSolicitado, idioma)}/><Selo idioma={idioma} status={enviada.status}/><p>{tc.confirmacao.proximoPasso}</p></section><Botao href={rota(idioma, `painel/?recibo=${encodeURIComponent(enviada.reciboToken!)}`)}>{tc.confirmacao.acao}</Botao><p className="nota">{t.comum.envio.linkPrivado}</p></div>;
    if (!rascunho.pronto)
        return <div className="pilha"><p role="status">{rascunho.status === 'erroLeitura' ? t.conta.rascunhoFalhaLeitura : t.conta.rascunhoCarregando}</p>{rascunho.status === 'erroLeitura' ? <Botao onClick={() => void rascunho.carregar()}>{t.comum.envio.tentar}</Botao> : null}</div>;
    if (!rascunho.editor?.aceitaEnvio && !rascunho.editor?.versao)
        return null;
    if (!rascunho.editor?.aceitaEnvio)
        return <div className="pilha"><p>{t.conta.rascunhoFechado}</p><CopiarRascunho idioma={idioma} dados={dados}/></div>;
    const anterior = candidaturas.find(c => c.editalSlug === edital.slug);
    if (anterior && !rascunho.editor.versao && !preparandoOutra && !Object.values(dados).some(Boolean))
        return <section className="cartao"><p>{t.conta.propostaRecebida}</p><p>{anterior.projeto}</p><Botao href={rota(idioma, 'painel/')}>{tc.confirmacao.acao}</Botao><Botao variante="secundario" onClick={() => setPreparandoOutra(true)}>{t.conta.novaProposta}</Botao></section>;
    if (!organizacoes.length || adicionando)
        return <div className="pilha"><p>{t.conta.empresaNecessaria}</p><CadastroOrganizacao idioma={idioma} aposSalvar={() => setAdicionando(false)} onCancelar={organizacoes.length ? () => setAdicionando(false) : undefined}/></div>;
    return <div ref={topo}><div className="pilha" style={{ marginBottom: 24 }}><StatusRascunho idioma={idioma} status={rascunho.status} atualizadoEm={rascunho.editor?.atualizadoEm} onTentar={() => void rascunho.salvar(true)} onRecarregar={() => void rascunho.carregar()} dados={dados}/><p className="nota">{t.conta.rascunhoAviso}</p></div><Passos passos={[t.conta.executora, tc.projeto.titulo, tc.revisao.titulo]} atual={passo}/><form onSubmit={enviar} className="pilha--g" aria-busy={busy}><fieldset disabled={busy || envioIncerto || rascunho.status === 'carregando'} className="pilha--g" style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}>
  {passo === 0 ? <section className="pilha"><h2 ref={titulo} tabIndex={-1}>{t.conta.executora}</h2><CampoSelecao idioma={idioma} id="proposta-organizacao" rotulo={t.conta.selecionarEmpresa} value={String(organizacaoId)} opcoes={organizacoes.map(o => ({ valor: String(o.id), rotulo: `${o.razaoSocial} · ${o.cnpj}` }))} onChange={e => rascunho.organizacao(Number(e.target.value))} erro={erros.organizacao} required/>{org ? <div className="cartao"><Item rotulo={t.conta.razaoSocial} valor={org.razaoSocial}/><Item rotulo={t.conta.cnpj} valor={org.cnpj}/></div> : null}<Botao variante="secundario" onClick={() => setAdicionando(true)}>{t.conta.outraEmpresa}</Botao><div className="cartao"><h3>{t.conta.responsavel}</h3><Item rotulo={t.cadastro.campos.nome} valor={perfil?.nome}/><Item rotulo={t.conta.email} valor={perfil?.email}/><Item rotulo={t.conta.telefone} valor={perfil?.telefone}/></div></section> : null}
  {passo === 1 ? <section className="pilha"><h2 ref={titulo} tabIndex={-1}>{tc.projeto.titulo}</h2><CampoTexto idioma={idioma} id="projeto" rotulo={tc.projeto.nome} value={dados.projeto} maxLength={200} onChange={e => atualizar('projeto', e.target.value)} erro={erros.projeto} required/><CampoArea idioma={idioma} id="descricao" rotulo={tc.projeto.descricao} ajuda={tc.projeto.descricaoAjuda} value={dados.descricao} maxLength={10000} onChange={e => atualizar('descricao', e.target.value)} erro={erros.descricao} rows={5} required/><div className="grade--2"><CampoSelecao idioma={idioma} id="formato" rotulo={tc.projeto.formato} vazio={tc.selecioneFormato} opcoes={tc.formatos.map(f => ({ valor: f, rotulo: f }))} value={dados.formato} onChange={e => atualizar('formato', e.target.value)} erro={erros.formato} required/><CampoTexto idioma={idioma} id="valor" rotulo={tc.projeto.valor} type="number" min={0.01} step="any" value={dados.valor} onChange={e => atualizar('valor', e.target.value)} erro={erros.valor} ajuda={edital.faixaApoio ? textoDaFaixa(idioma, edital.faixaApoio) : undefined} required/></div>{(['justificativa', 'alcance', 'distribuicao'] as const).map(k => <CampoArea key={k} idioma={idioma} id={k} rotulo={tc.projeto[k]} ajuda={tc.projeto[`${k}Ajuda`]} value={dados[k]} maxLength={10000} onChange={e => atualizar(k, e.target.value)} erro={erros[k]} rows={3} required/>)}</section> : null}
  {passo === 2 ? <section className="pilha"><h2 ref={titulo} tabIndex={-1}>{tc.revisao.titulo}</h2><p>{tc.revisao.descricao}</p><div className="cartao"><Item rotulo={t.conta.executora} valor={org?.razaoSocial}/><Item rotulo={t.conta.cnpj} valor={org?.cnpj}/><Item rotulo={t.conta.responsavel} valor={perfil?.nome}/><Item rotulo={t.conta.email} valor={perfil?.email}/><Botao variante="discreto" onClick={() => ir(0)}>{tc.corrigir}</Botao></div><div className="cartao"><Item rotulo={tc.projeto.nome} valor={dados.projeto}/><Item rotulo={tc.projeto.descricao} valor={dados.descricao}/><Item rotulo={tc.projeto.formato} valor={dados.formato}/><Item rotulo={tc.projeto.valor} valor={moeda(Number(dados.valor), idioma)}/>{(['justificativa', 'alcance', 'distribuicao'] as const).map(k => <Item key={k} rotulo={tc.projeto[k]} valor={dados[k]}/>)}<Botao variante="discreto" onClick={() => ir(1)}>{tc.corrigir}</Botao></div></section> : null}
  {erroEnvio ? <p role="alert" className="campo__erro">{t.comum.envio[erroEnvio]}</p> : null}
  <div className="linha linha--fim">{passo > 0 ? <Botao variante="secundario" onClick={() => ir(passo - 1)}>{t.comum.acoes.voltar}</Botao> : <Botao href={rota(idioma, `oportunidades/${edital.slug}/`)} variante="secundario">{tc.voltarEdital}</Botao>}<Botao type="submit" disabled={busy || rascunho.status === 'conflito'}>{busy ? t.comum.envio.enviando : passo < 2 ? t.comum.acoes.avancar : erroEnvio && !envioIncerto ? t.comum.envio.tentar : t.comum.acoes.enviar}</Botao></div>
 </fieldset>{envioIncerto ? <div className="pilha"><p role="alert">{t.conta.envioIncerto}</p><CopiarRascunho idioma={idioma} dados={dados}/><Botao type="submit" disabled={busy}>{busy ? t.comum.envio.enviando : t.comum.envio.tentar}</Botao></div> : null}</form></div>;
}
