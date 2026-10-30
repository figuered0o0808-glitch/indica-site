import type { Idioma } from '@/i18n/idiomas';
import { textos } from '@/i18n/strings';
import { moeda } from '@/lib/format';
import type { Call } from '@/lib/types';

/**
 * Como o apoio de uma chamada aparece em texto, nos lugares em que antes so
 * havia dinheiro. Uma chamada pode nao ter valor definido (em negociacao) ou
 * oferecer outra coisa (residencia, mentoria, estudio): nesses casos entra a
 * descricao, e sem descricao entra "A definir". Cinco telas mostravam a faixa
 * cada uma do seu jeito; agora todas perguntam aqui.
 */
/** "R$ 8.000 a R$ 30.000", ou so "R$ 20.000" quando a faixa e um valor so (premio, bolsa). */
export function textoDaFaixa(idioma: Idioma, faixa: { min: number; max: number }): string {
  if (faixa.min === faixa.max) return moeda(faixa.min, idioma);
  return `${moeda(faixa.min, idioma)} ${textos(idioma).editais.faixaSeparador} ${moeda(faixa.max, idioma)}`;
}

export function textoDoApoio(idioma: Idioma, edital: Call): string {
  const t = textos(idioma).editais;
  if (edital.faixaApoio) return textoDaFaixa(idioma, edital.faixaApoio);
  return edital.apoioDescricao ?? t.semValor;
}

export function textoDoValorTotal(idioma: Idioma, edital: Call): string {
  const t = textos(idioma).editais;
  if (edital.valorTotal == null) return t.semValor;
  const valor = moeda(edital.valorTotal, idioma);
  return edital.valorTotalAte ? `${t.valorAte} ${valor}` : valor;
}
