/** Canal público da INDICA. Só a confirmação do servidor autoriza um sucesso. */
import { normalizarTelefone } from '@/lib/telefone';
import type { PerfilCadastro, ReciboPublico } from '@/lib/types';

const DESTINO = (process.env.NEXT_PUBLIC_INDICA_API || process.env.NEXT_PUBLIC_TILT_API || '').replace(/\/+$/, '');
const LIMITE_MS = 30000;

export type MotivoEnvio = 'indisponivel' | 'rede' | 'recusado' | 'resposta' | 'perfil';
export class ErroEnvio extends Error {
  constructor(public motivo: MotivoEnvio) { super(motivo); this.name = 'ErroEnvio'; }
}
export function motivoDoErro(erro: unknown): MotivoEnvio {
  return erro instanceof ErroEnvio ? erro.motivo : 'rede';
}
export function canalAberto(): boolean { return DESTINO.length > 0; }

/** Mantido pelo formulário até receber confirmação, inclusive após timeout. */
export function novoEnvioId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 15) | 64;
  bytes[8] = (bytes[8] & 63) | 128;
  const h = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

async function requisitar(caminho: string, corpo?: unknown): Promise<Record<string, unknown>> {
  if (!canalAberto()) throw new ErroEnvio('indisponivel');
  const controle = new AbortController();
  const relogio = setTimeout(() => controle.abort(), LIMITE_MS);
  try {
    const resposta = await fetch(`${DESTINO}${caminho}`, {
      method: corpo === undefined ? 'GET' : 'POST',
      ...(corpo === undefined ? {} : { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(corpo) }),
      signal: controle.signal, cache: 'no-store', referrerPolicy: 'no-referrer',
    });
    if (!resposta.ok) throw new ErroEnvio('recusado');
    const json: unknown = await resposta.json().catch(() => null);
    if (!json || typeof json !== 'object' || Array.isArray(json)) throw new ErroEnvio('resposta');
    return json as Record<string, unknown>;
  } catch (erro) {
    if (erro instanceof ErroEnvio) throw erro;
    throw new ErroEnvio('rede');
  } finally { clearTimeout(relogio); }
}
function texto(valor: unknown): string { return typeof valor === 'string' ? valor.trim() : ''; }
function identificador(valor: unknown): string {
  return typeof valor === 'number' && Number.isFinite(valor) ? String(valor) : texto(valor);
}
export function perfilParaEnvio(perfil: PerfilCadastro) {
  return {
    nome: perfil.nome.trim(), email: perfil.email.trim().toLowerCase(),
    telefone: normalizarTelefone(perfil.telefone, perfil.pais), pais: perfil.pais,
    cidade: perfil.cidade.trim(), uf: perfil.uf.trim(), nichos: perfil.nichos,
    redes: perfil.redes.filter((rede) => rede.plataforma && rede.perfil).map((rede) => ({
      plataforma: rede.plataforma, perfil: rede.perfil.trim(),
      seguidores: Number.parseInt(rede.seguidores.replace(/\D/g, ''), 10) || 0,
    })),
  };
}
export async function enviarCadastro(perfil: PerfilCadastro): Promise<void> {
  const resposta = await requisitar('/tilt/publico/cadastro', { ...perfilParaEnvio(perfil), origem: 'site' });
  if (resposta.ok !== true) throw new ErroEnvio('resposta');
}
export async function enviarCandidatura(dados: {
  chamadaSlug: string; chamadaId?: string; envioId: string;
  proponente: Record<string, string>; projeto: Record<string, string | number>; valorSolicitado: number;
}): Promise<{ protocolo: string; chamadaId: string; reciboToken: string }> {
  const resposta = await requisitar('/tilt/publico/candidatura', dados);
  const protocolo = texto(resposta.protocolo), chamadaId = identificador(resposta.chamadaId), reciboToken = texto(resposta.reciboToken);
  if (!protocolo || !chamadaId || !reciboToken) throw new ErroEnvio('resposta');
  return { protocolo, chamadaId, reciboToken };
}
export async function enviarInscricaoCurso(cursoSlug: string, perfil: PerfilCadastro, envioId: string) {
  const resposta = await requisitar('/tilt/publico/curso-inscricao', { cursoSlug, perfil: perfilParaEnvio(perfil), envioId });
  const reciboToken = texto(resposta.reciboToken);
  if (resposta.ok !== true || !reciboToken || resposta.cursoSlug !== cursoSlug) throw new ErroEnvio('resposta');
  return { reciboToken, cursoSlug };
}
export async function consultarRecibo(reciboToken: string): Promise<ReciboPublico> {
  const resposta = await requisitar(`/tilt/publico/recibos/${encodeURIComponent(reciboToken)}`);
  const tipo = texto(resposta.tipo), referencia = identificador(resposta.referencia), estado = texto(resposta.estado);
  const titulo = texto(resposta.titulo), enviadaEm = texto(resposta.enviadaEm);
  if (!tipo || !referencia || !estado || !titulo || !enviadaEm) throw new ErroEnvio('resposta');
  return { tipo, referencia, estado, titulo, enviadaEm, protocolo: texto(resposta.protocolo) || undefined, reciboToken };
}
