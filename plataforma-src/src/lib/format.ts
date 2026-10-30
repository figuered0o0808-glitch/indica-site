/**
 * Formatadores. Deterministas: nada depende do relogio nem do fuso.
 *
 * TODOS RECEBEM IDIOMA, e o padrao e portugues para nao quebrar quem ainda nao
 * passa. O motivo e um erro que estava no ar: numero em portugues dentro das
 * paginas em ingles. "R$ 10.000" formatado em pt-BR e lido por quem fala ingles
 * como dez reais, nao dez mil, porque em ingles o ponto e separador decimal. O
 * mesmo texto trazia "14 de outubro de 2026" numa pagina em espanhol.
 *
 * Quem chama de dentro de uma tela por idioma DEVE passar o idioma. Se aparecer
 * numero ou data em portugues numa pagina em ingles, e uma chamada sem idioma.
 */

import type { Idioma } from '@/i18n/idiomas';
import { textos } from '@/i18n/strings';

/**
 * Locale de numero por idioma.
 *
 * Espanhol usa pt-BR de proposito. Os separadores sao os mesmos (ponto para
 * milhar), e o locale 'es' com moeda BRL escreve "10.000 BRL", trocando o
 * simbolo por codigo. Para um programa brasileiro lido em espanhol, "R$ 10.000"
 * diz mais do que "10.000 BRL", e os separadores continuam certos.
 */
const LOCALE_DE_MOEDA: Record<Idioma, string> = { pt: 'pt-BR', en: 'en', es: 'pt-BR' };

/** Para numero puro cada idioma usa o proprio locale: todos acertam. */
const LOCALE_DE_NUMERO: Record<Idioma, string> = { pt: 'pt-BR', en: 'en', es: 'es' };

/** 42000 -> "R$ 42.000" em portugues, "R$42,000" em ingles */
export function moeda(valor: number, idioma: Idioma): string {
  return new Intl.NumberFormat(LOCALE_DE_MOEDA[idioma], {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(valor);
}

/** 1250000 -> "1.250.000" em portugues, "1,250,000" em ingles */
export function numero(valor: number, idioma: Idioma): string {
  return new Intl.NumberFormat(LOCALE_DE_NUMERO[idioma]).format(valor);
}

/*
 * Mes e modelo de data vem de i18n, do namespace de aprendizado, onde a
 * biblioteca ja os mantinha nos tres idiomas. Ficam la, e nao duplicados aqui,
 * porque duas listas de meses divergem no dia em que alguem corrige uma so.
 */
function calendario(idioma: Idioma) {
  return textos(idioma).aprendizado.materiais;
}

/** "2026-03-12" -> "12 de março de 2026" | "March 12, 2026" */
export function data(iso: string, idioma: Idioma): string {
  const [ano, mes, dia] = iso.split('-').map(Number);
  if (!ano || !mes || !dia) return iso;
  const { meses, dataModelo } = calendario(idioma);
  return dataModelo
    .replace('{dia}', String(dia))
    .replace('{mes}', meses[mes - 1])
    .replace('{ano}', String(ano));
}

/** "2026-03-12" -> "12/03/2026" | "03/12/2026" em ingles */
export function dataCurta(iso: string, idioma: Idioma): string {
  const [ano, mes, dia] = iso.split('-');
  if (!ano || !mes || !dia) return iso;
  return calendario(idioma)
    .dataCurtaModelo.replace('{dia}', dia)
    .replace('{mes}', mes)
    .replace('{ano}', ano);
}

/** Iniciais para avatares: "Ana Beatriz Quirino" -> "AQ" */
export function iniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/).filter((p) => p.length > 2);
  if (partes.length === 0) return nome.slice(0, 2).toUpperCase();
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}

/** Identificador estavel sem depender de relogio nem de aleatoriedade. */
export function proximoId(prefixo: string, existentes: { id: string }[]): string {
  const numeros = existentes
    .map((item) => Number(item.id.replace(/\D/g, '')))
    .filter((n) => Number.isFinite(n));
  const proximo = (numeros.length ? Math.max(...numeros) : 0) + 1;
  return `${prefixo}-${String(proximo).padStart(3, '0')}`;
}

/** Caminho de um arquivo em /public, com o prefixo que o GitHub Pages exige. */
export function arquivoPublico(caminho: string): string {
  const base = process.env.BASE_PATH ?? '';
  return `${base}${caminho}`;
}
