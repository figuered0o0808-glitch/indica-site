'use client';
import { useEffect, useState, type FormEvent } from 'react';
import { Botao } from '@/components/Botao';
import { CampoSelecao, CampoTexto } from '@/components/Campo';
import type { Idioma } from '@/i18n/idiomas';
import { textos } from '@/i18n/strings';
import { motivoDoErro, type MotivoEnvio } from '@/lib/envio';
import type { DadosPagamento, OrganizacaoExecutora } from '@/lib/types';
import { rota } from '@/lib/rotas';
import { useApp } from '@/state/AppState';
export function Pagamento({idioma,protocolo}:{idioma:Idioma;protocolo:string}){
 const t=textos(idioma),{cadastrado,candidaturas,organizacoes}=useApp();
 if(!cadastrado)return <section className="cartao"><h3>{t.conta.pagamentoTitulo}</h3><p>{t.conta.pagamentoLogin}</p><Botao href={rota(idioma,'cadastro/?entrar=1')}>{t.conta.entrar}</Botao></section>;
 const proposta=candidaturas.find(c=>c.protocolo===protocolo),org=proposta?.organizacao??organizacoes.find(o=>o.id===proposta?.organizacaoId);
 if(!proposta||!org)return <p className="nota">{t.conta.pagamentoSemAcesso}</p>;
 return <FormularioPagamento key={`${protocolo}-${org.id}`} idioma={idioma} protocolo={protocolo} org={org}/>;
}
function FormularioPagamento({idioma,protocolo,org}:{idioma:Idioma;protocolo:string;org:OrganizacaoExecutora}){
 const t=textos(idioma),{carregarPagamento,gravarPagamento}=useApp();
 const [dados,setDados]=useState<DadosPagamento>({titular:org.razaoSocial,cnpj:org.cnpj,tipo:'pix',pixTipo:'cnpj',pixChave:org.cnpj,tipoConta:'corrente'});
 const [consulta,setConsulta]=useState<{habilitado:boolean;recebido:boolean}>(),[carregando,setCarregando]=useState(true),[busy,setBusy]=useState(false),[erro,setErro]=useState<MotivoEnvio>(),[erroCampos,setErroCampos]=useState(false),[salvo,setSalvo]=useState(false),[tentativa,setTentativa]=useState(0);
 useEffect(()=>{let ativo=true;setCarregando(true);setErro(undefined);carregarPagamento(protocolo).then(r=>{if(!ativo)return;setConsulta(r);if(r.dados)setDados({...r.dados,titular:org.razaoSocial,cnpj:org.cnpj});}).catch(e=>{if(ativo)setErro(motivoDoErro(e));}).finally(()=>{if(ativo)setCarregando(false);});return()=>{ativo=false;};},[protocolo,org.id,carregarPagamento,tentativa]);
 function atualizar(k:keyof DadosPagamento,v:string){setDados(d=>({...d,[k]:v}));setSalvo(false);setErroCampos(false);}
 async function enviar(e:FormEvent){e.preventDefault();if(busy)return;let envio:DadosPagamento={titular:org.razaoSocial,cnpj:org.cnpj,tipo:dados.tipo};
  if(dados.tipo==='pix'){const chave=dados.pixTipo==='cnpj'?org.cnpj:dados.pixChave?.trim();if(!chave){setErroCampos(true);return;}envio={...envio,pixTipo:dados.pixTipo??'cnpj',pixChave:chave};}
  else{if(!dados.banco?.trim()||!dados.agencia?.trim()||!dados.conta?.trim()||!dados.tipoConta){setErroCampos(true);return;}envio={...envio,banco:dados.banco.trim(),agencia:dados.agencia.trim(),agenciaDigito:dados.agenciaDigito?.trim(),conta:dados.conta.trim(),contaDigito:dados.contaDigito?.trim(),tipoConta:dados.tipoConta};}
  setBusy(true);setErro(undefined);setSalvo(false);try{await gravarPagamento(protocolo,envio);setSalvo(true);setConsulta({habilitado:true,recebido:true});}catch(e){setErro(motivoDoErro(e));}finally{setBusy(false);}
 }
 if(carregando)return <p role="status">{t.comum.envio.atualizando}</p>;
 if(!consulta)return <div className="pilha"><p role="alert" className="campo__erro">{t.comum.envio[erro??'rede']}</p><Botao variante="secundario" onClick={()=>setTentativa(x=>x+1)}>{t.comum.envio.tentar}</Botao></div>;
 if(!consulta.habilitado)return <p className="nota">{t.conta.pagamentoIndisponivel}</p>;
 const campo=(k:keyof DadosPagamento,label:string,required=false)=> <CampoTexto key={k} idioma={idioma} id={`pg-${protocolo}-${k}`} rotulo={label} value={String(dados[k]??'')} autoComplete="off" required={required} opcional={!required} onChange={e=>atualizar(k,e.target.value)}/>;
 return <form className="cartao" onSubmit={enviar} aria-busy={busy}><h3>{t.conta.pagamentoTitulo}</h3><p>{consulta.recebido?t.conta.pagamentoRecebido:t.conta.pagamentoPendente}</p><p className="nota">{t.conta.pagamentoIntro}</p><fieldset disabled={busy} className="pilha" style={{border:0,padding:0,margin:0,minWidth:0}}><CampoTexto idioma={idioma} id={`pg-${protocolo}-titular`} rotulo={t.conta.titular} value={org.razaoSocial} readOnly/><CampoTexto idioma={idioma} id={`pg-${protocolo}-cnpj`} rotulo={t.conta.cnpj} value={org.cnpj} readOnly/><CampoSelecao idioma={idioma} id={`pg-${protocolo}-tipo`} rotulo={t.conta.pagamentoTipo} value={dados.tipo} opcoes={[{valor:'pix',rotulo:t.conta.pix},{valor:'bancaria',rotulo:t.conta.bancaria}]} onChange={e=>atualizar('tipo',e.target.value)}/>
 {dados.tipo==='pix'?<><CampoSelecao idioma={idioma} id={`pg-${protocolo}-pixTipo`} rotulo={t.conta.pixTipo} value={dados.pixTipo??'cnpj'} opcoes={[{valor:'cnpj',rotulo:t.conta.cnpj},{valor:'email',rotulo:t.conta.email},{valor:'telefone',rotulo:t.conta.telefone},{valor:'aleatoria',rotulo:t.conta.aleatoria}]} onChange={e=>{const tipo=e.target.value as DadosPagamento['pixTipo'];setDados(d=>({...d,pixTipo:tipo,pixChave:tipo==='cnpj'?org.cnpj:''}));setSalvo(false);}}/><CampoTexto idioma={idioma} id={`pg-${protocolo}-pixChave`} rotulo={t.conta.pixChave} type={dados.pixTipo==='email'?'email':'text'} value={dados.pixTipo==='cnpj'?org.cnpj:dados.pixChave??''} readOnly={dados.pixTipo==='cnpj'} onChange={e=>atualizar('pixChave',e.target.value)} required autoComplete="off"/></>:<>{campo('banco',t.conta.banco,true)}<div className="grade--2">{campo('agencia',t.conta.agencia,true)}{campo('agenciaDigito',t.conta.agenciaDigito)}</div><div className="grade--2">{campo('conta',t.conta.numeroConta,true)}{campo('contaDigito',t.conta.contaDigito)}</div><CampoSelecao idioma={idioma} id={`pg-${protocolo}-tipoConta`} rotulo={t.conta.tipoConta} value={dados.tipoConta??'corrente'} opcoes={[{valor:'corrente',rotulo:t.conta.corrente},{valor:'poupanca',rotulo:t.conta.poupanca}]} onChange={e=>atualizar('tipoConta',e.target.value)}/></>}
 {erroCampos?<p role="alert" className="campo__erro">{t.conta.pagamentoErro}</p>:null}{erro?<p role="alert" className="campo__erro">{t.comum.envio[erro]}</p>:null}{salvo?<p role="status">{t.conta.pagamentoSalvo}</p>:null}<Botao type="submit" disabled={busy}>{busy?t.comum.envio.enviando:t.conta.pagamentoSalvar}</Botao><p className="nota">{t.conta.pagamentoPrivado}</p></fieldset></form>;
}
