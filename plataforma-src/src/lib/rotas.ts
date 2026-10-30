import { IDIOMA_PADRAO, ehIdioma, type Idioma } from '@/i18n/idiomas';

/** Monta um endereco interno com o idioma na frente: /pt/oportunidades */
export function rota(idioma: Idioma, caminho = ''): string {
  const limpo = caminho.replace(/^\/+/, '');
  return limpo ? `/${idioma}/${limpo}` : `/${idioma}`;
}

/** Le o idioma de um caminho da URL. Usado nos componentes de cliente. */
export function idiomaDoCaminho(caminho: string): Idioma {
  const primeiro = caminho.split('/').filter(Boolean)[0] ?? '';
  return ehIdioma(primeiro) ? primeiro : IDIOMA_PADRAO;
}
