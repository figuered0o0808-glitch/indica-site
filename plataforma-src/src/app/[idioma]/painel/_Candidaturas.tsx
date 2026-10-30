'use client';

/**
 * Tabela das candidaturas enviadas. So e montada com o cadastro aberto: o
 * estado vazio daqui e o de quem tem cadastro e ainda nao se candidatou.
 */

import Link from 'next/link';

import { Botao } from '@/components/Botao';
import { Chip } from '@/components/Chip';
import { EstadoVazio } from '@/components/EstadoVazio';
import { Selo } from '@/components/Selo';
import type { Idioma } from '@/i18n/idiomas';
import { textos } from '@/i18n/strings';
import { dataCurta, moeda } from '@/lib/format';
import { rota } from '@/lib/rotas';
import type { Call, Candidatura } from '@/lib/types';
import { textoDoApoio, textoDoValorTotal } from '@/lib/apoio';

/** Registros locais so aparecem enquanto a chamada existe no catalogo atual. */
export function candidaturasDoPainel(catalogo: Call[], candidaturas: Candidatura[]): Candidatura[] {
  const slugsPublicados = new Set(catalogo.map((chamada) => chamada.slug));
  return candidaturas.filter((candidatura) => slugsPublicados.has(candidatura.editalSlug));
}

/**
 * Estado vazio de quem tem cadastro e ainda nao se candidatou.
 *
 * Em vez de dizer que a lista esta vazia e mandar procurar, ele traz as
 * chamadas que estao aceitando inscricao agora, com o apoio por projeto, o
 * prazo e o botao que abre o formulario. E o unico lugar do painel em que a
 * pessoa pode agir sem sair da pagina.
 */
function SemCandidatura({ idioma, abertas }: { idioma: Idioma; abertas: Call[] }) {
  const t = textos(idioma);
  const s = t.paineis;

  if (abertas.length === 0) {
    return (
      <EstadoVazio
        desenho="pasta"
        titulo={s.candidaturasVazio}
        acao={
          <Botao href={rota(idioma, 'oportunidades')} variante="secundario" tamanho="pequeno">
            {s.verOportunidades}
          </Botao>
        }
      />
    );
  }

  return (
    <div className="pilha">
      <p style={{ margin: 0 }}>{s.candidaturasVazio}</p>

      {abertas.map((edital) => (
        <article key={edital.slug} className="cartao">
          <div className="linha" style={{ gap: 8 }}>
            <Selo idioma={idioma} status={edital.status} />
            <Chip vazado>{t.comum.tiposEdital[edital.tipo]}</Chip>
            {edital.modalidade ? <Chip vazado>{edital.modalidade}</Chip> : null}
            {edital.publico ? <Chip cor="areia">{t.comum.publicoEdital[edital.publico]}</Chip> : null}
          </div>

          <h3 className="cartao__titulo">{edital.titulo}</h3>
          {/* O painel e largo; o resumo para na medida em que ainda se le. */}
          <p className="cartao__texto" style={{ maxWidth: '62ch' }}>
            {edital.resumo}
          </p>

          <dl
            className="definicoes definicoes--2"
            style={{ gap: 16, borderTop: '1px solid var(--linha)', paddingTop: 16 }}
          >
            <div>
              <dt>{t.comum.rotulos.apoio}</dt>
              <dd>
                {textoDoApoio(idioma, edital)}
              </dd>
            </div>
            <div>
              <dt>{t.comum.rotulos.prazo}</dt>
              <dd>
                {edital.inscricoesAte ? dataCurta(edital.inscricoesAte, idioma) : t.editais.semPrazo}
              </dd>
            </div>
          </dl>

          <div className="linha">
            <Botao
              href={rota(idioma, `oportunidades/${edital.slug}/candidatura`)}
              tamanho="pequeno"
            >
              {t.comum.acoes.candidatarProjeto}
            </Botao>
            <Botao
              href={rota(idioma, `oportunidades/${edital.slug}`)}
              variante="secundario"
              tamanho="pequeno"
            >
              {t.comum.acoes.verEdital}
            </Botao>
          </div>
        </article>
      ))}
    </div>
  );
}

export function Candidaturas({
  idioma,
  candidaturas,
  abertas,
}: {
  idioma: Idioma;
  candidaturas: Candidatura[];
  /** Chamadas com inscricao aberta, entregues pela pagina (servidor). */
  abertas: Call[];
}) {
  const s = textos(idioma).paineis;

  if (candidaturas.length === 0) {
    return <SemCandidatura idioma={idioma} abertas={abertas} />;
  }

  const total = candidaturas.reduce((soma, item) => soma + item.valorSolicitado, 0);

  return (
    <div className="tabela-rolagem">
      <table className="tabela">
        <thead>
          <tr>
            <th scope="col">{s.colunas.edital}</th>
            <th scope="col">{s.colunas.projeto}</th>
            <th scope="col" className="num">
              {s.colunas.valor}
            </th>
            <th scope="col">{s.colunas.enviada}</th>
            <th scope="col">{s.colunas.situacao}</th>
          </tr>
        </thead>
        <tbody>
          {candidaturas.map((candidatura) => (
            <tr key={candidatura.id}>
              <td>
                <Link href={rota(idioma, `oportunidades/${candidatura.editalSlug}`)}>
                  {candidatura.editalTitulo}
                </Link>
              </td>
              <td>
                <span style={{ display: 'block', color: 'var(--preto)' }}>
                  {candidatura.projeto}
                </span>
                <span className="texto-mini">
                  {candidatura.protocolo
                    ? `${candidatura.formato} · ${textos(idioma).fluxos.candidatura.confirmacao.protocolo} ${candidatura.protocolo}`
                    : candidatura.formato}
                </span>
              </td>
              <td className="num">{moeda(candidatura.valorSolicitado, idioma)}</td>
              <td>{dataCurta(candidatura.enviadaEm.slice(0, 10), idioma)}</td>
              <td>
                <Selo idioma={idioma} status={candidatura.status} />
              </td>
            </tr>
          ))}
        </tbody>
        {candidaturas.length > 1 ? (
          <tfoot>
            <tr>
              <td colSpan={2}>{s.totalSolicitado}</td>
              <td className="num">{moeda(total, idioma)}</td>
              <td colSpan={2} />
            </tr>
          </tfoot>
        ) : null}
      </table>
    </div>
  );
}
