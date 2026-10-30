import type { Metadata } from 'next';

import { notFound } from 'next/navigation';

import { ehIdioma } from '@/i18n/idiomas';
import { textos } from '@/i18n/strings';
import { alternativas } from '@/lib/seo';
import { cadastroAberto, chamadasAbertas, conteudo } from '@/lib/data';

import { Painel } from './_Painel';

/**
 * O titulo fica no nome da area, e nao no que ela mostra, porque a pagina
 * muda conforme o cadastro esteja aberto ou fechado.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ idioma: string }>;
}): Promise<Metadata> {
  const { idioma } = await params;
  if (!ehIdioma(idioma)) return {};
  /* Area pessoal: o HTML exportado nao tem conteudo, e nao e pagina para buscador. */
  return {
    title: textos(idioma).paineis.olho,
    robots: { index: false, follow: true },
    alternates: alternativas(idioma, 'painel'),
  };
}

export default async function PaginaPainel({
  params,
}: {
  params: Promise<{ idioma: string }>;
}) {
  const { idioma } = await params;
  if (!ehIdioma(idioma)) notFound();

  /* O que o painel precisa do conteudo vem daqui, do servidor: o cliente nao carrega os dados. */
  return (
    <Painel
      idioma={idioma}
      aberto={cadastroAberto(idioma)}
      abertas={chamadasAbertas(idioma)}
      catalogoEditais={conteudo(idioma).editais}
      catalogo={conteudo(idioma).cursos}
    />
  );
}
