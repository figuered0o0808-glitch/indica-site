'use client';
import { useEffect, useMemo, useState } from 'react';
import type { Idioma } from '@/i18n/idiomas';
import css from './_Classificacao.module.css';

export interface LinhaClassificacao {
  protocolo: string; situacao: string;
  posicao?: number | null; nota?: number | null;
  nome?: string | null; projeto?: string | null; formato?: string | null; uf?: string | null;
}

export interface OpcoesResultadoPublico {
  exibirNotas?: boolean;
  exibirClassificacao?: boolean;
  somenteSelecionados?: boolean;
  notaMaxima?: number | null;
}

const TEXTO = {
  pt: { titulo: 'Resultado publicado', ranking: 'Classificação publicada', selecionados: 'Propostas selecionadas', buscar: 'Buscar responsável ou projeto', situacao: 'Situação', todas: 'Todas', selecionada: 'Selecionada', suplente: 'Suplente', 'aguardando-aceite': 'Aguardando confirmação', recusada: 'Oferta recusada', 'nao-selecionada': 'Não selecionada', inabilitada: 'Inabilitada', recebida: 'Recebida', 'em-avaliacao': 'Em avaliação', copiar: 'Copiar link desta proposta', copiado: 'Link copiado.', erro: 'Não foi possível copiar. Use o endereço desta página para compartilhar o resultado.', exportar: 'Baixar resultado', encontradas: 'proposta(s) neste resultado', vazio: 'Nenhuma proposta corresponde à busca.', limpar: 'Limpar busca', reservada: 'Identidade reservada nesta etapa.', explicacao: 'A seleção é definida pela organização da chamada. A nota não determina, por si só, a concessão do apoio.', pendentes: 'As propostas identificadas como “Aguardando confirmação” dependem do aceite da pessoa responsável.', nome: 'Responsável', projeto: 'Projeto', posicao: 'Posição', protocolo: 'Protocolo', nota: 'Nota', maxima: 'Nota máxima' },
  en: { titulo: 'Published results', ranking: 'Published ranking', selecionados: 'Selected proposals', buscar: 'Search applicant or project', situacao: 'Status', todas: 'All', selecionada: 'Selected', suplente: 'Reserve', 'aguardando-aceite': 'Awaiting confirmation', recusada: 'Offer declined', 'nao-selecionada': 'Not selected', inabilitada: 'Ineligible', recebida: 'Received', 'em-avaliacao': 'Under review', copiar: 'Copy link to this proposal', copiado: 'Link copied.', erro: 'Could not copy. Share the address of this page to share the results.', exportar: 'Download results', encontradas: 'proposal(s) in these results', vazio: 'No proposals match your search.', limpar: 'Clear search', reservada: 'Identity withheld at this stage.', explicacao: 'The organization responsible for the call determines the selection. A score alone does not determine funding.', pendentes: 'Proposals marked “Awaiting confirmation” depend on acceptance by the responsible person.', nome: 'Applicant', projeto: 'Project', posicao: 'Position', protocolo: 'Reference', nota: 'Score', maxima: 'Maximum score' },
  es: { titulo: 'Resultado publicado', ranking: 'Clasificación publicada', selecionados: 'Propuestas seleccionadas', buscar: 'Buscar responsable o proyecto', situacao: 'Estado', todas: 'Todos', selecionada: 'Seleccionada', suplente: 'Suplente', 'aguardando-aceite': 'Pendiente de confirmación', recusada: 'Oferta rechazada', 'nao-selecionada': 'No seleccionada', inabilitada: 'Inhabilitada', recebida: 'Recibida', 'em-avaliacao': 'En evaluación', copiar: 'Copiar enlace de esta propuesta', copiado: 'Enlace copiado.', erro: 'No fue posible copiar. Comparte la dirección de esta página para compartir el resultado.', exportar: 'Descargar resultado', encontradas: 'propuesta(s) en este resultado', vazio: 'Ninguna propuesta coincide con la búsqueda.', limpar: 'Limpiar búsqueda', reservada: 'Identidad reservada en esta etapa.', explicacao: 'La organización de la convocatoria define la selección. La nota, por sí sola, no determina la concesión del apoyo.', pendentes: 'Las propuestas identificadas como “Pendiente de confirmación” dependen de la aceptación de la persona responsable.', nome: 'Responsable', projeto: 'Proyecto', posicao: 'Posición', protocolo: 'Protocolo', nota: 'Nota', maxima: 'Nota máxima' },
} as const;

const selecionada = (i: LinhaClassificacao) => ['selecionada', 'aguardando-aceite'].includes(i.situacao);
function normalizar(v: string) { return v.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase(); }
function celula(v: unknown) { const s = String(v ?? ''); return '"' + (/^[\s]*[=+@-]/.test(s) ? "'" + s : s).replaceAll('"', '""') + '"'; }

/** A apresentação e o CSV seguem a mesma escolha de divulgação do servidor. */
export function linhasPublicas(itens: LinhaClassificacao[], opcoes: OpcoesResultadoPublico): LinhaClassificacao[] {
  const linhas = itens.filter(i => opcoes.somenteSelecionados === false || selecionada(i)).map(i => ({
    protocolo: i.protocolo, situacao: i.situacao, nome: i.nome, projeto: i.projeto,
    ...(opcoes.exibirClassificacao === true && Number.isFinite(i.posicao) ? { posicao: i.posicao } : {}),
    ...(opcoes.exibirNotas === true && Number.isFinite(i.nota) ? { nota: i.nota } : {}),
  }));
  if (opcoes.exibirClassificacao === true) linhas.sort((a, b) => (a.posicao ?? Infinity) - (b.posicao ?? Infinity) || a.protocolo.localeCompare(b.protocolo));
  else linhas.sort((a, b) => normalizar(`${a.nome ?? ''}\u0000${a.projeto ?? ''}\u0000${a.protocolo}`).localeCompare(normalizar(`${b.nome ?? ''}\u0000${b.projeto ?? ''}\u0000${b.protocolo}`)));
  return linhas;
}

export function csvResultadoPublico(idioma: Idioma, itens: LinhaClassificacao[], opcoes: OpcoesResultadoPublico): string {
  const t = TEXTO[idioma], ranking = opcoes.exibirClassificacao === true, notas = opcoes.exibirNotas === true;
  const label = (s: string) => t[s as keyof typeof t] || s;
  const cabecalho = [...(ranking ? [t.posicao] : []), t.nome, t.projeto, ...(notas ? [t.nota, t.maxima] : []), ...(opcoes.somenteSelecionados === false ? [t.protocolo, t.situacao] : [])];
  const linhas = linhasPublicas(itens, opcoes).map(i => [
    ...(ranking ? [i.posicao] : []), i.nome, i.projeto,
    ...(notas ? [i.nota, opcoes.notaMaxima] : []),
    ...(opcoes.somenteSelecionados === false ? [i.protocolo, label(i.situacao)] : []),
  ]);
  return '\uFEFF' + [cabecalho, ...linhas].map(r => r.map(celula).join(';')).join('\r\n');
}

export function ClassificacaoPublica({ idioma, itens, ...opcoes }: { idioma: Idioma; itens: LinhaClassificacao[] } & OpcoesResultadoPublico) {
  const t = TEXTO[idioma], ranking = opcoes.exibirClassificacao === true, notas = opcoes.exibirNotas === true, somente = opcoes.somenteSelecionados !== false;
  const [busca, setBusca] = useState(''), [estado, setEstado] = useState(''), [mensagem, setMensagem] = useState('');
  const label = (s: string) => t[s as keyof typeof t] || s;
  const publicos = useMemo(() => linhasPublicas(itens, opcoes), [itens, opcoes.exibirClassificacao, opcoes.exibirNotas, opcoes.somenteSelecionados]);
  useEffect(() => { const ref = new URLSearchParams(location.search).get('inscricao'); if (ref && publicos.some(i => i.protocolo === ref)) setBusca(ref); }, [publicos]);
  const filtrados = useMemo(() => { const termos = normalizar(busca).split(/\s+/).filter(Boolean); return publicos.filter(i => (!estado || i.situacao === estado) && termos.every(q => normalizar([i.protocolo, i.nome, i.projeto].filter(Boolean).join(' ')).includes(q))); }, [publicos, busca, estado]);
  const estados = [...new Set(publicos.map(i => i.situacao))];
  const formatoNota = new Intl.NumberFormat(idioma === 'pt' ? 'pt-BR' : idioma, { maximumFractionDigits: 2 });
  async function copiar(protocolo: string) { const url = new URL(location.href); url.search = ''; url.searchParams.set('inscricao', protocolo); url.hash = 'resultado'; try { await navigator.clipboard.writeText(url.toString()); setMensagem(t.copiado); } catch { setMensagem(t.erro); } }
  function exportar() { const blob = new Blob([csvResultadoPublico(idioma, filtrados, opcoes)], { type: 'text/csv;charset=utf-8' }); const url = URL.createObjectURL(blob), a = document.createElement('a'); a.href = url; a.download = 'indica-resultados.csv'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
  return <div>
    <h3>{ranking ? t.ranking : somente ? t.selecionados : t.titulo}</h3>
    {notas || ranking ? <p className={css.nota}>{t.explicacao}</p> : null}
    {publicos.some(i => i.situacao === 'aguardando-aceite') ? <p className={css.nota}>{t.pendentes}</p> : null}
    <div className={css.controles}>
      <label className={css.busca}><span>{t.buscar}</span><input type="search" value={busca} onChange={e => setBusca(e.target.value)} /></label>
      {!somente ? <label className={css.filtro}><span>{t.situacao}</span><select value={estado} onChange={e => setEstado(e.target.value)}><option value="">{t.todas}</option>{estados.map(s => <option value={s} key={s}>{label(s)}</option>)}</select></label> : null}
      <button className="btn btn--secundario" type="button" onClick={exportar} disabled={!filtrados.length}>{t.exportar}</button>
    </div>
    <p className={css.nota} aria-live="polite">{filtrados.length} {t.encontradas}</p>
    <ul className={css.lista}>{filtrados.map(i => <li className={[css.linha, ranking ? css.comPosicao : ''].join(' ')} key={i.protocolo} id={`resultado-${i.protocolo}`}>
      {ranking ? <span className={css.posicao} aria-label={`${t.posicao} ${i.posicao ?? '—'}`}>{i.posicao ?? '—'}.</span> : null}
      <div>{ranking || !somente ? <div className={css.protocolo}>{i.protocolo}</div> : null}{i.projeto ? <h4 className={css.titulo}>{i.projeto}</h4> : <p className={css.reserva}>{t.reservada}</p>}{i.nome ? <p className={css.nome}>{i.nome}</p> : null}</div>
      <div className={css.acoes}>
        {notas ? <span className={css.pontuacao}>{t.nota}: {i.nota != null ? formatoNota.format(i.nota) : '—'}{opcoes.notaMaxima != null ? ` / ${formatoNota.format(opcoes.notaMaxima)}` : ''}</span> : null}
        {!somente || i.situacao === 'aguardando-aceite' ? <span className={css.situacao} data-estado={i.situacao}>{label(i.situacao)}</span> : null}
        <button className={css.copiar} type="button" onClick={() => void copiar(i.protocolo)}>{t.copiar}</button>
      </div>
    </li>)}</ul>
    {!filtrados.length ? <p>{t.vazio} <button className="btn btn--discreto" onClick={() => { setBusca(''); setEstado(''); }}>{t.limpar}</button></p> : null}<p className={css.mensagem} role="status">{mensagem}</p>
  </div>;
}
