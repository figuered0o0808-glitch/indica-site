/**
 * Acesso tipado ao conteudo publicado, lido dos arquivos JSON em /data.
 * Ha uma pasta por idioma: o conteudo pode ser publicado em um idioma e nao
 * em outro, e cada idioma mostra apenas o que existe nele.
 * Nenhuma chamada de rede: o site inteiro e estatico.
 */
import 'server-only';

import type { Article, Call, Course } from '@/lib/types';
import type { Idioma } from '@/i18n/idiomas';

import ptCalls from '@data/pt/calls.json';
import ptCourses from '@data/pt/courses.json';
import ptArticles from '@data/pt/articles.json';

import enCalls from '@data/en/calls.json';
import enCourses from '@data/en/courses.json';
import enArticles from '@data/en/articles.json';

import esCalls from '@data/es/calls.json';
import esCourses from '@data/es/courses.json';
import esArticles from '@data/es/articles.json';

interface Conteudo {
  editais: Call[];
  cursos: Course[];
  materiais: Article[];
}

/*
 * O JSON entra convertido as cegas, e o TypeScript nao confere arquivo de
 * dados. O que se confere aqui e o pouco que, errado, some da tela sem erro
 * nenhum: as chaves que toda pagina le e os valores fechados (status, tipo,
 * trilha, publico). Um deslize derruba o build, que e onde ele deve cair, e
 * nao a coluna rosa da home num sabado.
 *
 * Este modulo e de servidor: nenhum componente de cliente deve importa-lo,
 * senao os tres idiomas de conteudo entram no bundle de toda pagina.
 */
const STATUS_CHAMADA = ['aberta', 'em-avaliacao', 'encerrada', 'consulta'];
const TIPOS_CHAMADA = ['tema-amplo', 'macrotema', 'pauta-especifica', 'edital-organizacao'];
const PUBLICOS = ['criadores', 'organizacoes', 'ambos'];
const TRILHAS = ['criadores', 'organizacoes'];
const STATUS_CURSO = ['aberto', 'em-breve'];

function exigir(condicao: boolean, onde: string, mensagem: string): void {
  if (!condicao) throw new Error(`conteudo invalido em ${onde}: ${mensagem}`);
}

function conferirLista(
  idioma: Idioma,
  nome: string,
  itens: unknown,
  chaves: string[],
  fechados: Record<string, string[]>,
): void {
  exigir(Array.isArray(itens), `${idioma}/${nome}`, 'esperava uma lista');
  for (const item of itens as Record<string, unknown>[]) {
    const onde = `${idioma}/${nome}/${String(item.slug ?? '?')}`;
    for (const chave of chaves) exigir(chave in item, onde, `falta a chave ${chave}`);
    for (const [chave, valores] of Object.entries(fechados)) {
      const valor = item[chave];
      if (valor === undefined) continue;
      exigir(valores.includes(String(valor)), onde, `${chave} = ${String(valor)} nao e um de ${valores.join(', ')}`);
    }
  }
}

function conferir(idioma: Idioma, bruto: { calls: unknown; courses: unknown; articles: unknown }): Conteudo {
  conferirLista(
    idioma,
    'calls',
    bruto.calls,
    ['slug', 'titulo', 'status', 'tipo', 'resumo', 'valorTotal', 'faixaApoio', 'inscricoesAte', 'cronograma', 'distribuicao'],
    { status: STATUS_CHAMADA, tipo: TIPOS_CHAMADA, publico: PUBLICOS },
  );
  for (const chamada of bruto.calls as Record<string, unknown>[]) {
    const onde = `${idioma}/calls/${String(chamada.slug)}`;
    if (chamada.valorTotalAte !== undefined) exigir(typeof chamada.valorTotalAte === 'boolean', onde, 'valorTotalAte deve ser booleano');
    for (const campo of ['criteriosDescricao', 'bancaDescricao']) {
      if (chamada[campo] !== undefined) exigir(typeof chamada[campo] === 'string', onde, `${campo} deve ser texto`);
    }
    if (chamada.arquivoEdital !== undefined) {
      const arquivo = chamada.arquivoEdital as Record<string, unknown> | null;
      exigir(Boolean(arquivo) && typeof arquivo === 'object', onde, 'arquivoEdital deve ser um objeto');
      exigir(typeof arquivo?.arquivo === 'string' && arquivo.arquivo.startsWith('/') && arquivo.arquivo.endsWith('.pdf'), onde, 'arquivoEdital deve apontar para um PDF local');
      exigir(typeof arquivo?.idioma === 'string' && arquivo.idioma.trim().length > 0, onde, 'arquivoEdital deve declarar o idioma');
      if (arquivo?.paginas !== undefined) exigir(typeof arquivo.paginas === 'number' && Number.isInteger(arquivo.paginas) && arquivo.paginas > 0, onde, 'paginas deve ser um inteiro positivo');
    }
    if (chamada.secoesComplementares !== undefined) {
      exigir(Array.isArray(chamada.secoesComplementares), onde, 'secoesComplementares deve ser uma lista');
      const ids = new Set(['apresentacao', 'escopo', 'nao-apoiado', 'criterios', 'cronograma', 'banca', 'distribuicao', 'resultado']);
      for (const secao of chamada.secoesComplementares as Record<string, unknown>[]) {
        exigir(typeof secao.id === 'string' && /^[a-z][a-z0-9-]*$/.test(secao.id) && !ids.has(secao.id), onde, 'seção complementar precisa de id único');
        ids.add(String(secao.id));
        exigir(typeof secao.titulo === 'string' && secao.titulo.trim().length > 0, onde, 'seção complementar precisa de título');
        for (const campo of ['paragrafos', 'itens']) {
          if (secao[campo] !== undefined) exigir(Array.isArray(secao[campo]) && (secao[campo] as unknown[]).every((item) => typeof item === 'string'), onde, `${campo} deve ser uma lista de textos`);
        }
      }
    }
    for (const etapa of chamada.cronograma as Record<string, unknown>[]) {
      if (etapa.dataFim !== undefined) exigir(typeof etapa.dataFim === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(etapa.dataFim) && etapa.dataFim >= String(etapa.data), onde, 'dataFim deve ser uma data ISO posterior ou igual ao início');
    }
  }
  conferirLista(idioma, 'courses', bruto.courses, ['slug', 'titulo', 'status', 'resumo', 'modulos', 'proximaTurma'], {
    status: STATUS_CURSO,
  });
  conferirLista(
    idioma,
    'articles',
    bruto.articles,
    ['slug', 'titulo', 'trilha', 'autoria', 'organizacao', 'tema', 'formato', 'atualizadoEm', 'secoes'],
    { trilha: TRILHAS },
  );
  return {
    editais: bruto.calls as Call[],
    cursos: bruto.courses as Course[],
    materiais: bruto.articles as Article[],
  };
}

const CONTEUDO: Record<Idioma, Conteudo> = {
  pt: conferir('pt', { calls: ptCalls, courses: ptCourses, articles: ptArticles }),
  en: conferir('en', { calls: enCalls, courses: enCourses, articles: enArticles }),
  es: conferir('es', { calls: esCalls, courses: esCourses, articles: esArticles }),
};

export function conteudo(idioma: Idioma): Conteudo {
  return CONTEUDO[idioma];
}

export function editalPorSlug(idioma: Idioma, slug: string): Call | undefined {
  return conteudo(idioma).editais.find((e) => e.slug === slug);
}

export function cursoPorSlug(idioma: Idioma, slug: string): Course | undefined {
  return conteudo(idioma).cursos.find((c) => c.slug === slug);
}

export function materialPorSlug(idioma: Idioma, slug: string): Article | undefined {
  return conteudo(idioma).materiais.find((m) => m.slug === slug);
}

/** A conta pessoal pode ser criada em qualquer época. */
export function cadastroAberto(_idioma: Idioma): boolean { return true; }

/** As chamadas que aceitam inscricao agora. */
export function chamadasAbertas(idioma: Idioma): Call[] {
  return conteudo(idioma).editais.filter((edital) => !edital.simulacao && edital.status === 'aberta');
}
