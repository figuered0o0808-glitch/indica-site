/**
 * Envio do que o site publico coleta para o sistema da INDICA.
 *
 * O site e estatico e nao tem servidor proprio. Hoje o cadastro e a candidatura
 * ficam so no navegador de quem preencheu, o que significa que se perdem quando
 * a pessoa troca de aparelho. Este arquivo e o unico ponto por onde eles saem
 * daqui.
 *
 * DESLIGADO POR PADRAO. Sem NEXT_PUBLIC_INDICA_API definido, `enviar` nao faz
 * requisicao nenhuma e devolve `{ enviado: false, motivo: 'sem-destino' }`. E
 * de proposito: o site esta no ar, a API ainda nao existe, e um site publicado
 * nao pode passar a bater num endereco inexistente a cada formulario enviado.
 * No dia da integracao, define-se a variavel e o canal abre, sem tocar em tela
 * nenhuma.
 *
 * O ENVIO NUNCA BLOQUEIA A PESSOA. Quem preencheu o formulario ve a confirmacao
 * de qualquer jeito, e o estado local e gravado do mesmo jeito. Falha de rede,
 * API fora do ar ou destino errado sao problema de quem opera, nao de quem se
 * candidatou: perder o que a pessoa digitou por causa de um 500 seria pior do
 * que nao ter canal nenhum. Por isso `enviar` nunca lanca excecao.
 *
 * Ver docs/BRIEFING_INDICA.md, secao 7, no repositorio da operacao: os dois
 * destinos abaixo sao rotas SEM CONTA, e portanto a superficie mais exposta do
 * modulo. Do lado da API elas precisam de limite de taxa e de validacao propria.
 * Nada do que sai daqui pode ser tratado como confiavel na chegada.
 */

import { normalizarTelefone } from '@/lib/telefone';

/** Endereco da API da INDICA, sem barra no fim. Vazio desliga o canal. */
const DESTINO = (process.env.NEXT_PUBLIC_INDICA_API || process.env.NEXT_PUBLIC_TILT_API || '').replace(/\/+$/, '');

/** Quanto tempo esperar antes de desistir. Formulario nao pode ficar pendurado. */
const LIMITE_MS = 8000;

export type ResultadoDoEnvio =
  | { enviado: true; resposta?: unknown }
  | { enviado: false; motivo: 'sem-destino' | 'rede' | 'recusado'; detalhe?: string };

/** Verdadeiro quando existe destino configurado. */
export function canalAberto(): boolean {
  return DESTINO.length > 0;
}

/**
 * Manda um pacote para a API e responde se foi.
 *
 * `keepalive` importa: a candidatura e enviada no mesmo instante em que a tela
 * de confirmacao aparece, e sem ele o navegador pode cancelar a requisicao no
 * meio se a pessoa clicar em outra coisa em seguida.
 */
async function enviar(caminho: string, corpo: unknown): Promise<ResultadoDoEnvio> {
  if (!canalAberto()) return { enviado: false, motivo: 'sem-destino' };

  const controle = new AbortController();
  const relogio = setTimeout(() => controle.abort(), LIMITE_MS);

  try {
    const resposta = await fetch(`${DESTINO}${caminho}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(corpo),
      signal: controle.signal,
      keepalive: true,
    });

    if (!resposta.ok) {
      return { enviado: false, motivo: 'recusado', detalhe: String(resposta.status) };
    }
    /* A resposta e opcional: a API pode responder vazio, e o protocolo vem nela quando vem. */
    const devolvido: unknown = await resposta.json().catch(() => undefined);
    return { enviado: true, resposta: devolvido };
  } catch (erro) {
    /* Aborto por tempo cai aqui junto com falha de rede, e o efeito e o mesmo. */
    return { enviado: false, motivo: 'rede', detalhe: erro instanceof Error ? erro.name : undefined };
  } finally {
    clearTimeout(relogio);
  }
}

/**
 * Cadastro de criador.
 *
 * Vira uma linha em `candidato`, com `influenciador_id` nulo ate alguem da
 * equipe reconhecer a pessoa na base da INDICA. `pais` sai daqui como codigo ISO
 * de dois digitos, ja normalizado (ver src/lib/paises.ts): e o que permite
 * agrupar por pais do outro lado sem depender do idioma de quem preencheu.
 */
export function enviarCadastro(perfil: {
  nome: string;
  email: string;
  telefone: string;
  pais: string;
  cidade: string;
  uf: string;
  nichos: string[];
  redes: { plataforma: string; perfil: string; seguidores: string }[];
}): Promise<ResultadoDoEnvio> {
  return enviar('/tilt/publico/cadastro', {
    nome: perfil.nome.trim(),
    email: perfil.email.trim().toLowerCase(),
    telefone: normalizarTelefone(perfil.telefone, perfil.pais),
    pais: perfil.pais,
    cidade: perfil.cidade.trim(),
    uf: perfil.uf.trim(),
    nichos: perfil.nichos,
    redes: perfil.redes
      .filter((rede) => rede.plataforma && rede.perfil)
      .map((rede) => ({
        plataforma: rede.plataforma,
        perfil: rede.perfil.trim(),
        /* Seguidores vem do formulario como texto; numero invalido vira zero em
         * vez de NaN, que atravessaria o JSON como null e sujaria a base. */
        seguidores: Number.parseInt(rede.seguidores.replace(/\D/g, ''), 10) || 0,
      })),
    origem: 'site',
  });
}

/**
 * Candidatura a uma chamada.
 *
 * Vira uma linha em `proposta`, no estado 'recebida'. O protocolo NAO e
 * gerado aqui: quem numera e o servidor, senao dois navegadores offline geram o
 * mesmo numero e a chamada passa a ter dois C01-003.
 */
export function enviarCandidatura(dados: {
  chamadaSlug: string;
  proponente: Record<string, string>;
  projeto: Record<string, string | number>;
  valorSolicitado: number;
}): Promise<ResultadoDoEnvio> {
  return enviar('/tilt/publico/candidatura', dados);
}

/** O protocolo que a API devolveu, se devolveu algo que se pareca com um. */
export function protocoloDaResposta(resultado: ResultadoDoEnvio): string | undefined {
  if (!resultado.enviado || !resultado.resposta || typeof resultado.resposta !== 'object') return undefined;
  const valor = (resultado.resposta as { protocolo?: unknown }).protocolo;
  return typeof valor === 'string' && valor.trim() ? valor.trim() : undefined;
}
