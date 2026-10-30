import type { Metadata } from 'next';
import type { CSSProperties, ReactNode } from 'react';
import { notFound } from 'next/navigation';

import { Avatar } from '@/components/Avatar';
import { CabecalhoPagina } from '@/components/CabecalhoPagina';
import { corDoTema } from '@/components/Chip';
import { Selo } from '@/components/Selo';
import { Organizacao } from '@/components/Organizacao';
import { NumerosChamada } from '@/components/NumerosChamada';
import { IDIOMAS, ehIdioma } from '@/i18n/idiomas';
import { textos } from '@/i18n/strings';
import { conteudo, editalPorSlug } from '@/lib/data';
import { arquivoPublico, data } from '@/lib/format';
import { textoDoApoio } from '@/lib/apoio';
import { alternativas } from '@/lib/seo';

import { DocumentoEdital } from '../_DocumentoEdital';
import { enderecoDaChamada } from '../_endereco';
import { prazoDaChamada } from '../_prazo';

import { Compartilhar } from './_Compartilhar';
import { Lateral } from './_Lateral';
import { Resultado } from './_Resultado';

/** Cada idioma gera apenas as chamadas publicadas nele. */
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
  const edital = editalPorSlug(idioma, slug);
  /* O resumo da chamada e a description: e o que aparece quando o link circula. */
  return {
    title: edital?.titulo ?? textos(idioma).editais.listaTitulo,
    description: edital?.resumo,
    alternates: alternativas(idioma, `oportunidades/${slug}`),
  };
}

/** Secao ancorada da pagina da chamada. O recuo sob o cabecalho fixo vem da regra :target global. */
function Secao({ id, titulo, children }: { id: string; titulo: string; children: ReactNode }) {
  return (
    <section id={id}>
      <h2>{titulo}</h2>
      {children}
    </section>
  );
}

/** Linha de registro do manual: rotulo curto a esquerda, conteudo a direita. */
function Registro({ rotulo, children }: { rotulo: string; children: ReactNode }) {
  return (
    <div className="registro">
      <p className="registro__rotulo">{rotulo}</p>
      <div>{children}</div>
    </div>
  );
}

export default async function PaginaEdital({
  params,
}: {
  params: Promise<{ idioma: string; slug: string }>;
}) {
  const { idioma, slug } = await params;
  if (!ehIdioma(idioma)) notFound();

  const t = textos(idioma);
  const edital = editalPorSlug(idioma, slug);
  if (!edital) notFound();

  /*
   * Ha chamada que atribui peso numerico a cada criterio e ha chamada que so
   * apresenta critérios qualitativos. A numeração identifica o item sem
   * atribuir ordem de importância ao que não possui peso publicado.
   */
  const pesos = edital.criterios.map((criterio) => criterio.peso);
  const comPeso = pesos.length > 0 && pesos.every((peso) => typeof peso === 'number');
  const somaPesos = pesos.reduce<number>((soma, peso) => soma + (peso ?? 0), 0);

  const prazo = prazoDaChamada(idioma, edital);
  const temObservacao = edital.distribuicao.some((faixa) => Boolean(faixa.observacao));
  const endereco = enderecoDaChamada(idioma, edital.slug);

  return (
    <>
      <CabecalhoPagina
        olho={edital.modalidade ? `${edital.modalidade} · ${t.comum.tiposEdital[edital.tipo]}` : t.comum.tiposEdital[edital.tipo]}
        titulo={edital.titulo}
        descricao={edital.resumo}
        acoes={
          <div className="linha" style={{ gap: 'var(--esp-16)' }}>
            {edital.logoOrganizacao ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={arquivoPublico(edital.logoOrganizacao)}
                alt={edital.organizacao ?? ''}
                style={{ height: 20, width: 'auto', display: 'block' }}
              />
            ) : null}
            <Selo idioma={idioma} status={edital.status} />
            <DocumentoEdital idioma={idioma} edital={edital} />
          </div>
        }
      />

      {edital.status === 'consulta' ? (
        <div className="container" style={{ marginTop: 'var(--esp-24)' }}>
          <p className="nota" style={{ maxWidth: '70ch' }}>{t.editais.consultaAviso}</p>
        </div>
      ) : null}

      <section
        className="secao secao--curta secao--branco"
        style={{ marginTop: 'var(--esp-48)', borderTop: '1px solid var(--linha)' }}
      >
        <div className="container">
          <h2 className="sr-only">{t.editais.numerosTitulo}</h2>
          <NumerosChamada idioma={idioma} edital={edital} />
          <dl
            className="definicoes"
            style={{
              gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
              gap: 'var(--esp-24)',
              margin: 'var(--esp-24) 0 0',
            }}
          >
            <div>
              <dt>{t.editais.proponente}</dt>
              <dd>
                {edital.proponente ? (
                  <Organizacao nome={edital.proponente} logo={edital.logoOrganizacao} />
                ) : (
                  t.editais.proponenteProprio
                )}
              </dd>
            </div>
            <div>
              <dt>{t.comum.rotulos.apoio}</dt>
              <dd>
                {textoDoApoio(idioma, edital)}
              </dd>
            </div>
            <div>
              <dt>{prazo.rotulo}</dt>
              <dd>{prazo.valor}</dd>
            </div>
          </dl>
        </div>
      </section>

      {/*
        A lateral vem ANTES do documento no JSX, e nao depois.

        Ela traz o prazo, o sumario e o botao de candidatura: no celular, em
        coluna unica, ela precisa aparecer primeiro, e no desktop precisa ficar
        a direita. A versao anterior resolvia isso com `order: -1` no celular,
        mantendo a lateral por ultimo no DOM. So que `order` muda a ordem
        visual e nao a ordem de foco: quem lia com os olhos via o botao de
        candidatura primeiro, e quem navegava por Tab so chegava nele depois de
        percorrer o edital inteiro.

        Com a lateral primeiro no DOM, o celular ja fica certo sem regra
        nenhuma, e no desktop `order: 2` a devolve para a coluna da direita.
        Agora a ordem de leitura e a ordem de foco sao a mesma nas duas larguras.
      */}
      <style>{`
        @media (min-width: 1041px) {
          .chamada__corpo > .lateral { order: 2; }
        }
      `}</style>

      {edital.status === 'encerrada' && edital.resultado ? (
        <Resultado idioma={idioma} resultado={edital.resultado} />
      ) : null}

      <div className="secao">
        <div className="container">
          <div className="grade--lateral chamada__corpo">
            <Lateral idioma={idioma} edital={edital} />

            <div className="pilha--g">
              <Secao id="apresentacao" titulo={t.editais.secoes.apresentacao}>
                <div className="prosa">
                  {edital.apresentacao.map((paragrafo) => (
                    <p key={paragrafo}>{paragrafo}</p>
                  ))}
                </div>
              </Secao>

              {edital.escopo.length > 0 ? (
              <Secao id="escopo" titulo={t.editais.secoes.escopo}>
                <div className="cartao">
                  <ul style={{ margin: 0 }}>
                    {edital.escopo.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </Secao>
              ) : null}

              {edital.naoApoiado.length > 0 ? (
              <Secao id="nao-apoiado" titulo={t.editais.secoes.naoApoiado}>
                <div
                  className="cartao cartao--marcado"
                  style={{ '--marca': 'var(--rosa)' } as CSSProperties}
                >
                  <ul style={{ margin: 0 }}>
                    {edital.naoApoiado.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </Secao>
              ) : null}

              {edital.criterios.length > 0 || edital.criteriosDescricao ? (
              <Secao id="criterios" titulo={t.editais.secoes.criterios}>
                {edital.criteriosDescricao ? (
                  <p className="prosa" style={{ marginBottom: 'var(--esp-24)' }}>{edital.criteriosDescricao}</p>
                ) : null}
                <div>
                  {edital.criterios.map((criterio, indice) => (
                    <Registro
                      key={criterio.titulo}
                      rotulo={
                        comPeso
                          ? `${t.editais.pesoRotulo} ${criterio.peso}`
                          : String(indice + 1).padStart(2, '0')
                      }
                    >
                      <h3 style={{ margin: '0 0 var(--esp-4)', fontSize: 'var(--titulo-p)' }}>{criterio.titulo}</h3>
                      <p className="texto-pequeno" style={{ margin: 0, maxWidth: '62ch' }}>
                        {criterio.descricao}
                      </p>
                    </Registro>
                  ))}
                  {comPeso ? (
                    <Registro rotulo={t.editais.somaPesos}>
                      <p style={{ margin: 0 }}>{somaPesos}</p>
                    </Registro>
                  ) : null}
                </div>
              </Secao>
              ) : null}

              {/* O cronograma reproduz as datas do documento, inclusive intervalos. */}
              {edital.cronograma.length > 0 ? (
                <Secao id="cronograma" titulo={t.editais.secoes.cronograma}>
                  <div>
                    {edital.cronograma.map((etapa) => (
                      <Registro key={etapa.etapa} rotulo={etapa.dataFim ? `${data(etapa.data, idioma)} ${t.editais.faixaSeparador} ${data(etapa.dataFim, idioma)}` : data(etapa.data, idioma)}>
                        <p style={{ margin: 0 }}>{etapa.etapa}</p>
                      </Registro>
                    ))}
                  </div>
                </Secao>
              ) : null}

              {edital.banca.length > 0 || edital.bancaDescricao ? (
              <Secao id="banca" titulo={t.editais.secoes.banca}>
                {edital.bancaDescricao ? <p className="prosa">{edital.bancaDescricao}</p> : null}
                {edital.banca.length > 0 ? (
                  <div className="grade--2">
                    {edital.banca.map((membro) => (
                      <div className="cartao cartao--compacto" key={membro.nome}>
                        <div className="linha" style={{ gap: 'var(--esp-12)', flexWrap: 'nowrap' }}>
                          <Avatar nome={membro.nome} cor={corDoTema(membro.nome)} />
                          <div>
                            <p style={{ margin: 0 }}>{membro.nome}</p>
                            <p className="texto-mini" style={{ margin: 0 }}>
                              {membro.afiliacao}
                            </p>
                          </div>
                        </div>
                        <p className="cartao__texto">{membro.minibio}</p>
                      </div>
                    ))}
                  </div>
                ) : null}
              </Secao>
              ) : null}

              {/* Distribuicao so entra quando ha faixa publicada: tabela vazia nao informa nada. */}
              {edital.distribuicao.length > 0 ? (
              <Secao id="distribuicao" titulo={t.editais.secoes.distribuicao}>
                <div className="tabela-rolagem">
                  <table className="tabela">
                    <thead>
                      <tr>
                        <th scope="col">{t.editais.distribuicaoColunas.faixa}</th>
                        <th scope="col">{t.editais.distribuicaoColunas.quantidade}</th>
                        {temObservacao ? (
                          <th scope="col">{t.editais.distribuicaoColunas.observacao}</th>
                        ) : null}
                      </tr>
                    </thead>
                    <tbody>
                      {edital.distribuicao.map((faixa) => (
                        <tr key={faixa.faixa}>
                          <td>{faixa.faixa}</td>
                          <td>{faixa.quantidade}</td>
                          {temObservacao ? <td>{faixa.observacao ?? ''}</td> : null}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Secao>
              ) : null}

              {edital.secoesComplementares?.map((secao) => (
                <Secao key={secao.id} id={secao.id} titulo={secao.titulo}>
                  <div className="prosa">
                    {secao.paragrafos?.map((paragrafo, indice) => <p key={`${secao.id}-p-${indice}`}>{paragrafo}</p>)}
                    {secao.itens?.length ? (
                      <ul>{secao.itens.map((item, indice) => <li key={`${secao.id}-item-${indice}`}>{item}</li>)}</ul>
                    ) : null}
                  </div>
                </Secao>
              ))}

              <Compartilhar idioma={idioma} endereco={endereco} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
