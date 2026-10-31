'use client';
import { useEffect, useRef, useState } from 'react';
import { Botao } from '@/components/Botao';
import type { Idioma } from '@/i18n/idiomas';
import { textos } from '@/i18n/strings';
import { motivoDoErro, type MotivoEnvio } from '@/lib/envio';
import { rota } from '@/lib/rotas';
import { useApp } from '@/state/AppState';
import styles from './AppPessoal.module.css';

export function BancoInfluenciadores({ idioma }: { idioma: Idioma }) {
    const t = textos(idioma), { perfil, participaBanco, definirParticipacaoBanco, sessaoId } = useApp();
    const [consentimento, setConsentimento] = useState(false), [confirmarSaida, setConfirmarSaida] = useState(false);
    const [busy, setBusy] = useState(false), [erro, setErro] = useState<MotivoEnvio>(), [salvo, setSalvo] = useState<boolean>();
    const aviso = useRef<HTMLParagraphElement>(null), pergunta = useRef<HTMLParagraphElement>(null), acaoSaida = useRef<HTMLDivElement>(null);
    const redeValida = perfil?.redes.some(r => r.plataforma.trim() && r.perfil.trim());
    useEffect(() => { setConsentimento(false); setConfirmarSaida(false); setErro(undefined); setSalvo(undefined); }, [sessaoId]);
    useEffect(() => { if (salvo !== undefined) aviso.current?.focus(); }, [salvo]);
    useEffect(() => { if (confirmarSaida) pergunta.current?.focus(); }, [confirmarSaida]);
    async function confirmar(participar: boolean) {
        if (busy || (participar && (!consentimento || !redeValida))) return;
        setBusy(true); setErro(undefined); setSalvo(undefined);
        try {
            await definirParticipacaoBanco(participar);
            setSalvo(participar); setConfirmarSaida(false); setConsentimento(false);
        } catch (e) { setErro(motivoDoErro(e)); }
        finally { setBusy(false); }
    }
    return <div className={`pilha ${styles.draftActions}`} aria-busy={busy}>
        <p>{t.conta.bancoIntro}</p>
        <p className="nota">{participaBanco ? t.conta.bancoAtivo : t.conta.bancoInativo}</p>
        {participaBanco ? confirmarSaida ? <div className={styles.notice} role="group" aria-label={t.conta.bancoSairPergunta}>
            <p ref={pergunta} tabIndex={-1}><strong>{t.conta.bancoSairPergunta}</strong></p><p>{t.conta.bancoSairAjuda}</p>
            <div className={styles.actions}><Botao onClick={() => void confirmar(false)} disabled={busy}>{busy ? t.comum.envio.enviando : t.conta.bancoSairConfirmar}</Botao><Botao variante="secundario" disabled={busy} onClick={() => { setConfirmarSaida(false); requestAnimationFrame(() => acaoSaida.current?.querySelector('button')?.focus()); }}>{t.conta.cancelar}</Botao></div>
        </div> : <div ref={acaoSaida}><Botao variante="secundario" disabled={busy} onClick={() => { setConfirmarSaida(true); setSalvo(undefined); }}>{t.conta.bancoSair}</Botao></div> : <>
            {!redeValida ? <><p>{t.conta.bancoRedeNecessaria}</p><Botao href={rota(idioma, 'painel/#perfil')} variante="secundario">{t.conta.bancoEditarRedes}</Botao></> : null}
            <label className={styles.choice}><input type="checkbox" checked={consentimento} disabled={busy} onChange={e => setConsentimento(e.target.checked)}/><span>{t.conta.bancoOptin}</span></label>
            <div><Botao disabled={busy || !consentimento || !redeValida} onClick={() => void confirmar(true)}>{busy ? t.comum.envio.enviando : t.conta.bancoParticipar}</Botao></div>
        </>}
        {erro ? <p role="alert" className="campo__erro">{t.comum.envio[erro]}</p> : null}
        {salvo !== undefined ? <p role="status" tabIndex={-1} ref={aviso}>{salvo ? t.conta.bancoEntrou : t.conta.bancoSaiu}</p> : null}
    </div>;
}
