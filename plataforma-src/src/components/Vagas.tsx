import type { Idioma } from '@/i18n/idiomas';
import { textos } from '@/i18n/strings';
import { Pontos } from '@/components/Pontos';
import { numero } from '@/lib/format';
import type { Call } from '@/lib/types';

/**
 * As vagas de uma chamada como fileira de pontos: um por vaga ate o maximo
 * declarado. Cheio, projeto ja selecionado (so existe depois do resultado);
 * vazado, vaga aberta. E o mesmo ponto do logotipo virando medida.
 *
 * A fileira e desenho: para quem nao ve, o numero esta na legenda. Por isso
 * ela leva aria-hidden e a legenda nunca e omitida.
 *
 * As strings moram em home.coluna porque nasceram na home, e a chamada, a
 * lateral e a lista usam as mesmas: uma lista de strings, tres idiomas.
 */

/** Modelo curto com chaves entre chaves: "{n} de {max}". */
function preencher(modelo: string, valores: Record<string, string>): string {
  return modelo.replace(/\{(\w+)\}/g, (_, chave: string) => valores[chave] ?? '');
}

export function Vagas({
  idioma,
  chamada,
  semRotulo,
}: {
  idioma: Idioma;
  chamada: Call;
  /** Some o rotulo "Vagas" acima da fileira, quando o contexto ja o diz. */
  semRotulo?: boolean;
}) {
  const t = textos(idioma);
  const tc = t.home.coluna;
  const max = chamada.vagas?.max ?? 0;
  if (max <= 0) return null;

  // Consulta informa a previsão do documento, sem sugerir vagas ou resultados atuais.
  if (chamada.status === 'consulta') {
    const min = chamada.vagas?.min ?? max;
    const legenda = min === max
      ? preencher(t.editais.consultaVagasFixas, { n: numero(max, idioma) })
      : preencher(t.editais.consultaVagas, { min: numero(min, idioma), max: numero(max, idioma) });
    return <p className="texto-pequeno" style={{ margin: 0 }}>{legenda}</p>;
  }

  const selecionados = chamada.resultado?.apoiados.length ?? 0;
  const abertas = Math.max(max - selecionados, 0);
  /*
   * Chamada encerrada nao tem vaga aberta: o que sobrou do maximo deixou de
   * existir. A fileira mostra so os selecionados, todos cheios.
   */
  const encerrada = chamada.status === 'encerrada';
  const total = encerrada && selecionados > 0 ? selecionados : max;
  const legenda = encerrada && selecionados > 0
    ? preencher(tc.vagasApoiados, { n: numero(selecionados, idioma) })
    : selecionados > 0
      ? preencher(tc.vagasSelecionados, {
          n: numero(selecionados, idioma),
          r: numero(abertas, idioma),
        })
      : (chamada.vagas?.min ?? 0) === max
        ? preencher(tc.vagasApoiados, { n: numero(max, idioma) })
        : preencher(tc.vagasFaixa, {
            min: numero(chamada.vagas?.min ?? 0, idioma),
            max: numero(max, idioma),
          });

  return (
    <div>
      {semRotulo ? null : (
        <p className="rotulo" style={{ margin: '0 0 10px' }}>
          {tc.vagas}
        </p>
      )}
      <Pontos cheios={selecionados} total={total} />
      <p className="texto-pequeno" style={{ margin: '9px 0 0' }}>
        {legenda}
      </p>
    </div>
  );
}
