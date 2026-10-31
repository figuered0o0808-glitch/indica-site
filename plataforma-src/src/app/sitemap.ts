import type { MetadataRoute } from 'next';
import { IDIOMAS } from '@/i18n/idiomas';
import { conteudo } from '@/lib/data';
import { enderecoPublico } from '@/lib/seo';

/** Atualizado pelo mesmo build que publica o catálogo; contas e testes ficam fora. */
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const urls: MetadataRoute.Sitemap = [];
  for (const idioma of IDIOMAS) {
    for (const caminho of ['', 'oportunidades', 'biblioteca', 'biblioteca/materiais', 'biblioteca/cursos', 'como-funciona', 'contato']) {
      urls.push({url:enderecoPublico(idioma,caminho),changeFrequency:'weekly',priority:caminho?0.6:0.9});
    }
    const dados=conteudo(idioma);
    for (const c of dados.editais.filter(c=>!c.simulacao)) {
      urls.push({url:enderecoPublico(idioma,`oportunidades/${c.slug}`),changeFrequency:'weekly',priority:0.8});
    }
    for (const m of dados.materiais) {
      urls.push({url:enderecoPublico(idioma,`biblioteca/materiais/${m.slug}`),lastModified:m.atualizadoEm,changeFrequency:'monthly',priority:0.7});
    }
  }
  return urls;
}
