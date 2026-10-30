import Link from 'next/link';

import { Chip } from '@/components/Chip';
import { Marcador } from '@/components/Marcador';
import { Selo } from '@/components/Selo';
import { Vagas } from '@/components/Vagas';
import { Organizacao } from '@/components/Organizacao';
import type { Idioma } from '@/i18n/idiomas';
import { textos } from '@/i18n/strings';
import { arquivoPublico, dataCurta, moeda } from '@/lib/format';
import { rota } from '@/lib/rotas';
import type { Call } from '@/lib/types';
import { textoDoApoio, textoDoValorTotal } from '@/lib/apoio';

import { prazoEmLinha } from './_prazo';

/** Data mostrada no rodape do cartao, coerente com a situacao da chamada. */
function rodape(idioma: Idioma, edital: Call): string {
  if (edital.status === 'encerrada' && edital.resultado) {
    const t = textos(idioma);
    return `${t.editais.resultadoPublicadoEm} ${dataCurta(edital.resultado.publicadoEm, idioma)}`;
  }
  return prazoEmLinha(idioma, edital, true);
}

export function CartaoEdital({ idioma, edital }: { idioma: Idioma; edital: Call }) {
  const t = textos(idioma);
  const id = `chamada-${edital.slug}`;

  /*
   * O cartao inteiro e o link. Sem nome proprio, o leitor de tela leria o
   * cartao todo como nome do link: o nome e o titulo, e o resumo e a descricao.
   */
  return (
    <Link
      href={rota(idioma, `oportunidades/${edital.slug}`)}
      className="cartao"
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
            /* A linha do proponente logo abaixo ja nomeia a organizacao; aqui a marca e decorativa. */
            alt={edital.proponente ? '' : (edital.organizacao ?? '')}
            style={{
              height: 16,
              width: 'auto',
              display: 'block',
              flex: 'none',
              /* Quando a linha quebra no celular, a marca fica no fim, nao orfa a esquerda. */
              marginLeft: 'auto',
            }}
          />
        ) : null}
      </div>

      <div>
        <h3 className="cartao__titulo" id={`${id}-titulo`}>
          {edital.titulo}
        </h3>
        <p className="texto-mini" style={{ margin: 'var(--esp-8) 0 0', display: 'flex', alignItems: 'center', gap: 'var(--esp-8)' }}>
          {edital.proponente ? (
            <>
              <span>{t.editais.proponente}:</span>
              <Organizacao nome={edital.proponente} logo={edital.logoOrganizacao} altura={13} />
            </>
          ) : (
            t.editais.proponenteProprio
          )}
        </p>
      </div>

      {/* O resumo absorve a folga para que os blocos de numeros fiquem alinhados. */}
      <p className="cartao__texto" id={`${id}-resumo`} style={{ flex: 1 }}>
        {edital.resumo}
      </p>

      {/* A ficha em linhas com filete, como na coluna rosa da home. */}
      <div className="coluna__linhas">
        <div className="coluna__linha">
          <span className="rotulo">{t.comum.rotulos.valorTotal}</span>
          <span>{textoDoValorTotal(idioma, edital)}</span>
        </div>
        <div className={edital.faixaApoio ? 'coluna__linha' : 'coluna__linha coluna__linha--longa'}>
          <span className="rotulo">{t.comum.rotulos.apoio}</span>
          <span>{textoDoApoio(idioma, edital)}</span>
        </div>
      </div>

      <Vagas idioma={idioma} chamada={edital} />

      <div className="cartao__rodape">
        <span>{rodape(idioma, edital)}</span>
        <span className="link-seta">{t.comum.acoes.verEdital}</span>
      </div>
    </Link>
  );
}
