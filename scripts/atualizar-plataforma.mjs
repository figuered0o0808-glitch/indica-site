/** Compila o fonte publico e publica somente sua saida estatica em /plataforma. */
import { spawnSync } from 'node:child_process';
import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const agencia = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const fonte = join(agencia, 'plataforma-src');
const destino = join(agencia, 'plataforma');
const require = createRequire(join(fonte, 'package.json'));
const env = { ...process.env, BASE_PATH: '/plataforma', NEXT_PUBLIC_SITE_ORIGIN: 'https://agenciaindica.com',
  NEXT_TELEMETRY_DISABLED: '1', NEXT_PUBLIC_INDICA_API: '', NEXT_PUBLIC_TILT_API: '' };
for (const [bin, args] of [['next/dist/bin/next', ['build']]]) {
  const result = spawnSync(process.execPath, [require.resolve(bin), ...args], { cwd: fonte, env, stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status || 1);
}

async function ajustarIdioma(pasta, lang) {
  for (const item of await readdir(pasta, { withFileTypes: true })) {
    const arquivo = join(pasta, item.name);
    if (item.isDirectory()) await ajustarIdioma(arquivo, lang);
    else if (item.name.endsWith('.html')) {
      const html = await readFile(arquivo, 'utf8');
      const corrigido = /<html\b[^>]*\blang=/.test(html)
        ? html.replace(/(<html\b[^>]*\blang=)["'][^"']*["']/, `$1"${lang}"`)
        : html.replace(/<html\b/, `<html lang="${lang}"`);
      await writeFile(arquivo, corrigido);
    }
  }
}
const saida = join(fonte, 'out');
for (const [pasta, lang] of [['pt','pt-BR'],['en','en'],['es','es']]) await ajustarIdioma(join(saida, pasta), lang);
// A saida anterior so e substituida depois de o build completo passar.
await rm(destino, { recursive: true, force: true });
await mkdir(destino, { recursive: true });
await cp(saida, destino, { recursive: true });
await writeFile(join(agencia, '.nojekyll'), '');
console.log('Plataforma publica atualizada em agenciaindica.com/plataforma/');
