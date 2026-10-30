import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Botao } from '@/components/Botao';
import { CabecalhoPagina } from '@/components/CabecalhoPagina';
import { Chip } from '@/components/Chip';
import { IDIOMAS, ehIdioma } from '@/i18n/idiomas';
import { textos } from '@/i18n/strings';
import { conteudo, editalPorSlug } from '@/lib/data';
import { rota } from '@/lib/rotas';
import { alternativas } from '@/lib/seo';

import { DocumentoEdital } from '../../_DocumentoEdital';
import { prazoEmLinha } from '../../_prazo';

import { FormularioCandidatura, type EditalResumo } from './_FormularioCandidatura';

/**
 * Toda chamada tem endereco de candidatura, no idioma em que esta publicada:
 * o link que alguem guardou continua valendo depois do prazo, e o que ele
 * mostra e o aviso de que as inscricoes fecharam, nao um 404.
 */
export function generateStaticParams() {
  return IDIOMAS.flatMap((idioma) =>
    conteudo(idioma).editais.map((edital) => ({ idioma, slug: edital.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ idioma: string; slug: string }>;
}): Promise<Metadata> {
  const { idioma, slug } = await params;
  if (!ehIdioma(idioma)) return {};
  const tc = textos(idioma).fluxos.candidatura;
  const edital = editalPorSlug(idioma, slug);
  /* Formulario nao e pagina para buscador. */
  return {
    title: edital ? `${tc.titulo}: ${edital.titulo}` : tc.titulo,
    description: edital?.resumo,
    robots: { index: false, follow: true },
    alternates: alternativas(idioma, `oportunidades/${slug}/candidatura`),
  };
}

export default async function PaginaCandidatura({
  params,
}: {
  params: Promise<{ idioma: string; slug: string }>;
}) {
  const { idioma, slug } = await params;
  if (!ehIdioma(idioma)) notFound();

  const edital = editalPorSlug(idioma, slug);
  if (!edital) notFound();

  const t = textos(idioma);
  if (edital.status !== 'aberta') {
    return (
      <>
        <CabecalhoPagina estreito olho={edital.status === 'consulta' ? t.editais.consultaTitulo : t.fluxos.candidatura.titulo} titulo={edital.titulo} />
        <div className="secao">
          <div className="container-estreito">
            <section className="cartao">
              <p className="cartao__texto" style={{ margin: 0 }}>
                {edital.status === 'consulta' ? t.editais.consultaAviso : edital.status === 'encerrada' ? t.editais.encerradaAviso : t.editais.emAvaliacaoAviso}
              </p>
              {edital.status === 'consulta' ? <DocumentoEdital idioma={idioma} edital={edital} /> : null}
              <div className="linha">
                <Botao href={rota(idioma, `oportunidades/${edital.slug}`)} variante="secundario">
                  {t.fluxos.candidatura.voltarEdital}
                </Botao>
              </div>
            </section>
          </div>
        </div>
      </>
    );
  }

  const resumo: EditalResumo = {
    slug: edital.slug,
    titulo: edital.titulo,
    faixaApoio: edital.faixaApoio,
  };

  return (
    <>
      <CabecalhoPagina
        estreito
        olho={textos(idioma).fluxos.candidatura.titulo}
        titulo={edital.titulo}
      />

      <div className="secao secao--curta" style={{ paddingBottom: 0 }}>
        <div className="container-estreito">
          <div className="chips">
            <Chip vazado>{prazoEmLinha(idioma, edital)}</Chip>
          </div>
        </div>
      </div>

      <div className="secao">
        <div className="container-estreito">
          <FormularioCandidatura idioma={idioma} edital={resumo} />
        </div>
      </div>
    </>
  );
}
