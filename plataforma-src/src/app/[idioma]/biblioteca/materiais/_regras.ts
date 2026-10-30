/**
 * Regras do acervo: busca, facetas, ordenacao e vizinhanca entre publicacoes.
 *
 * Sem estado e sem React, para que a lista e a pagina de um material usem o
 * mesmo criterio. As opcoes de filtro saem sempre do conteudo publicado: nada
 * aqui conhece um tema, uma organizacao ou um formato pelo nome.
 */
import type { Idioma } from '@/i18n/idiomas';
import type { Article, ArquivoMaterial } from '@/lib/types';

/** Campos que viram filtro. Todos sao texto livre vindo do conteudo. */
export type CampoFacetado = 'trilha' | 'tema' | 'organizacao' | 'formato';

export const CAMPOS_FACETADOS: readonly CampoFacetado[] = [
  'trilha',
  'tema',
  'organizacao',
  'formato',
];

/**
 * Como a estante se organiza. As duas primeiras sao ordens planas; as outras
 * agrupam: uma prateleira por valor do campo, com o mais recente primeiro
 * dentro de cada uma. E o mesmo controle porque, para quem le, "por tema" e
 * "por titulo" sao respostas a mesma pergunta: em que ordem quero ver isto.
 */
export type Ordem = 'atualizacao' | 'titulo' | 'tema' | 'organizacao' | 'formato' | 'ano';

export const ORDENS: readonly Ordem[] = [
  'atualizacao',
  'titulo',
  'tema',
  'organizacao',
  'formato',
  'ano',
];

export function ehOrdem(valor: string): valor is Ordem {
  return (ORDENS as readonly string[]).includes(valor);
}

/** Uma prateleira da estante: o valor que a nomeia e o que ela reune. */
export interface Prateleira {
  chave: string;
  rotulo: string;
  itens: Article[];
}

export type Selecao = Record<CampoFacetado, string>;

export const SELECAO_VAZIA: Selecao = {
  trilha: '',
  tema: '',
  organizacao: '',
  formato: '',
};

/** Uma opcao de filtro, com o total que ela ainda devolve. */
export interface Opcao {
  valor: string;
  rotulo: string;
  total: number;
}

/**
 * Minusculas e sem acento: quem procura "atencao" acha "atenção", e o mesmo
 * vale entre os tres idiomas. Comparacao por texto normalizado, nunca por
 * localeCompare, para que servidor e navegador ordenem igual.
 */
export function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/** Tudo que a busca varre em um material, ja normalizado. */
export function alvoDeBusca(material: Article): string {
  return normalizar(
    [
      material.titulo,
      material.resumo,
      material.organizacao,
      material.tema,
      material.formato,
      ...material.autoria,
      ...material.palavrasChave,
    ].join(' '),
  );
}

/** Termos separados por espaco, todos exigidos. */
export function termosDaBusca(consulta: string): string[] {
  return normalizar(consulta).split(/\s+/).filter(Boolean);
}

export function valorDoCampo(material: Article, campo: CampoFacetado): string {
  return material[campo];
}

/** Valores distintos de um campo, em ordem alfabetica estavel. */
export function valoresDistintos(materiais: Article[], campo: CampoFacetado): string[] {
  const vistos = new Set<string>();
  for (const material of materiais) {
    const valor = valorDoCampo(material, campo);
    if (valor) vistos.add(valor);
  }
  return [...vistos].sort((a, b) => (normalizar(a) < normalizar(b) ? -1 : 1));
}

/**
 * Ordem plana: por titulo quando pedida; senao data mais recente primeiro,
 * empate resolvido pelo titulo. As ordens agrupadas caem na segunda regra,
 * que e a ordem de dentro de cada prateleira.
 */
export function ordenar(materiais: Article[], ordem: Ordem): Article[] {
  const lista = [...materiais];
  lista.sort((a, b) => {
    if (ordem === 'titulo') return normalizar(a.titulo) < normalizar(b.titulo) ? -1 : 1;
    if (a.atualizadoEm !== b.atualizadoEm) return a.atualizadoEm < b.atualizadoEm ? 1 : -1;
    return normalizar(a.titulo) < normalizar(b.titulo) ? -1 : 1;
  });
  return lista;
}

/** O valor que nomeia a prateleira de um material, para uma ordem agrupada. */
function chaveDaPrateleira(material: Article, ordem: Ordem): string {
  if (ordem === 'ano') return /^\d{4}-/.test(material.atualizadoEm) ? material.atualizadoEm.slice(0, 4) : '';
  if (ordem === 'tema' || ordem === 'organizacao' || ordem === 'formato') return material[ordem];
  return '';
}

/**
 * As ordens que valem a pena oferecer para este acervo: as planas sempre; as
 * agrupadas so quando o campo varia, porque agrupar por um campo de valor
 * unico daria uma prateleira so, com tudo, que e a lista plana com um titulo.
 */
export function ordensDisponiveis(materiais: Article[]): Ordem[] {
  return ORDENS.filter((ordem) => {
    if (ordem === 'atualizacao' || ordem === 'titulo') return true;
    const vistos = new Set(materiais.map((material) => chaveDaPrateleira(material, ordem)));
    vistos.delete('');
    return vistos.size > 1;
  });
}

/**
 * A estante em prateleiras. Ordem plana devolve uma prateleira so, sem nome,
 * com tudo; ordem agrupada devolve uma por valor, em ordem alfabetica, exceto
 * o ano, que vem do mais novo para o mais velho. Dentro de cada uma, o mais
 * recente primeiro. Material sem valor no campo (tema vazio, data fora do
 * padrao) vai para uma ultima prateleira sem nome, que a tela mostra sem
 * cabecalho, em vez de sumir da estante.
 */
export function prateleiras(materiais: Article[], ordem: Ordem): Prateleira[] {
  if (ordem === 'atualizacao' || ordem === 'titulo') {
    return [{ chave: '', rotulo: '', itens: ordenar(materiais, ordem) }];
  }
  const porChave = new Map<string, Article[]>();
  for (const material of ordenar(materiais, 'atualizacao')) {
    const chave = chaveDaPrateleira(material, ordem);
    const itens = porChave.get(chave) ?? [];
    itens.push(material);
    porChave.set(chave, itens);
  }
  const chaves = [...porChave.keys()].sort((a, b) => {
    if (!a) return 1;
    if (!b) return -1;
    if (ordem === 'ano') return a < b ? 1 : -1;
    return normalizar(a) < normalizar(b) ? -1 : 1;
  });
  return chaves.map((chave) => ({ chave, rotulo: chave, itens: porChave.get(chave) ?? [] }));
}

/**
 * Marca da organizacao quando ela nao envia logotipo: nome de uma palavra sai
 * inteiro, nome composto vira as iniciais. Nunca repete o titulo do material.
 */
export function siglaOrganizacao(nome: string): string {
  const palavras = nome.trim().split(/\s+/).filter((palavra) => palavra.length > 2);
  if (palavras.length <= 1) return nome.trim().slice(0, 14).toUpperCase();
  return palavras
    .slice(0, 4)
    .map((palavra) => palavra[0])
    .join('')
    .toUpperCase();
}

/**
 * O que ler depois: primeiro o resto da mesma organizacao, depois o mesmo tema
 * e, se nada disso existir, a mesma trilha. Uma publicacao nunca aparece duas
 * vezes na mesma faixa.
 */
export function vizinhanca(
  material: Article,
  todos: Article[],
  limite = 2,
): { organizacao: Article[]; tema: Article[]; trilha: Article[] } {
  const outros = ordenar(
    todos.filter((outro) => outro.slug !== material.slug),
    'atualizacao',
  );

  const organizacao = outros
    .filter((outro) => outro.organizacao === material.organizacao)
    .slice(0, limite);

  const usados = new Set(organizacao.map((outro) => outro.slug));
  const tema = outros
    .filter((outro) => !usados.has(outro.slug) && outro.tema === material.tema)
    .slice(0, limite);

  for (const outro of tema) usados.add(outro.slug);
  const trilha =
    organizacao.length + tema.length > 0
      ? []
      : outros.filter((outro) => outro.trilha === material.trilha).slice(0, limite);

  return { organizacao, tema, trilha };
}

/**
 * Codigo do idioma de um arquivo, lido do fim do nome: "-pt.pdf" devolve "pt".
 *
 * O JSON escreve o idioma por extenso e ja traduzido, o que serve de rotulo mas
 * nao serve de chave. Nome fora do padrao devolve string vazia e nao ordena
 * nada: uma publicacao com um arquivo so nunca depende disto.
 */
export function idiomaDoArquivo(caminho: string): string {
  return /-([a-z]{2})\.[a-z0-9]+$/i.exec(caminho)?.[1]?.toLowerCase() ?? '';
}

/**
 * O arquivo no idioma de quem le vem primeiro; os outros mantem a ordem
 * publicada. E o unico criterio que separa dois PDFs do mesmo texto.
 */
export function ordenarArquivos(
  arquivos: ArquivoMaterial[],
  idioma: Idioma,
): ArquivoMaterial[] {
  return [...arquivos].sort(
    (a, b) =>
      Number(idiomaDoArquivo(b.arquivo) === idioma) -
      Number(idiomaDoArquivo(a.arquivo) === idioma),
  );
}
