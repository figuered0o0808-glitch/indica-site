import type { Metadata } from 'next';

import { notFound } from 'next/navigation';

import { Botao } from '@/components/Botao';
import { CabecalhoPagina } from '@/components/CabecalhoPagina';
import { EstadoVazio } from '@/components/EstadoVazio';
import { ehIdioma } from '@/i18n/idiomas';
import { textos } from '@/i18n/strings';
import { alternativas } from '@/lib/seo';
import { conteudo } from '@/lib/data';
import { rota } from '@/lib/rotas';

import { Acervo } from './_Acervo';
import { Trilhas } from './_Trilhas';
import { EstilosAcervo } from './_estilos';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ idioma: string }>;
}): Promise<Metadata> {
  const { idioma } = await params;
  if (!ehIdioma(idioma)) return {};
  const r = textos(idioma).aprendizado.materiais;
  return { title: r.titulo, description: r.descricao, alternates: alternativas(idioma, 'biblioteca/materiais') };
}

/**
 * Acervo de materiais tecnicos. Reune publicacoes de varias organizacoes: a
 * pagina nasce com busca, filtros e ordenacao mesmo tendo poucos titulos, e
 * cada filtro sai do que esta publicado. As duas trilhas vem depois, como
 * leitura do conjunto e como ancora do pe de cada material.
 */
export default async function MateriaisPage({
  params,
}: {
  params: Promise<{ idioma: string }>;
}) {
  const { idioma } = await params;
  if (!ehIdioma(idioma)) notFound();

  const t = textos(idioma);
  const { materiais } = conteudo(idioma);

  return (
    <>
      <EstilosAcervo />
      <CabecalhoPagina
        olho={t.aprendizado.materiais.olho}
        titulo={t.aprendizado.materiais.titulo}
      />

      <div className="secao">
        <div className="container pilha--g">
          {materiais.length === 0 ? (
            <EstadoVazio
              titulo={t.aprendizado.materiais.vazioTitulo}
              desenho="pasta"
              acao={
                <Botao href={rota(idioma)} variante="secundario" tamanho="pequeno">
                  {t.aprendizado.materiais.vazioAcao}
                </Botao>
              }
            />
          ) : (
            <Acervo idioma={idioma} materiais={materiais} />
          )}

          <Trilhas idioma={idioma} materiais={materiais} />
        </div>
      </div>
    </>
  );
}
