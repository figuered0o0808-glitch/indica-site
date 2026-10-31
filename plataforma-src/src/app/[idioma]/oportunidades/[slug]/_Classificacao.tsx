'use client';
import { useEffect, useMemo, useState } from 'react';
import type { Idioma } from '@/i18n/idiomas';
import css from './_Classificacao.module.css';

export interface LinhaClassificacao {
  posicao: number; protocolo: string; situacao: string;
  nome?: string | null; projeto?: string | null; formato?: string | null; uf?: string | null;
}

const TEXTO = {
  pt: {titulo:'Classificação publicada',buscar:'Buscar protocolo, organização ou projeto',situacao:'Situação',todas:'Todas',selecionada:'Selecionada',suplente:'Suplente','aguardando-aceite':'Aguardando aceite',recusada:'Oferta recusada','nao-selecionada':'Não selecionada',inabilitada:'Inabilitada',recebida:'Recebida','em-avaliacao':'Em avaliação',copiar:'Copiar link desta inscrição',copiado:'Link copiado.',erro:'Não foi possível copiar. Use o endereço desta página para compartilhar o resultado.',exportar:'Baixar classificação',encontradas:'inscrição(ões) neste resultado',vazio:'Nenhuma inscrição corresponde à busca.',limpar:'Limpar busca',reservada:'Identidade reservada nesta etapa.',explicacao:'A classificação mostra a situação atual. Propostas que aguardam aceite só integram a seleção após a confirmação da pessoa responsável. Suplentes aguardam convocação da equipe.',colunas:['Posição','Protocolo','Situação','Organização','Projeto','Formato','UF']},
  en: {titulo:'Published ranking',buscar:'Search reference, organization or project',situacao:'Status',todas:'All',selecionada:'Selected',suplente:'Reserve','aguardando-aceite':'Awaiting acceptance',recusada:'Offer declined','nao-selecionada':'Not selected',inabilitada:'Ineligible',recebida:'Received','em-avaliacao':'Under review',copiar:'Copy link to this registration',copiado:'Link copied.',erro:'Could not copy. Share the address of this page to share the results.',exportar:'Download ranking',encontradas:'registration(s) in these results',vazio:'No registrations match your search.',limpar:'Clear search',reservada:'Identity withheld at this stage.',explicacao:'The ranking shows the current status. Offers awaiting acceptance only become selections after confirmation by the responsible person. Reserve proposals await an invitation from the team.',colunas:['Position','Reference','Status','Organization','Project','Format','State']},
  es: {titulo:'Clasificación publicada',buscar:'Buscar protocolo, organización o proyecto',situacao:'Estado',todas:'Todos',selecionada:'Seleccionada',suplente:'Suplente','aguardando-aceite':'Pendiente de aceptación',recusada:'Oferta rechazada','nao-selecionada':'No seleccionada',inabilitada:'Inhabilitada',recebida:'Recibida','em-avaliacao':'En evaluación',copiar:'Copiar enlace de esta inscripción',copiado:'Enlace copiado.',erro:'No fue posible copiar. Comparte la dirección de esta página para compartir el resultado.',exportar:'Descargar clasificación',encontradas:'inscripción(es) en este resultado',vazio:'Ninguna inscripción coincide con la búsqueda.',limpar:'Limpiar búsqueda',reservada:'Identidad reservada en esta etapa.',explicacao:'La clasificación muestra el estado actual. Las ofertas pendientes de aceptación se integran a la selección después de la confirmación de la persona responsable. Las suplentes esperan una convocatoria del equipo.',colunas:['Posición','Protocolo','Estado','Organización','Proyecto','Formato','Estado federativo']},
} as const;

function normalizar(v: string) { return v.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase(); }
function celula(v: unknown) { const s=String(v??''); return '"'+ (/^[\s]*[=+@-]/.test(s)?"'"+s:s).replaceAll('"','""')+'"'; }

export function ClassificacaoPublica({ idioma, itens }: { idioma: Idioma; itens: LinhaClassificacao[] }) {
  const t=TEXTO[idioma];const [busca,setBusca]=useState(''),[estado,setEstado]=useState(''),[mensagem,setMensagem]=useState('');
  const label=(s:string)=>t[s as keyof typeof t] as string || s;
  useEffect(()=>{const ref=new URLSearchParams(location.search).get('inscricao');if(ref&&itens.some(i=>i.protocolo===ref))setBusca(ref);},[itens]);
  const filtrados=useMemo(()=>{const termos=normalizar(busca).split(/\s+/).filter(Boolean);return itens.filter(i=>(!estado||i.situacao===estado)&&termos.every(q=>normalizar([i.protocolo,i.nome,i.projeto].filter(Boolean).join(' ')).includes(q)));},[itens,busca,estado]);
  const estados=[...new Set(itens.map(i=>i.situacao))];
  async function copiar(protocolo:string){const url=new URL(location.href);url.search='';url.searchParams.set('inscricao',protocolo);url.hash='resultado';try{await navigator.clipboard.writeText(url.toString());setMensagem(t.copiado);}catch{setMensagem(t.erro);}}
  function exportar(){const linhas=[t.colunas,...filtrados.map(i=>[i.posicao,i.protocolo,label(i.situacao),i.nome,i.projeto,i.formato,i.uf])];const blob=new Blob(['\uFEFF'+linhas.map(r=>r.map(celula).join(';')).join('\r\n')],{type:'text/csv;charset=utf-8'});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='indica-classificacao.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  return <div>
    <h3>{t.titulo}</h3><p className={css.nota}>{t.explicacao}</p>
    <div className={css.controles}><label className={css.busca}><span>{t.buscar}</span><input type="search" value={busca} onChange={e=>setBusca(e.target.value)}/></label><label className={css.filtro}><span>{t.situacao}</span><select value={estado} onChange={e=>setEstado(e.target.value)}><option value="">{t.todas}</option>{estados.map(s=><option value={s} key={s}>{label(s)}</option>)}</select></label><button className="btn btn--secundario" type="button" onClick={exportar} disabled={!filtrados.length}>{t.exportar}</button></div>
    <p className={css.nota} aria-live="polite">{filtrados.length} {t.encontradas}</p>
    <ol className={css.lista}>{filtrados.map(i=><li className={css.linha} key={i.protocolo} id={`resultado-${i.protocolo}`}><span className={css.posicao} aria-label={`${t.colunas[0]} ${i.posicao}`}>{i.posicao}.</span><div><div className={css.protocolo}>{i.protocolo}</div>{i.projeto?<h4 className={css.titulo}>{i.projeto}</h4>:<p className={css.reserva}>{t.reservada}</p>}{i.nome?<p className={css.nome}>{i.nome}{i.uf?` · ${i.uf}`:''}</p>:null}{i.formato?<p className={css.nome}>{i.formato}</p>:null}</div><div className={css.acoes}><span className={css.situacao} data-estado={i.situacao}>{label(i.situacao)}</span><button className={css.copiar} type="button" onClick={()=>void copiar(i.protocolo)}>{t.copiar}</button></div></li>)}</ol>
    {!filtrados.length?<p>{t.vazio} <button className="btn btn--discreto" onClick={()=>{setBusca('');setEstado('');}}>{t.limpar}</button></p>:null}<p className={css.mensagem} role="status">{mensagem}</p>
  </div>;
}
