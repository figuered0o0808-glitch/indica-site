import Link from 'next/link';
import type { CSSProperties } from 'react';

import { Chip } from '@/components/Chip';
import { Marcador } from '@/components/Marcador';
import { Selo } from '@/components/Selo';
import { NumerosChamada } from '@/components/NumerosChamada';
import { Organizacao } from '@/components/Organizacao';
import type { Idioma } from '@/i18n/idiomas';
import { textos } from '@/i18n/strings';
import { arquivoPublico } from '@/lib/format';
import { rota } from '@/lib/rotas';
import type { Call } from '@/lib/types';
import { textoDoApoio } from '@/lib/apoio';

import { prazoDaChamada } from './_prazo';

/**
 * Uma chamada sozinha, em largura inteira.
 *
 * Um cartao de grade ao lado de duas colunas vazias faz a unica chamada
 * publicada parecer sobra de lista. Aqui ela ocupa a coluna toda e ja mostra
 * os quatro numeros que decidem se vale ler o resto: quem financia, quanto ha
 * na chamada, quanto vai por projeto e ate quando da para se inscrever.
 */
export function ChamadaDestaque({
  idioma,
  edital,
  nivel = 2,
}: {
  idioma: Idioma;
  edital: Call;
  nivel?: 2 | 3;
}) {
  const t = textos(idioma);
  const prazo = prazoDaChamada(idioma, edital);
  const Titulo = nivel === 2 ? 'h2' : 'h3';

  /*
   * Sozinha na lista, a chamada aberta e a coluna rosa da home que continuou:
   * mesma superficie, mesmo marcador, a ficha em linhas com filete e as vagas
   * em pontos. Encerrada ou em avaliacao, a cor sai e fica o cartao branco.
   */
  const classe =
    edital.status === 'aberta' ? 'cartao coluna--rosa coluna--solta' : 'cartao';
  /* O cartao inteiro e o link: o nome e o titulo, o resumo e a descricao. */
  const id = `chamada-${edital.slug}`;

  return (
    <Link
      href={rota(idioma, `oportunidades/${edital.slug}`)}
      className={classe}
      style={{ gap: 'var(--esp-16)' } as CSSProperties}
      aria-labelledby={`${id}-titulo`}
      aria-describedby={`${id}-resumo`}
    >
      <div className="linha linha--fim" style={{ gap: 'var(--esp-12)' }}>
        <div className="linha" style={{ gap: 'var(--esp-8)' }}>
          <Marcador arranjo={1} />
          <Selo idioma={idioma} status={edital.status} />
          <Chip vazado>{t.comum.tiposEdital[edital.tipo]}</Chip>
          {edital.modalidade ? <Chip vazado>{edital.modalidade}</Chip> : null}
          {edital.publico ? <Chip cor="areia">{t.comum.publicoEdital[edital.publico]}</Chip> : null}
        </div>
        {edital.logoOrganizacao ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={arquivoPublico(edital.logoOrganizacao)}
            alt={edital.proponente ? '' : (edital.organizacao ?? '')}
            style={{
              height: 22,
              width: 'auto',
              display: 'block',
              flex: 'none',
              /* Quando a linha quebra no celular, a marca fica no fim, nao orfa a esquerda. */
              marginLeft: 'auto',
            }}
          />
        ) : null}
      </div>

      {/* Sozinha na pagina, a chamada leva o corpo de titulo, nao o de cartao. */}
      <Titulo
        id={`${id}-titulo`}
        style={{
          margin: 0,
          maxWidth: '38ch',
          fontSize: 'var(--titulo-g)',
          lineHeight: 'var(--entrelinha-g)',
        }}
      >
        {edital.titulo}
      </Titulo>

      <p className="cartao__texto" id={`${id}-resumo`} style={{ maxWidth: '64ch' }}>
        {edital.resumo}
      </p>

      <NumerosChamada idioma={idioma} edital={edital} />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 'var(--esp-32)',
          alignItems: 'start',
        }}
      >
        <div className="coluna__linhas">
          <div className="coluna__linha">
            <span className="rotulo">{t.editais.proponente}</span>
            <span>
              {edital.proponente ? (
                <Organizacao nome={edital.proponente} logo={edital.logoOrganizacao} />
              ) : (
                t.editais.proponenteProprio
              )}
            </span>
          </div>
          <div className={edital.faixaApoio ? 'coluna__linha' : 'coluna__linha coluna__linha--longa'}>
            <span className="rotulo">{t.comum.rotulos.apoio}</span>
            <span>{textoDoApoio(idioma, edital)}</span>
          </div>
          <div className="coluna__linha">
            <span className="rotulo">{prazo.rotulo}</span>
            <span>{prazo.valor}</span>
          </div>
        </div>
      </div>

      <div className="cartao__rodape">
        <span className="link-seta">{t.comum.acoes.verEdital}</span>
      </div>
    </Link>
  );
}
