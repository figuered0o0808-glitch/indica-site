import type { Metadata } from 'next';

import type { Idioma } from '@/i18n/idiomas';
import { rota } from '@/lib/rotas';

/**
 * Enderecos publicos do site, para o que precisa deles por inteiro: canonical,
 * hreflang, imagem de compartilhamento, endereco de uma chamada. Ao apontar um
 * dominio proprio, troque a origem aqui e o resto acompanha.
 *
 * Tudo aqui sai absoluto de proposito. O Next resolve caminho relativo contra
 * metadataBase, e com basePath a regra tem casos de borda; endereco inteiro
 * nao tem.
 */
export const ORIGEM = (process.env.NEXT_PUBLIC_SITE_ORIGIN || 'https://agenciaindica.com').replace(/\/+$/, '');

/** Prefixo de caminho do site publicado (vazio no dev). */
export const BASE = process.env.BASE_PATH ?? '';

/** Endereco absoluto de uma pagina, com a barra no fim que a exportacao gera. */
export function enderecoPublico(idioma: Idioma, caminho = ''): string {
  return `${ORIGEM}${BASE}${rota(idioma, caminho)}/`;
}

/** Endereco absoluto de um arquivo de /public. */
export function enderecoDeArquivo(caminho: string): string {
  return `${ORIGEM}${BASE}${caminho.startsWith('/') ? caminho : `/${caminho}`}`;
}

/** canonical e hreflang de uma pagina que existe nos tres idiomas. */
export function alternativas(idioma: Idioma, caminho = ''): Metadata['alternates'] {
  return {
    canonical: enderecoPublico(idioma, caminho),
    languages: {
      'pt-BR': enderecoPublico('pt', caminho),
      en: enderecoPublico('en', caminho),
      es: enderecoPublico('es', caminho),
      'x-default': enderecoPublico('pt', caminho),
    },
  };
}
