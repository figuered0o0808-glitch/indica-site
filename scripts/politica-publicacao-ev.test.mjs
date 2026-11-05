import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { carregarPoliticaPublicacaoEV, projetarCatalogoEV, aplicarPoliticaPublicacaoEV, textosPublicacaoEV } from './politica-publicacao-ev.mjs';

const politica = await carregarPoliticaPublicacaoEV();
const sha = 'b'.repeat(64);
const linhas = {
  pt: ['Todas as propostas deverão divulgar o site Eletrificação Já (eletrificacaoja.com.br).', 'O site Eletrificação Já e a cartilha da campanha reúnem dados e referências.', 'Executar a divulgação do site Eletrificação Já prevista na proposta.'],
  en: ['Every proposal must promote the Eletrificação Já website (eletrificacaoja.com.br).', 'The Eletrificação Já website and campaign guide provide data and references.', 'Deliver the action to promote the Eletrificação Já website described in the proposal.'],
  es: ['Todas las propuestas deberán difundir el sitio Eletrificação Já (eletrificacaoja.com.br).', 'El sitio Eletrificação Já y la guía de la campaña reúnen datos y referencias.', 'Ejecutar la difusión del sitio Eletrificação Já prevista en la propuesta.'],
};
function fixture() {
  return {
    revisao: 'a'.repeat(64),
    idiomas: Object.fromEntries(['pt', 'en', 'es'].map(idioma => {
      const [divulgacao, materiais, obrigacao] = linhas[idioma];
      const ev = {
        slug: politica.slug, chamadaId: politica.chamadaId, status: 'aberta', simulacao: false,
        titulo: `EV ${idioma}`, inscricoesAte: '2026-11-13', valorTotal: 100000,
        faixaApoio: { min: 0, max: 30000 }, vagas: { min: 5, max: 15 }, exigeCnpj: false,
        cronograma: [{ etapa: 'Resultado', data: '2026-11-18' }],
        criterios: [{ titulo: 'Nota da proposta', descricao: '0 a 10' }],
        resultado: { publicacao: 'preservar' }, distribuicao: [{ quantidade: '5–15' }],
        apresentacao: ['Objetivo original', divulgacao], escopo: ['Público original', divulgacao],
        banca: [{ nome: 'Avaliador reservado' }], bancaDescricao: 'Banca anterior',
        arquivoEdital: { idioma: 'pt', arquivo: `/arquivos/${'c'.repeat(64)}/edital-carros-eletricos-brasil.pdf`, paginas: 8 },
        secoesComplementares: [
          { id: 'briefing', titulo: 'Briefing', paragrafos: ['Contexto original', divulgacao, materiais], itens: ['Eixo opcional original'] },
          { id: 'obrigacoes', titulo: 'Obrigações', itens: ['Validar conteúdo previamente', obrigacao] },
          { id: 'outro', titulo: 'Outra regra', itens: ['Regra preservada'] },
        ],
      };
      return [idioma, { calls: [ev, { slug: 'outra-chamada', chamadaId: 'C02', texto: divulgacao }], courses: [{ slug: 'curso-original' }], articles: [{ slug: 'artigo-original' }] }];
    })),
  };
}

test('pré-lançamento nos três idiomas remove referências e mantém condições e outras publicações', () => {
  const entrada = fixture(), original = structuredClone(entrada);
  const saida = projetarCatalogoEV(entrada, politica, { sha256: sha });
  assert.deepEqual(entrada, original, 'a origem não pode ser alterada');
  for (const idioma of ['pt', 'en', 'es']) {
    const antes = entrada.idiomas[idioma], depois = saida.idiomas[idioma], a = antes.calls[0], b = depois.calls[0], t = textosPublicacaoEV[idioma];
    assert.doesNotMatch(JSON.stringify(b), /eletrificacaoja\.com\.br|cartilha|\bguide\b|\bguía\b/i);
    assert.deepEqual(b.banca, []);
    assert.equal(b.bancaDescricao, t.banca);
    assert.deepEqual(b.arquivoEdital, { idioma: 'pt', arquivo: `/arquivos/${sha}/edital-carros-eletricos-brasil.pdf`, paginas: 8 });
    assert.deepEqual(b.apresentacao, ['Objetivo original', t.divulgacao]);
    assert.deepEqual(b.escopo, ['Público original', t.divulgacao]);
    assert.deepEqual(b.secoesComplementares[0].paragrafos, ['Contexto original', t.divulgacao, t.materiais]);
    assert.deepEqual(b.secoesComplementares[0].itens, a.secoesComplementares[0].itens);
    assert.deepEqual(b.secoesComplementares[1].itens, ['Validar conteúdo previamente', t.obrigacao]);
    assert.deepEqual(b.secoesComplementares[2], a.secoesComplementares[2]);
    for (const campo of Object.keys(a).filter(k => !['apresentacao', 'escopo', 'banca', 'bancaDescricao', 'arquivoEdital', 'secoesComplementares'].includes(k))) assert.deepEqual(b[campo], a[campo], `${idioma}/${campo}`);
    assert.deepEqual(depois.calls[1], antes.calls[1]);
    assert.deepEqual(depois.courses, antes.courses);
    assert.deepEqual(depois.articles, antes.articles);
  }
});

test('desativar pré-lançamento sobre a origem fresca restaura textos e mantém banca reservada/PDF aprovado', () => {
  const entrada = fixture();
  const saida = projetarCatalogoEV(entrada, { ...politica, preLancamento: false }, { sha256: sha });
  for (const idioma of ['pt', 'en', 'es']) {
    const a = entrada.idiomas[idioma].calls[0], b = saida.idiomas[idioma].calls[0];
    assert.deepEqual(b.apresentacao, a.apresentacao);
    assert.deepEqual(b.escopo, a.escopo);
    assert.deepEqual(b.secoesComplementares, a.secoesComplementares);
    assert.match(JSON.stringify(b), /eletrificacaoja\.com\.br/);
    assert.deepEqual(b.banca, []);
    assert.equal(b.arquivoEdital.arquivo, `/arquivos/${sha}/edital-carros-eletricos-brasil.pdf`);
  }
});

test('revisão estável e idempotente depende de origem, configuração e conteúdo do PDF', () => {
  const entrada = fixture(), a = projetarCatalogoEV(entrada, politica, { sha256: sha });
  assert.equal(a.revisaoOrigem, entrada.revisao);
  assert.equal(a.revisao, projetarCatalogoEV(entrada, politica, { sha256: sha }).revisao);
  assert.deepEqual(a, projetarCatalogoEV(a, politica, { sha256: sha }));
  assert.notEqual(a.revisao, projetarCatalogoEV(entrada, { ...politica, preLancamento: false }, { sha256: sha }).revisao);
  assert.notEqual(a.revisao, projetarCatalogoEV(entrada, politica, { sha256: 'd'.repeat(64) }).revisao);
  assert.notEqual(a.revisao, projetarCatalogoEV({ ...entrada, revisao: 'e'.repeat(64) }, politica, { sha256: sha }).revisao);
});

test('slug e chamada C01 precisam coincidir; outro conteúdo não recebe a política', () => {
  const entrada = fixture();
  for (const dados of Object.values(entrada.idiomas)) dados.calls[0].chamadaId = 'C99';
  assert.deepEqual(projetarCatalogoEV(entrada, politica, { sha256: sha }), entrada);
});

test('PDF aprovado é copiado antes da sincronização e sua referência corresponde exatamente aos bytes', async () => {
  const fonte = await mkdtemp(join(tmpdir(), 'indica-ev-policy-'));
  try {
    const bytes = Buffer.from('%PDF-1.4\nconteudo de teste\n%%EOF\n'), hash = createHash('sha256').update(bytes).digest('hex');
    await mkdir(join(fonte, 'public', 'editais'), { recursive: true });
    await writeFile(join(fonte, 'public', politica.arquivoPdf), bytes);
    const saida = await aplicarPoliticaPublicacaoEV(fixture(), { fonte, politica });
    const referencia = saida.idiomas.pt.calls[0].arquivoEdital.arquivo;
    assert.equal(referencia, `/arquivos/${hash}/edital-carros-eletricos-brasil.pdf`);
    assert.deepEqual(await readFile(join(fonte, 'public', referencia)), bytes);
    assert.equal(saida.revisao, (await aplicarPoliticaPublicacaoEV(fixture(), { fonte, politica })).revisao);
    await writeFile(join(fonte, 'public', politica.arquivoPdf), 'isto não é PDF');
    await assert.rejects(aplicarPoliticaPublicacaoEV(fixture(), { fonte, politica }), /PDF EV local inválido/);
  } finally { await rm(fonte, { recursive: true, force: true }); }
});

test('política inválida falha antes de alterar conteúdo', () => {
  assert.throws(() => projetarCatalogoEV(fixture(), { ...politica, preLancamento: 'sim' }, { sha256: sha }), /Política/);
  assert.throws(() => projetarCatalogoEV(fixture(), { ...politica, arquivoPdf: '../privado.pdf' }, { sha256: sha }), /Política/);
});
