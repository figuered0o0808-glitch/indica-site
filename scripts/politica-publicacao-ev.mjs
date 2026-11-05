/** Política editorial temporária; o catálogo de origem e as inscrições não são alterados. */
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { createHash } from 'node:crypto';

const CONFIG = new URL('./politica-publicacao-ev.json', import.meta.url);
const IDIOMAS = ['pt', 'en', 'es'];
const DOMINIO_CAMPANHA = /(?:https?:\/\/)?(?:www\.)?eletrificacaoja\.com\.br/i;
const NOME_CAMPANHA = /eletrifica[çc][aã]o\s+j[aá]/i;
const SITE = /\b(?:site|website|sitio)\b/i;
const MATERIAL_CAMPANHA = /(?:cartilha|\bgu[ií]a\b|\bguide\b)/i;
const SHA = /^[a-f0-9]{64}$/;

export const textosPublicacaoEV = {
  pt: {
    divulgacao: 'As propostas deverão prever uma ação de divulgação da campanha Eletrificação Já. A INDICA fornecerá os materiais e indicará os canais a serem divulgados durante o alinhamento com os selecionados.',
    materiais: 'Os materiais de referência e os canais de divulgação serão informados pela INDICA durante o alinhamento com os selecionados.',
    obrigacao: 'Executar a ação de divulgação da campanha Eletrificação Já prevista na proposta aprovada, com os materiais e canais indicados pela INDICA durante o alinhamento com os selecionados.',
    banca: 'A avaliação será realizada por uma banca interna da INDICA. Os nomes dos avaliadores não serão divulgados.',
  },
  en: {
    divulgacao: 'Proposals must include an action to promote the Eletrificação Já campaign. INDICA will provide the materials and specify the channels to be promoted during alignment with the selected applicants.',
    materiais: 'INDICA will provide reference materials and information about the channels to be promoted during alignment with the selected applicants.',
    obrigacao: 'Deliver the action to promote the Eletrificação Já campaign described in the approved proposal, using the materials and channels specified by INDICA during alignment with the selected applicants.',
    banca: 'Proposals will be assessed by an internal INDICA panel. The names of the evaluators will not be disclosed.',
  },
  es: {
    divulgacao: 'Las propuestas deberán prever una acción de difusión de la campaña Eletrificação Já. INDICA proporcionará los materiales e indicará los canales que deberán difundirse durante la coordinación con los seleccionados.',
    materiais: 'INDICA proporcionará los materiales de referencia y la información sobre los canales de difusión durante la coordinación con los seleccionados.',
    obrigacao: 'Ejecutar la acción de difusión de la campaña Eletrificação Já prevista en la propuesta aprobada, con los materiales y canales indicados por INDICA durante la coordinación con los seleccionados.',
    banca: 'La evaluación estará a cargo de un jurado interno de INDICA. Los nombres de los evaluadores no se divulgarán.',
  },
};

function validarPolitica(politica) {
  if (!politica || politica.versao !== 1 || politica.slug !== 'carros-eletricos-no-brasil'
      || politica.chamadaId !== 'C01' || typeof politica.preLancamento !== 'boolean'
      || politica.arquivoPdf !== 'editais/carros-eletricos-brasil.pdf' || politica.paginasPdf !== 8) {
    throw new Error('Política de publicação EV inválida');
  }
  return politica;
}

export async function carregarPoliticaPublicacaoEV(arquivo = CONFIG) {
  return validarPolitica(JSON.parse(await readFile(arquivo, 'utf8')));
}

function serializacaoEstavel(valor) {
  if (Array.isArray(valor)) return `[${valor.map(serializacaoEstavel).join(',')}]`;
  if (valor && typeof valor === 'object') {
    return `{${Object.keys(valor).sort().map(chave => `${JSON.stringify(chave)}:${serializacaoEstavel(valor[chave])}`).join(',')}}`;
  }
  return JSON.stringify(valor);
}

function ehChamadaEV(chamada, politica) {
  return chamada?.slug === politica.slug && chamada.chamadaId === politica.chamadaId;
}

function orientarTexto(texto, idioma, obrigacao = false) {
  if (typeof texto !== 'string') return texto;
  const t = textosPublicacaoEV[idioma];
  if (MATERIAL_CAMPANHA.test(texto) && (NOME_CAMPANHA.test(texto) || /campanh[ae]|campaign|campa[ñn]a/i.test(texto))) return t.materiais;
  if (DOMINIO_CAMPANHA.test(texto) || (NOME_CAMPANHA.test(texto) && SITE.test(texto))) return obrigacao ? t.obrigacao : t.divulgacao;
  return texto;
}

/** Projeção pura. Reaplicar o mesmo catálogo, política e PDF produz a mesma revisão. */
export function projetarCatalogoEV(catalogo, politica, pdf) {
  validarPolitica(politica);
  const origem = catalogo.revisaoOrigem ?? catalogo.revisao;
  if (!SHA.test(origem) || !SHA.test(pdf.sha256)) throw new Error('Revisão ou PDF EV inválido');
  const saida = structuredClone(catalogo);
  let encontradas = 0;
  for (const idioma of IDIOMAS) {
    for (const chamada of saida.idiomas[idioma]?.calls ?? []) {
      if (!ehChamadaEV(chamada, politica)) continue;
      encontradas++;
      chamada.banca = [];
      chamada.bancaDescricao = textosPublicacaoEV[idioma].banca;
      chamada.arquivoEdital = {
        ...chamada.arquivoEdital,
        idioma: 'pt',
        arquivo: `/arquivos/${pdf.sha256}/edital-carros-eletricos-brasil.pdf`,
        paginas: politica.paginasPdf,
      };
      if (!politica.preLancamento) continue;
      for (const campo of ['apresentacao', 'escopo']) {
        if (Array.isArray(chamada[campo])) chamada[campo] = chamada[campo].map(texto => orientarTexto(texto, idioma));
      }
      for (const secao of chamada.secoesComplementares ?? []) {
        for (const campo of ['paragrafos', 'itens']) {
          if (Array.isArray(secao[campo])) secao[campo] = secao[campo].map(texto => orientarTexto(texto, idioma, secao.id === 'obrigacoes'));
        }
      }
      // Não publicar uma referência nova que a política ainda não saiba tratar.
      if (DOMINIO_CAMPANHA.test(JSON.stringify(chamada))) throw new Error(`Referência de pré-lançamento não tratada: ${idioma}`);
    }
  }
  if (!encontradas) return saida;
  saida.revisaoOrigem = origem;
  saida.revisao = createHash('sha256').update(serializacaoEstavel({
    revisaoOrigem: origem,
    politica,
    pdfSha256: pdf.sha256,
  })).digest('hex');
  return saida;
}

/** O PDF aprovado fica disponível localmente antes de o sincronizador percorrer os arquivos. */
export async function aplicarPoliticaPublicacaoEV(catalogo, { fonte, politica } = {}) {
  politica ??= await carregarPoliticaPublicacaoEV();
  validarPolitica(politica);
  const chamadas = IDIOMAS.flatMap(idioma => catalogo.idiomas[idioma]?.calls ?? []);
  if (!chamadas.some(chamada => ehChamadaEV(chamada, politica))) return structuredClone(catalogo);
  if (!fonte) throw new Error('Diretório da plataforma não informado');
  const bytes = await readFile(join(fonte, 'public', politica.arquivoPdf));
  if (bytes.subarray(0, 5).toString() !== '%PDF-' || bytes.length > 20 * 1024 * 1024) throw new Error('PDF EV local inválido');
  const sha256 = createHash('sha256').update(bytes).digest('hex');
  const saida = projetarCatalogoEV(catalogo, politica, { sha256 });
  const destino = join(fonte, 'public', 'arquivos', sha256, 'edital-carros-eletricos-brasil.pdf');
  await mkdir(dirname(destino), { recursive: true });
  await writeFile(destino, bytes);
  return saida;
}
