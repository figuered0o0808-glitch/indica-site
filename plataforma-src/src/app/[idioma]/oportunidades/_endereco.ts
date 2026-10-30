/**
 * Endereco publico de uma chamada.
 *
 * Montado sem o navegador: o bloco de compartilhamento precisa trazer o
 * endereco escrito no HTML estatico, antes de qualquer script rodar. Depois
 * de montar, o componente troca pelo endereco real da barra de enderecos,
 * que e o que vale quando o site ganhar dominio proprio.
 */
import type { Idioma } from '@/i18n/idiomas';
import { enderecoPublico } from '@/lib/seo';

export function enderecoDaChamada(idioma: Idioma, slug: string): string {
  return enderecoPublico(idioma, `oportunidades/${slug}`);
}
