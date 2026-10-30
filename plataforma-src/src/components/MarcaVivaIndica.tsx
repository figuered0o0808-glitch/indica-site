'use client';

import { useEffect, useRef, useState } from 'react';

import { CarinhaIndica, type CorCarinhaIndica, type ExpressaoCarinhaIndica } from '@/components/CarinhaIndica';
import { arquivoPublico } from '@/lib/format';

type Fase = 'preparando' | 'logo' | 'abrindo' | 'carinha' | 'fechando';

const DURACAO = { logo: 2500, abrindo: 1420, carinha: 6000, fechando: 1200 } as const;
const PROXIMA = { logo: 'abrindo', abrindo: 'carinha', carinha: 'fechando', fechando: 'logo' } as const;

/** Um único SVG: a marca se desdobra em rosto e volta à assinatura no seu próprio ritmo. */
export function MarcaVivaIndica({
  expressao,
  cor,
  interagindo = false,
  atraso = 0,
  className = '',
}: {
  expressao: ExpressaoCarinhaIndica;
  cor: CorCarinhaIndica;
  interagindo?: boolean;
  atraso?: number;
  className?: string;
}) {
  const elemento = useRef<SVGSVGElement>(null);
  const faseAtual = useRef<Fase>('preparando');
  const restante = useRef(0);
  const iniciou = useRef(false);
  const estavaInteragindo = useRef(interagindo);
  const [fase, setFase] = useState<Fase>('preparando');
  const [pronta, setPronta] = useState(false);
  const [visivel, setVisivel] = useState(false);
  const [documentoVisivel, setDocumentoVisivel] = useState(true);
  const [reduzido, setReduzido] = useState(false);
  const [revelada, setRevelada] = useState(false);

  useEffect(() => {
    let encerrado = false;
    setPronta(false);
    const fontes = ['/marca/indica.png', `/marca/rostos/rosto-${expressao}.png`];
    void Promise.all(fontes.map((fonte) => {
      const imagem = new Image();
      imagem.src = arquivoPublico(fonte);
      return imagem.decode().catch(() => undefined);
    })).then(() => { if (!encerrado) setPronta(true); });
    return () => { encerrado = true; };
  }, [expressao]);

  useEffect(() => {
    const preferencia = window.matchMedia('(prefers-reduced-motion: reduce)');
    const atualizarPreferencia = () => setReduzido(preferencia.matches);
    const atualizarDocumento = () => setDocumentoVisivel(document.visibilityState === 'visible');
    atualizarPreferencia();
    atualizarDocumento();
    preferencia.addEventListener('change', atualizarPreferencia);
    document.addEventListener('visibilitychange', atualizarDocumento);
    const svg = elemento.current;
    const observador = svg && typeof IntersectionObserver !== 'undefined'
      ? new IntersectionObserver(([item]) => setVisivel(item.isIntersecting && item.intersectionRatio >= .15), { threshold: [0, .15] })
      : null;
    if (svg && observador) observador.observe(svg);
    else setVisivel(true);
    return () => {
      observador?.disconnect();
      preferencia.removeEventListener('change', atualizarPreferencia);
      document.removeEventListener('visibilitychange', atualizarDocumento);
    };
  }, []);

  useEffect(() => {
    const saiuDaInteracao = estavaInteragindo.current && !interagindo;
    estavaInteragindo.current = interagindo;
    if (!pronta || !visivel || !documentoVisivel) return;
    const trocar = (nova: Exclude<Fase, 'preparando'>, duracao: number = DURACAO[nova]) => {
      faseAtual.current = nova;
      restante.current = duracao;
      setFase(nova);
      if (nova === 'abrindo' || nova === 'carinha') setRevelada(true);
    };
    if (!iniciou.current) {
      iniciou.current = true;
      trocar(reduzido ? 'carinha' : 'logo', reduzido ? DURACAO.carinha : 900 + Math.max(0, atraso));
    }
    if (reduzido) {
      trocar('carinha');
      return;
    }
    // Ao sair do hover, retoma a carinha com um percurso completo e sem saltar fases.
    if (saiuDaInteracao) trocar('abrindo');
    if (interagindo) return;
    let espera: ReturnType<typeof setTimeout> | undefined;
    let inicio = 0;
    let encerrado = false;
    const agendar = () => {
      inicio = performance.now();
      espera = setTimeout(() => {
        espera = undefined;
        if (encerrado || faseAtual.current === 'preparando') return;
        trocar(PROXIMA[faseAtual.current]);
        agendar();
      }, restante.current);
    };
    agendar();
    return () => {
      encerrado = true;
      if (espera !== undefined) {
        clearTimeout(espera);
        // Conserva a parte restante da fase; não acumula ciclos quando a aba fica oculta.
        restante.current = Math.max(0, restante.current - (performance.now() - inicio));
      }
    };
  }, [pronta, visivel, documentoVisivel, reduzido, interagindo, atraso]);

  const preparando = fase === 'preparando';
  const marca = preparando || interagindo || (!reduzido && (fase === 'logo' || fase === 'fechando'));
  return (
    <CarinhaIndica
      elementoRef={elemento}
      expressao={expressao}
      cor={cor}
      entrada={revelada}
      preparando={preparando}
      pausada={!visivel || !documentoVisivel}
      marca={marca}
      ciclo={interagindo ? 'interacao' : fase}
      className={className}
    />
  );
}
