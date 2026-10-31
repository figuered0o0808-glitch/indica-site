'use client';
import { useEffect, useRef, useState } from 'react';
import { Botao } from '@/components/Botao';
import type { Idioma } from '@/i18n/idiomas';
import { textos } from '@/i18n/strings';
import type { DadosRascunho, RascunhoProposta } from '@/lib/types';
import { useApp } from '@/state/AppState';
import type { EstadoSalvamento } from './useRascunho';
import styles from './AppPessoal.module.css';
export function textoRascunho(dados: DadosRascunho, idioma: Idioma) { const t = textos(idioma).fluxos.candidatura.projeto; return (['projeto', 'descricao', 'formato', 'valor', 'justificativa', 'alcance', 'distribuicao'] as const).map(k => `${k === 'projeto' ? t.nome : t[k]}\n${dados[k]}`).join('\n\n'); }
export function CopiarRascunho({ idioma, dados }: {
    idioma: Idioma;
    dados: DadosRascunho;
}) {
    const t = textos(idioma).conta, ref = useRef<HTMLTextAreaElement>(null), [copiado, setCopiado] = useState(false), texto = textoRascunho(dados, idioma);
    async function copiar() { try {
        await navigator.clipboard.writeText(texto);
        setCopiado(true);
    }
    catch {
        ref.current?.focus();
        ref.current?.select();
    } }
    return <div className="pilha"><textarea className={styles.copy} ref={ref} readOnly value={texto} aria-label={t.textoRecuperavel}/><Botao variante="secundario" onClick={() => void copiar()}>{t.copiarTexto}</Botao>{copiado ? <p role="status">{t.copiado}</p> : null}</div>;
}
export function StatusRascunho({ idioma, status, atualizadoEm, onTentar, onRecarregar, dados }: {
    idioma: Idioma;
    status: EstadoSalvamento;
    atualizadoEm?: string;
    onTentar: () => void;
    onRecarregar: () => void;
    dados: DadosRascunho;
}) {
    const t = textos(idioma).conta;
    const label = { novo: t.rascunhoNovo, carregando: t.rascunhoCarregando, salvo: t.salvo, pendente: t.naoSalvo, salvando: t.salvando, erro: t.rascunhoErro, conflito: t.rascunhoConflito, erroLeitura: t.rascunhoFalhaLeitura, fechado: t.rascunhoFechado }[status];
    return <div className={status === 'conflito' || status === 'erro' ? styles.notice : styles.saving}><div role="status" aria-live="polite"><p>{label}</p>{status === 'salvo' && atualizadoEm ? <p className="texto-mini">{new Date(atualizadoEm).toLocaleString(idioma === 'pt' ? 'pt-BR' : idioma)}</p> : null}</div>{status === 'erro' ? <Botao variante="secundario" tamanho="pequeno" onClick={onTentar}>{textos(idioma).comum.envio.tentar}</Botao> : null}{status === 'conflito' ? <><p>{t.manterTexto}</p><CopiarRascunho idioma={idioma} dados={dados}/><Botao variante="secundario" onClick={onRecarregar}>{t.carregarVersao}</Botao></> : null}</div>;
}
export function RecuperarRascunho({ idioma, slug }: {
    idioma: Idioma;
    slug: string;
}) {
    const t = textos(idioma), { carregarRascunho, sessaoId } = useApp();
    const [dados, setDados] = useState<RascunhoProposta | null>(), [erro, setErro] = useState(false), [tentativa, setTentativa] = useState(0);
    useEffect(() => { let ativo = true; setDados(undefined); setErro(false); carregarRascunho(slug).then(r => { if (ativo)
        setDados(r.rascunho); }).catch(() => { if (ativo)
        setErro(true); }); return () => { ativo = false; }; }, [slug, sessaoId, carregarRascunho, tentativa]);
    return <div className={styles.notice}>{erro ? <><p role="alert">{t.conta.rascunhoFalhaLeitura}</p><Botao onClick={() => setTentativa(x => x + 1)}>{t.comum.envio.tentar}</Botao></> : dados === undefined ? <p role="status">{t.conta.rascunhoCarregando}</p> : dados ? <CopiarRascunho idioma={idioma} dados={dados.dados}/> : <p>{t.conta.rascunhoVazio}</p>}</div>;
}
