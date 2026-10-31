'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Botao } from '@/components/Botao';
import { CabecalhoPagina } from '@/components/CabecalhoPagina';
import { Selo } from '@/components/Selo';
import { LoginConta } from '@/components/conta/LoginConta';
import { CadastroOrganizacao } from '@/components/conta/Organizacao';
import { EditarPerfil } from '@/components/conta/EditarPerfil';
import { Pagamento } from '@/components/conta/Pagamento';
import { Oferta } from '@/components/conta/Oferta';
import { HistoricoProposta, ImprimirComprovante, rotuloEstado } from '@/components/conta/Comprovante';
import { RecuperarRascunho } from '@/components/conta/RascunhoUI';
import { ExcluirRascunho } from '@/components/conta/ExcluirRascunho';
import styles from '@/components/conta/AppPessoal.module.css';
import type { Idioma } from '@/i18n/idiomas';
import { textos } from '@/i18n/strings';
import { rota } from '@/lib/rotas';
import { data } from '@/lib/format';
import type { Call, Course, ResumoRascunho, OrganizacaoExecutora, PerfilCadastro } from '@/lib/types';
import { useApp } from '@/state/AppState';
import { Candidaturas } from './_Candidaturas';
import { Cursos, cursosDoPainel } from './_Cursos';
import { ResumoPainel, SecaoPainel } from './_PainelUI';
function RascunhoCard({ idioma, rascunho, chamada, org, onExcluido }: {
    idioma: Idioma;
    rascunho: ResumoRascunho;
    chamada?: Call;
    org?: OrganizacaoExecutora;
    onExcluido: () => void;
}) {
    const t = textos(idioma), [mostrar, setMostrar] = useState(false);
    return <article className="cartao"><p className="olho">{t.conta.rascunho}</p><h3>{rascunho.tituloProjeto || t.conta.semTitulo}</h3><p>{rascunho.tituloChamada || chamada?.titulo}</p>{org ? <p className="texto-pequeno">{org.razaoSocial}</p> : null}<dl className="definicoes definicoes--2"><div><dt>{t.conta.atualizadoEm}</dt><dd>{new Date(rascunho.atualizadoEm).toLocaleString(idioma === 'pt' ? 'pt-BR' : idioma)}</dd></div><div><dt>{t.conta.prazo}</dt><dd>{chamada?.inscricoesAte ? data(chamada.inscricoesAte.slice(0, 10), idioma) : t.conta.semPrazo}</dd></div></dl>{rascunho.aceitaEnvio ? <Botao href={rota(idioma, `oportunidades/${rascunho.chamadaSlug}/candidatura/`)}>{t.conta.continuar}</Botao> : <p className="nota">{t.conta.rascunhoFechado}</p>}<details onToggle={e => setMostrar(e.currentTarget.open)}><summary>{t.conta.textoRecuperavel}</summary>{mostrar ? <RecuperarRascunho idioma={idioma} slug={rascunho.chamadaSlug}/> : null}</details><ExcluirRascunho idioma={idioma} rascunho={rascunho} onExcluido={onExcluido}/></article>;
}
function EditorPerfil({ idioma, perfil }: {
    idioma: Idioma;
    perfil: PerfilCadastro;
}) { const [aberto, setAberto] = useState(false); return <details className="cartao" onToggle={e => setAberto(e.currentTarget.open)}><summary>{textos(idioma).conta.perfilEditar}</summary>{aberto ? <EditarPerfil idioma={idioma} perfil={perfil}/> : null}</details>; }
function EditorOrganizacao({ idioma, org }: {
    idioma: Idioma;
    org?: OrganizacaoExecutora;
}) { const [aberto, setAberto] = useState(false); return <details className="cartao" onToggle={e => setAberto(e.currentTarget.open)}><summary>{org ? `${textos(idioma).conta.editarEmpresa} · ${org.razaoSocial}` : textos(idioma).conta.adicionarEmpresa}</summary>{aberto ? <CadastroOrganizacao idioma={idioma} inicial={org}/> : null}</details>; }
export function Painel({ idioma, abertas, catalogo, catalogoEditais }: {
    idioma: Idioma;
    aberto: boolean;
    abertas: Call[];
    catalogoEditais: Call[];
    catalogo: Course[];
}) {
    const { candidaturas, cadastrado, cursosInscritos, recibos, organizacoes, perfil, rascunhos, atualizarRecibos, atualizarConta, sair, hidratado, carregandoConta, erroConta, nome } = useApp();
    const t = textos(idioma), s = t.paineis, envio = t.comum.envio, search = useSearchParams(), tokenUrl = search.get('recibo')?.trim() || undefined;
    const [atualizando, setAtualizando] = useState(false), [consulta, setConsulta] = useState<'ok' | 'erro'>();
    const [exclusoes, setExclusoes] = useState(0), avisoExclusao = useRef<HTMLParagraphElement>(null);
    useEffect(() => { if (exclusoes) avisoExclusao.current?.focus(); }, [exclusoes]);
    const atualizar = useCallback(async (token?: string) => { setAtualizando(true); setConsulta(undefined); try {
        setConsulta(await atualizarRecibos(token) ? 'ok' : 'erro');
    }
    catch {
        setConsulta('erro');
    }
    finally {
        setAtualizando(false);
    } }, [atualizarRecibos]);
    useEffect(() => { if (hidratado && (tokenUrl || cadastrado))
        void atualizar(tokenUrl); }, [hidratado, tokenUrl, cadastrado, atualizar]);
    const linhasCursos = useMemo(() => cursosDoPainel(catalogo, cursosInscritos, recibos), [catalogo, cursosInscritos, recibos]);
    const selecionadas = candidaturas.filter(c => c.status === 'selecionada' || c.status === 'aprovada');
    const ofertas = candidaturas.filter(c => c.status === 'aguardando-aceite' || (['selecionada', 'aprovada', 'recusada'].includes(c.status) && c.oferta));
    const prioridadeOferta = candidaturas.find(c => c.status === 'aguardando-aceite');
    const prioridadePagamento = selecionadas.find(c => c.pagamentoPendente);
    if (!hidratado || (carregandoConta && !cadastrado))
        return <section className="secao"><div className="container"><p role="status">{t.conta.carregando}</p></div></section>;
    return <>
    <CabecalhoPagina olho={s.olho} titulo={cadastrado ? nome || s.titulo : s.titulo} acoes={<div className="linha"><Botao href={rota(idioma, 'oportunidades/')} variante="secundario">{s.verOportunidades}</Botao>{cadastrado ? <Botao onClick={() => void sair().catch(() => { })} variante="secundario">{t.conta.sair}</Botao> : null}</div>}/>
    {cadastrado && (prioridadeOferta || prioridadePagamento) ? <section className="secao secao--curta"><div className="container"><div className={styles.notice}><p className="olho">{t.conta.proximoPasso}</p><h2>{prioridadeOferta ? t.conta.estadoAceite : t.conta.pagamentoTitulo}</h2><p>{(prioridadeOferta ?? prioridadePagamento)?.projeto}</p><Botao href={rota(idioma, prioridadeOferta ? `painel/#oferta-${encodeURIComponent(prioridadeOferta.protocolo!)}` : `painel/#pagamento-${encodeURIComponent(prioridadePagamento!.protocolo!)}`)}>{prioridadeOferta ? t.conta.ofertaAbrir : t.conta.pagamentoAbrir}</Botao></div></div></section> : null}
    {erroConta ? <section className="secao secao--curta"><div className="container"><p role="alert" className="campo__erro">{envio[erroConta]}</p><Botao onClick={() => void atualizarConta().catch(() => { })}>{t.conta.atualizar}</Botao></div></section> : null}
    {!cadastrado ? <section className="secao secao--curta"><div className="container-estreito"><LoginConta idioma={idioma} recibo={tokenUrl}/></div></section> : null}
    {cadastrado ? <>
      <section className="secao secao--curta"><div className="container"><ResumoPainel itens={[{ rotulo: t.conta.rascunhosTitulo, valor: String(rascunhos.length) }, { rotulo: s.resumo.enviadas, valor: String(candidaturas.length) }, { rotulo: s.resumo.emAvaliacao, valor: String(candidaturas.filter(c => ['recebida', 'enviada', 'em-avaliacao'].includes(c.status)).length) }, { rotulo: s.resumo.aprovadas, valor: String(selecionadas.length) }]}/></div></section>
      {rascunhos.length || exclusoes ? <SecaoPainel id="rascunhos" titulo={t.conta.rascunhosTitulo}>{exclusoes ? <p role="status" tabIndex={-1} ref={avisoExclusao}>{t.conta.rascunhoExcluido}</p> : null}{rascunhos.length ? <><p className="nota">{t.conta.rascunhoAviso}</p><div className={styles.grid}>{rascunhos.map(r => <RascunhoCard key={r.chamadaSlug} idioma={idioma} rascunho={r} chamada={catalogoEditais.find(c => c.slug === r.chamadaSlug)} org={organizacoes.find(o => o.id === r.organizacaoId)} onExcluido={() => setExclusoes(n => n + 1)}/>)}</div></> : null}</SecaoPainel> : null}
      <SecaoPainel id="candidaturas" titulo={s.candidaturasTitulo}>
        {candidaturas.length ? <div className={styles.list}>{candidaturas.map(c => <article key={c.protocolo} className="cartao"><div className="linha linha--fim"><h3>{c.projeto || c.editalTitulo}</h3><Selo idioma={idioma} status={c.status} rotulo={rotuloEstado(c.status, idioma)}/></div><p>{c.editalTitulo}</p>{c.simulacao ? <p className="nota">{t.conta.simulacaoTitulo}</p> : null}<p className="texto-pequeno">{c.protocolo} · {c.organizacao?.razaoSocial}</p><dl className="definicoes definicoes--2"><div><dt>{envio.enviadaEm}</dt><dd>{data(c.enviadaEm.slice(0, 10), idioma)}</dd></div>{catalogoEditais.find(ch => ch.slug === c.editalSlug)?.inscricoesAte ? <div><dt>{t.conta.prazo}</dt><dd>{data(catalogoEditais.find(ch => ch.slug === c.editalSlug)!.inscricoesAte!.slice(0, 10), idioma)}</dd></div> : null}</dl><p className="rotulo">{t.conta.proximoPasso}</p>{c.status === 'aguardando-aceite' ? <Botao href={rota(idioma, `painel/#oferta-${encodeURIComponent(c.protocolo!)}`)}>{t.conta.ofertaTitulo}</Botao> : c.status === 'selecionada' || c.status === 'aprovada' ? <><p>{c.pagamentoPendente ? t.conta.pagamentoPendente : c.pagamentoStatus === 'recebido' ? t.conta.pagamentoRecebido : t.conta.pagamentoTitulo}</p><Botao href={rota(idioma, `painel/#pagamento-${encodeURIComponent(c.protocolo!)}`)}>{c.pagamentoPendente ? t.conta.pagamentoAbrir : t.conta.pagamentoTitulo}</Botao></> : <p>{c.status === 'suplente' ? t.conta.suplenteAjuda : c.status === 'recusada' ? t.conta.ofertaRecusada : t.conta.aguardar}</p>}<HistoricoProposta idioma={idioma} proposta={c}/>{c.reciboToken ? <Botao href={rota(idioma, `painel/?recibo=${encodeURIComponent(c.reciboToken)}`)} variante="secundario" tamanho="pequeno">{envio.linkComprovante}</Botao> : null}</article>)}</div> : <Candidaturas idioma={idioma} candidaturas={[]} abertas={abertas}/>}
      </SecaoPainel>
      {ofertas.map(c => <SecaoPainel key={c.protocolo} id={`decisao-${c.protocolo}`} titulo={`${t.conta.ofertaTitulo} · ${c.protocolo}`}><Oferta idioma={idioma} proposta={c}/></SecaoPainel>)}
      {selecionadas.map(c => <SecaoPainel key={c.protocolo} id={`pagamento-${c.protocolo}`} titulo={`${t.conta.pagamentoTitulo} · ${c.protocolo}`}><div className={styles.noPrint}><Pagamento idioma={idioma} protocolo={c.protocolo!}/></div></SecaoPainel>)}
    </> : null}
    {recibos.length || tokenUrl ? <SecaoPainel id="comprovantes" titulo={envio.comprovantes} acoes={<Botao onClick={() => void atualizar(tokenUrl)} disabled={atualizando} variante="secundario" tamanho="pequeno">{atualizando ? envio.atualizando : envio.atualizar}</Botao>}>
      {atualizando ? <p role="status">{envio.consulta}</p> : null}{consulta ? <p role={consulta === 'erro' ? 'alert' : 'status'} className={consulta === 'erro' ? 'campo__erro' : 'nota'}>{consulta === 'erro' ? envio.semAtualizacao : envio.atualizado}</p> : null}
      <div className={styles.list}>{recibos.map(r => <article className="cartao" key={r.reciboToken}><h3>{r.titulo}</h3>{r.simulacao ? <p className="nota">{t.conta.simulacaoTitulo}</p> : null}<dl className="definicoes definicoes--2">{r.protocolo ? <div><dt>{envio.protocolo}</dt><dd>{r.protocolo}</dd></div> : null}<div><dt>{envio.enviadaEm}</dt><dd>{data(r.enviadaEm.slice(0, 10), idioma)}</dd></div><div><dt>{envio.situacao}</dt><dd><Selo idioma={idioma} status={r.estado} rotulo={rotuloEstado(r.estado, idioma)}/></dd></div></dl><div className={styles.actions}><Botao href={rota(idioma, `painel/?recibo=${encodeURIComponent(r.reciboToken)}`)} variante="secundario" tamanho="pequeno">{envio.linkComprovante}</Botao><ImprimirComprovante idioma={idioma} recibo={r} projeto={candidaturas.find(c => c.protocolo === r.protocolo)?.projeto}/></div><p className="nota">{envio.linkPrivado}</p>{r.protocolo && (r.estado === 'selecionada' || r.estado === 'aprovada') && !candidaturas.some(c => c.protocolo === r.protocolo) ? <div className={styles.noPrint}><Pagamento idioma={idioma} protocolo={r.protocolo}/></div> : null}</article>)}</div>
    </SecaoPainel> : null}
    {cadastrado ? <>
      {perfil ? <SecaoPainel id="perfil" titulo={t.conta.perfilTitulo}><div className={styles.noPrint}><EditorPerfil idioma={idioma} perfil={perfil}/></div></SecaoPainel> : null}
      <SecaoPainel id="empresas" titulo={t.conta.empresas}><div className={styles.list}>{organizacoes.map(o => <EditorOrganizacao key={o.id} idioma={idioma} org={o}/>)}<EditorOrganizacao idioma={idioma}/></div></SecaoPainel>
      {catalogo.length ? <SecaoPainel id="cursos" titulo={s.cursosTitulo} fundo><Cursos idioma={idioma} linhas={linhasCursos}/></SecaoPainel> : null}
    </> : null}
  </>;
}
