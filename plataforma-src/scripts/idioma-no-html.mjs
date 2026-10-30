/**
 * Corrige o atributo lang de cada pagina exportada.
 *
 * O PROBLEMA. O elemento <html> mora em src/app/layout.tsx, que e a raiz e nao
 * conhece o segmento de idioma da rota: ele so pode escrever um valor fixo, e
 * escreve pt-BR. Resultado: as paginas em ingles e espanhol saem com conteudo
 * traduzido e anunciadas como portugues do Brasil. Um leitor de tela le
 * "Opportunities" e "Convocatorias" com regras de pronuncia portuguesas. E
 * falha WCAG 3.1.1, nivel A, em dois tercos de um site trilingue.
 *
 * POR QUE AQUI, e nao no React. Em App Router o <html> tem de estar no layout
 * raiz, e a raiz deste projeto atende tambem a rota "/" (que redireciona para
 * /pt) e a 404. Mover a raiz para dentro de [idioma] resolveria o lang e
 * quebraria essas duas. Como `output: export` gera um arquivo HTML por rota, e
 * cada arquivo ja esta na pasta do idioma dele, arrumar no arquivo e a correcao
 * mais direta e a unica que funciona sem JavaScript no navegador.
 *
 * O que faz: percorre docs/, e em todo .html abaixo de docs/en/ e docs/es/
 * troca o lang do <html>. docs/pt/ ja esta certo e nao e tocado.
 *
 * Roda depois do `next build`, dentro do script `publicar`.
 */

import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

/** Pasta exportada, relativa a raiz do projeto. */
const SAIDA = 'docs';

/** Pasta do idioma e o valor que o lang deve ter nela. */
const IDIOMAS = { en: 'en', es: 'es' };

/** O que o layout raiz escreve e que precisa ser trocado. */
const LANG_DA_RAIZ = 'pt-BR';

async function arquivosHtml(pasta) {
  const achados = [];
  for (const item of await readdir(pasta, { withFileTypes: true })) {
    const caminho = join(pasta, item.name);
    if (item.isDirectory()) achados.push(...(await arquivosHtml(caminho)));
    else if (item.name.endsWith('.html')) achados.push(caminho);
  }
  return achados;
}

let trocados = 0;
let semLang = 0;

for (const [pasta, lang] of Object.entries(IDIOMAS)) {
  let html;
  try {
    html = await arquivosHtml(join(SAIDA, pasta));
  } catch {
    /* Idioma sem paginas exportadas: nada a fazer, e nao e erro. */
    continue;
  }

  for (const arquivo of html) {
    const antes = await readFile(arquivo, 'utf8');
    const depois = antes.replace(`<html lang="${LANG_DA_RAIZ}"`, `<html lang="${lang}"`);

    if (depois === antes) {
      semLang += 1;
      continue;
    }
    await writeFile(arquivo, depois, 'utf8');
    trocados += 1;
  }
}

console.log(`idioma-no-html: ${trocados} paginas corrigidas`);

/*
 * Nenhuma troca em nenhum arquivo significa que o layout raiz mudou de forma e
 * a busca nao casa mais. Falhar aqui e melhor que publicar calado: o erro de
 * acessibilidade e invisivel em teste de olho.
 */
if (trocados === 0) {
  console.error(
    `idioma-no-html: nenhuma pagina casou com '<html lang="${LANG_DA_RAIZ}"'. ` +
      `Verifique src/app/layout.tsx (${semLang} arquivos lidos).`,
  );
  process.exit(1);
}
