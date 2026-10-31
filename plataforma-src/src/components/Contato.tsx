'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Botao } from '@/components/Botao';
import { CampoArea, CampoSelecao, CampoTexto } from '@/components/Campo';
import type { Idioma } from '@/i18n/idiomas';
import { contato } from '@/lib/contato';
import { novoEnvioId } from '@/lib/envio';
import css from './Contato.module.css';

type Mensagem = {nome: string; email: string; organizacao: string; assunto: string; mensagem: string; honey: string};
type Tentativa = Mensagem & {envioId: string; idioma: Idioma; origem: 'plataforma'};
const API = (process.env.NEXT_PUBLIC_INDICA_API || process.env.NEXT_PUBLIC_TILT_API || '').replace(/\/+$/, '');

export function FormularioContato({ idioma }: {idioma: Idioma}) {
  const t=contato(idioma), inicial=():Mensagem=>({nome:'',email:'',organizacao:'',assunto:t.assuntos[0],mensagem:'',honey:''});
  const [dados,setDados]=useState<Mensagem>(inicial),[busy,setBusy]=useState(false),[pendente,setPendente]=useState(false),[erro,setErro]=useState('');
  const [recibo,setRecibo]=useState<{protocolo:string;recebidaEm:string}>(),[copiado,setCopiado]=useState(false);
  const tentativa=useRef<Tentativa|null>(null),emVoo=useRef(false),controle=useRef<AbortController|null>(null),topo=useRef<HTMLDivElement>(null);
  useEffect(()=>()=>controle.current?.abort(),[]);
  function atualizar(k:keyof Mensagem,v:string){setDados(d=>({...d,[k]:v}));setErro('');}
  async function enviar(e:FormEvent<HTMLFormElement>){
    e.preventDefault();if(emVoo.current)return;
    emVoo.current=true;setBusy(true);setErro('');
    const payload=tentativa.current??{...dados,nome:dados.nome.trim(),email:dados.email.trim().toLowerCase(),organizacao:dados.organizacao.trim(),mensagem:dados.mensagem.trim(),envioId:novoEnvioId(),idioma,origem:'plataforma' as const};
    tentativa.current=payload;setPendente(true);const c=new AbortController();controle.current=c;const tempo=setTimeout(()=>c.abort(),30000);
    try{
      if(!API)throw new Error('rede');
      const r=await fetch(API+'/tilt/publico/contato',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),credentials:'omit',cache:'no-store',referrerPolicy:'no-referrer',signal:c.signal});
      if(!r.ok){if([400,409,413,422,429].includes(r.status)){tentativa.current=null;setPendente(false);throw new Error(r.status===429?'limite':'invalido');}throw new Error('rede');}
      const d=await r.json();
      if(d.ok!==true||typeof d.protocolo!=='string'||!d.protocolo||d.protocolo.length>100||typeof d.recebidaEm!=='string'||!Number.isFinite(Date.parse(d.recebidaEm)))throw new Error('rede');
      setRecibo({protocolo:d.protocolo,recebidaEm:d.recebidaEm});tentativa.current=null;setPendente(false);setDados(inicial());
      requestAnimationFrame(()=>{topo.current?.focus();topo.current?.scrollIntoView({block:'start',behavior:'auto'});});
    }catch(e){setErro(e instanceof Error&&e.message==='limite'?t.limite:e instanceof Error&&e.message==='invalido'?t.invalido:t.falha);}
    finally{clearTimeout(tempo);controle.current=null;emVoo.current=false;setBusy(false);}
  }
  function revisar(){if(!window.confirm(t.revisar))return;tentativa.current=null;setPendente(false);setErro('');}
  return <div className={css.formulario} ref={topo} tabIndex={-1}>
    {recibo?<section className={css.recibo} aria-label={t.sucesso} role="status"><h2>{t.sucesso}</h2><p>{t.recebido}</p><dl><div><dt>{t.protocolo}</dt><dd>{recibo.protocolo}</dd></div><div><dt>{t.data}</dt><dd>{new Intl.DateTimeFormat(idioma==='pt'?'pt-BR':idioma==='es'?'es':'en',{dateStyle:'long',timeStyle:'short'}).format(new Date(recibo.recebidaEm))}</dd></div></dl><div className="linha"><Botao variante="secundario" onClick={async()=>{try{await navigator.clipboard.writeText(recibo.protocolo);setCopiado(true);}catch{window.getSelection()?.selectAllChildren(topo.current?.querySelector('dd') as Node);}}}>{copiado?t.copiado:t.copiar}</Botao><Botao variante="secundario" onClick={()=>{setRecibo(undefined);setCopiado(false);}}>{t.nova}</Botao></div></section>:
      <form onSubmit={enviar} action={API+'/tilt/publico/contato/formulario'} method="post" className="pilha--g" aria-busy={busy}>
        <input type="hidden" name="idioma" value={idioma}/><input type="hidden" name="origem" value="plataforma"/>
        <fieldset className="pilha--g" disabled={busy||pendente} style={{border:0,padding:0,margin:0,minWidth:0}}>
          <div className={css.grade}><CampoTexto idioma={idioma} id="contato-nome" name="Nome" rotulo={t.nome} autoComplete="name" value={dados.nome} onChange={e=>atualizar('nome',e.target.value)} minLength={2} maxLength={160} required/><CampoTexto idioma={idioma} id="contato-email" name="E-mail" rotulo={t.email} autoComplete="email" type="email" value={dados.email} onChange={e=>atualizar('email',e.target.value)} maxLength={254} required/></div>
          <CampoTexto idioma={idioma} id="contato-organizacao" name="Organização" rotulo={t.organizacao} autoComplete="organization" value={dados.organizacao} onChange={e=>atualizar('organizacao',e.target.value)} maxLength={200} opcional/>
          <CampoSelecao idioma={idioma} id="contato-assunto" name="Assunto" rotulo={t.assunto} value={dados.assunto} onChange={e=>atualizar('assunto',e.target.value)} opcoes={t.assuntos.map(a=>({valor:a,rotulo:a}))} required/>
          <CampoArea idioma={idioma} id="contato-mensagem" name="Mensagem" rotulo={t.mensagem} ajuda={t.ajuda} value={dados.mensagem} onChange={e=>atualizar('mensagem',e.target.value)} minLength={10} maxLength={10000} rows={7} required/>
          <div className={css.campoOculto} aria-hidden="true"><label htmlFor="contato-website">Website</label><input id="contato-website" name="_honey" tabIndex={-1} autoComplete="off" value={dados.honey} onChange={e=>atualizar('honey',e.target.value)}/></div>
        </fieldset>
        <p className="nota">{t.privacidade}</p>
        {erro?<p role="alert" className="campo__erro">{erro}</p>:null}
        <div className="linha"><Botao type="submit" disabled={busy}>{busy?t.enviando:pendente?t.tentar:t.enviar}</Botao>{pendente&&!busy?<Botao variante="secundario" onClick={revisar}>{t.editar}</Botao>:null}</div>
      </form>}
    <p className={css.ajuda}>{t.emailAlternativo} <a href="mailto:indica.osc@gmail.com">indica.osc@gmail.com</a>.</p>
  </div>;
}
