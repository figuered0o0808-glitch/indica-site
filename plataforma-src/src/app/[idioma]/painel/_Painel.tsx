'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Botao } from '@/components/Botao';
import { CabecalhoPagina } from '@/components/CabecalhoPagina';
import { Selo } from '@/components/Selo';
import { LoginConta } from '@/components/conta/LoginConta';
import { CadastroOrganizacao } from '@/components/conta/Organizacao';
import { Pagamento } from '@/components/conta/Pagamento';
import type { Idioma } from '@/i18n/idiomas';
import { textos } from '@/i18n/strings';
import { rota } from '@/lib/rotas';
import { data } from '@/lib/format';
import type { Call, Course } from '@/lib/types';
import { useApp } from '@/state/AppState';
import { Candidaturas } from './_Candidaturas';
import { Cursos, cursosDoPainel } from './_Cursos';
import { ResumoPainel, SecaoPainel } from './_PainelUI';
export function Painel({idioma,abertas,catalogo}:{idioma:Idioma;aberto:boolean;abertas:Call[];catalogoEditais:Call[];catalogo:Course[]}){
 const {candidaturas,cadastrado,cursosInscritos,recibos,organizacoes,atualizarRecibos,atualizarConta,sair,hidratado,carregandoConta,erroConta,nome}=useApp();
 const t=textos(idioma),s=t.paineis,envio=t.comum.envio,search=useSearchParams(),tokenUrl=search.get('recibo')?.trim()||undefined;
 const [atualizando,setAtualizando]=useState(false),[consulta,setConsulta]=useState<'ok'|'erro'>();
 const atualizar=useCallback(async(token?:string)=>{setAtualizando(true);setConsulta(undefined);try{setConsulta(await atualizarRecibos(token)?'ok':'erro');}catch{setConsulta('erro');}finally{setAtualizando(false);}},[atualizarRecibos]);
 useEffect(()=>{if(!hidratado)return;if(tokenUrl||cadastrado)void atualizar(tokenUrl);},[hidratado,tokenUrl,cadastrado,atualizar]);
 const linhasCursos=useMemo(()=>cursosDoPainel(catalogo,cursosInscritos,recibos),[catalogo,cursosInscritos,recibos]);
 const selecionadas=candidaturas.filter(c=>c.status==='selecionada'||c.status==='aprovada'||c.pagamentoPendente);
 if(!hidratado||(carregandoConta&&!cadastrado))return <section className="secao"><div className="container"><p role="status">{t.conta.carregando}</p></div></section>;
 return <><CabecalhoPagina olho={s.olho} titulo={cadastrado?nome||s.titulo:s.titulo} acoes={<div className="linha"><Botao href={rota(idioma,'oportunidades/')} variante="secundario">{s.verOportunidades}</Botao>{cadastrado?<Botao onClick={()=>void sair().catch(()=>{})} variante="secundario">{t.conta.sair}</Botao>:null}</div>}/>
 {erroConta?<section className="secao secao--curta"><div className="container"><p role="alert" className="campo__erro">{envio[erroConta]}</p><Botao onClick={()=>void atualizarConta().catch(()=>{})}>{t.conta.atualizar}</Botao></div></section>:null}
 {!cadastrado?<section className="secao secao--curta"><div className="container-estreito"><LoginConta idioma={idioma}/></div></section>:null}
 {cadastrado&&candidaturas.length?<section className="secao secao--curta"><div className="container"><ResumoPainel itens={[{rotulo:s.resumo.enviadas,valor:String(candidaturas.length)},{rotulo:s.resumo.emAvaliacao,valor:String(candidaturas.filter(c=>['recebida','enviada','em-avaliacao'].includes(c.status)).length)},{rotulo:s.resumo.aprovadas,valor:String(selecionadas.length)}]}/></div></section>:null}
 {recibos.length||tokenUrl?<SecaoPainel id="comprovantes" titulo={envio.comprovantes} acoes={<Botao onClick={()=>void atualizar(tokenUrl)} disabled={atualizando} variante="secundario" tamanho="pequeno">{atualizando?envio.atualizando:envio.atualizar}</Botao>}>
 {atualizando?<p role="status">{envio.consulta}</p>:null}{consulta?<p role={consulta==='erro'?'alert':'status'} className={consulta==='erro'?'campo__erro':'nota'}>{consulta==='erro'?envio.semAtualizacao:envio.atualizado}</p>:null}
 <div className="pilha">{recibos.map(r=><article className="cartao" key={r.reciboToken}><h3 className="cartao__titulo">{r.titulo}</h3>{r.simulacao?<p className="nota">{t.conta.simulacaoTitulo}</p>:null}<dl className="definicoes definicoes--2">{r.protocolo?<div><dt>{envio.protocolo}</dt><dd>{r.protocolo}</dd></div>:null}<div><dt>{envio.enviadaEm}</dt><dd>{data(r.enviadaEm.slice(0,10),idioma)}</dd></div><div><dt>{envio.situacao}</dt><dd><Selo idioma={idioma} status={r.estado}/></dd></div></dl><Botao href={rota(idioma,`painel/?recibo=${encodeURIComponent(r.reciboToken)}`)} variante="secundario" tamanho="pequeno">{envio.linkComprovante}</Botao><p className="nota">{envio.linkPrivado}</p>{r.protocolo&&(r.pagamentoPendente||r.estado==='selecionada'||r.estado==='aprovada')?<div className="pilha"><p>{t.conta.pagamentoPendente}</p>{candidaturas.some(c=>c.protocolo===r.protocolo)?<Botao href={rota(idioma,`painel/#pagamento-${encodeURIComponent(r.protocolo)}`)}>{t.conta.pagamentoAbrir}</Botao>:<Pagamento idioma={idioma} protocolo={r.protocolo}/>}</div>:null}</article>)}</div></SecaoPainel>:null}
 {cadastrado?<><SecaoPainel id="candidaturas" titulo={s.candidaturasTitulo}><Candidaturas idioma={idioma} candidaturas={candidaturas} abertas={abertas}/></SecaoPainel>
 {selecionadas.map(c=><SecaoPainel key={c.protocolo} id={`pagamento-${c.protocolo}`} titulo={`${t.conta.pagamentoTitulo} · ${c.protocolo}`}><Pagamento idioma={idioma} protocolo={c.protocolo!}/></SecaoPainel>)}
 <SecaoPainel id="empresas" titulo={t.conta.empresas}><div className="pilha">{organizacoes.map(o=><article className="cartao" key={o.id}><h3>{o.razaoSocial}</h3><p>{t.conta.cnpj}: {o.cnpj}</p></article>)}<details className="cartao"><summary>{t.conta.adicionarEmpresa}</summary><CadastroOrganizacao idioma={idioma}/></details></div></SecaoPainel>
 {catalogo.length?<SecaoPainel id="cursos" titulo={s.cursosTitulo} fundo><Cursos idioma={idioma} linhas={linhasCursos}/></SecaoPainel>:null}</>:null}</>;
}
