'use client';
import { useEffect, useId, useRef, useState } from 'react';
import { Botao } from '@/components/Botao';
import type { Idioma } from '@/i18n/idiomas';
import { textos } from '@/i18n/strings';
import { ErroEnvio, motivoDoErro, type MotivoEnvio } from '@/lib/envio';
import type { ResumoRascunho } from '@/lib/types';
import { useApp } from '@/state/AppState';
import styles from './AppPessoal.module.css';

/** A exclusão só remove a versão exibida. Um conflito exige atualizar a lista. */
export function ExcluirRascunho({ idioma, rascunho, onExcluido }: {
    idioma: Idioma;
    rascunho: ResumoRascunho;
    onExcluido: () => void;
}) {
    const t = textos(idioma), id = useId();
    const { apagarRascunho, atualizarConta } = useApp();
    const [confirmando, setConfirmando] = useState(false), [busy, setBusy] = useState(false);
    const [erro, setErro] = useState<MotivoEnvio>(), [conflito, setConflito] = useState(false);
    const acao = useRef<HTMLButtonElement>(null), pergunta = useRef<HTMLParagraphElement>(null);
    const emVoo = useRef(false);
    useEffect(() => { setConfirmando(false); setErro(undefined); setConflito(false); }, [rascunho.envioId, rascunho.versao]);
    useEffect(() => { if (confirmando) pergunta.current?.focus(); }, [confirmando]);
    function cancelar() { setConfirmando(false); setErro(undefined); requestAnimationFrame(() => acao.current?.focus()); }
    async function excluir() {
        if (emVoo.current) return;
        emVoo.current = true;
        setBusy(true);
        setErro(undefined);
        try {
            await apagarRascunho(rascunho.chamadaSlug, rascunho.envioId, rascunho.versao);
            onExcluido();
        } catch (e) {
            if (e instanceof ErroEnvio && e.status === 409) setConflito(true);
            else setErro(motivoDoErro(e));
        } finally {
            emVoo.current = false;
            setBusy(false);
        }
    }
    async function atualizar() {
        if (emVoo.current) return;
        emVoo.current = true;
        setBusy(true);
        try { await atualizarConta(); cancelar(); }
        catch (e) { setErro(motivoDoErro(e)); }
        finally { emVoo.current = false; setBusy(false); }
    }
    return <div className={`pilha ${styles.draftActions}`}>
        <button ref={acao} type="button" className="btn btn--discreto btn--pequeno" aria-expanded={confirmando} aria-controls={id} disabled={busy} onClick={() => setConfirmando(true)}>{t.conta.rascunhoExcluir}</button>
        {confirmando ? <div id={id} role="group" aria-labelledby={`${id}-titulo`} aria-busy={busy} className={styles.notice}>
            <p id={`${id}-titulo`} ref={pergunta} tabIndex={-1}><strong>{t.conta.rascunhoExcluirPergunta}</strong></p>
            <p>{t.conta.rascunhoExcluirAjuda}</p>
            {conflito ? <p role="alert" className="campo__erro">{t.conta.rascunhoExcluirConflito}</p> : null}
            {erro ? <p role="alert" className="campo__erro">{t.comum.envio[erro]}</p> : null}
            <div className={styles.actions}>
                {conflito ? <Botao onClick={() => void atualizar()} disabled={busy}>{busy ? t.comum.envio.atualizando : t.conta.rascunhosAtualizar}</Botao> : <Botao onClick={() => void excluir()} disabled={busy}>{busy ? t.conta.rascunhoExcluindo : t.conta.rascunhoExcluirConfirmar}</Botao>}
                <Botao variante="secundario" onClick={cancelar} disabled={busy}>{t.conta.cancelar}</Botao>
            </div>
        </div> : null}
    </div>;
}
