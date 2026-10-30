import type { CSSProperties } from 'react';

/** Assinatura oficial: azul, verde e rosa, com os degradês do site da INDICA. */
export function AssinaturaIndica({ tamanho = 14, className = '' }: { tamanho?: number; className?: string }) {
  return (
    <span className={`assinatura-indica ${className}`} aria-hidden="true"
      style={{ '--ponto-tamanho': `${tamanho}px` } as CSSProperties}>
      <i className="assinatura-indica__ponto assinatura-indica__ponto--azul" />
      <i className="assinatura-indica__ponto assinatura-indica__ponto--verde" />
      <i className="assinatura-indica__ponto assinatura-indica__ponto--rosa" />
    </span>
  );
}
