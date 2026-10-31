'use client';
import { useState, type FormEvent } from 'react';
import { CampoTexto } from '@/components/Campo';
import { Botao } from '@/components/Botao';
import type { Idioma } from '@/i18n/idiomas';
import { textos } from '@/i18n/strings';
import { cnpjValido, normalizarCnpj } from '@/lib/cnpj';
import { motivoDoErro, type MotivoEnvio } from '@/lib/envio';
import type { NovaOrganizacao } from '@/lib/types';
import { useApp } from '@/state/AppState';
export const EMPRESA_VAZIA:NovaOrganizacao={cnpj:'',razaoSocial:'',nomeFantasia:'',email:'',telefone:'',cidade:'',uf:''};
export function CamposOrganizacao({idioma,dados,onChange,erroCnpj,prefixo='org'}:{idioma:Idioma;dados:NovaOrganizacao;onChange:(dados:NovaOrganizacao)=>void;erroCnpj?:string;prefixo?:string}){
 const t=textos(idioma).conta;
 const campo=(chave:keyof NovaOrganizacao,rotulo:string,obrigatorio=false)=> <CampoTexto idioma={idioma} id={`${prefixo}-${chave}`} key={chave} rotulo={rotulo} value={String(dados[chave]??'')} type={chave==='email'?'email':'text'} autoComplete={chave==='cnpj'?'off':undefined} autoCapitalize={chave==='cnpj'?'characters':undefined} maxLength={chave==='cnpj'?18:chave==='uf'?2:undefined} erro={chave==='cnpj'?erroCnpj:undefined} required={obrigatorio} opcional={!obrigatorio} onChange={e=>onChange({...dados,[chave]:chave==='uf'?e.target.value.toUpperCase():e.target.value})}/>;
 return <div className="pilha">{campo('cnpj',t.cnpj,true)}{campo('razaoSocial',t.razaoSocial,true)}{campo('nomeFantasia',t.nomeFantasia)}<div className="grade--2">{campo('cidade',t.cidade,true)}{campo('uf',t.uf,true)}</div>{campo('email',t.email)}{campo('telefone',t.telefone)}</div>;
}
export function CadastroOrganizacao({idioma,aposSalvar,onCancelar}:{idioma:Idioma;aposSalvar?:()=>void;onCancelar?:()=>void}){
 const t=textos(idioma),{salvarOrganizacao}=useApp();const [dados,setDados]=useState<NovaOrganizacao>(EMPRESA_VAZIA),[erro,setErro]=useState<MotivoEnvio>(),[erroCnpj,setErroCnpj]=useState<string>(),[busy,setBusy]=useState(false),[salvo,setSalvo]=useState(false);
 async function enviar(e:FormEvent){e.preventDefault();if(busy)return;if(!cnpjValido(dados.cnpj)){setErroCnpj(t.conta.cnpjErro);return;}setBusy(true);setErro(undefined);try{await salvarOrganizacao({...dados,cnpj:normalizarCnpj(dados.cnpj)});setSalvo(true);aposSalvar?.();}catch(e){setErro(motivoDoErro(e));}finally{setBusy(false);}}
 return <form className="cartao" onSubmit={enviar} aria-busy={busy}><h2 className="cartao__titulo">{t.conta.adicionarEmpresa}</h2><p>{t.conta.empresaAjuda}</p><fieldset disabled={busy} className="pilha" style={{border:0,padding:0,margin:0,minWidth:0}}><CamposOrganizacao idioma={idioma} dados={dados} onChange={d=>{setDados(d);setErroCnpj(undefined);setSalvo(false);}} erroCnpj={erroCnpj}/>{erro?<p className="campo__erro" role="alert">{t.comum.envio[erro]}</p>:null}{salvo?<p role="status">{t.conta.empresaSalva}</p>:null}<div className="linha"><Botao type="submit" disabled={busy}>{busy?t.comum.envio.enviando:t.conta.salvar}</Botao>{onCancelar?<Botao variante="secundario" onClick={onCancelar}>{t.conta.cancelar}</Botao>:null}</div></fieldset></form>;
}
