import type { CSSProperties } from 'react';

import { Botao } from '@/components/Botao';
import type { Idioma } from '@/i18n/idiomas';
import { textos } from '@/i18n/strings';
import { rota } from '@/lib/rotas';

/**
 * Conteudo da aba enquanto nenhuma chamada esta publicada.
 *
 * Estado vazio com saida: diz o que a primeira chamada vai trazer, o que da
 * para deixar pronto antes dela e para onde ir agora.
 */
export function SemChamadas({ idioma }: { idioma: Idioma }) {
  const t = textos(idioma);

  return (
    <div className="secao">
      <div className="container-estreito">
        <div
          className="cartao cartao--marcado"
          style={{ '--marca': 'var(--menta)' } as CSSProperties}
        >
          <h2 className="cartao__titulo">{t.editais.semChamadaTitulo}</h2>
          <p className="cartao__texto">{t.editais.semChamadaTexto}</p>

          <div className="registro">
            <p className="registro__rotulo">{t.editais.prepararTitulo}</p>
            <ul style={{ margin: 0 }}>
              {t.editais.prepararItens.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="linha" style={{ gap: 18 }}>
            <Botao href={rota(idioma, 'cadastro')}>{t.home.entrarPrincipal}</Botao>
            <Botao href={rota(idioma, 'biblioteca')} variante="discreto">
              {t.home.inicioAcaoAreas}
            </Botao>
          </div>
        </div>
      </div>
    </div>
  );
}
