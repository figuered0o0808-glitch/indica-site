'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * Carrossel de uma coluna: um item por vez, e passa-se para o lado.
 *
 * O trilho e um rolo horizontal com encaixe (scroll-snap): no toque, arrasta;
 * no teclado, o foco que entra num item escondido o traz para a tela, porque
 * o navegador rola para o que ganha foco. As setas so rolam o trilho; o
 * contador le de onde ele parou. Nenhum estado alem do que o rolo ja tem.
 *
 * Com `automatico`, passa sozinho a cada intervalo e da a volta no fim. Para
 * quando o ponteiro esta em cima, quando algo dentro tem foco, quando a aba
 * ou o trilho saem da vista, quando a pessoa pede pausa e quando o sistema
 * pede menos movimento. Qualquer navegacao manual reinicia a contagem: o
 * rolo nao pula logo depois de um clique.
 */
export function Carrossel({
  itens,
  cabeca,
  rotulo,
  anterior,
  proximo,
  posicao,
  papel,
  automatico,
  pausar,
  continuar,
}: {
  itens: ReactNode[];
  /** O que abre a coluna (marcador e rotulo); as setas entram ao lado. */
  cabeca: ReactNode;
  /** Nome do conjunto, para o leitor de tela. */
  rotulo: string;
  anterior: string;
  proximo: string;
  /** Modelo do contador: "{n} de {total}". */
  posicao: string;
  /** Nome do papel para o leitor de tela ("carrossel"), no idioma da pagina. */
  papel: string;
  /** Intervalo em milissegundos para passar sozinho; ausente, nao passa. */
  automatico?: number;
  pausar?: string;
  continuar?: string;
}) {
  const trilho = useRef<HTMLDivElement>(null);
  const [atual, setAtual] = useState(0);
  /* Para onde a ultima seta mandou, enquanto o rolo ainda esta a caminho. */
  const pendente = useRef<number | null>(null);
  const total = itens.length;

  const [pausado, setPausado] = useState(false);
  const [emCima, setEmCima] = useState(false);
  const [comFoco, setComFoco] = useState(false);
  const [aVista, setAVista] = useState(false);
  const [abaVisivel, setAbaVisivel] = useState(true);
  const [menosMovimento, setMenosMovimento] = useState(false);

  /* O item atual e o que esta sob a borda esquerda do trilho. */
  const ler = useCallback(() => {
    const el = trilho.current;
    if (!el || el.clientWidth === 0) return;
    const indice = Math.min(total - 1, Math.max(0, Math.round(el.scrollLeft / el.clientWidth)));
    if (pendente.current !== null && Math.abs(el.scrollLeft - pendente.current * el.clientWidth) < 2) {
      pendente.current = null;
    }
    setAtual(indice);
  }, [total]);

  useEffect(() => {
    const el = trilho.current;
    if (!el) return;
    el.addEventListener('scroll', ler, { passive: true });
    window.addEventListener('resize', ler);
    return () => {
      el.removeEventListener('scroll', ler);
      window.removeEventListener('resize', ler);
    };
  }, [ler]);

  /* O que faz o automatico parar sem ninguem pedir: aba escondida, trilho fora da tela, menos movimento. */
  useEffect(() => {
    if (!automatico) return;
    const el = trilho.current;
    if (!el) return;

    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const lerMovimento = () => setMenosMovimento(media.matches);
    lerMovimento();
    media.addEventListener('change', lerMovimento);

    const lerAba = () => setAbaVisivel(document.visibilityState === 'visible');
    lerAba();
    document.addEventListener('visibilitychange', lerAba);

    const observador = new IntersectionObserver(
      ([entrada]) => setAVista(entrada.isIntersecting),
      { threshold: 0.5 },
    );
    observador.observe(el);

    return () => {
      media.removeEventListener('change', lerMovimento);
      document.removeEventListener('visibilitychange', lerAba);
      observador.disconnect();
    };
  }, [automatico]);

  /*
   * Um passo a partir de onde a ultima seta mandou, e nao de onde o rolo esta:
   * duas setas em seguida, com o rolo ainda a caminho, contam dois passos. No
   * fim da a volta: o carrossel que passa sozinho precisa de onde continuar.
   */
  const passo = useCallback(
    (delta: number) => {
      const el = trilho.current;
      if (!el || total === 0) return;
      const base = pendente.current ?? atual;
      const alvo = (base + delta + total) % total;
      pendente.current = alvo;
      el.scrollTo({ left: alvo * el.clientWidth, behavior: menosMovimento ? 'auto' : 'smooth' });
    },
    [atual, total, menosMovimento],
  );

  /* O relogio. Depende de `atual` de proposito: cada passo, manual ou nao, o reinicia. */
  const andando =
    Boolean(automatico) && total > 1 && !pausado && !emCima && !comFoco && aVista && abaVisivel && !menosMovimento;
  useEffect(() => {
    if (!andando) return;
    const relogio = window.setTimeout(() => passo(1), automatico);
    return () => window.clearTimeout(relogio);
  }, [andando, automatico, passo, atual]);

  const contador = posicao.replace('{n}', String(atual + 1)).replace('{total}', String(total));

  return (
    <div
      className="carrossel__caixa"
      onPointerEnter={() => setEmCima(true)}
      onPointerLeave={() => setEmCima(false)}
      onFocus={() => setComFoco(true)}
      onBlur={(evento) => {
        if (!evento.currentTarget.contains(evento.relatedTarget as Node | null)) setComFoco(false);
      }}
    >
      <div className="coluna__cabeca">
        {cabeca}
        {total > 1 ? (
          <div className="carrossel__nav">
            <span className="carrossel__contador" aria-live={andando ? 'off' : 'polite'}>
              {contador}
            </span>
            {/* O rotulo diz a acao que o botao faz agora; sem aria-pressed, que leria "Continuar, pressionado". */}
            {automatico ? (
              <button
                type="button"
                className="carrossel__seta"
                onClick={() => setPausado((valor) => !valor)}
                aria-label={pausado ? continuar : pausar}
              >
                {pausado ? (
                  <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
                    <path d="M2 1l7 4-7 4z" fill="currentColor" />
                  </svg>
                ) : (
                  <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
                    <rect x="1.5" y="1" width="2.5" height="8" fill="currentColor" />
                    <rect x="6" y="1" width="2.5" height="8" fill="currentColor" />
                  </svg>
                )}
              </button>
            ) : null}
            <button
              type="button"
              className="carrossel__seta"
              onClick={() => passo(-1)}
              aria-label={anterior}
            >
              <span aria-hidden="true">&larr;</span>
            </button>
            <button
              type="button"
              className="carrossel__seta"
              onClick={() => passo(1)}
              aria-label={proximo}
            >
              <span aria-hidden="true">&rarr;</span>
            </button>
          </div>
        ) : null}
      </div>

      <div
        className="carrossel"
        ref={trilho}
        role="group"
        aria-roledescription={papel}
        aria-label={rotulo}
      >
        {itens.map((item, indice) => (
          <div
            key={indice}
            className="carrossel__item"
            role="group"
            aria-label={posicao.replace('{n}', String(indice + 1)).replace('{total}', String(total))}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
