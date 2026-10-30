/** Idiomas do site. O primeiro e o padrao. */
export const IDIOMAS = ['pt', 'en', 'es'] as const;

export type Idioma = (typeof IDIOMAS)[number];

export const IDIOMA_PADRAO: Idioma = 'pt';

export const NOME_DO_IDIOMA: Record<Idioma, string> = {
  pt: 'Português',
  en: 'English',
  es: 'Español',
};

/** Sigla curta usada no seletor. */
export const SIGLA_DO_IDIOMA: Record<Idioma, string> = {
  pt: 'PT',
  en: 'EN',
  es: 'ES',
};

/** Atributo lang do documento. */
export const TAG_HTML: Record<Idioma, string> = {
  pt: 'pt-BR',
  en: 'en',
  es: 'es',
};

export function ehIdioma(valor: string): valor is Idioma {
  return (IDIOMAS as readonly string[]).includes(valor);
}
