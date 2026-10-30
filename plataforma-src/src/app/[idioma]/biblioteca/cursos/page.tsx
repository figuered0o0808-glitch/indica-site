import type { Metadata } from 'next';

import { notFound, redirect } from 'next/navigation';

import { Botao } from '@/components/Botao';
import { CabecalhoPagina } from '@/components/CabecalhoPagina';
import { EstadoVazio } from '@/components/EstadoVazio';
import { Selo } from '@/components/Selo';
import { ehIdioma } from '@/i18n/idiomas';
import { textos } from '@/i18n/strings';
import { alternativas } from '@/lib/seo';
import { conteudo } from '@/lib/data';
import { data } from '@/lib/format';
import { rota } from '@/lib/rotas';
import { InscricaoCurso } from './_InscricaoCurso';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ idioma: string }>;
}): Promise<Metadata> {
  const { idioma } = await params;
  if (!ehIdioma(idioma)) return {};
  const c = textos(idioma).aprendizado.cursos;
  return { title: c.titulo, description: c.descricao, alternates: alternativas(idioma, 'biblioteca/cursos') };
}

/**
 * O catalogo mostra apenas turmas abertas e publicadas.
 */
export default async function CursosPage({
  params,
}: {
  params: Promise<{ idioma: string }>;
}) {
  const { idioma } = await params;
  if (!ehIdioma(idioma)) notFound();

  const t = textos(idioma);
  const cursos = conteudo(idioma).cursos.filter((curso) => curso.status === 'aberto');
  if (cursos.length === 0) redirect(rota(idioma, 'biblioteca'));

  return (
    <>
      <CabecalhoPagina
        olho={t.aprendizado.cursos.olho}
        titulo={t.aprendizado.cursos.titulo}
        descricao={t.aprendizado.cursos.descricao}
      />

      <div className="secao">
        <div className="container">
          {cursos.length === 0 ? (
            <EstadoVazio
              titulo={t.aprendizado.cursos.vazioTitulo}
              desenho="pasta"
              acao={
                <Botao href={rota(idioma, 'biblioteca/materiais')} variante="secundario" tamanho="pequeno">
                  {t.aprendizado.cursos.vazioAcao}
                </Botao>
              }
            />
          ) : (
            <div className="grade--2">
              {cursos.map((curso) => (
                <article key={curso.slug} id={`curso-${curso.slug}`} className="cartao">
                  <div className="linha linha--fim">
                    <Selo idioma={idioma} status={curso.status} />
                    <span className="rotulo">{curso.duracao}</span>
                  </div>
                  {curso.organizacao ? <p className="rotulo">{curso.organizacao}</p> : null}
                  <h2 className="cartao__titulo">{curso.titulo}</h2>
                  <p className="cartao__texto">{curso.resumo}</p>
                  {curso.descricao.length || curso.paraQuem.length || curso.modulos.length ? (
                    <details>
                      <summary>{t.aprendizado.cursos.modulosTitulo}</summary>
                      <div className="pilha--p" style={{ marginTop: 16 }}>
                        {curso.descricao.map((paragrafo, i) => <p key={i}>{paragrafo}</p>)}
                        {curso.paraQuem.length ? <div>
                          <h3>{t.aprendizado.cursos.paraQuem}</h3>
                          <ul>{curso.paraQuem.map((publico, i) => <li key={i}>{publico}</li>)}</ul>
                        </div> : null}
                        {curso.modulos.length ? <ol>
                          {curso.modulos.map((modulo) => <li key={modulo.numero}>
                            <strong>{modulo.titulo}</strong>
                            <p>{modulo.descricao}</p>
                          </li>)}
                        </ol> : null}
                        <p>{t.aprendizado.cursos.formato}: {curso.formato}</p>
                      </div>
                    </details>
                  ) : null}
                  <div className="cartao__rodape">
                    <span>
                      {t.aprendizado.cursos.proximaTurma}: {data(curso.proximaTurma, idioma)}
                    </span>
                    <InscricaoCurso idioma={idioma} slug={curso.slug} />
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
