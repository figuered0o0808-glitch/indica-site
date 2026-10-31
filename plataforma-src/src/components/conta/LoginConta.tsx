'use client';
import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { CampoTexto } from '@/components/Campo';
import { Botao } from '@/components/Botao';
import type { Idioma } from '@/i18n/idiomas';
import { textos } from '@/i18n/strings';
import { ErroEnvio, motivoDoErro, type MotivoEnvio } from '@/lib/envio';
import { rota } from '@/lib/rotas';
import { useApp } from '@/state/AppState';
export function LoginConta({ idioma, retorno, recibo, criarConta }: {
    idioma: Idioma;
    retorno?: string;
    recibo?: string;
    criarConta?: () => void;
}) {
    const t = textos(idioma), router = useRouter(), { entrar } = useApp();
    const [email, setEmail] = useState(''), [senha, setSenha] = useState(''), [busy, setBusy] = useState(false), [erro, setErro] = useState<MotivoEnvio | 'login'>();
    async function enviar(e: FormEvent) { e.preventDefault(); if (busy)
        return; setBusy(true); setErro(undefined); try {
        await entrar(email, senha);
        setSenha('');
        router.push(rota(idioma, retorno ? `oportunidades/${retorno}/candidatura/` : `painel/${recibo ? `?recibo=${encodeURIComponent(recibo)}#comprovantes` : ''}`));
    }
    catch (e) {
        setErro(e instanceof ErroEnvio && e.status === 401 ? 'login' : motivoDoErro(e));
    }
    finally {
        setBusy(false);
    } }
    return <form onSubmit={enviar} className="cartao" aria-busy={busy}><h2 className="cartao__titulo">{t.conta.loginTitulo}</h2><p>{t.conta.loginIntro}</p><fieldset disabled={busy} className="pilha" style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}><CampoTexto idioma={idioma} id="conta-login-email" type="email" rotulo={t.conta.email} value={email} onChange={e => setEmail(e.target.value)} autoComplete="username" required/><CampoTexto idioma={idioma} id="conta-login-senha" type="password" rotulo={t.conta.senha} value={senha} onChange={e => setSenha(e.target.value)} autoComplete="current-password" required/>{erro ? <p role="alert" className="campo__erro">{erro === 'login' ? t.conta.erroLogin : t.comum.envio[erro]}</p> : null}<div className="linha"><Botao type="submit" disabled={busy}>{busy ? t.comum.envio.enviando : t.conta.entrar}</Botao>{criarConta ? <Botao variante="secundario" onClick={criarConta}>{t.conta.criar}</Botao> : <Botao href={rota(idioma, `cadastro/${retorno ? `?retorno=${encodeURIComponent(retorno)}` : ''}`)} variante="secundario">{t.conta.criar}</Botao>}</div></fieldset></form>;
}
