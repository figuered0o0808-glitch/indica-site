import type { ReactElement } from 'react';

/**
 * Ilustrações da plataforma INDICA: traços finos e formas geométricas
 * nos tons da marca e pontos como textura. Sem fotos e sem imagens
 * de banco.
 */

export type NomeIlustracao = 'busca' | 'lista' | 'pasta' | 'enviado';

/** Textura geométrica de apoio. */
function Pontos({
  x,
  y,
  colunas,
  linhas,
  passo = 14,
  raio = 2.2,
  opacidade = 1,
}: {
  x: number;
  y: number;
  colunas: number;
  linhas: number;
  passo?: number;
  raio?: number;
  opacidade?: number;
}) {
  const pontos: ReactElement[] = [];
  for (let l = 0; l < linhas; l += 1) {
    for (let c = 0; c < colunas; c += 1) {
      pontos.push(
        <circle
          key={`${l}-${c}`}
          cx={x + c * passo}
          cy={y + l * passo}
          r={raio}
          fill="currentColor"
          stroke="none"
        />,
      );
    }
  }
  return <g opacity={opacidade}>{pontos}</g>;
}

const DESENHOS: Record<NomeIlustracao, { viewBox: string; conteudo: ReactElement }> = {
  busca: {
    viewBox: '0 0 120 96',
    conteudo: (
      <>
        <Pontos x={24} y={20} colunas={6} linhas={5} passo={14} raio={2.2} opacidade={0.28} />
        <circle cx="54" cy="42" r="23" fill="var(--branco)" />
        <Pontos x={44} y={36} colunas={3} linhas={2} passo={10} raio={2.1} />
        <path d="M71 59l19 19" strokeWidth="2" />
      </>
    ),
  },
  lista: {
    viewBox: '0 0 120 96',
    conteudo: (
      <>
        <rect x="28" y="14" width="64" height="70" rx="7" fill="var(--branco)" />
        <rect x="48" y="6" width="24" height="15" rx="5" fill="var(--menta)" />
        <Pontos x={42} y={38} colunas={4} linhas={3} passo={12} raio={2.2} />
        <path d="M76 36.5l3.5 3.5 6-7" />
      </>
    ),
  },
  pasta: {
    viewBox: '0 0 120 96',
    conteudo: (
      <>
        <path d="M20 28a5 5 0 0 1 5-5h21l9 11h40a5 5 0 0 1 5 5v35a5 5 0 0 1-5 5H25a5 5 0 0 1-5-5z" fill="var(--areia)" />
        <path d="M20 45h80" />
        <Pontos x={36} y={60} colunas={4} linhas={1} passo={13} raio={2.2} />
      </>
    ),
  },
  enviado: {
    viewBox: '0 0 120 96',
    conteudo: (
      <>
        <rect x="28" y="24" width="62" height="46" rx="7" fill="var(--branco)" />
        <path d="M28 31l31 23 31-23" />
        <circle cx="90" cy="68" r="14" fill="var(--menta)" />
        <path d="M84 68.5l4.5 4.5 7.5-9" />
        <Pontos x={6} y={38} colunas={2} linhas={3} passo={9} raio={2} opacidade={0.5} />
      </>
    ),
  },

};

export function Ilustracao({
  nome,
  largura = 120,
  className,
}: {
  nome: NomeIlustracao;
  largura?: number;
  className?: string;
}) {
  const desenho = DESENHOS[nome];
  return (
    <svg
      className={`ilustracao ${className ?? ''}`}
      viewBox={desenho.viewBox}
      width={largura}
      role="presentation"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ height: 'auto' }}
    >
      {desenho.conteudo}
    </svg>
  );
}
