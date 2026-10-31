'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { STORAGE_KEY, LEGACY_STORAGE_KEY } from '@/config/program';
import type { Candidatura, PerfilCadastro, ReciboPublico, OrganizacaoExecutora, NovaOrganizacao, DadosPagamento, ResumoRascunho, RascunhoProposta, OfertaProposta } from '@/lib/types';
import { cadastrarConta, entrarConta, consultarConta, sairConta, enviarOrganizacao, enviarCandidatura as enviarProposta, enviarInscricaoCurso, consultarRecibo, consultarPagamento, enviarPagamento, ErroEnvio, motivoDoErro, type MotivoEnvio, type ContaRecebida, type EnvioRascunho, consultarRascunho, enviarRascunho, excluirRascunho, atualizarPerfil, consultarOferta, responderOferta } from '@/lib/envio';
const CHAVE_TOKEN = 'indica:conta-pessoal:token:v1';
interface Estado {
    cadastrado: boolean;
    cadastroConfirmado: boolean;
    nome: string;
    perfil: PerfilCadastro | null;
    organizacoes: OrganizacaoExecutora[];
    candidaturas: Candidatura[];
    cursosInscritos: string[];
    recibos: ReciboPublico[];
    rascunhos: ResumoRascunho[];
}
const inicial = (): Estado => ({ cadastrado: false, cadastroConfirmado: false, nome: '', perfil: null, organizacoes: [], candidaturas: [], cursosInscritos: [], recibos: [], rascunhos: [] });
export type NovaCandidatura = Omit<Candidatura, 'id' | 'enviadaEm' | 'status' | 'protocolo' | 'reciboToken'> & {
    organizacaoId: number;
};
interface ContextoApp extends Estado {
    sessaoId: number;
    hidratado: boolean;
    carregandoConta: boolean;
    erroConta?: MotivoEnvio;
    cadastrar: (perfil: PerfilCadastro, senha: string, organizacao?: NovaOrganizacao) => Promise<void>;
    entrar: (email: string, senha: string) => Promise<void>;
    sair: () => Promise<void>;
    atualizarConta: () => Promise<void>;
    salvarPerfil: (perfil: PerfilCadastro) => Promise<void>;
    carregarRascunho: (slug: string) => ReturnType<typeof consultarRascunho>;
    salvarRascunho: (slug: string, dados: EnvioRascunho) => Promise<RascunhoProposta>;
    apagarRascunho: (slug: string, envioId: string, versao: number) => Promise<void>;
    carregarOferta: (protocolo: string) => Promise<OfertaProposta | null>;
    decidirOferta: (protocolo: string, oferta: OfertaProposta, aceitar: boolean) => ReturnType<typeof responderOferta>;
    salvarOrganizacao: (dados: NovaOrganizacao) => Promise<void>;
    enviarCandidatura: (dados: NovaCandidatura, envioId: string) => Promise<Candidatura>;
    inscreverCurso: (slug: string, envioId: string) => Promise<ReciboPublico>;
    atualizarRecibos: (tokenExtra?: string) => Promise<boolean>;
    carregarPagamento: (protocolo: string) => ReturnType<typeof consultarPagamento>;
    gravarPagamento: (protocolo: string, dados: DadosPagamento) => Promise<void>;
    estaInscrito: (slug: string) => boolean;
    reiniciar: () => void;
}
const Contexto = createContext<ContextoApp | null>(null);
function perfilValido(p: unknown): p is PerfilCadastro {
    if (!p || typeof p !== 'object')
        return false;
    const v = p as PerfilCadastro;
    return ['nome', 'email', 'telefone', 'pais', 'cidade', 'uf'].every(k => typeof v[k as keyof PerfilCadastro] === 'string') && Array.isArray(v.nichos) && v.nichos.every(x => typeof x === 'string') && Array.isArray(v.redes) && v.redes.every(r => r && typeof r.plataforma === 'string' && typeof r.perfil === 'string' && typeof r.seguidores === 'string');
}
function reciboValido(v: unknown): v is ReciboPublico {
    if (!v || typeof v !== 'object')
        return false;
    const r = v as ReciboPublico;
    return ['tipo', 'referencia', 'estado', 'titulo', 'enviadaEm', 'reciboToken'].every(k => typeof r[k as keyof ReciboPublico] === 'string') && (r.protocolo === undefined || typeof r.protocolo === 'string');
}
function juntar(atuais: ReciboPublico[], novos: ReciboPublico[]) { const m = new Map(atuais.map(r => [r.reciboToken, r])); novos.forEach(r => { const anterior = m.get(r.reciboToken); m.set(r.reciboToken, { ...r, simulacao: r.simulacao ?? anterior?.simulacao, pagamentoPendente: r.pagamentoPendente ?? anterior?.pagamentoPendente }); }); return [...m.values()]; }
function reciboDaCandidatura(c: Candidatura): ReciboPublico {
    return { tipo: 'candidatura', referencia: c.editalSlug, protocolo: c.protocolo, estado: c.status, titulo: c.editalTitulo, enviadaEm: c.enviadaEm, reciboToken: c.reciboToken!, pagamentoPendente: c.pagamentoPendente, simulacao: c.simulacao };
}
export function AppProvider({ children }: {
    children: ReactNode;
}) {
    const [estado, setEstado] = useState<Estado>(inicial);
    const [hidratado, setHidratado] = useState(false), [carregandoConta, setCarregando] = useState(false), [erroConta, setErroConta] = useState<MotivoEnvio>();
    const geracaoRef = useRef(0), mutacaoRef = useRef(0), finalizadosRef = useRef(new Set<string>());
    const tokenRef = useRef<string | null>(null), estadoRef = useRef(estado);
    estadoRef.current = estado;
    const limpar = useCallback(() => { geracaoRef.current++; mutacaoRef.current++; finalizadosRef.current.clear(); tokenRef.current = null; setCarregando(false); setEstado(inicial()); setErroConta(undefined); try {
        localStorage.removeItem(CHAVE_TOKEN);
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(LEGACY_STORAGE_KEY);
    }
    catch { } }, []);
    const aplicar = useCallback((conta: ContaRecebida) => {
        setEstado(atual => {
            const anteriores = conta.inscricoesCursos;
            return { cadastrado: true, cadastroConfirmado: true, nome: conta.perfil.nome, perfil: conta.perfil, organizacoes: conta.organizacoes, candidaturas: conta.candidaturas, rascunhos: conta.rascunhos.filter(r => !finalizadosRef.current.has(`${r.chamadaSlug}:${r.envioId}`)),
                recibos: juntar(anteriores, conta.candidaturas.filter(c => Boolean(c.reciboToken)).map(reciboDaCandidatura)), cursosInscritos: anteriores.map(r => r.referencia) };
        });
        setErroConta(undefined);
    }, []);
    const atualizarConta = useCallback(async () => {
        const token = tokenRef.current, geracao = geracaoRef.current, mutacao = mutacaoRef.current;
        if (!token)
            throw new ErroEnvio('perfil');
        setCarregando(true);
        try {
            const conta = await consultarConta(token);
            if (tokenRef.current === token && geracaoRef.current === geracao && mutacaoRef.current === mutacao)
                aplicar(conta);
        }
        catch (e) {
            if (geracaoRef.current === geracao) {
                if (e instanceof ErroEnvio && e.status === 401)
                    limpar();
                else
                    setErroConta(motivoDoErro(e));
            }
            throw e;
        }
        finally {
            if (geracaoRef.current === geracao)
                setCarregando(false);
        }
    }, [aplicar, limpar]);
    useEffect(() => {
        try {
            const salvo = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(LEGACY_STORAGE_KEY) ?? 'null');
            if (salvo && typeof salvo === 'object')
                setEstado(atual => ({ ...atual, perfil: perfilValido(salvo.perfil) ? salvo.perfil : null, recibos: Array.isArray(salvo.recibos) ? salvo.recibos.filter(reciboValido) : [] }));
            tokenRef.current = localStorage.getItem(CHAVE_TOKEN);
        }
        catch { }
        setHidratado(true);
        if (tokenRef.current)
            void atualizarConta().catch(() => { });
    }, [atualizarConta]);
    useEffect(() => {
        if (!hidratado)
            return;
        // Explicit whitelist: senha, CPF, respostas privadas e pagamento nunca entram no cache.
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ perfil: estado.perfil, organizacoes: estado.organizacoes, recibos: estado.recibos }));
        }
        catch { }
    }, [estado, hidratado]);
    const comSessao = useCallback(async <T,>(pedido: Promise<T>): Promise<T> => { const geracao = geracaoRef.current; try {
        const resposta = await pedido;
        if (geracaoRef.current !== geracao)
            throw new ErroEnvio('perfil');
        return resposta;
    }
    catch (e) {
        if (geracaoRef.current === geracao && e instanceof ErroEnvio && e.status === 401)
            limpar();
        throw e;
    } }, [limpar]);
    const guardarToken = useCallback((token: string) => { geracaoRef.current++; mutacaoRef.current++; finalizadosRef.current.clear(); tokenRef.current = token; try {
        localStorage.setItem(CHAVE_TOKEN, token);
    }
    catch { } }, []);
    const cadastrar = useCallback(async (perfil: PerfilCadastro, senha: string, org?: NovaOrganizacao) => { const geracao = geracaoRef.current; const c = await cadastrarConta(perfil, senha, org); if (geracaoRef.current !== geracao)
        throw new ErroEnvio('perfil'); guardarToken(c.token); aplicar(c); }, [guardarToken, aplicar]);
    const entrar = useCallback(async (email: string, senha: string) => { const geracao = geracaoRef.current; const c = await entrarConta(email, senha); if (geracaoRef.current !== geracao)
        throw new ErroEnvio('perfil'); guardarToken(c.token); const me = await comSessao(consultarConta(c.token)); if (tokenRef.current === c.token)
        aplicar(me); }, [guardarToken, aplicar, atualizarConta]);
    const sair = useCallback(async () => { const token = tokenRef.current; try {
        if (token)
            await sairConta(token);
    }
    finally {
        limpar();
    } }, [limpar]);
    const tokenObrigatorio = () => { if (!tokenRef.current)
        throw new ErroEnvio('perfil'); return tokenRef.current; };
    const salvarOrganizacao = useCallback(async (dados: NovaOrganizacao) => { const token = tokenObrigatorio(), orgs = await comSessao(enviarOrganizacao(dados, token)); if (tokenRef.current === token) {
        mutacaoRef.current++;
        setEstado(a => ({ ...a, organizacoes: orgs }));
    } }, []);
    const enviarCandidatura = useCallback(async (dados: NovaCandidatura, envioId: string): Promise<Candidatura> => {
        const token = tokenObrigatorio(), org = estadoRef.current.organizacoes.find(o => o.id === dados.organizacaoId);
        if (!org)
            throw new ErroEnvio('perfil');
        const resposta = await comSessao(enviarProposta({ chamadaSlug: dados.editalSlug, chamadaId: dados.chamadaId, organizacaoId: org.id, envioId, projeto: { titulo: dados.projeto, formato: dados.formato, descricao: dados.descricao ?? '', justificativa: dados.justificativa ?? '', alcance: dados.alcance ?? '', distribuicao: dados.distribuicao ?? '' }, valorSolicitado: dados.valorSolicitado }, token));
        mutacaoRef.current++;
        finalizadosRef.current.add(`${dados.editalSlug}:${envioId}`);
        const nova: Candidatura = { ...dados, ...resposta, id: resposta.protocolo, enviadaEm: new Date().toISOString(), status: 'recebida', organizacao: org };
        if (tokenRef.current === token)
            setEstado(a => ({ ...a, rascunhos: a.rascunhos.filter(r => !(r.chamadaSlug === dados.editalSlug && r.envioId === envioId)), candidaturas: [nova, ...a.candidaturas.filter(c => c.protocolo !== nova.protocolo)], recibos: juntar(a.recibos, [reciboDaCandidatura(nova)]) }));
        return nova;
    }, []);
    const inscreverCurso = useCallback(async (slug: string, envioId: string) => {
        const token = tokenObrigatorio(), perfil = estadoRef.current.perfil;
        if (!perfil)
            throw new ErroEnvio('perfil');
        const r = await comSessao(enviarInscricaoCurso(slug, perfil, envioId, token));
        mutacaoRef.current++;
        const recibo: ReciboPublico = { tipo: 'curso', referencia: slug, estado: 'recebida', titulo: slug, enviadaEm: new Date().toISOString(), reciboToken: r.reciboToken };
        if (tokenRef.current === token)
            setEstado(a => ({ ...a, cursosInscritos: [...new Set([...a.cursosInscritos, slug])], recibos: juntar(a.recibos, [recibo]) }));
        return recibo;
    }, []);
    const atualizarRecibos = useCallback(async (tokenExtra?: string) => {
        const geracao = geracaoRef.current;
        let ok = true;
        if (tokenRef.current)
            try {
                await atualizarConta();
            }
            catch {
                ok = false;
            }
        if (geracaoRef.current !== geracao)
            return false;
        const tokens = [...new Set([...estadoRef.current.recibos.map(r => r.reciboToken), ...(tokenExtra ? [tokenExtra] : [])])];
        const resultados = await Promise.allSettled(tokens.map(consultarRecibo));
        if (geracaoRef.current !== geracao)
            return false;
        const novos = resultados.flatMap(r => r.status === 'fulfilled' ? [r.value] : []);
        if (novos.length)
            setEstado(a => ({ ...a, recibos: juntar(a.recibos, novos) }));
        return ok && resultados.every(r => r.status === 'fulfilled');
    }, [atualizarConta]);
    const carregarPagamento = useCallback((protocolo: string) => comSessao(consultarPagamento(protocolo, tokenObrigatorio())), [comSessao]);
    const gravarPagamento = useCallback(async (protocolo: string, dados: DadosPagamento) => { await comSessao(enviarPagamento(protocolo, dados, tokenObrigatorio())); void atualizarConta().catch(() => { }); }, [atualizarConta, comSessao]);
    const salvarPerfil = useCallback(async (perfil: PerfilCadastro) => {
        const novo = await comSessao(atualizarPerfil(perfil, tokenObrigatorio()));
        mutacaoRef.current++;
        setEstado(a => ({ ...a, perfil: novo, nome: novo.nome }));
    }, [comSessao]);
    const carregarRascunho = useCallback((slug: string) => comSessao(consultarRascunho(slug, tokenObrigatorio())), [comSessao]);
    const salvarRascunho = useCallback(async (slug: string, dados: EnvioRascunho) => {
        const r = await comSessao(enviarRascunho(slug, dados, tokenObrigatorio()));
        if (!finalizadosRef.current.has(`${slug}:${dados.envioId}`)) {
            mutacaoRef.current++;
            setEstado(a => ({ ...a, rascunhos: [{ chamadaSlug: slug, tituloChamada: a.rascunhos.find(d => d.chamadaSlug === slug)?.tituloChamada ?? slug, tituloProjeto: r.dados.projeto, atualizadoEm: r.atualizadoEm, versao: r.versao, envioId: r.envioId, organizacaoId: r.organizacaoId, aceitaEnvio: true }, ...a.rascunhos.filter(d => d.chamadaSlug !== slug)] }));
        }
        return r;
    }, [comSessao]);
    const apagarRascunho = useCallback(async (slug: string, envioId: string, versao: number) => {
        await comSessao(excluirRascunho(slug, envioId, versao, tokenObrigatorio()));
        mutacaoRef.current++;
        setEstado(a => ({ ...a, rascunhos: a.rascunhos.filter(r => r.chamadaSlug !== slug || r.envioId !== envioId) }));
    }, [comSessao]);
    const carregarOferta = useCallback((protocolo: string) => comSessao(consultarOferta(protocolo, tokenObrigatorio())), [comSessao]);
    const decidirOferta = useCallback(async (protocolo: string, oferta: OfertaProposta, aceitar: boolean) => {
        const r = await comSessao(responderOferta(protocolo, oferta, aceitar, tokenObrigatorio()));
        mutacaoRef.current++;
        setEstado(a => ({ ...a, candidaturas: a.candidaturas.map(c => c.protocolo === protocolo ? { ...c, oferta: r.oferta, status: r.estadoProposta as Candidatura['status'], pagamentoPendente: r.estadoProposta === 'selecionada' } : c) }));
        void atualizarConta().catch(() => { });
        return r;
    }, [comSessao, atualizarConta]);
    const valor = useMemo<ContextoApp>(() => ({ ...estado, sessaoId: geracaoRef.current, salvarPerfil, carregarRascunho, salvarRascunho, apagarRascunho, carregarOferta, decidirOferta, hidratado, carregandoConta, erroConta, cadastrar, entrar, sair, atualizarConta, salvarOrganizacao, enviarCandidatura, inscreverCurso, atualizarRecibos, carregarPagamento, gravarPagamento, estaInscrito: slug => estado.cursosInscritos.includes(slug), reiniciar: limpar }), [estado, salvarPerfil, carregarRascunho, salvarRascunho, apagarRascunho, carregarOferta, decidirOferta, hidratado, carregandoConta, erroConta, cadastrar, entrar, sair, atualizarConta, salvarOrganizacao, enviarCandidatura, inscreverCurso, atualizarRecibos, carregarPagamento, gravarPagamento, limpar]);
    return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}
export function useApp(): ContextoApp { const c = useContext(Contexto); if (!c)
    throw new Error('useApp precisa estar dentro de AppProvider'); return c; }
