'use client';

/**
 * Estado local da pessoa que navega: cadastro, candidaturas enviadas e
 * inscricoes em curso. Nao ha divisao de papel: quem entra e sempre a mesma
 * pessoa, e o cadastro apenas desbloqueia a area de acompanhamento.
 *
 * Persiste em localStorage quando disponivel. Nada quebra sem ele: o estado
 * inicial vem sempre do conteudo publicado, e todo acesso ao storage e protegido.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { STORAGE_KEY, LEGACY_STORAGE_KEY } from '@/config/program';
import { proximoId } from '@/lib/format';
import type { Candidatura, PerfilCadastro } from '@/lib/types';
import {
  enviarCadastro as enviarCadastroParaIndica,
  enviarCandidatura as enviarCandidaturaParaIndica,
  protocoloDaResposta,
} from '@/lib/envio';

interface Estado {
  cadastrado: boolean;
  nome: string;
  perfil: PerfilCadastro | null;
  candidaturas: Candidatura[];
  cursosInscritos: string[];
}

function estadoInicial(): Estado {
  return {
    cadastrado: false,
    nome: '',
    perfil: null,
    candidaturas: [],
    cursosInscritos: [],
  };
}

/** Tudo que o formulario colheu: vai inteiro para a INDICA e fica no navegador para o comprovante. */
export type NovaCandidatura = Omit<Candidatura, 'id' | 'enviadaEm' | 'status' | 'protocolo'>;

interface ContextoApp extends Estado {
  hidratado: boolean;
  cadastrar: (perfil: PerfilCadastro) => void;
  enviarCandidatura: (dados: NovaCandidatura) => Candidatura;
  inscreverCurso: (slug: string) => void;
  estaInscrito: (slug: string) => boolean;
  reiniciar: () => void;
}

const Contexto = createContext<ContextoApp | null>(null);

/** Dia da acao no calendario local de quem esta usando o navegador. */
function dataDaAcao(): string {
  const agora = new Date();
  const mes = String(agora.getMonth() + 1).padStart(2, '0');
  const dia = String(agora.getDate()).padStart(2, '0');
  return `${agora.getFullYear()}-${mes}-${dia}`;
}

/*
 * O que vem do localStorage e texto que qualquer um pode ter editado. Cada
 * campo so entra se tiver o tipo esperado; o resto e descartado, e o painel
 * nunca quebra por um valor fora do lugar.
 */
function ler(): Partial<Estado> | null {
  if (typeof window === 'undefined') return null;
  try {
    const bruto = window.localStorage.getItem(STORAGE_KEY) ?? window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!bruto) return null;
    const salvo: unknown = JSON.parse(bruto);
    if (!salvo || typeof salvo !== 'object') return null;
    const registro = salvo as Record<string, unknown>;
    const estado: Partial<Estado> = {};
    if (typeof registro.cadastrado === 'boolean') estado.cadastrado = registro.cadastrado;
    if (typeof registro.nome === 'string') estado.nome = registro.nome;
    if (registro.perfil && typeof registro.perfil === 'object') estado.perfil = registro.perfil as PerfilCadastro;
    if (Array.isArray(registro.candidaturas)) {
      estado.candidaturas = registro.candidaturas.filter(
        (item): item is Candidatura =>
          Boolean(item) && typeof item === 'object' && typeof (item as Candidatura).id === 'string',
      );
    }
    if (Array.isArray(registro.cursosInscritos)) {
      estado.cursosInscritos = registro.cursosInscritos.filter((item): item is string => typeof item === 'string');
    }
    return estado;
  } catch {
    return null;
  }
}

function gravar(estado: Estado): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(estado));
  } catch {
    /* modo privado ou storage cheio: a navegacao segue em memoria */
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [estado, setEstado] = useState<Estado>(estadoInicial);
  const [hidratado, setHidratado] = useState(false);

  useEffect(() => {
    const salvo = ler();
    if (salvo) setEstado((atual) => ({ ...atual, ...salvo }));
    setHidratado(true);
  }, []);

  useEffect(() => {
    if (hidratado) gravar(estado);
  }, [estado, hidratado]);

  const cadastrar = useCallback((perfil: PerfilCadastro) => {
    setEstado((atual) => ({
      ...atual,
      cadastrado: true,
      nome: perfil.nome.trim(),
      perfil,
    }));

    /*
     * Sai daqui para a INDICA quando ha destino configurado (ver src/lib/envio.ts).
     * Sem destino, nao ha requisicao nenhuma, e e esse o estado de hoje.
     * O envio nao e esperado de proposito: a confirmacao na tela responde ao que
     * a pessoa fez, e nao ao que a rede conseguiu fazer.
     */
    void enviarCadastroParaIndica(perfil);
  }, []);

  const enviarCandidatura = useCallback(
    (dados: NovaCandidatura): Candidatura => {
      /* O documento (CPF/CNPJ) vai so para a API: nao fica guardado no navegador. */
      const nova: Candidatura = {
        ...dados,
        proponente: dados.proponente ? { ...dados.proponente, documento: undefined } : undefined,
        id: proximoId('cand', estado.candidaturas),
        enviadaEm: dataDaAcao(),
        status: 'enviada',
      };
      setEstado((atual) => ({
        ...atual,
        cadastrado: true,
        candidaturas: [nova, ...atual.candidaturas],
      }));

      /*
       * Mesmo desenho do cadastro: nao espera e nao bloqueia a confirmacao.
       * Quando a API responde com protocolo, ele entra na candidatura depois,
       * e o comprovante que ainda estiver na tela passa a mostra-lo.
       */
      void enviarCandidaturaParaIndica({
        chamadaSlug: dados.editalSlug,
        proponente: Object.fromEntries(
          Object.entries(dados.proponente ?? {}).filter((par): par is [string, string] => typeof par[1] === 'string'),
        ),
        projeto: {
          titulo: dados.projeto,
          formato: dados.formato,
          descricao: dados.descricao ?? '',
          justificativa: dados.justificativa ?? '',
          alcance: dados.alcance ?? '',
          distribuicao: dados.distribuicao ?? '',
        },
        valorSolicitado: dados.valorSolicitado,
      }).then((resultado) => {
        const protocolo = protocoloDaResposta(resultado);
        if (!protocolo) return;
        setEstado((atual) => ({
          ...atual,
          candidaturas: atual.candidaturas.map((item) =>
            item.id === nova.id ? { ...item, protocolo } : item,
          ),
        }));
      });

      return nova;
    },
    [estado.candidaturas],
  );

  const inscreverCurso = useCallback((slug: string) => {
    setEstado((atual) =>
      atual.cursosInscritos.includes(slug)
        ? atual
        : { ...atual, cadastrado: true, cursosInscritos: [...atual.cursosInscritos, slug] },
    );
  }, []);

  const reiniciar = useCallback(() => {
    setEstado(estadoInicial());
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {
        /* sem storage, nada a limpar */
      }
    }
  }, []);

  const valor = useMemo<ContextoApp>(
    () => ({
      ...estado,
      hidratado,
      cadastrar,
      enviarCandidatura,
      inscreverCurso,
      estaInscrito: (slug: string) => estado.cursosInscritos.includes(slug),
      reiniciar,
    }),
    [estado, hidratado, cadastrar, enviarCandidatura, inscreverCurso, reiniciar],
  );

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useApp(): ContextoApp {
  const contexto = useContext(Contexto);
  if (!contexto) throw new Error('useApp precisa estar dentro de AppProvider');
  return contexto;
}
