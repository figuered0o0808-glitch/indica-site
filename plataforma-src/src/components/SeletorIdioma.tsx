'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { IDIOMAS, NOME_DO_IDIOMA, SIGLA_DO_IDIOMA, type Idioma } from '@/i18n/idiomas';
import { textos } from '@/i18n/strings';
import { idiomaDoCaminho } from '@/lib/rotas';

/**
 * Troca de idioma mantendo a pagina: /pt/oportunidades vira /en/oportunidades.
 * Se a pagina nao existir no outro idioma, o visitante cai no 404, que oferece
 * o caminho de volta.
 */
export function SeletorIdioma() {
  const caminho = usePathname();
  const atual = idiomaDoCaminho(caminho);

  function equivalente(idioma: Idioma): string {
    const partes = caminho.split('/').filter(Boolean);
    partes[0] = idioma;
    return `/${partes.join('/')}`;
  }

  return (
    <nav className="seletor-idioma" aria-label={textos(atual).comum.rotulos.idioma}>
      {IDIOMAS.map((idioma) => (
        <Link
          key={idioma}
          href={equivalente(idioma)}
          className="seletor-idioma__opcao"
          hrefLang={idioma}
          aria-current={idioma === atual ? 'true' : undefined}
          title={NOME_DO_IDIOMA[idioma]}
        >
          {SIGLA_DO_IDIOMA[idioma]}
        </Link>
      ))}
    </nav>
  );
}
