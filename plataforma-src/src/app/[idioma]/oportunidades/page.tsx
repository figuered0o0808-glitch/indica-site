import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { CabecalhoPagina } from '@/components/CabecalhoPagina';
import { MarcaVivaIndica } from '@/components/MarcaVivaIndica';
import { ehIdioma } from '@/i18n/idiomas';
import { textos } from '@/i18n/strings';
import { conteudo } from '@/lib/data';
import { moeda, numero } from '@/lib/format';
import { alternativas } from '@/lib/seo';
import type { Call, StatusEdital } from '@/lib/types';

import { ListaEditais } from './_ListaEditais';
import { SemChamadas } from './_SemChamadas';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ idioma: string }>;
}): Promise<Metadata> {
  const { idioma } = await params;
  if (!ehIdioma(idioma)) return {};
  return { title: textos(idioma).editais.listaTitulo, alternates: alternativas(idioma, 'oportunidades') };
}

const PESO_STATUS: Record<StatusEdital, number> = {
  aberta: 0,
  'em-avaliacao': 1,
  encerrada: 2,
  consulta: 3,
};

/** Chamada sem calendario fechado nao tem data para comparar: vai para o fim. */
const SEM_PRAZO = { crescente: '9999-12-31', decrescente: '0000-01-01' };

/**
 * Abertas primeiro, com o prazo mais proximo no topo. Depois as chamadas em
 * avaliacao e as encerradas, da mais recente para a mais antiga.
 */
function ordenar(lista: Call[]): Call[] {
  return [...lista].sort((a, b) => {
    const porStatus = PESO_STATUS[a.status] - PESO_STATUS[b.status];
    if (porStatus !== 0) return porStatus;
    if (a.status === 'aberta') {
      const { crescente } = SEM_PRAZO;
      return (a.inscricoesAte ?? crescente).localeCompare(b.inscricoesAte ?? crescente);
    }
    const { decrescente } = SEM_PRAZO;
    return (b.inscricoesAte ?? decrescente).localeCompare(a.inscricoesAte ?? decrescente);
  });
}

/**
 * Numeros do ciclo, derivados das chamadas publicadas. Quantas estao abertas
 * o filtro de situacao ja diz, logo abaixo; aqui ficam os dois numeros que
 * nao aparecem em mais nenhum lugar.
 */
function resumoDoCiclo(lista: Call[]) {
  const abertas = lista.filter((edital) => edital.status === 'aberta');
  return {
    recursos: abertas.reduce((soma, edital) => soma + (edital.valorTotal ?? 0), 0),
    apoiados: lista.reduce(
      (soma, edital) => soma + (edital.resultado ? edital.resultado.apoiados.length : 0),
      0,
    ),
  };
}

export default async function PaginaEditais({
  params,
}: {
  params: Promise<{ idioma: string }>;
}) {
  const { idioma } = await params;
  if (!ehIdioma(idioma)) notFound();

  const t = textos(idioma);
  const lista = ordenar(conteudo(idioma).editais);

  const cabecalho = (estreito: boolean) => (
    <CabecalhoPagina
      estreito={estreito}
      titulo={t.editais.listaTitulo}
      ilustracao={<MarcaVivaIndica expressao="03" cor="azul" />}
    />
  );

  /* Sem chamada publicada nao ha resumo do ciclo, filtro nem lista. */
  if (lista.length === 0) {
    return (
      <>
        {cabecalho(true)}
        <SemChamadas idioma={idioma} />
      </>
    );
  }

  const resumo = resumoDoCiclo(lista);

  return (
    <>
      {cabecalho(false)}

      <div className="secao">
        <div className="container pilha--g">
          {/*
            Com uma unica chamada publicada os numeros do ciclo repetem o que o
            cartao ja diz. O resumo entra quando ha mais de uma chamada, numa
            linha so, logo acima dos filtros: a lista comeca na primeira tela.
          */}
          {lista.length > 1 && (resumo.recursos > 0 || resumo.apoiados > 0) ? (
            <dl
              className="definicoes"
              style={{
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                margin: 0,
                gap: 'var(--esp-32)',
              }}
            >
              <div>
                <dt>{t.editais.resumoRecursos}</dt>
                <dd>
                  <span className="numero-grande">{moeda(resumo.recursos, idioma)}</span>
                </dd>
              </div>
              {resumo.apoiados > 0 ? (
                <div>
                  <dt>{t.editais.resumoApoiados}</dt>
                  <dd>
                    <span className="numero-grande">{numero(resumo.apoiados, idioma)}</span>
                  </dd>
                </div>
              ) : null}
            </dl>
          ) : null}

          <ListaEditais idioma={idioma} editais={lista} />
        </div>
      </div>
    </>
  );
}
