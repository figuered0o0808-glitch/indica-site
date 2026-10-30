import type { Metadata } from 'next';

import Link from 'next/link';
import { notFound } from 'next/navigation';

import { CabecalhoPagina } from '@/components/CabecalhoPagina';
import { Marcador } from '@/components/Marcador';
import { MarcaVivaIndica } from '@/components/MarcaVivaIndica';
import { ehIdioma } from '@/i18n/idiomas';
import { textos } from '@/i18n/strings';
import { alternativas } from '@/lib/seo';
import { conteudo } from '@/lib/data';
import { rota } from '@/lib/rotas';

import { Estante } from './materiais/_Estante';
import { ordenar } from './materiais/_regras';
import { EstilosAcervo } from './materiais/_estilos';

/**
 * Quantas publicacoes recentes o indice mostra antes de mandar para o acervo:
 * uma fileira cheia na tela larga; na estreita, duas ou tres.
 */
const RECENTES = 6;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ idioma: string }>;
}): Promise<Metadata> {
  const { idioma } = await params;
  if (!ehIdioma(idioma)) return {};
  const { indice } = textos(idioma).aprendizado;
  return { title: indice.titulo, description: indice.descricao, alternates: alternativas(idioma, 'biblioteca') };
}

/**
 * Indice da Biblioteca: as publicacoes atualizadas mais recentemente abrem a
 * pagina e o acervo inteiro fica a um clique, com a contagem no proprio link.
 * A area de cursos so aparece quando ha uma turma publicada.
 */
export default async function BibliotecaPage({
  params,
}: {
  params: Promise<{ idioma: string }>;
}) {
  const { idioma } = await params;
  if (!ehIdioma(idioma)) notFound();

  const t = textos(idioma);
  const { indice } = t.aprendizado;
  const { cursos, materiais } = conteudo(idioma);
  const recentes = ordenar(materiais, 'atualizacao').slice(0, RECENTES);

  return (
    <>
      <EstilosAcervo />
      <CabecalhoPagina olho={indice.olho} titulo={indice.titulo}
        ilustracao={<MarcaVivaIndica expressao="02" cor="rosa" />} />

      <section className="secao">
        <div className="container pilha--g">
          {recentes.length > 0 ? (
            /* A coluna amarela da home que continuou: os materiais moram nela. */
            <div className="coluna coluna--amarelo coluna--solta">
              <div className="coluna__cabeca">
                <Marcador arranjo={3} />
                <h2 className="rotulo" style={{ margin: 0 }}>
                  {indice.materiaisTitulo}
                </h2>
              </div>
              <Estante idioma={idioma} materiais={recentes} />
              <div className="linha">
                <Link href={rota(idioma, 'biblioteca/materiais')} className="link-seta">
                  {`${indice.materiaisAcao} (${materiais.length})`}
                </Link>
              </div>
            </div>
          ) : null}

          {cursos.some((curso) => curso.status === 'aberto') ? (
            <div
              className="cartao cartao--compacto"
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 16,
              }}
            >
              <div className="pilha--p">
                <h2 className="rotulo rotulo--forte" style={{ margin: 0 }}>
                  {indice.cursosTitulo}
                </h2>
              </div>
              <Link href={rota(idioma, 'biblioteca/cursos')} className="link-seta">
                {indice.cursosAcao}
              </Link>
            </div>
          ) : null}
        </div>
      </section>

      <section className="secao secao--preto">
        <div className="container">
          {indice.abertura.map((item) => (
            <div key={item.rotulo} className="registro">
              <p className="registro__rotulo">{item.rotulo}</p>
              <p style={{ margin: 0 }}>{item.texto}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
