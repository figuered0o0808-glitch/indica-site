'use client';

/**
 * Pecas de layout compartilhadas pelas telas do painel. Sao apenas
 * composicoes das classes de globals.css: nenhum estilo novo, nenhuma
 * cor fora da paleta.
 */

import type { ReactNode } from 'react';

import { Marcador } from '@/components/Marcador';

/** Secao do painel: titulo, acoes a direita e conteudo. */
export function SecaoPainel({
  id,
  titulo,
  acoes,
  fundo,
  marcador = 1,
  children,
}: {
  id: string;
  titulo: string;
  acoes?: ReactNode;
  fundo?: boolean;
  /** Arranjo do marcador de pontos ao lado do titulo, para duas secoes nao repetirem o desenho. */
  marcador?: 1 | 2 | 3;
  children: ReactNode;
}) {
  return (
    <section id={id} className={fundo ? 'secao secao--fundo' : 'secao'}>
      <div className="container">
        <div className="linha linha--fim" style={{ alignItems: 'flex-end', marginBottom: 22 }}>
          <div className="linha" style={{ gap: 12 }}>
            <Marcador arranjo={marcador} />
            <h2 style={{ margin: 0 }}>{titulo}</h2>
          </div>
          {acoes ? <div className="linha">{acoes}</div> : null}
        </div>
        {children}
      </div>
    </section>
  );
}

/**
 * Faixa de indicadores. Os numeros vem sempre do que a pessoa registrou;
 * quem chama so a desenha quando ha algo para contar.
 */
export function ResumoPainel({ itens }: { itens: { rotulo: string; valor: string }[] }) {
  return (
    <div className="grade--4">
      {itens.map((item) => (
        <div key={item.rotulo} className="cartao cartao--compacto">
          <p className="numero-grande" style={{ margin: 0 }}>
            {item.valor}
          </p>
          <p className="texto-mini" style={{ margin: 0 }}>
            {item.rotulo}
          </p>
        </div>
      ))}
    </div>
  );
}

/** Barra de progresso simples, desenhada com div e borda. Sem biblioteca. */
export function BarraProgresso({ valor, rotulo }: { valor: number; rotulo: string }) {
  const limitado = Math.max(0, Math.min(100, Math.round(valor)));
  return (
    <div className="pilha--p">
      <div className="linha linha--fim texto-mini" style={{ gap: 10, flexWrap: 'nowrap' }}>
        <span>{rotulo}</span>
        <span style={{ fontVariantNumeric: 'tabular-nums' }}>{limitado}%</span>
      </div>
      <div
        role="img"
        aria-label={`${rotulo}: ${limitado} por cento`}
        style={{
          height: 10,
          borderRadius: 'var(--raio-pilula)',
          border: '1px solid var(--preto)',
          background: 'var(--areia)',
          overflow: 'hidden',
        }}
      >
        <div style={{ width: `${limitado}%`, height: '100%', background: 'var(--preto)' }} />
      </div>
    </div>
  );
}
