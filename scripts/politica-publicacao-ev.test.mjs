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
const calendarios = {
  pt: ['Inscrições e envio de propostas', 'Prazo final da triagem e avaliação de propostas pela banca', 'Divulgação do resultado preliminar', 'Interposição de recursos (48 horas após a divulgação)', 'Prazo final de confirmação dos selecionados; contratação após a confirmação', 'Prazo final de execução, validação e publicação dos conteúdos', 'Prazo final de entrega do relatório consolidado de resultados'],
  en: ['Applications and submission of proposals', 'Deadline for screening and evaluation of proposals by the committee', 'Publication of preliminary results', 'Submission of appeals (48 hours after publication)', 'Deadline for selected applicants to confirm; contracting after confirmation', 'Deadline for execution, validation and publication of content', 'Deadline for delivery of the consolidated results report'],
  es: ['Inscripciones y envío de propuestas', 'Plazo final de revisión inicial y evaluación de propuestas por la comisión', 'Publicación del resultado preliminar', 'Presentación de recursos (48 horas después de la publicación)', 'Plazo final de confirmación de los seleccionados; contratación después de la confirmación', 'Plazo final de ejecución, validación y publicación de los contenidos', 'Plazo final de entrega del informe consolidado de resultados'],
};
const regrasRecursos = {
  pt: ['Caberá recurso quanto ao resultado preliminar em até 48 horas.', 'Os casos omissos serão resolvidos pela comissão organizadora da INDICA.'],
  en: ['Preliminary results may be appealed within 48 hours of publication.', 'Matters not covered will be resolved by INDICA.'],
  es: ['El resultado preliminar admite recursos dentro de las 48 horas posteriores.', 'Los casos no previstos serán resueltos por INDICA.'],
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
        cronograma: calendarios[idioma].map((etapa, i) => ({ etapa,
          data: ['2026-11-04', '2026-11-18', '2026-11-18', '2026-11-18', '2026-11-20', '2026-12-23', '2026-12-28'][i],
          ...(i === 0 ? { dataFim: '2026-11-13' } : i === 3 ? { dataFim: '2026-11-20' } : {}),
        })),
        criterios: [{ titulo: 'Nota da proposta', descricao: '0 a 10' }],
        resultado: { publicacao: 'preservar' }, distribuicao: [{ quantidade: '5–15' }],
        apresentacao: ['Objetivo original', divulgacao], escopo: ['Público original', divulgacao],
        banca: [{ nome: 'Avaliador reservado' }], bancaDescricao: 'Banca anterior',
        arquivoEdital: { idioma: 'pt', arquivo: `/arquivos/${'c'.repeat(64)}/edital-carros-eletricos-brasil.pdf`, paginas: 8 },
        secoesComplementares: [
          { id: 'briefing', titulo: 'Briefing', paragrafos: ['Contexto original', divulgacao, materiais], itens: ['Eixo opcional original'] },
          { id: 'obrigacoes', titulo: 'Obrigações', itens: ['Validar conteúdo previamente', obrigacao] },
          { id: 'outro', titulo: 'Outra regra', itens: ['Regra preservada'] },
          { id: 'recursos', titulo: 'Recursos e disposições gerais', paragrafos: regrasRecursos[idioma] },
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
    for (const campo of Object.keys(a).filter(k => !['apresentacao', 'escopo', 'banca', 'bancaDescricao', 'arquivoEdital', 'secoesComplementares', 'inscricoesAte', 'cronograma'].includes(k))) assert.deepEqual(b[campo], a[campo], `${idioma}/${campo}`);
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
    assert.deepEqual(b.secoesComplementares.slice(0, 3), a.secoesComplementares.slice(0, 3));
    assert.match(JSON.stringify(b), /eletrificacaoja\.com\.br/);
    assert.deepEqual(b.banca, []);
    assert.equal(b.arquivoEdital.arquivo, `/arquivos/${sha}/edital-carros-eletricos-brasil.pdf`);
  }
});

test('inscrições até15/11, avaliação/resultado19/11 e ausência de recursos em todos os idiomas', () => {
  const entrada = fixture(), original = structuredClone(entrada);
  const saida = projetarCatalogoEV(entrada, politica, { sha256: sha });
  for (const idioma of ['pt', 'en', 'es']) {
    const a = entrada.idiomas[idioma].calls[0], b = saida.idiomas[idioma].calls[0];
    assert.equal(b.inscricoesAte, '2026-11-15');
    assert.equal(b.cronograma.length, 6);
    assert.deepEqual(b.cronograma[0], { ...a.cronograma[0], dataFim: '2026-11-15' });
    assert.deepEqual(b.cronograma[1], { ...a.cronograma[1], data: '2026-11-19' });
    assert.deepEqual(b.cronograma[2], { etapa: textosPublicacaoEV[idioma].resultado, data: '2026-11-19' });
    assert.deepEqual(b.cronograma.slice(3), a.cronograma.slice(4), 'confirmar20/11, executar23/12 e relatório28/12 preservados');
    assert.doesNotMatch(JSON.stringify(b), /preliminar|preliminary|48\s*(?:horas|hours|h)|appeal|interposi|presentación de recursos/i);
    const disposicoes = b.secoesComplementares.find(secao => secao.id === 'disposicoes-gerais');
    assert.equal(disposicoes.titulo, textosPublicacaoEV[idioma].disposicoesGerais);
    assert.deepEqual(disposicoes.paragrafos, [regrasRecursos[idioma][1]], 'casos omissos preservados');
    assert.deepEqual(b.resultado, a.resultado);
  }
  assert.deepEqual(entrada, original);
  assert.deepEqual(saida, projetarCatalogoEV(saida, politica, { sha256: sha }));
  assert.notEqual(saida.revisao, projetarCatalogoEV(entrada, { ...politica, calendario: { ...politica.calendario, inscricoesAte: '2026-11-16' } }, { sha256: sha }).revisao);
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
