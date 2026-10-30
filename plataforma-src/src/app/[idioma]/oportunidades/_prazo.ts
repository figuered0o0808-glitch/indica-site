/**
 * Prazo de inscricao das chamadas. `inscricoesAte` e nulo enquanto o calendario
 * da chamada nao esta fechado: nesse caso nenhuma data e escrita.
 */
import type { Idioma } from '@/i18n/idiomas';
import { textos } from '@/i18n/strings';
import { data, dataCurta } from '@/lib/format';
import type { Call } from '@/lib/types';

/** Rotulo e valor do prazo, coerentes com a situacao e com o calendario. */
export function prazoDaChamada(
  idioma: Idioma,
  edital: Call,
  curto = false,
): { rotulo: string; valor: string } {
  const t = textos(idioma);
  if (edital.status === 'consulta') {
    return { rotulo: t.editais.consultaPrazoRotulo, valor: t.editais.consultaPrazoValor };
  }
  if (!edital.inscricoesAte) {
    return { rotulo: t.comum.rotulos.prazo, valor: t.editais.semPrazo };
  }
  return {
    rotulo:
      edital.status === 'aberta'
        ? t.comum.rotulos.inscricoesAte
        : t.editais.inscricoesEncerradasEm,
    valor: curto ? dataCurta(edital.inscricoesAte, idioma) : data(edital.inscricoesAte, idioma),
  };
}

/** Mesma informacao em uma linha, para rodape de cartao e para chip. */
export function prazoEmLinha(idioma: Idioma, edital: Call, curto = false): string {
  if (edital.status === 'consulta') return textos(idioma).comum.status.consulta;
  if (!edital.inscricoesAte) return textos(idioma).editais.prazoADefinir;
  const { rotulo, valor } = prazoDaChamada(idioma, edital, curto);
  return `${rotulo} ${valor}`;
}
