'use client';

import { useEffect, useRef, useState } from 'react';

import { Botao } from '@/components/Botao';
import type { Idioma } from '@/i18n/idiomas';
import { textos } from '@/i18n/strings';

/**
 * Compartilhamento da chamada sem script de terceiro e sem rede.
 *
 * O endereco vem escrito da exportacao estatica e e ele proprio o link: quem
 * abre a pagina com o JavaScript desligado le e copia o endereco a mao. Ja
 * montado, o componente troca pelo endereco da barra do navegador, que e o
 * correto em qualquer dominio, e oferece o botao de copiar quando a area de
 * transferencia existe. Se o navegador recusar a copia, o endereco fica
 * selecionado, e ai a copia sai pelo teclado.
 */
export function Compartilhar({ idioma, endereco }: { idioma: Idioma; endereco: string }) {
  const t = textos(idioma);
  const alvo = useRef<HTMLAnchorElement>(null);
  const [atual, setAtual] = useState(endereco);
  const [podeCopiar, setPodeCopiar] = useState(false);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    setAtual(window.location.href);
    setPodeCopiar(Boolean(navigator.clipboard));
  }, []);

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(atual);
      setCopiado(true);
      return;
    } catch {
      setCopiado(false);
    }
    if (alvo.current) window.getSelection()?.selectAllChildren(alvo.current);
  };

  return (
    <section id="compartilhar">
      <div className="cartao">
        <p className="olho" style={{ margin: 0 }}>
          {t.editais.compartilharTitulo}
        </p>

        <a
          ref={alvo}
          href={atual}
          style={{
            fontFamily: 'var(--mono)',
            fontSize: 'var(--texto-m)',
            lineHeight: 'var(--entrelinha-p)',
            wordBreak: 'break-all',
          }}
        >
          {atual}
        </a>

        {podeCopiar ? (
          <div className="linha" style={{ gap: 16 }}>
            <Botao variante="secundario" tamanho="pequeno" onClick={copiar}>
              {t.editais.copiarEndereco}
            </Botao>
            <p className="texto-mini" style={{ margin: 0 }} aria-live="polite">
              {copiado ? t.editais.enderecoCopiado : ''}
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
