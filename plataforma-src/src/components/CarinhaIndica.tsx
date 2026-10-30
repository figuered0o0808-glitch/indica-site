'use client';

import { useEffect, useId, useMemo, useRef, useState, type CSSProperties, type Ref } from 'react';

import { arquivoPublico } from '@/lib/format';
import { INDICA_MORPH, type MorphPoint, type MorphPiece } from './indica-morph-data';

import styles from './CarinhaIndica.module.css';

export type EstadoCarinhaIndica = 'neutro' | 'oportunidades' | 'cadastro' | 'biblioteca' | 'confirmacao';
export type ExpressaoCarinhaIndica = '01' | '02' | '03';
export type CorCarinhaIndica = 'azul' | 'verde' | 'rosa' | 'branco';

type Caixa = {
  x: number;
  y: number;
  largura: number;
  altura: number;
};

type Recorte = Caixa & {
  nome: string;
  classe: string;
  pontos?: string;
  excluir?: string[];
};

type Arte = {
  viewBox: string;
  centro: string;
  recortes: Recorte[];
};

/* Cada mapa separa partes da própria imagem: os traços nunca são redesenhados. */
const ARTES: Record<ExpressaoCarinhaIndica, Arte> = {
  '01': {
    viewBox: '40 235 1040 655',
    centro: '560px 565px',
    recortes: [
      { nome: 'sobrancelha-esquerda', classe: 'sobrancelhaEsquerda', x: 280, y: 260, largura: 190, altura: 85 },
      { nome: 'sobrancelha-direita', classe: 'sobrancelhaDireita', x: 570, y: 260, largura: 190, altura: 85 },
      { nome: 'olho-esquerdo', classe: 'olhoEsquerdo', x: 325, y: 395, largura: 180, altura: 195 },
      { nome: 'olho-direito', classe: 'olhoDireito', x: 530, y: 395, largura: 185, altura: 195 },
      { nome: 'orelha-esquerda', classe: 'orelha', x: 125, y: 410, largura: 140, altura: 175 },
      { nome: 'orelha-direita', classe: 'orelha', x: 820, y: 425, largura: 140, altura: 170 },
      { nome: 'nariz', classe: 'nariz', x: 400, y: 605, largura: 265, altura: 110 },
      { nome: 'boca', classe: 'boca', x: 475, y: 717, largura: 65, altura: 65 },
      { nome: 'face-esquerda', classe: 'face', x: 60, y: 620, largura: 310, altura: 225 },
      { nome: 'face-direita', classe: 'face', x: 710, y: 620, largura: 355, altura: 225 },
    ],
  },
  '02': {
    viewBox: '220 120 780 850',
    centro: '610px 545px',
    recortes: [
      { nome: 'sobrancelha-esquerda', classe: 'sobrancelhaEsquerda', x: 245, y: 150, largura: 200, altura: 90 },
      { nome: 'sobrancelha-direita', classe: 'sobrancelhaDireita', x: 540, y: 145, largura: 215, altura: 105 },
      { nome: 'olho-esquerdo', classe: 'olhoEsquerdo', x: 275, y: 270, largura: 225, altura: 245 },
      { nome: 'olho-direito', classe: 'olhoDireito', x: 500, y: 270, largura: 250, altura: 245 },
      { nome: 'orelha', classe: 'orelha', x: 810, y: 330, largura: 155, altura: 190 },
      { nome: 'nariz', classe: 'nariz', x: 415, y: 510, largura: 110, altura: 180 },
      { nome: 'boca', classe: 'boca', x: 380, y: 720, largura: 215, altura: 210 },
    ],
  },
  '03': {
    viewBox: '170 90 760 930',
    centro: '550px 555px',
    recortes: [
      { nome: 'sobrancelha-esquerda', classe: 'sobrancelhaEsquerda', x: 195, y: 155, largura: 235, altura: 115, pontos: '212,160 426,198 415,270 196,232' },
      { nome: 'sobrancelha-direita', classe: 'sobrancelhaDireita', x: 535, y: 115, largura: 355, altura: 190, pontos: '537,221 860,116 889,198 565,306' },
      { nome: 'olho-esquerdo', classe: 'olhoEsquerdo', x: 220, y: 225, largura: 225, altura: 245, excluir: ['sobrancelha-esquerda'] },
      { nome: 'olho-direito', classe: 'olhoDireito', x: 620, y: 215, largura: 250, altura: 240, excluir: ['sobrancelha-direita'] },
      { nome: 'nariz', classe: 'nariz', x: 235, y: 520, largura: 105, altura: 165 },
      { nome: 'boca', classe: 'boca', x: 385, y: 465, largura: 175, altura: 175 },
      { nome: 'face', classe: 'face', x: 270, y: 660, largura: 385, altura: 315, excluir: ['nariz'] },
    ],
  },
};

const BRANCO = '#f3f5f8';
const GRADIENTES = {
  azul: { cores: ['#62c2ff', '#2f6df0'], angulo: 150 },
  verde: { cores: ['#c2ee5a', '#5cbf1f'], angulo: 150 },
  rosa: { cores: ['#8ace2b', '#ff2e9a'], angulo: 140 },
} as const;

const PARTES_COLORIDAS: Record<ExpressaoCarinhaIndica, string[]> = {
  '01': ['olho-esquerdo', 'boca'],
  '02': ['olho-direito'],
  '03': ['sobrancelha-direita', 'boca'],
};

const COR_DA_ARTE: Record<ExpressaoCarinhaIndica, Exclude<CorCarinhaIndica, 'branco'>> = {
  '01': 'verde', '02': 'rosa', '03': 'azul',
};

/* Caixas medidas na marca oficial. O i permanece uma única letra na arte final. */
const ALVOS = {
  simbolo: { x: 1, y: 1, largura: 393, altura: 814 },
  n: { x: 454, y: 199, largura: 577, altura: 585 },
  d: { x: 1088, y: 12, largura: 614, altura: 778 },
  'i-ponto': { x: 1799, y: 2, largura: 183, altura: 158 },
  'i-haste': { x: 1803, y: 208, largura: 178, altura: 579 },
  c: { x: 2036, y: 194, largura: 539, altura: 598 },
  a: { x: 2612, y: 193, largura: 613, altura: 599 },
  sublinhado: { x: 2066, y: 852, largura: 488, altura: 115 },
} satisfies Record<string, Caixa>;

const GLIFOS_FINAIS = [
  { nome: 'simbolo', caixa: ALVOS.simbolo },
  { nome: 'n', caixa: ALVOS.n },
  { nome: 'd', caixa: ALVOS.d },
  { nome: 'i', caixa: { x: 1799, y: 2, largura: 183, altura: 785 } },
  { nome: 'c', caixa: ALVOS.c },
  { nome: 'a', caixa: ALVOS.a },
  { nome: 'sublinhado', caixa: ALVOS.sublinhado },
] as const;

type Montagem = {
  alvo: keyof typeof ALVOS;
  rotacao: number;
  apoio?: boolean;
  tinta?: Caixa;
  dimensoesAlinhadas?: [number, number];
};

/* A mesma peça colorida viaja até a mesma letra da marca. */
const MONTAGEM: Record<ExpressaoCarinhaIndica, Record<string, Montagem>> = {
  '01': {
    'sobrancelha-esquerda': { alvo: 'i-haste', rotacao: 90 },
    'sobrancelha-direita': { alvo: 'i-ponto', rotacao: 0 },
    'olho-esquerdo': { alvo: 'n', rotacao: 180, tinta: { x: 333, y: 406, largura: 166, altura: 169 } },
    'olho-direito': { alvo: 'i-haste', rotacao: 180, apoio: true },
    'orelha-esquerda': { alvo: 'simbolo', rotacao: 180, apoio: true },
    'orelha-direita': { alvo: 'd', rotacao: 180 },
    nariz: { alvo: 'simbolo', rotacao: 0 },
    boca: { alvo: 'a', rotacao: 0, tinta: { x: 479, y: 718, largura: 58, altura: 58 } },
    'face-esquerda': { alvo: 'c', rotacao: 90 },
    'face-direita': { alvo: 'd', rotacao: 90, apoio: true },
  },
  '02': {
    'sobrancelha-esquerda': { alvo: 'i-haste', rotacao: 90 },
    'sobrancelha-direita': { alvo: 'sublinhado', rotacao: 0 },
    'olho-esquerdo': { alvo: 'c', rotacao: 0 },
    'olho-direito': { alvo: 'a', rotacao: 0, tinta: { x: 509, y: 280, largura: 230, altura: 223 } },
    orelha: { alvo: 'd', rotacao: 180 },
    nariz: { alvo: 'simbolo', rotacao: 0 },
    boca: { alvo: 'n', rotacao: 90 },
  },
  '03': {
    'sobrancelha-esquerda': { alvo: 'i-haste', rotacao: 90 },
    'sobrancelha-direita': {
      alvo: 'sublinhado', rotacao: 18.106,
      tinta: { x: 543, y: 124, largura: 336, altura: 172 },
      dimensoesAlinhadas: [354, 75],
    },
    'olho-esquerdo': { alvo: 'c', rotacao: 0 },
    'olho-direito': { alvo: 'a', rotacao: 0 },
    nariz: { alvo: 'simbolo', rotacao: 0 },
    boca: { alvo: 'n', rotacao: 90, tinta: { x: 395, y: 477, largura: 148, altura: 147 } },
    face: { alvo: 'd', rotacao: 180 },
  },
};

const DURACAO_MONTAGEM = 840;

function nomeDoGlifo(alvo: keyof typeof ALVOS) {
  return alvo === 'i-haste' || alvo === 'i-ponto' ? 'i' : alvo;
}

/* Uma só silhueta por vez: cada letra assume no quadro em que suas peças chegam. */
function temposDosGlifos(expressao: ExpressaoCarinhaIndica) {
  const recortes = ARTES[expressao].recortes;
  const tempos: Record<string, { chegada: number; partida: number }> = {};
  recortes.forEach((recorte, indice) => {
    const montagem = MONTAGEM[expressao][recorte.nome];
    if (montagem.apoio) return;
    const nome = nomeDoGlifo(montagem.alvo);
    const chegada = DURACAO_MONTAGEM + indice * 16;
    const partida = (recortes.length - 1 - indice) * 12;
    tempos[nome] = {
      chegada: Math.max(tempos[nome]?.chegada ?? 0, chegada),
      partida: Math.min(tempos[nome]?.partida ?? Infinity, partida),
    };
  });
  return tempos;
}

const GLIFOS_COLORIDOS: Record<ExpressaoCarinhaIndica, readonly string[]> = {
  '01': ['n', 'a'],
  '02': ['a'],
  '03': ['n', 'sublinhado'],
};

function Forma({ recorte, fill }: { recorte: Recorte; fill?: string }) {
  return recorte.pontos ? (
    <polygon points={recorte.pontos} fill={fill} />
  ) : (
    <rect x={recorte.x} y={recorte.y} width={recorte.largura} height={recorte.altura} fill={fill} />
  );
}

function eixoDoGradiente(recorte: Caixa, angulo: number) {
  const radianos = angulo * Math.PI / 180;
  const dx = Math.sin(radianos);
  const dy = -Math.cos(radianos);
  const comprimento = Math.abs(recorte.largura * dx) + Math.abs(recorte.altura * dy);
  const cx = recorte.x + recorte.largura / 2;
  const cy = recorte.y + recorte.altura / 2;
  return {
    x1: cx - dx * comprimento / 2,
    y1: cy - dy * comprimento / 2,
    x2: cx + dx * comprimento / 2,
    y2: cy + dy * comprimento / 2,
  };
}

type PecaVetorial = {
  nome: string;
  indice: number;
  cx: number;
  cy: number;
  dx: number;
  dy: number;
  rotacao: number;
  escalaX: number;
  escalaY: number;
  source: MorphPoint[][];
  target: MorphPoint[][];
  opacity: number;
  aux: { source: MorphPoint[][]; target: MorphPoint[][]; opacity: number }[];
};

function caminhoEntre(origem: MorphPoint[][], destino: MorphPoint[][], progresso: number) {
  let d = '';
  origem.forEach((contorno, i) => {
    const final = destino[i];
    contorno.forEach(([x, y], j) => {
      const [fx, fy] = final[j];
      d += `${j ? 'L' : 'M'}${(x + (fx - x) * progresso).toFixed(2)},${(y + (fy - y) * progresso).toFixed(2)}`;
    });
    d += 'Z';
  });
  return d;
}

function transformacaoEntre(peca: PecaVetorial, progresso: number) {
  return `translate(${peca.dx * progresso} ${peca.dy * progresso}) rotate(${peca.rotacao * progresso}) scale(${1 + (peca.escalaX - 1) * progresso} ${1 + (peca.escalaY - 1) * progresso})`;
}

function curvaMovimento(progresso: number, voltando: boolean) {
  if (progresso <= 0 || progresso >= 1) return progresso;
  const [x1, y1, x2, y2] = voltando ? [.2, .72, .18, 1] : [.22, .76, .16, 1];
  const coordenada = (t: number, a: number, b: number) => 3 * (1 - t) ** 2 * t * a + 3 * (1 - t) * t ** 2 * b + t ** 3;
  let baixo = 0;
  let alto = 1;
  for (let i = 0; i < 13; i++) {
    const meio = (baixo + alto) / 2;
    if (coordenada(meio, x1, x2) < progresso) baixo = meio;
    else alto = meio;
  }
  return coordenada((baixo + alto) / 2, y1, y2);
}

/** Artes originais: branco predominante, acentos por parte e pivôs SVG nativos. */
export function CarinhaIndica({
  estado = 'neutro',
  expressao = '02',
  cor = 'branco',
  entrada = false,
  preparando = false,
  pausada = false,
  marca = false,
  elementoRef,
  ciclo,
  className = '',
}: {
  estado?: EstadoCarinhaIndica;
  expressao?: ExpressaoCarinhaIndica;
  cor?: CorCarinhaIndica;
  entrada?: boolean;
  preparando?: boolean;
  pausada?: boolean;
  marca?: boolean;
  elementoRef?: Ref<SVGSVGElement>;
  ciclo?: string;
  className?: string;
}) {
  const instancia = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const [apresentada, setApresentada] = useState(false);
  const [viva, setViva] = useState(false);
  const atrasoEntrada = expressao === '03' ? 0 : expressao === '01' ? 140 : 280;
  useEffect(() => {
    if (!entrada || preparando || pausada) return;
    const fim = setTimeout(() => setApresentada(true), 1500);
    return () => clearTimeout(fim);
  }, [entrada, preparando, pausada]);
  useEffect(() => {
    if (!entrada || preparando || marca) { setViva(false); return; }
    if (pausada) return;
    const fim = setTimeout(() => setViva(true), 1420);
    return () => clearTimeout(fim);
  }, [entrada, preparando, marca, pausada]);
  const prefixo = `carinha-${instancia}-${expressao}`;
  const arte = ARTES[expressao];
  const fonte = arquivoPublico(`/marca/rostos/rosto-${expressao}.png`);
  const fonteMarca = arquivoPublico('/marca/indica.png');
  const [minX, minY, largura, altura] = arte.viewBox.split(' ').map(Number);
  const [centroX, centroY] = arte.centro.split(' ').map(parseFloat);
  const gradiente = GRADIENTES[COR_DA_ARTE[expressao]];
  const partesColoridas = PARTES_COLORIDAS[expressao];
  const temposGlifos = temposDosGlifos(expressao);
  const origemZero = { '--origem': '0px 0px', '--centro-rosto': '0px 0px' } as CSSProperties;
  const larguraMarca = Math.max(largura, altura) * 4 / 3;
  const escalaMarca = larguraMarca / 3228;
  const alturaMarca = 968 * escalaMarca;
  const marcaX = (largura - larguraMarca) / 2;
  const marcaY = (altura - alturaMarca) / 2;

  const dadosVetoriais = expressao === '02' || expressao === '03' ? INDICA_MORPH.faces[expressao] : null;
  const gruposVetoriais = useRef<Record<string, SVGGElement | null>>({});
  const caminhosVetoriais = useRef<Record<string, SVGPathElement | null>>({});
  const auxiliaresVetoriais = useRef<Record<string, (SVGPathElement | null)[]>>({});
  const progressosVetoriais = useRef<Record<string, number>>({});
  const inicioVetorial = useRef(marca ? 1 : 0);
  const pecasVetoriais = useMemo(() => {
    if (!dadosVetoriais) return null;
    const pecas: Record<string, PecaVetorial> = {};
    arte.recortes.forEach((recorte, indice) => {
      const dados: MorphPiece = dadosVetoriais[recorte.nome];
      const montagem = MONTAGEM[expressao][recorte.nome];
      const tinta = montagem.tinta ?? recorte;
      const cx = tinta.x + tinta.largura / 2;
      const cy = tinta.y + tinta.altura / 2;
      const alvo = ALVOS[montagem.alvo];
      const destinoX = minX + marcaX + (alvo.x + alvo.largura / 2) * escalaMarca;
      const destinoY = minY + marcaY + (alvo.y + alvo.altura / 2) * escalaMarca;
      const quartoDeVolta = Math.abs(montagem.rotacao) % 180 === 90;
      const [larguraAlinhada, alturaAlinhada] = montagem.dimensoesAlinhadas ?? [tinta.largura, tinta.altura];
      const escalaX = (quartoDeVolta ? alvo.altura : alvo.largura) * escalaMarca / larguraAlinhada;
      const escalaY = (quartoDeVolta ? alvo.largura : alvo.altura) * escalaMarca / alturaAlinhada;
      const radianos = montagem.rotacao * Math.PI / 180;
      const cos = Math.cos(radianos);
      const sin = Math.sin(radianos);
      // O destino é a própria letra oficial, trazida ao sistema local da peça.
      const target = dados.target.map((contorno) => contorno.map(([x, y]): MorphPoint => {
        const rx = minX + marcaX + x * escalaMarca - destinoX;
        const ry = minY + marcaY + y * escalaMarca - destinoY;
        return [cx + (cos * rx + sin * ry) / escalaX, cy + (-sin * rx + cos * ry) / escalaY];
      }));
      const aux = dados.aux.map((camada) => ({
        source: camada.contours,
        target: camada.contours.map((contorno) => {
          const centro = contorno.reduce(([sx, sy], [x, y]) => [sx + x / contorno.length, sy + y / contorno.length], [0, 0]);
          return contorno.map((): MorphPoint => [centro[0], centro[1]]);
        }),
        opacity: camada.opacity,
      }));
      pecas[recorte.nome] = { nome: recorte.nome, indice, cx, cy, dx: destinoX - cx, dy: destinoY - cy,
        rotacao: montagem.rotacao, escalaX, escalaY, source: dados.source, target, opacity: dados.opacity, aux };
    });
    return pecas;
  }, [expressao]);

  useEffect(() => {
    if (!pecasVetoriais) return;
    const alvo = marca ? 1 : 0;
    const movimentoReduzido = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pintar = (peca: PecaVetorial, progresso: number) => {
      progressosVetoriais.current[peca.nome] = progresso;
      gruposVetoriais.current[peca.nome]?.setAttribute('transform', transformacaoEntre(peca, progresso));
      const path = caminhosVetoriais.current[peca.nome];
      path?.setAttribute('d', caminhoEntre(peca.source, peca.target, progresso));
      // Só o nariz originalmente cinza ganha tinta; a silhueta principal nunca se dissolve.
      path?.setAttribute('opacity', String(peca.opacity + (1 - peca.opacity) * progresso));
      peca.aux.forEach((camada, indice) => {
        auxiliaresVetoriais.current[peca.nome]?.[indice]?.setAttribute('d', caminhoEntre(camada.source, camada.target, progresso));
      });
    };
    const pecas = Object.values(pecasVetoriais);
    const origens = pecas.map((peca) => progressosVetoriais.current[peca.nome] ?? inicioVetorial.current);
    const finalizar = () => pecas.forEach((peca) => pintar(peca, alvo));
    if (preparando || movimentoReduzido.matches) { finalizar(); return; }
    if (pausada) return;
    let quadro = 0;
    let inicio: number | null = null;
    let encerrado = false;
    const animar = (agora: number) => {
      if (encerrado) return;
      if (inicio === null) inicio = agora;
      let continua = false;
      pecas.forEach((peca, i) => {
        const origem = origens[i];
        if (Math.abs(origem - alvo) < .00001) return;
        const atrasoDaPeca = marca ? peca.indice * 16 : (pecas.length - 1 - peca.indice) * 12 + (entrada && !apresentada ? atrasoEntrada : 0);
        const duracao = (marca ? 840 : 940) * Math.abs(alvo - origem);
        const andamento = Math.max(0, Math.min(1, (agora - inicio! - atrasoDaPeca) / duracao));
        const progresso = origem + (alvo - origem) * curvaMovimento(andamento, !marca);
        pintar(peca, progresso);
        if (andamento < 1) continua = true;
      });
      if (continua) quadro = requestAnimationFrame(animar);
    };
    const preferenciaMudou = () => {
      if (movimentoReduzido.matches) { cancelAnimationFrame(quadro); finalizar(); }
    };
    movimentoReduzido.addEventListener('change', preferenciaMudou);
    if (origens.some((origem) => Math.abs(origem - alvo) > .00001)) quadro = requestAnimationFrame(animar);
    return () => {
      encerrado = true;
      cancelAnimationFrame(quadro);
      movimentoReduzido.removeEventListener('change', preferenciaMudou);
    };
  }, [pecasVetoriais, marca, preparando, pausada, entrada]);

  return (
    <svg
      ref={elementoRef}
      data-ciclo={ciclo}
      data-vetor={pecasVetoriais ? 'ativo' : undefined}
      data-pausada={pausada ? 'ativa' : undefined}
      className={`${styles.carinha} ${className}`}
      data-estado={estado}
      data-expressao={expressao}
      data-cor={cor}
      data-abertura={preparando ? 'preparando' : entrada && !apresentada ? 'revelando' : undefined}
      data-viva={viva && !marca && !preparando ? 'ativa' : undefined}
      style={{ '--sequencia-atraso': `${entrada && !apresentada ? atrasoEntrada : 0}ms` } as CSSProperties}
      data-marca={marca ? 'ativa' : undefined}
      viewBox={`0 0 ${largura} ${altura}`}
      width="64"
      height="64"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <mask id={`${prefixo}-base`} maskUnits="userSpaceOnUse" x="0" y="0" width="1080" height="1080">
          <rect width="1080" height="1080" fill="white" />
          {arte.recortes.map((recorte) => <Forma key={recorte.nome} recorte={recorte} fill="black" />)}
        </mask>
        {arte.recortes.map((recorte) => (
          <clipPath key={recorte.nome} id={`${prefixo}-${recorte.nome}`} clipPathUnits="userSpaceOnUse">
            <Forma recorte={recorte} />
          </clipPath>
        ))}
        {arte.recortes.filter((recorte) => recorte.excluir?.length).map((recorte) => (
          <mask key={recorte.nome} id={`${prefixo}-${recorte.nome}-separado`} maskUnits="userSpaceOnUse" x="0" y="0" width="1080" height="1080">
            <rect width="1080" height="1080" fill="white" />
            {recorte.excluir?.map((nome) => {
              const excluido = arte.recortes.find((parte) => parte.nome === nome);
              return excluido ? <Forma key={nome} recorte={excluido} fill="black" /> : null;
            })}
          </mask>
        ))}
        {/* A tinta branca mantém os cinzas como opacidade e elimina o fundo da imagem. */}
        <filter id={`${prefixo}-tinta`} filterUnits="userSpaceOnUse" x="0" y="0" width="1080" height="1080" colorInterpolationFilters="sRGB">
          <feColorMatrix in="SourceGraphic" type="luminanceToAlpha" result="luminancia" />
          <feComponentTransfer in="luminancia" result="negativo">
            <feFuncA type="table" tableValues="1 0" />
          </feComponentTransfer>
          <feComposite in="negativo" in2="SourceAlpha" operator="in" result="tintaAlpha" />
          <feColorMatrix in="tintaAlpha" type="matrix"
            values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0" />
        </filter>
        <mask id={`${prefixo}-tinta-base`} maskUnits="userSpaceOnUse" x="0" y="0" width="1080" height="1080">
          <image href={fonte} width="1080" height="1080" filter={`url(#${prefixo}-tinta)`} mask={`url(#${prefixo}-base)`} />
        </mask>
        {arte.recortes.map((recorte) => (
          <mask key={recorte.nome} id={`${prefixo}-${recorte.nome}-tinta`} maskUnits="userSpaceOnUse" x="0" y="0" width="1080" height="1080">
            <image href={fonte} width="1080" height="1080"
              filter={`url(#${prefixo}-tinta)`}
              clipPath={`url(#${prefixo}-${recorte.nome})`}
              mask={recorte.excluir?.length ? `url(#${prefixo}-${recorte.nome}-separado)` : undefined} />
          </mask>
        ))}
        {arte.recortes.filter((recorte) => partesColoridas.includes(recorte.nome)).map((recorte) => (
          <linearGradient key={recorte.nome} id={`${prefixo}-${recorte.nome}-gradiente`}
            gradientUnits="userSpaceOnUse" {...eixoDoGradiente(recorte, gradiente.angulo)}>
            <stop offset="0" stopColor={gradiente.cores[0]} />
            <stop offset="1" stopColor={gradiente.cores[1]} />
          </linearGradient>
        ))}
        {pecasVetoriais && (
          <linearGradient id={`${prefixo}-vetor-gradiente`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0" stopColor={gradiente.cores[0]} />
            <stop offset="1" stopColor={gradiente.cores[1]} />
          </linearGradient>
        )}
        {GLIFOS_FINAIS.map(({ nome, caixa }) => (
          <clipPath key={`marca-clip-${nome}`} id={`${prefixo}-marca-${nome}-clip`} clipPathUnits="userSpaceOnUse">
            <rect x={caixa.x - 3} y={caixa.y - 3} width={caixa.largura + 6} height={caixa.altura + 6} />
          </clipPath>
        ))}
        {/* A marca já tem tinta branca e transparência: sua máscara não é invertida. */}
        {GLIFOS_FINAIS.map(({ nome }) => (
          <mask key={`marca-tinta-${nome}`} id={`${prefixo}-marca-${nome}-tinta`}
            maskUnits="userSpaceOnUse" x="0" y="0" width="3228" height="968">
            <image href={fonteMarca} width="3228" height="968" clipPath={`url(#${prefixo}-marca-${nome}-clip)`} />
          </mask>
        ))}
        {GLIFOS_FINAIS.filter(({ nome }) => GLIFOS_COLORIDOS[expressao].includes(nome)).map(({ nome, caixa }) => (
          <linearGradient key={`marca-gradiente-${nome}`} id={`${prefixo}-marca-${nome}-gradiente`}
            gradientUnits="userSpaceOnUse" {...eixoDoGradiente(caixa, gradiente.angulo)}>
            <stop offset="0" stopColor={gradiente.cores[0]} />
            <stop offset="1" stopColor={gradiente.cores[1]} />
          </linearGradient>
        ))}
      </defs>
      <g transform={`translate(${-minX} ${-minY})`}>
        <g transform={`translate(${centroX} ${centroY})`}>
          <g className={styles.apresentacao} style={origemZero}>
            <g className={styles.rosto} style={origemZero}>
              <g transform={`translate(${-centroX} ${-centroY})`}>
                {!pecasVetoriais && <g className={styles.restante}>
                  <rect width="1080" height="1080" fill={BRANCO} mask={`url(#${prefixo}-tinta-base)`} />
                </g>}
                {arte.recortes.map((recorte, indice) => {
                  const pecaVetorial = pecasVetoriais?.[recorte.nome];
                  const montagem = MONTAGEM[expressao][recorte.nome];
                  const tinta = montagem.tinta ?? recorte;
                  const cx = tinta.x + tinta.largura / 2;
                  const cy = tinta.y + tinta.altura / 2;
                  const alvo = ALVOS[montagem.alvo];
                  const destinoX = minX + marcaX + (alvo.x + alvo.largura / 2) * escalaMarca;
                  const destinoY = minY + marcaY + (alvo.y + alvo.altura / 2) * escalaMarca;
                  const quartoDeVolta = Math.abs(montagem.rotacao) % 180 === 90;
                  const [larguraAlinhada, alturaAlinhada] = montagem.dimensoesAlinhadas ?? [tinta.largura, tinta.altura];
                  const escalaX = montagem.apoio ? 0 : (quartoDeVolta ? alvo.altura : alvo.largura) * escalaMarca / larguraAlinhada;
                  const escalaY = montagem.apoio ? 0 : (quartoDeVolta ? alvo.largura : alvo.altura) * escalaMarca / alturaAlinhada;
                  const estiloMontagem = {
                    ...origemZero,
                    '--montar-x': `${destinoX - cx}px`,
                    '--montar-y': `${destinoY - cy}px`,
                    '--montar-rotacao': `${montagem.rotacao}deg`,
                    '--montar-escala-x': escalaX,
                    '--montar-escala-y': escalaY,
                    '--montar-atraso': `${indice * 16}ms`,
                    '--montar-chegada': `${temposGlifos[nomeDoGlifo(montagem.alvo)]?.chegada ?? DURACAO_MONTAGEM + indice * 16}ms`,
                    '--voltar-atraso': `${(arte.recortes.length - 1 - indice) * 12}ms`,
                  } as CSSProperties;
                  const colorido = cor !== 'branco' && partesColoridas.includes(recorte.nome);
                  return (
                    <g key={recorte.nome} transform={`translate(${cx} ${cy})`}>
                      <g className={pecaVetorial ? styles.pecaVetorial : styles.pecaMontagem} data-peca={recorte.nome} data-alvo={montagem.alvo}
                        ref={pecaVetorial ? (node) => { gruposVetoriais.current[recorte.nome] = node; } : undefined}
                        transform={pecaVetorial ? transformacaoEntre(pecaVetorial, inicioVetorial.current) : undefined}
                        style={estiloMontagem}>
                        <g className={styles.entradaParte} data-parte={recorte.classe} style={origemZero}>
                          <g className={`${styles.recorte} ${styles[recorte.classe]}`} style={origemZero}>
                            <g transform={`translate(${-cx} ${-cy})`}>
                              {pecaVetorial ? <>
                                <path ref={(node) => { caminhosVetoriais.current[recorte.nome] = node; }}
                                  d={caminhoEntre(pecaVetorial.source, pecaVetorial.target, inicioVetorial.current)}
                                  fill={colorido ? `url(#${prefixo}-vetor-gradiente)` : BRANCO} fillRule="evenodd"
                                  opacity={pecaVetorial.opacity + (1 - pecaVetorial.opacity) * inicioVetorial.current} />
                                {pecaVetorial.aux.map((camada, camadaIndice) => (
                                  <path key={camadaIndice} ref={(node) => {
                                    (auxiliaresVetoriais.current[recorte.nome] ??= [])[camadaIndice] = node;
                                  }} d={caminhoEntre(camada.source, camada.target, inicioVetorial.current)}
                                    fill={BRANCO} fillRule="evenodd" opacity={camada.opacity} />
                                ))}
                              </> : <rect width="1080" height="1080"
                                fill={colorido ? `url(#${prefixo}-${recorte.nome}-gradiente)` : BRANCO}
                                mask={`url(#${prefixo}-${recorte.nome}-tinta)`} />}
                            </g>
                          </g>
                        </g>
                      </g>
                    </g>
                  );
                })}
              </g>
            </g>
          </g>
        </g>
      </g>
      {!pecasVetoriais && <svg className={styles.marcaFinal} x={marcaX} y={marcaY} width={larguraMarca} height={alturaMarca}
        viewBox="0 0 3228 968" overflow="visible" aria-hidden="true" focusable="false">
        {GLIFOS_FINAIS.map(({ nome }) => {
          const colorido = cor !== 'branco' && GLIFOS_COLORIDOS[expressao].includes(nome);
          return (
            <g key={nome} className={styles.glifoMarca} data-glifo={nome}
              style={{ '--glifo-chegada': `${temposGlifos[nome]?.chegada ?? DURACAO_MONTAGEM}ms`, '--glifo-partida': `${temposGlifos[nome]?.partida ?? 0}ms` } as CSSProperties}>
              <rect width="3228" height="968"
                fill={colorido ? `url(#${prefixo}-marca-${nome}-gradiente)` : BRANCO}
                mask={`url(#${prefixo}-marca-${nome}-tinta)`} />
            </g>
          );
        })}
      </svg>}
    </svg>
  );
}
