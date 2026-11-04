'use client';
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Botao } from '@/components/Botao';
import { CampoArea, CampoSelecao, CampoTexto } from '@/components/Campo';
import { Passos } from '@/components/Passos';
import { Selo } from '@/components/Selo';
import { LoginConta } from '@/components/conta/LoginConta';
import { CadastroOrganizacao } from '@/components/conta/Organizacao';
import type { Idioma } from '@/i18n/idiomas';
import { textos } from '@/i18n/strings';
import { textosAnexos, linksPortfolioValidos, type ErroAnexos } from '@/i18n/anexos';
import { AnexosCandidatura } from '@/components/conta/AnexosCandidatura';
import { useAnexos } from '@/components/conta/useAnexos';
import { data, moeda } from '@/lib/format';
import { textoDaFaixa } from '@/lib/apoio';
import { descreverFormatos, formatosValidos } from '@/lib/formatos';
import { eletrificacaoJa } from '@/lib/eletrificacao';
import anexosStyles from '@/components/conta/AnexosCandidatura.module.css';
import { motivoDoErro, ErroEnvio, type MotivoEnvio } from '@/lib/envio';
import { rota } from '@/lib/rotas';
import { useRascunho } from '@/components/conta/useRascunho';
import { StatusRascunho, CopiarRascunho } from '@/components/conta/RascunhoUI';
import { DADOS_RASCUNHO_VAZIOS } from '@/lib/envio';
import styles from '@/components/conta/AppPessoal.module.css';
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
    exigeCnpj?: boolean;
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
    const t = textos(idioma), tc = t.fluxos.candidatura, ta = textosAnexos(idioma), router = useRouter();
    const { cadastrado, hidratado, carregandoConta, perfil, organizacoes, candidaturas, sessaoId, enviarCandidatura } = useApp();
    const exigeCnpj = edital.exigeCnpj !== false;
    const rascunho = useRascunho(edital.slug, edital.aceitaEnvio !== false, exigeCnpj || perfil?.tipoCadastro === 'pj' ? organizacoes[0]?.id : undefined);
    const dados = rascunho.editor?.dados ?? VAZIO, passo = rascunho.editor?.passo ?? 0, organizacaoId = rascunho.editor?.organizacaoId ?? 0;
    const comDocumentos = edital.slug === 'carros-eletricos-no-brasil';
    const anexos = useAnexos(edital.slug, rascunho.editor?.envioId ?? '', comDocumentos && cadastrado && rascunho.pronto && rascunho.editor?.aceitaEnvio === true);
    const [erroAnexos, setErroAnexos] = useState<ErroAnexos>();
    const tentativaDocumentos = useRef<{ envioId: string; ids: string[]; linksPortfolio: string } | null>(null);
    useEffect(() => { tentativaDocumentos.current = null; setErroAnexos(undefined); }, [sessaoId, rascunho.editor?.envioId]);
    useEffect(() => { setErroAnexos(undefined); }, [anexos.consulta, anexos.fila]);
    const [adicionando, setAdicionando] = useState(false), [preparandoOutra, setPreparandoOutra] = useState(false);
    const [erros, setErros] = useState<Partial<Record<keyof Dados | 'organizacao', string>>>({}), [erroEnvio, setErroEnvio] = useState<MotivoEnvio>(), [busy, setBusy] = useState(false), [envioIncerto, setEnvioIncerto] = useState(false), [enviada, setEnviada] = useState<Candidatura | null>(null);
    const [saindo, setSaindo] = useState(false), [querPJ, setQuerPJ] = useState(false);
    const usaOrg = exigeCnpj || querPJ;
    useEffect(() => { if (rascunho.pronto) setQuerPJ(Boolean(rascunho.editor?.organizacaoId)); }, [rascunho.editor?.envioId, sessaoId]);
    const emVoo = useRef(false), topo = useRef<HTMLDivElement>(null), titulo = useRef<HTMLHeadingElement>(null), donoEnvio = useRef(sessaoId);
    useEffect(() => { if (usaOrg && rascunho.pronto && rascunho.editor?.aceitaEnvio && !organizacoes.some(o => o.id === organizacaoId) && organizacoes.length)
        rascunho.organizacao(organizacoes[0].id); }, [usaOrg, organizacoes, organizacaoId, rascunho.pronto, sessaoId]);
    useEffect(() => { titulo.current?.focus(); }, [passo, enviada]);
    useEffect(() => { setEnviada(null); setEnvioIncerto(false); setPreparandoOutra(false); setBusy(false); setSaindo(false); emVoo.current = false; donoEnvio.current = sessaoId; }, [sessaoId]);
    const org = organizacoes.find(o => o.id === organizacaoId);
    function atualizar(k: Exclude<keyof Dados, 'formatos'>, v: string) {
        if (k === 'formatoOutro') rascunho.campos({ formatoOutro: v, formato: descreverFormatos(dados.formatos, v) });
        else rascunho.campo(k, v);
        setErros(e => ({ ...e, [k]: undefined, ...(k === 'formatoOutro' ? { formato: undefined } : {}) }));
    }
    function marcarFormato(formato: string, marcado: boolean) {
        const formatos = marcado ? [...dados.formatos, formato] : dados.formatos.filter(v => v !== formato);
        if (formatos.length > 20) { setErros(e => ({ ...e, formato: ta.formatosLimite })); return; }
        rascunho.campos({ formatos, formato: descreverFormatos(formatos, dados.formatoOutro) });
        setErros(e => ({ ...e, formato: undefined }));
    }
    const formatosPadrao: readonly string[] = tc.formatos;
    const opcoesFormatos = [...formatosPadrao, ...dados.formatos.filter(v => !formatosPadrao.includes(v))];
    const formatoDescritivo = descreverFormatos(dados.formatos, dados.formatoOutro) || dados.formato;
    function ir(p: number) { rascunho.passo(p); topo.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    async function salvarESair(destino: string) {
        if (emVoo.current || envioIncerto || rascunho.status === 'conflito') return;
        emVoo.current = true;
        setSaindo(true);
        setErroEnvio(undefined);
        try {
            if (comDocumentos && anexos.fila.length) {
                const arquivos = await anexos.enviarTodos();
                if (donoEnvio.current !== sessaoId) return;
                if (!arquivos.ok) { setErroAnexos(arquivos.erro ?? 'upload'); ir(1); return; }
            }
            if (!await rascunho.salvar(true) || donoEnvio.current !== sessaoId) return;
            rascunho.pausar();
            router.push(rota(idioma, destino));
        } finally {
            if (donoEnvio.current === sessaoId) {
                emVoo.current = false;
                setSaindo(false);
            }
        }
    }
    function validar() {
        const e: typeof erros = {};
        if (usaOrg && !org) e.organizacao = t.conta.empresaNecessaria;
        const obrigatorios = ['projeto', 'descricao', 'valor', 'justificativa', 'alcance', 'distribuicao'] as const;
        for (const k of obrigatorios) if (!dados[k].trim()) e[k] = tc.erros.obrigatorio;
        if (!formatosValidos(dados.formatos, dados.formatoOutro)) e.formato = ta.formatosObrigatorios;
        if (comDocumentos && dados.linksPortfolio.trim() && !linksPortfolioValidos(dados.linksPortfolio)) e.linksPortfolio = ta.linksInvalidos;
        if (comDocumentos && (!dados.divulgacaoSite.trim() || dados.divulgacaoSite.length > 4000)) e.divulgacaoSite = ta.divulgacaoObrigatoria;
        const valor = Number(dados.valor);
        if (dados.valor && (!Number.isFinite(valor) || valor <= 0)) e.valor = tc.erros.valorNumero;
        else if (edital.faixaApoio && (valor < edital.faixaApoio.min || valor > edital.faixaApoio.max))
            e.valor = `${tc.erros.valorFaixa} ${textoDaFaixa(idioma, edital.faixaApoio)}.`;
        return e;
    }
    async function enviar(e: FormEvent) {
        e.preventDefault();
        if (emVoo.current || !rascunho.editor?.aceitaEnvio || rascunho.status === 'conflito') return;
        if (passo === 0) {
            if (usaOrg && !org) { setErros({ organizacao: t.conta.empresaNecessaria }); return; }
            ir(1); return;
        }
        const encontrados = validar();
        setErros(encontrados);
        if (Object.values(encontrados).some(Boolean)) { ir(encontrados.organizacao ? 0 : 1); return; }
        const repetindoEnvio = envioIncerto && tentativaDocumentos.current?.envioId === rascunho.editor.envioId;
        emVoo.current = true;
        setBusy(true);
        setErroEnvio(undefined);
        try {
            let ids = repetindoEnvio ? tentativaDocumentos.current!.ids : anexos.ids;
            if (comDocumentos && !repetindoEnvio) {
                const arquivos = await anexos.enviarTodos();
                if (donoEnvio.current !== sessaoId) return;
                setErroAnexos(arquivos.erro);
                if (!arquivos.ok) { ir(1); return; }
                ids = arquivos.ids;
            }
            if (!envioIncerto && (!await rascunho.salvar(true) || donoEnvio.current !== sessaoId)) return;
            if (passo === 1) { ir(2); return; }
            rascunho.pausar();
            if (!repetindoEnvio) tentativaDocumentos.current = { envioId: rascunho.editor.envioId, ids: [...ids], linksPortfolio: dados.linksPortfolio.trim() };
            const documentos = tentativaDocumentos.current!;
            const nova = await enviarCandidatura({ editalSlug: edital.slug, chamadaId: edital.chamadaId, editalTitulo: edital.titulo,
                organizacaoId: usaOrg ? organizacaoId : null, projeto: dados.projeto.trim(), formato: formatoDescritivo,
                formatos: [...dados.formatos], formatoOutro: dados.formatoOutro.trim(), divulgacaoSite: dados.divulgacaoSite.trim(),
                valorSolicitado: Number(dados.valor), descricao: dados.descricao.trim(), justificativa: dados.justificativa.trim(),
                alcance: dados.alcance.trim(), distribuicao: dados.distribuicao.trim(), linksPortfolio: documentos.linksPortfolio,
                anexos: documentos.ids, simulacao: edital.simulacao }, rascunho.editor.envioId);
            if (donoEnvio.current !== sessaoId) return;
            setEnviada(nova); setEnvioIncerto(false);
            topo.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } catch (e) {
            if (donoEnvio.current !== sessaoId) return;
            setErroEnvio(motivoDoErro(e));
            if (e instanceof ErroEnvio && e.status && e.status >= 400 && e.status < 500 && e.status !== 409) {
                tentativaDocumentos.current = null; rascunho.retomar(); setEnvioIncerto(false);
            } else setEnvioIncerto(true);
        } finally {
            if (donoEnvio.current === sessaoId) { emVoo.current = false; setBusy(false); }
        }
    }
    if (!hidratado || carregandoConta)
        return <p role="status">{t.conta.carregando}</p>;
    if (!cadastrado && edital.aceitaEnvio === false)
        return null;
    if (!cadastrado)
        return <LoginConta idioma={idioma} retorno={edital.slug}/>;
    if (enviada)
        return <div ref={topo} className="pilha--g"><section className="cartao"><h2 tabIndex={-1} ref={titulo}>{tc.confirmacao.titulo}</h2><Item rotulo={tc.confirmacao.protocolo} valor={enviada.protocolo}/><Item rotulo={tc.confirmacao.edital} valor={enviada.editalTitulo}/><Item rotulo={tc.confirmacao.projeto} valor={enviada.projeto}/><Item rotulo={usaOrg ? t.conta.executora : t.conta.pessoaFisica} valor={usaOrg ? org?.razaoSocial : perfil?.nome}/><Item rotulo={tc.confirmacao.enviadaEm} valor={data(enviada.enviadaEm.slice(0, 10), idioma)}/><Item rotulo={tc.confirmacao.valor} valor={moeda(enviada.valorSolicitado, idioma)}/><Selo idioma={idioma} status={enviada.status}/><p>{tc.confirmacao.proximoPasso}</p></section><Botao href={rota(idioma, `painel/?recibo=${encodeURIComponent(enviada.reciboToken!)}`)}>{tc.confirmacao.acao}</Botao><p className="nota">{t.comum.envio.linkPrivado}</p></div>;
    if (!rascunho.pronto)
        return <div className="pilha"><p role="status">{rascunho.status === 'erroLeitura' ? t.conta.rascunhoFalhaLeitura : t.conta.rascunhoCarregando}</p>{rascunho.status === 'erroLeitura' ? <Botao onClick={() => void rascunho.carregar()}>{t.comum.envio.tentar}</Botao> : null}</div>;
    if (!rascunho.editor?.aceitaEnvio && !rascunho.editor?.versao)
        return null;
    if (!rascunho.editor?.aceitaEnvio)
        return <div className="pilha"><p>{t.conta.rascunhoFechado}</p><CopiarRascunho idioma={idioma} dados={dados}/></div>;
    const anterior = candidaturas.find(c => c.editalSlug === edital.slug);
    if (anterior && !rascunho.editor.versao && !preparandoOutra && !Object.values(dados).some(v => Array.isArray(v) ? v.length > 0 : Boolean(v)))
        return <section className="cartao"><p>{t.conta.propostaRecebida}</p><p>{anterior.projeto}</p><Botao href={rota(idioma, 'painel/')}>{tc.confirmacao.acao}</Botao><Botao variante="secundario" onClick={() => setPreparandoOutra(true)}>{t.conta.novaProposta}</Botao></section>;
    if ((usaOrg && !organizacoes.length) || adicionando)
        return <div className="pilha"><p>{t.conta.empresaNecessaria}</p><CadastroOrganizacao idioma={idioma} aposSalvar={() => setAdicionando(false)} onCancelar={!exigeCnpj ? () => { setAdicionando(false); setQuerPJ(false); rascunho.organizacao(null); } : organizacoes.length ? () => setAdicionando(false) : undefined}/></div>;
    return <div ref={topo}><div className="pilha" style={{ marginBottom: 24 }}><StatusRascunho idioma={idioma} status={rascunho.status} atualizadoEm={rascunho.editor?.atualizadoEm} onTentar={() => void rascunho.salvar(true)} onRecarregar={() => void rascunho.carregar()} dados={dados}/><p className="nota">{t.conta.rascunhoAviso}</p><div><Botao className={styles.wrapButton} variante="secundario" disabled={busy || saindo || envioIncerto || rascunho.status === 'conflito'} onClick={() => void salvarESair('painel/#rascunhos')}>{saindo ? t.conta.salvando : t.conta.salvarEContinuarDepois}</Botao></div></div><div className={styles.proposalSteps}><Passos passos={[t.conta.proponenteTipoTitulo, tc.projeto.titulo, tc.revisao.titulo]} atual={passo}/></div><form onSubmit={enviar} className="pilha--g" aria-busy={busy || saindo}><fieldset disabled={busy || saindo || envioIncerto || rascunho.status === 'carregando'} className="pilha--g" style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}>
  {passo === 0 ? <section className="pilha"><h2 ref={titulo} tabIndex={-1}>{t.conta.proponenteTipoTitulo}</h2>{exigeCnpj ? <p className="nota">{t.conta.cnpjChamada}</p> : <CampoSelecao idioma={idioma} id="proposta-tipo" rotulo={t.conta.tipoCadastro} value={usaOrg ? 'pj' : 'pf'} opcoes={[{valor:'pf',rotulo:t.conta.pessoaFisica},{valor:'pj',rotulo:t.conta.pessoaJuridica}]} onChange={e=>{const pj=e.target.value==='pj';setQuerPJ(pj);rascunho.organizacao(pj ? organizacoes[0]?.id ?? null : null);}}/>}{usaOrg ? <><CampoSelecao idioma={idioma} id="proposta-organizacao" rotulo={t.conta.selecionarEmpresa} value={String(organizacaoId)} opcoes={organizacoes.map(o => ({ valor: String(o.id), rotulo: `${o.razaoSocial} · ${o.cnpj}` }))} onChange={e => rascunho.organizacao(Number(e.target.value))} erro={erros.organizacao} required/>{org ? <div className="cartao"><Item rotulo={t.conta.razaoSocial} valor={org.razaoSocial}/><Item rotulo={t.conta.cnpj} valor={org.cnpj}/></div> : null}<Botao variante="secundario" onClick={() => setAdicionando(true)}>{t.conta.outraEmpresa}</Botao></> : <p>{t.conta.propostaPfAjuda}</p>}<div className="cartao"><h3>{t.conta.responsavel}</h3><Item rotulo={t.cadastro.campos.nome} valor={perfil?.nome}/><Item rotulo={t.conta.email} valor={perfil?.email}/><Item rotulo={t.conta.telefone} valor={perfil?.telefone}/></div></section> : null}
  {passo === 1 ? <section className="pilha"><h2 ref={titulo} tabIndex={-1}>{tc.projeto.titulo}</h2><CampoTexto idioma={idioma} id="projeto" rotulo={tc.projeto.nome} value={dados.projeto} maxLength={200} onChange={e => atualizar('projeto', e.target.value)} erro={erros.projeto} required/><CampoArea idioma={idioma} id="descricao" rotulo={tc.projeto.descricao} ajuda={tc.projeto.descricaoAjuda} value={dados.descricao} maxLength={10000} onChange={e => atualizar('descricao', e.target.value)} erro={erros.descricao} rows={5} required/><fieldset className="pilha" style={{ border: 0, padding: 0, margin: 0 }} aria-describedby={erros.formato ? 'formato-ajuda formato-erro' : 'formato-ajuda'}><legend className="campo__rotulo">{ta.formatosTitulo}</legend><p className="campo__ajuda" id="formato-ajuda">{ta.formatosAjuda}</p><div className={anexosStyles.formatos}>{opcoesFormatos.map((formato, i) => <label key={formato} className={anexosStyles.formato} htmlFor={`formato-${i}`}><input id={`formato-${i}`} type="checkbox" checked={dados.formatos.includes(formato)} onChange={e => marcarFormato(formato, e.target.checked)}/><span>{formato}</span></label>)}</div>{erros.formato ? <p className="campo__erro" id="formato-erro">{erros.formato}</p> : null}<CampoArea idioma={idioma} id="formatoOutro" rotulo={ta.formatoOutro} value={dados.formatoOutro} maxLength={1000} onChange={e => atualizar('formatoOutro', e.target.value)} rows={3} opcional/></fieldset><div className="grade--2"><CampoTexto idioma={idioma} id="valor" rotulo={tc.projeto.valor} type="number" min={0.01} max={edital.faixaApoio?.max} step="any" value={dados.valor} onChange={e => atualizar('valor', e.target.value)} erro={erros.valor} ajuda={edital.faixaApoio ? textoDaFaixa(idioma, edital.faixaApoio) : undefined} required/></div>{(['justificativa', 'alcance', 'distribuicao'] as const).map(k => <CampoArea key={k} idioma={idioma} id={k} rotulo={tc.projeto[k]} ajuda={tc.projeto[`${k}Ajuda`]} value={dados[k]} maxLength={10000} onChange={e => atualizar(k, e.target.value)} erro={erros[k]} rows={3} required/>)}{comDocumentos ? <><CampoArea idioma={idioma} id="divulgacaoSite" rotulo={ta.divulgacaoSite} ajuda={ta.divulgacaoAjuda} value={dados.divulgacaoSite} maxLength={4000} onChange={e => atualizar('divulgacaoSite', e.target.value)} erro={erros.divulgacaoSite} rows={4} required/><p className="texto-mini"><a href={eletrificacaoJa.site} target="_blank" rel="noopener noreferrer">{ta.conhecerSite} ↗</a></p><CampoArea idioma={idioma} id="linksPortfolio" rotulo={ta.links} ajuda={ta.linksAjuda} value={dados.linksPortfolio} maxLength={8000} onChange={e => atualizar('linksPortfolio', e.target.value)} erro={erros.linksPortfolio} rows={4} opcional/><AnexosCandidatura idioma={idioma} controle={anexos} pessoaJuridica={usaOrg} disabled={busy || saindo || envioIncerto} erroValidacao={erroAnexos}/></> : null}</section> : null}
  {passo === 2 ? <section className="pilha"><h2 ref={titulo} tabIndex={-1}>{tc.revisao.titulo}</h2><p>{tc.revisao.descricao}</p><div className="cartao"><Item rotulo={usaOrg ? t.conta.executora : t.conta.pessoaFisica} valor={usaOrg ? org?.razaoSocial : perfil?.nome}/>{usaOrg ? <Item rotulo={t.conta.cnpj} valor={org?.cnpj}/> : null}<Item rotulo={t.conta.responsavel} valor={perfil?.nome}/><Item rotulo={t.conta.email} valor={perfil?.email}/><Botao variante="discreto" onClick={() => ir(0)}>{tc.corrigir}</Botao></div><div className="cartao"><Item rotulo={tc.projeto.nome} valor={dados.projeto}/><Item rotulo={tc.projeto.descricao} valor={dados.descricao}/><Item rotulo={ta.formatosTitulo} valor={formatoDescritivo}/><Item rotulo={tc.projeto.valor} valor={moeda(Number(dados.valor), idioma)}/>{(['justificativa', 'alcance', 'distribuicao'] as const).map(k => <Item key={k} rotulo={tc.projeto[k]} valor={dados[k]}/>)}{comDocumentos ? <><Item rotulo={ta.divulgacaoSite} valor={dados.divulgacaoSite}/>{dados.linksPortfolio.trim() ? <Item rotulo={ta.links} valor={dados.linksPortfolio}/> : null}</> : null}<Botao variante="discreto" onClick={() => ir(1)}>{tc.corrigir}</Botao></div>{comDocumentos ? <AnexosCandidatura idioma={idioma} controle={anexos} pessoaJuridica={usaOrg} disabled={busy || saindo || envioIncerto} revisao erroValidacao={erroAnexos}/> : null}</section> : null}
  {erroEnvio ? <p role="alert" className="campo__erro">{t.comum.envio[erroEnvio]}</p> : null}
  <div className="linha linha--fim">{passo > 0 ? <Botao variante="secundario" onClick={() => ir(passo - 1)}>{t.comum.acoes.voltar}</Botao> : <Botao onClick={() => void salvarESair(`oportunidades/${edital.slug}/`)} variante="secundario" disabled={saindo || rascunho.status === 'conflito'}>{tc.voltarEdital}</Botao>}<Botao type="submit" disabled={busy || saindo || rascunho.status === 'conflito' || (comDocumentos && (Boolean(anexos.operacao) || (anexos.fila.length > 0 && anexos.carregando)))}>{busy ? t.comum.envio.enviando : passo < 2 ? ta.continuar : erroEnvio && !envioIncerto ? t.comum.envio.tentar : t.comum.acoes.enviar}</Botao></div>
 </fieldset>{envioIncerto ? <div className="pilha"><p role="alert">{t.conta.envioIncerto}</p><CopiarRascunho idioma={idioma} dados={dados}/><Botao type="submit" disabled={busy}>{busy ? t.comum.envio.enviando : t.comum.envio.tentar}</Botao></div> : null}</form></div>;
}
