'use client';
import { useEffect, useState, useRef } from 'react';
import { Botao } from '@/components/Botao';
import type { Idioma } from '@/i18n/idiomas';
import { textos } from '@/i18n/strings';
import type { ReciboPublico, Candidatura } from '@/lib/types';
import { data } from '@/lib/format';
import styles from './AppPessoal.module.css';
export function rotuloEstado(estado: string, idioma: Idioma) { const t = textos(idioma); if (estado === 'aguardando-aceite')
    return t.conta.estadoAceite; if (estado === 'suplente')
    return t.conta.estadoSuplente; if (estado === 'recusada')
    return t.conta.estadoRecusada; return t.comum.status[estado as keyof typeof t.comum.status] ?? estado; }
export function HistoricoProposta({ idioma, proposta }: {
    idioma: Idioma;
    proposta: Candidatura;
}) {
    const t = textos(idioma);
    if (!proposta.historico?.length)
        return null;
    return <details><summary>{t.conta.historico}</summary><ol className={styles.timeline} style={{ marginTop: 16 }}>{proposta.historico.map((h, i) => <li key={`${h.em}-${i}`}><strong>{rotuloEstado(h.estado, idioma)}</strong><br /><span className="texto-pequeno">{new Date(h.em).toLocaleString(idioma === 'pt' ? 'pt-BR' : idioma)}</span></li>)}</ol></details>;
}
export function ImprimirComprovante({ idioma, recibo, projeto }: {
    idioma: Idioma;
    recibo: ReciboPublico;
    projeto?: string;
}) {
    const t = textos(idioma), [imprimindo, setImprimindo] = useState(false), limparRef = useRef<(() => void) | null>(null);
    useEffect(() => () => limparRef.current?.(), []);
    function imprimir() {
        if (imprimindo)
            return;
        const artigo = document.createElement('article');
        artigo.className = styles.printable;
        function texto(tag: string, valor: string) { const elemento = document.createElement(tag); elemento.textContent = valor; artigo.appendChild(elemento); return elemento; }
        texto('h1', `INDICA · ${t.comum.envio.comprovante}`);
        texto('h2', recibo.titulo);
        if (recibo.simulacao)
            texto('p', t.conta.simulacaoTitulo);
        const lista = document.createElement('dl');
        artigo.appendChild(lista);
        const campos = [[t.comum.envio.protocolo, recibo.protocolo || '—'], ...(projeto ? [[t.fluxos.candidatura.projeto.nome, projeto]] : []), [t.comum.envio.enviadaEm, data(recibo.enviadaEm.slice(0, 10), idioma)], [t.comum.envio.situacao, rotuloEstado(recibo.estado, idioma)]];
        for (const [rotulo, valor] of campos) {
            const dt = document.createElement('dt'), dd = document.createElement('dd');
            dt.textContent = rotulo;
            dd.textContent = valor;
            lista.append(dt, dd);
        }
        texto('p', t.conta.comprovanteSemFinancas);
        document.body.appendChild(artigo);
        document.body.dataset.indicaRecibo = '1';
        document.body.classList.add(styles.printingRoot);
        setImprimindo(true);
        const limpar = () => { artigo.remove(); document.body.classList.remove(styles.printingRoot); delete document.body.dataset.indicaRecibo; window.removeEventListener('afterprint', limpar); limparRef.current = null; setImprimindo(false); };
        limparRef.current = limpar;
        window.addEventListener('afterprint', limpar);
        requestAnimationFrame(() => window.print());
    }
    return <Botao variante="secundario" tamanho="pequeno" onClick={imprimir} disabled={imprimindo}>{t.conta.imprimir}</Botao>;
}
