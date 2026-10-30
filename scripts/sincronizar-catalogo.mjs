/** Copia apenas o catálogo público do sistema; nunca usa sessão administrativa. */
import { appendFile, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const fonte = join(raiz, 'plataforma-src');
const api = (process.env.INDICA_API_URL || process.env.NEXT_PUBLIC_INDICA_API || 'https://indica-3by7.onrender.com').replace(/\/+$/, '');
const origem = new URL(api);
if (origem.protocol !== 'https:' && !['localhost', '127.0.0.1'].includes(origem.hostname)) throw new Error('A API pública precisa usar HTTPS');

async function baixar(url, limite) {
  const resposta = await fetch(url, { signal: AbortSignal.timeout(30000), headers: { 'Cache-Control': 'no-cache' } });
  if (!resposta.ok) throw new Error(`Falha ao consultar catálogo/arquivo público: HTTP ${resposta.status}`);
  if (Number(resposta.headers.get('content-length')) > limite) throw new Error('Arquivo público grande demais');
  const bytes = Buffer.from(await resposta.arrayBuffer());
  if (bytes.length > limite) throw new Error('Arquivo público grande demais');
  return bytes;
}

const catalogo = JSON.parse((await baixar(`${api}/tilt/publico/catalogo`, 10 * 1024 * 1024)).toString('utf8'));
if (!/^[a-f0-9]{64}$/.test(catalogo.revisao) || !catalogo.idiomas) throw new Error('Catálogo público inválido');
const marcador = join(fonte, 'public', 'catalogo-revisao.json');
let anterior;
try { anterior = JSON.parse(await readFile(marcador, 'utf8')); } catch {}
const mudou = anterior?.revisao !== catalogo.revisao;
if (process.env.GITHUB_OUTPUT) await appendFile(process.env.GITHUB_OUTPUT, `mudou=${mudou}\n`);
if (!mudou && !process.argv.includes('--forcar')) {
  console.log('O catálogo público já está atualizado.');
  process.exit(0);
}

const arquivos = new Set();
function visitar(valor) {
  if (Array.isArray(valor)) valor.forEach(visitar);
  else if (valor && typeof valor === 'object') Object.values(valor).forEach(visitar);
  else if (typeof valor === 'string' && valor.startsWith('/arquivos/')) {
    if (!/^\/arquivos\/[a-f0-9]{64}\/[A-Za-z0-9][A-Za-z0-9._-]{0,100}\.(?:pdf|png|jpg|jpeg|webp)$/.test(valor)) throw new Error('Caminho de arquivo público inválido');
    arquivos.add(valor);
  }
}
for (const idioma of ['pt', 'en', 'es']) {
  const dados = catalogo.idiomas[idioma];
  if (!dados || !['calls', 'courses', 'articles'].every((tipo) => Array.isArray(dados[tipo]))) throw new Error(`Catálogo inválido: ${idioma}`);
  for (const tipo of ['calls', 'courses', 'articles']) {
    const slugs = new Set();
    for (const item of dados[tipo]) {
      if (!item || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.slug) || slugs.has(item.slug)) throw new Error(`Identificador inválido ou repetido: ${idioma}/${tipo}`);
      slugs.add(item.slug);
    }
  }
  visitar(dados);
}
const downloads = [];
for (const caminho of arquivos) {
  const arquivo = join(fonte, 'public', caminho);
  try { await readFile(arquivo); } catch {
    const bytes = await baixar(`${api}/tilt/publico${caminho}`, 20 * 1024 * 1024);
    if (createHash('sha256').update(bytes).digest('hex') !== caminho.split('/')[2]) throw new Error('Arquivo público não corresponde à sua referência');
    if (caminho.endsWith('.pdf') && bytes.subarray(0, 5).toString() !== '%PDF-') throw new Error('PDF público inválido');
    downloads.push([arquivo, bytes]);
  }
}
for (const [arquivo, bytes] of downloads) {
  await mkdir(dirname(arquivo), { recursive: true });
  await writeFile(arquivo, bytes);
}
// A cópia pública dos uploads também acompanha retiradas. Os originais ficam no sistema.
async function limparRetirados(pasta, prefixo = '/arquivos') {
  let itens;
  try { itens = await readdir(pasta, { withFileTypes: true }); }
  catch (erro) { if (erro.code === 'ENOENT') return; throw erro; }
  for (const item of itens) {
    const arquivo = join(pasta, item.name), caminho = `${prefixo}/${item.name}`;
    if (item.isDirectory()) {
      await limparRetirados(arquivo, caminho);
      if ((await readdir(arquivo)).length === 0) await rm(arquivo, { recursive: true });
    } else if (!arquivos.has(caminho)) await rm(arquivo);
  }
}
await limparRetirados(join(fonte, 'public', 'arquivos'));
for (const idioma of ['pt', 'en', 'es']) {
  for (const tipo of ['calls', 'courses', 'articles']) {
    await writeFile(join(fonte, 'data', idioma, `${tipo}.json`), JSON.stringify(catalogo.idiomas[idioma][tipo], null, 2) + '\n');
  }
}
await writeFile(marcador, JSON.stringify({ revisao: catalogo.revisao, atualizadoEm: new Date().toISOString() }, null, 2) + '\n');
console.log(`Catálogo público recebido: ${Object.values(catalogo.idiomas).reduce((n, d) => n + d.calls.length + d.courses.length + d.articles.length, 0)} documentos em três idiomas.`);
