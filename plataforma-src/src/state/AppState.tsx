'use client';

/** Cache pessoal de confirmações da API; nunca substitui a gravação no servidor. */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { STORAGE_KEY, LEGACY_STORAGE_KEY } from '@/config/program';
import type { Candidatura, PerfilCadastro, ReciboPublico, StatusCandidatura } from '@/lib/types';
import { enviarCadastro, enviarCandidatura as enviarProposta, enviarInscricaoCurso, consultarRecibo, ErroEnvio } from '@/lib/envio';

interface Estado {
  cadastrado: boolean;
  cadastroConfirmado: boolean;
  nome: string;
  perfil: PerfilCadastro | null;
  candidaturas: Candidatura[];
  cursosInscritos: string[];
  recibos: ReciboPublico[];
}
function estadoInicial(): Estado {
  return { cadastrado: false, cadastroConfirmado: false, nome: '', perfil: null, candidaturas: [], cursosInscritos: [], recibos: [] };
}
export type NovaCandidatura = Omit<Candidatura, 'id' | 'enviadaEm' | 'status' | 'protocolo' | 'reciboToken'>;
interface ContextoApp extends Estado {
  hidratado: boolean;
  cadastrar: (perfil: PerfilCadastro) => Promise<void>;
  enviarCandidatura: (dados: NovaCandidatura, envioId: string) => Promise<Candidatura>;
  inscreverCurso: (slug: string, envioId: string) => Promise<ReciboPublico>;
  atualizarRecibos: (tokenExtra?: string) => Promise<boolean>;
  estaInscrito: (slug: string) => boolean;
  reiniciar: () => void;
}
const Contexto = createContext<ContextoApp | null>(null);

function perfilValido(valor: unknown): valor is PerfilCadastro {
  if (!valor || typeof valor !== 'object') return false;
  const p = valor as PerfilCadastro;
  return ['nome', 'email', 'telefone', 'pais', 'cidade', 'uf'].every((k) => typeof p[k as keyof PerfilCadastro] === 'string') &&
    Array.isArray(p.nichos) && p.nichos.every((n) => typeof n === 'string') &&
    Array.isArray(p.redes) && p.redes.every((r) => r && typeof r.plataforma === 'string' && typeof r.perfil === 'string' && typeof r.seguidores === 'string');
}
function reciboValido(valor: unknown): valor is ReciboPublico {
  if (!valor || typeof valor !== 'object') return false;
  const r = valor as ReciboPublico;
  return (r.protocolo === undefined || typeof r.protocolo === 'string') && ['tipo', 'referencia', 'estado', 'titulo', 'enviadaEm', 'reciboToken'].every((k) => typeof r[k as keyof ReciboPublico] === 'string' && Boolean(r[k as keyof ReciboPublico]));
}
function ler(): Estado | null {
  try {
    const bruto = window.localStorage.getItem(STORAGE_KEY) ?? window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!bruto) return null;
    const registro = JSON.parse(bruto) as Partial<Estado>;
    if (!registro || typeof registro !== 'object') return null;
    const perfil = perfilValido(registro.perfil) ? registro.perfil : null;
    const confirmado = registro.cadastroConfirmado === true && Boolean(perfil);
    // Registros antigos sem confirmação eram apenas simulações locais. O perfil
    // continua disponível como rascunho, mas eles não viram comprovantes recebidos.
    const candidaturas = Array.isArray(registro.candidaturas) ? registro.candidaturas.filter((c): c is Candidatura =>
      Boolean(c) && ['id', 'protocolo', 'reciboToken', 'editalSlug', 'editalTitulo', 'projeto', 'formato', 'enviadaEm', 'status'].every((k) => typeof c[k as keyof Candidatura] === 'string') && Boolean(c.reciboToken) && typeof c.valorSolicitado === 'number' && Number.isFinite(c.valorSolicitado)) : [];
    const recibos = Array.isArray(registro.recibos) ? registro.recibos.filter(reciboValido) : [];
    return {
      cadastrado: confirmado, cadastroConfirmado: confirmado, perfil, nome: perfil?.nome ?? '', candidaturas, recibos,
      cursosInscritos: Array.isArray(registro.cursosInscritos) ? registro.cursosInscritos.filter((slug) => typeof slug === 'string' && recibos.some((r) => r.tipo.includes('curso') && r.referencia === slug)) : [],
    };
  } catch { return null; }
}
function juntarRecibos(atuais: ReciboPublico[], novos: ReciboPublico[]): ReciboPublico[] {
  const mapa = new Map(atuais.map((r) => [r.reciboToken, r]));
  novos.forEach((r) => mapa.set(r.reciboToken, r));
  return [...mapa.values()];
}
function statusDaApi(estado: string, anterior: StatusCandidatura): StatusCandidatura {
  const chave = estado.toLowerCase().replaceAll('_', '-');
  if (['recebida', 'recebido'].includes(chave)) return 'recebida';
  if (chave === 'enviada') return 'enviada';
  if (['em-avaliacao', 'em-analise', 'avaliacao'].includes(chave)) return 'em-avaliacao';
  if (['aprovada', 'aprovado'].includes(chave)) return 'aprovada';
  if (chave === 'selecionada') return 'selecionada';
  if (chave === 'inabilitada') return 'inabilitada';
  if (['nao-selecionada', 'reprovada', 'recusada'].includes(chave)) return 'nao-selecionada';
  return anterior;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [estado, setEstado] = useState<Estado>(estadoInicial);
  const [hidratado, setHidratado] = useState(false);
  const estadoRef = useRef(estado);
  estadoRef.current = estado;
  useEffect(() => {
    const salvo = ler();
    if (salvo) setEstado(salvo);
    setHidratado(true);
  }, []);
  useEffect(() => {
    if (!hidratado) return;
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(estado)); } catch { /* cache opcional */ }
  }, [estado, hidratado]);

  const cadastrar = useCallback(async (perfil: PerfilCadastro) => {
    await enviarCadastro(perfil);
    setEstado((atual) => ({ ...atual, cadastrado: true, cadastroConfirmado: true, nome: perfil.nome.trim(), perfil }));
  }, []);

  const enviarCandidatura = useCallback(async (dados: NovaCandidatura, envioId: string): Promise<Candidatura> => {
    const resposta = await enviarProposta({
      chamadaSlug: dados.editalSlug, chamadaId: dados.chamadaId, envioId,
      proponente: Object.fromEntries(Object.entries(dados.proponente ?? {}).filter((par): par is [string, string] => typeof par[1] === 'string')),
      projeto: { titulo: dados.projeto, formato: dados.formato, descricao: dados.descricao ?? '', justificativa: dados.justificativa ?? '', alcance: dados.alcance ?? '', distribuicao: dados.distribuicao ?? '' },
      valorSolicitado: dados.valorSolicitado,
    });
    const enviadaEm = new Date().toISOString();
    const nova: Candidatura = {
      ...dados, ...resposta, id: `cand-${envioId}`, enviadaEm, status: 'enviada',
      proponente: dados.proponente ? { ...dados.proponente, documento: undefined } : undefined,
    };
    const recibo: ReciboPublico = { tipo: 'candidatura', referencia: dados.editalSlug, protocolo: resposta.protocolo, estado: 'recebida', titulo: dados.editalTitulo, enviadaEm, reciboToken: resposta.reciboToken };
    setEstado((atual) => ({ ...atual,
      candidaturas: [nova, ...atual.candidaturas.filter((c) => c.reciboToken !== resposta.reciboToken)],
      recibos: juntarRecibos(atual.recibos, [recibo]),
    }));
    return nova;
  }, []);

  const inscreverCurso = useCallback(async (slug: string, envioId: string): Promise<ReciboPublico> => {
    const perfil = estadoRef.current.perfil;
    if (!estadoRef.current.cadastroConfirmado || !perfil) throw new ErroEnvio('perfil');
    const resposta = await enviarInscricaoCurso(slug, perfil, envioId);
    const recibo: ReciboPublico = { tipo: 'curso', referencia: slug, estado: 'inscrito', titulo: slug, enviadaEm: new Date().toISOString(), reciboToken: resposta.reciboToken };
    setEstado((atual) => ({ ...atual,
      cursosInscritos: atual.cursosInscritos.includes(slug) ? atual.cursosInscritos : [...atual.cursosInscritos, slug],
      recibos: juntarRecibos(atual.recibos, [recibo]),
    }));
    return recibo;
  }, []);

  const atualizarRecibos = useCallback(async (tokenExtra?: string): Promise<boolean> => {
    const atual = estadoRef.current;
    const tokens = new Set([...atual.recibos.map((r) => r.reciboToken), ...atual.candidaturas.flatMap((c) => c.reciboToken ? [c.reciboToken] : []), ...(tokenExtra ? [tokenExtra] : [])]);
    if (tokens.size === 0) return true;
    const respostas = await Promise.allSettled([...tokens].map(consultarRecibo));
    const recebidos = respostas.flatMap((r) => r.status === 'fulfilled' ? [r.value] : []);
    if (recebidos.length) setEstado((anterior) => ({ ...anterior,
      recibos: juntarRecibos(anterior.recibos, recebidos),
      candidaturas: anterior.candidaturas.map((c) => {
        const recibo = recebidos.find((r) => r.reciboToken === c.reciboToken);
        return recibo ? { ...c, protocolo: recibo.protocolo ?? c.protocolo, status: statusDaApi(recibo.estado, c.status), enviadaEm: recibo.enviadaEm } : c;
      }),
    }));
    return respostas.every((r) => r.status === 'fulfilled');
  }, []);

  const reiniciar = useCallback(() => {
    setEstado(estadoInicial());
    try { window.localStorage.removeItem(STORAGE_KEY); window.localStorage.removeItem(LEGACY_STORAGE_KEY); } catch { /* cache opcional */ }
  }, []);
  const valor = useMemo<ContextoApp>(() => ({ ...estado, hidratado, cadastrar, enviarCandidatura, inscreverCurso, atualizarRecibos,
    estaInscrito: (slug) => estado.cursosInscritos.includes(slug), reiniciar,
  }), [estado, hidratado, cadastrar, enviarCandidatura, inscreverCurso, atualizarRecibos, reiniciar]);
  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}
export function useApp(): ContextoApp {
  const contexto = useContext(Contexto);
  if (!contexto) throw new Error('useApp precisa estar dentro de AppProvider');
  return contexto;
}
