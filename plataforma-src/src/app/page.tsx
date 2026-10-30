import type { Metadata } from 'next';
import Link from 'next/link';

import { LogoIndica } from '@/components/LogoIndica';
import { PROGRAM_NAME } from '@/config/program';
import { IDIOMAS, IDIOMA_PADRAO, NOME_DO_IDIOMA } from '@/i18n/idiomas';
import { rota } from '@/lib/rotas';
import { BASE, enderecoPublico } from '@/lib/seo';

export const metadata: Metadata = {
  alternates: { canonical: enderecoPublico(IDIOMA_PADRAO) },
  robots: { index: false, follow: true },
};

/**
 * A raiz nao tem conteudo proprio: manda para o idioma padrao. Um redirect()
 * de verdade nao existe em site estatico; o que existe e esta pagina, que
 * pula pelo meta refresh sem depender de script e, se o pulo nao acontecer,
 * ainda mostra a marca e um link por idioma.
 */
export default function Raiz() {
  return (
    <>
      <meta httpEquiv="refresh" content={`0; url=${BASE}${rota(IDIOMA_PADRAO)}/`} />
      <main className="secao">
        <div className="container-estreito pilha">
          <p style={{ margin: 0 }}>
            <LogoIndica altura={26} rotulo={PROGRAM_NAME} />
          </p>
          <ul className="pilha--p" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {IDIOMAS.map((idioma) => (
              <li key={idioma}>
                <Link href={rota(idioma)} hrefLang={idioma} className="link-sublinhado">
                  {NOME_DO_IDIOMA[idioma]}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </>
  );
}
