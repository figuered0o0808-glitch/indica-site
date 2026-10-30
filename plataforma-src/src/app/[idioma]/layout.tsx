import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { PROGRAM_NAME } from '@/config/program';
import { IDIOMAS, ehIdioma } from '@/i18n/idiomas';
import { textos } from '@/i18n/strings';
import { conteudo } from '@/lib/data';

export function generateStaticParams() {
  return IDIOMAS.map((idioma) => ({ idioma }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ idioma: string }>;
}): Promise<Metadata> {
  const { idioma } = await params;
  if (!ehIdioma(idioma)) return { title: PROGRAM_NAME };
  /* A description e a frase do rodape, no idioma da pagina; a tagline em ingles nao entra. */
  return {
    title: { default: PROGRAM_NAME, template: `%s | ${PROGRAM_NAME}` },
    description: textos(idioma).comum.rodape.descricao,
  };
}

export default async function LayoutIdioma({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ idioma: string }>;
}) {
  const { idioma } = await params;
  if (!ehIdioma(idioma)) notFound();

  const { editais } = conteudo(idioma);
  const temInscricoesAbertas = editais.some((edital) => edital.status === 'aberta');
  const t = textos(idioma);

  return (
    <>
      {/* Primeiro parada do teclado: pular o cabecalho fixo e cair no conteudo. */}
      <a href="#conteudo" className="pular">
        {t.comum.navegacao.pularParaConteudo}
      </a>
      <SiteHeader idioma={idioma} temInscricoesAbertas={temInscricoesAbertas} />
      <main id="conteudo" tabIndex={-1}>
        {children}
      </main>
      <SiteFooter idioma={idioma} />
    </>
  );
}
