'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { DADOS_RASCUNHO_VAZIOS, ErroEnvio, novoEnvioId } from '@/lib/envio';
import type { DadosRascunho } from '@/lib/types';
import { useApp } from '@/state/AppState';
export type EstadoSalvamento = 'carregando' | 'novo' | 'salvo' | 'pendente' | 'salvando' | 'erro' | 'conflito' | 'erroLeitura' | 'fechado';
interface Editor {
    dono: number;
    dados: DadosRascunho;
    organizacaoId: number | null;
    passo: number;
    envioId: string;
    versao: number | null;
    atualizadoEm: string;
    aceitaEnvio: boolean;
}
function assinatura(e: Editor) {
    return JSON.stringify({ dados: e.dados, organizacaoId: e.organizacaoId, passo: e.passo, envioId: e.envioId });
}
/** Texto privado fica só em memória e no servidor. O cache da conta não recebe rascunhos. */
export function useRascunho(slug: string, aberta: boolean, orgPadrao?: number) {
    const { cadastrado, sessaoId, carregarRascunho, salvarRascunho } = useApp();
    const [editor, setEditor] = useState<Editor | null>(null);
    const [status, setStatus] = useState<EstadoSalvamento>('carregando');
    const [pausado, setPausado] = useState(false);
    const atual = useRef(editor);
    atual.current = editor;
    const orgInicial = useRef(orgPadrao);
    orgInicial.current = orgPadrao;
    const ciclo = useRef(0), ultimaAssinatura = useRef('');
    const conflito = useRef(false), pausa = useRef(false), montado = useRef(true);
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const operacao = useRef<{
        ciclo: number;
        promessa: Promise<boolean>;
    } | null>(null);
    const cancelarTimer = useCallback(() => { if (timer.current)
        clearTimeout(timer.current); timer.current = null; }, []);
    const carregar = useCallback(async () => {
        cancelarTimer();
        const chamada = ++ciclo.current;
        setStatus('carregando');
        try {
            const resposta = await carregarRascunho(slug);
            if (!montado.current || ciclo.current !== chamada)
                return;
            const r = resposta.rascunho;
            const novo: Editor = { dono: sessaoId, dados: r?.dados ?? { ...DADOS_RASCUNHO_VAZIOS }, organizacaoId: r?.organizacaoId ?? orgInicial.current ?? null, passo: r?.passo ?? 0, envioId: r?.envioId ?? novoEnvioId(), versao: r?.versao ?? null, atualizadoEm: r?.atualizadoEm ?? '', aceitaEnvio: aberta && resposta.aceitaEnvio };
            atual.current = novo;
            ultimaAssinatura.current = assinatura(novo);
            conflito.current = false;
            pausa.current = false;
            setPausado(false);
            setEditor(novo);
            setStatus(!novo.aceitaEnvio ? 'fechado' : r ? 'salvo' : 'novo');
        }
        catch {
            if (montado.current && ciclo.current === chamada)
                setStatus(atual.current ? 'conflito' : 'erroLeitura');
        }
    }, [aberta, carregarRascunho, cancelarTimer, sessaoId, slug]);
    useEffect(() => {
        montado.current = true;
        ciclo.current++;
        operacao.current = null;
        conflito.current = false;
        pausa.current = false;
        setPausado(false);
        atual.current = null;
        setEditor(null);
        if (cadastrado)
            void carregar();
        return () => { montado.current = false; ciclo.current++; cancelarTimer(); };
    }, [cadastrado, sessaoId, carregar, cancelarTimer]);
    const salvar = useCallback(async function persistir(ateAtual = false): Promise<boolean> {
        cancelarTimer();
        const e = atual.current, chamada = ciclo.current;
        if (!e || e.dono !== sessaoId || !e.aceitaEnvio || conflito.current || pausa.current)
            return false;
        const existente = operacao.current;
        if (existente && existente.ciclo === chamada) {
            const ok = await existente.promessa;
            return ok && ateAtual ? persistir(true) : ok;
        }
        const marca = assinatura(e);
        if (marca === ultimaAssinatura.current && e.versao !== null)
            return true;
        if (montado.current)
            setStatus('salvando');
        const op = { ciclo: chamada, promessa: Promise.resolve(false) };
        op.promessa = (async () => {
            try {
                const r = await salvarRascunho(slug, { envioId: e.envioId, organizacaoId: e.organizacaoId, dados: e.dados, passo: e.passo, versao: e.versao });
                if (ciclo.current !== chamada || pausa.current)
                    return false;
                ultimaAssinatura.current = marca;
                const maisNovo = atual.current;
                if (maisNovo) {
                    const novo = { ...maisNovo, versao: r.versao, atualizadoEm: r.atualizadoEm };
                    atual.current = novo;
                    if (montado.current)
                        setEditor(novo);
                }
                if (montado.current)
                    setStatus(atual.current && assinatura(atual.current) === marca ? 'salvo' : 'pendente');
                return true;
            }
            catch (erro) {
                if (ciclo.current !== chamada || pausa.current)
                    return false;
                if (erro instanceof ErroEnvio && erro.status === 409) {
                    conflito.current = true;
                    if (montado.current)
                        setStatus('conflito');
                    try {
                        const r = await carregarRascunho(slug);
                        if (ciclo.current === chamada && !r.aceitaEnvio && atual.current) {
                            const novo = { ...atual.current, aceitaEnvio: false };
                            atual.current = novo;
                            if (montado.current) {
                                setEditor(novo);
                                setStatus('fechado');
                            }
                        }
                    }
                    catch { }
                }
                else if (montado.current)
                    setStatus('erro');
                return false;
            }
            finally {
                if (operacao.current === op)
                    operacao.current = null;
            }
        })();
        operacao.current = op;
        const ok = await op.promessa;
        if (ok && ateAtual && atual.current && assinatura(atual.current) !== ultimaAssinatura.current)
            return persistir(true);
        return ok;
    }, [carregarRascunho, cancelarTimer, salvarRascunho, sessaoId, slug]);
    const marca = editor ? assinatura(editor) : '';
    useEffect(() => {
        if (!editor || editor.dono !== sessaoId || !editor.aceitaEnvio || conflito.current || pausado || marca === ultimaAssinatura.current)
            return;
        timer.current = setTimeout(() => { timer.current = null; void salvar(); }, 800);
        return cancelarTimer;
    }, [marca, editor?.versao, pausado, salvar, cancelarTimer, sessaoId]);
    useEffect(() => {
        const salvarAoSair = () => { if (atual.current && assinatura(atual.current) !== ultimaAssinatura.current)
            void salvar(true); };
        const ocultou = () => { if (document.visibilityState === 'hidden')
            salvarAoSair(); };
        window.addEventListener('pagehide', salvarAoSair);
        document.addEventListener('visibilitychange', ocultou);
        return () => { window.removeEventListener('pagehide', salvarAoSair); document.removeEventListener('visibilitychange', ocultou); };
    }, [salvar]);
    const alterar = useCallback((transformar: (e: Editor) => Editor) => {
        setEditor(antes => { if (!antes || antes.dono !== sessaoId)
            return antes; const novo = transformar(antes); atual.current = novo; return novo; });
        if (!conflito.current)
            setStatus('pendente');
    }, [sessaoId]);
    const pausar = useCallback(() => { pausa.current = true; setPausado(true); cancelarTimer(); }, [cancelarTimer]);
    const retomar = useCallback(() => { pausa.current = false; setPausado(false); }, []);
    return { editor, pronto: Boolean(editor && editor.dono === sessaoId), status, carregar, salvar, pausar, retomar,
        campo: (nome: keyof DadosRascunho, valor: string) => alterar(e => ({ ...e, dados: { ...e.dados, [nome]: valor } })),
        organizacao: (id: number) => alterar(e => ({ ...e, organizacaoId: id || null })),
        passo: (passo: number) => alterar(e => ({ ...e, passo: Math.max(0, Math.min(2, passo)) })),
    };
}
