'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ErroAnexos } from '@/i18n/anexos';
import { ErroEnvio } from '@/lib/envio';
import type { AnexoCandidatura, CategoriaAnexo, ConsultaAnexos } from '@/lib/types';
import { useApp } from '@/state/AppState';

interface Estado {
  chave: string;
  consulta: ConsultaAnexos | null;
  selecionados: Partial<Record<CategoriaAnexo, File>>;
  carregando: boolean;
  operacao: string | null;
  erro?: ErroAnexos;
  precisaConferir: boolean;
}
const vazio = (chave: string): Estado => ({ chave, consulta: null, selecionados: {}, carregando: false, operacao: null, precisaConferir: false });

/** Arquivos ficam no servidor privado; somente a seleção ainda não enviada fica em memória. */
export function useAnexos(slug: string, envioId: string, habilitado: boolean) {
  const { sessaoId, carregarAnexos, adicionarAnexo, apagarAnexo, baixarAnexo } = useApp();
  const chave = `${sessaoId}:${slug}:${envioId}`;
  const [estado, setEstado] = useState<Estado>(() => vazio(chave));
  const atual = useRef(estado), dono = useRef(chave), leitura = useRef(0), ciclo = useRef(0), montado = useRef(false), urls = useRef(new Set<string>());
  dono.current = chave;
  atual.current = estado.chave === chave ? estado : vazio(chave);
  const mudar = useCallback((transformar: (antes: Estado) => Estado) => {
    if (!montado.current || dono.current !== chave) return;
    const novo = transformar(atual.current.chave === chave ? atual.current : vazio(chave));
    atual.current = novo;
    setEstado(novo);
  }, [chave]);

  const recarregar = useCallback(async (): Promise<boolean> => {
    if (!habilitado) return false;
    const pedido = ++leitura.current, geracao = ciclo.current;
    mudar(a => ({ ...a, carregando: true, erro: undefined }));
    try {
      const consulta = await carregarAnexos(slug);
      if (!montado.current || dono.current !== chave || ciclo.current !== geracao || leitura.current !== pedido) return false;
      // A chamada EV não pode liberar a revisão com uma resposta incompleta.
      const obrigatorias: CategoriaAnexo[] = ['identificacao', 'portfolio', 'midia-kit', 'proposta-orcamento'];
      if (slug === 'carros-eletricos-no-brasil' && (!consulta.requisitos.linksPortfolioObrigatorios
        || obrigatorias.some(id => !consulta.requisitos.categorias.some(c => c.id === id && c.obrigatoria))))
        throw new ErroEnvio('resposta');
      mudar(a => ({ ...a, consulta, carregando: false, precisaConferir: false, erro: undefined }));
      return true;
    } catch {
      if (montado.current && dono.current === chave && ciclo.current === geracao && leitura.current === pedido)
        mudar(a => ({ ...a, carregando: false, precisaConferir: true, erro: 'leitura' }));
      return false;
    }
  }, [carregarAnexos, chave, habilitado, mudar, slug]);

  useEffect(() => {
    montado.current = true;
    ++ciclo.current;
    ++leitura.current;
    mudar(() => vazio(chave));
    if (habilitado) void recarregar();
    return () => {
      montado.current = false;
      ++ciclo.current;
      ++leitura.current;
      urls.current.forEach(url => URL.revokeObjectURL(url));
      urls.current.clear();
    };
  }, [chave, habilitado, mudar, recarregar]);

  function selecionar(categoria: CategoriaAnexo, arquivo: File | null): boolean {
    const e = atual.current, requisitos = e.consulta?.requisitos;
    if (e.operacao || e.carregando || !requisitos) return false;
    const selecionados = { ...e.selecionados };
    delete selecionados[categoria];
    if (!arquivo) { mudar(a => ({ ...a, selecionados, erro: undefined })); return true; }
    const extensao = `.${arquivo.name.split('.').pop()?.toLowerCase() ?? ''}`;
    let erro: ErroAnexos | undefined;
    const pendentes = Object.values(selecionados);
    const permitidos = requisitos.categorias.find(c => c.id === categoria)?.tiposPermitidos ?? requisitos.tiposPermitidos;
    if (!permitidos.includes(extensao)) erro = categoria === 'identificacao' ? 'tipoIdentificacao' : 'tipo';
    else if (!arquivo.size || arquivo.size > requisitos.maxArquivoBytes) erro = 'tamanho';
    else if ((e.consulta?.uso.arquivos ?? 0) + pendentes.length + 1 > requisitos.maxArquivos) erro = 'quantidade';
    else if ((e.consulta?.uso.totalBytes ?? 0) + pendentes.reduce((n, f) => n + f.size, 0) + arquivo.size > requisitos.maxTotalBytes) erro = 'total';
    if (!erro) selecionados[categoria] = arquivo;
    mudar(a => ({ ...a, selecionados, erro }));
    return !erro;
  }

  async function enviar(categoria: CategoriaAnexo): Promise<boolean> {
    const e = atual.current, arquivo = e.selecionados[categoria];
    if (!arquivo || !e.consulta?.aceitaEnvio || e.operacao || e.carregando || e.precisaConferir) return false;
    const anteriores = new Set(e.consulta.anexos.map(a => a.id)), geracao = ciclo.current;
    const vigente = () => montado.current && dono.current === chave && ciclo.current === geracao;
    mudar(a => ({ ...a, operacao: `upload:${categoria}`, erro: undefined }));
    try {
      const anexo = await adicionarAnexo(slug, categoria, arquivo);
      if (!vigente()) return false;
      mudar(a => {
        const selecionados = { ...a.selecionados }; delete selecionados[categoria];
        const anexos = [...(a.consulta?.anexos ?? []).filter(x => x.id !== anexo.id), anexo];
        return { ...a, selecionados, consulta: a.consulta ? { ...a.consulta, anexos,
          uso: { arquivos: anexos.length, totalBytes: anexos.reduce((n, x) => n + x.tamanho, 0) } } : null };
      });
      return await recarregar();
    } catch (erro) {
      if (!vigente()) return false;
      const conferido = await recarregar();
      if (!vigente()) return false;
      // Um timeout pode ocorrer depois da gravação. Só a listagem autenticada confirma o arquivo.
      const confirmado = conferido && atual.current.consulta?.anexos.some(a => !anteriores.has(a.id)
        && a.categoria === categoria && a.nome === arquivo.name && a.tamanho === arquivo.size);
      if (confirmado) {
        mudar(a => { const selecionados = { ...a.selecionados }; delete selecionados[categoria]; return { ...a, selecionados, erro: undefined }; });
        return true;
      }
      if (conferido) mudar(a => ({ ...a, erro: erro instanceof ErroEnvio && erro.status === 413 ? 'tamanho'
        : erro instanceof ErroEnvio && erro.status === 415 ? (categoria === 'identificacao' ? 'tipoIdentificacao' : 'tipo') : 'upload' }));
      return false;
    } finally {
      if (vigente()) mudar(a => ({ ...a, operacao: null }));
    }
  }

  async function remover(anexo: AnexoCandidatura) {
    if (atual.current.operacao || atual.current.carregando) return;
    const geracao = ciclo.current, vigente = () => montado.current && dono.current === chave && ciclo.current === geracao;
    mudar(a => ({ ...a, operacao: `remove:${anexo.id}`, erro: undefined }));
    try {
      await apagarAnexo(anexo.id);
      if (vigente()) await recarregar();
    } catch {
      if (vigente()) {
        const conferido = await recarregar();
        if (conferido) mudar(a => ({ ...a, erro: 'remover' }));
      }
    } finally { if (vigente()) mudar(a => ({ ...a, operacao: null })); }
  }

  async function baixar(anexo: AnexoCandidatura) {
    if (atual.current.operacao) return;
    const geracao = ciclo.current, vigente = () => montado.current && dono.current === chave && ciclo.current === geracao;
    mudar(a => ({ ...a, operacao: `download:${anexo.id}`, erro: undefined }));
    try {
      const arquivo = await baixarAnexo(anexo.id);
      if (!vigente()) return;
      const url = URL.createObjectURL(arquivo);
      urls.current.add(url);
      const link = document.createElement('a');
      link.href = url; link.download = anexo.nome; document.body.appendChild(link); link.click(); link.remove();
      setTimeout(() => { URL.revokeObjectURL(url); urls.current.delete(url); }, 1000);
    } catch { if (vigente()) mudar(a => ({ ...a, erro: 'baixar' })); }
    finally { if (vigente()) mudar(a => ({ ...a, operacao: null })); }
  }

  function validar(): ErroAnexos | undefined {
    const e = atual.current;
    if (e.carregando || e.operacao) return 'ocupado';
    if (!e.consulta || e.precisaConferir) return 'leitura';
    if (e.erro) return e.erro;
    if (!e.consulta.aceitaEnvio) return 'fechado';
    if (Object.values(e.selecionados).some(Boolean)) return 'pendentes';
    if (e.consulta.requisitos.categorias.some(c => c.obrigatoria && !e.consulta!.anexos.some(a => a.categoria === c.id))) return 'obrigatorios';
    return undefined;
  }

  const exposto = estado.chave === chave ? estado : vazio(chave);
  return { ...exposto, selecionar, enviar, remover, baixar, recarregar, validar,
    ids: exposto.consulta?.anexos.map(a => a.id) ?? [],
    ocupado: exposto.carregando || Boolean(exposto.operacao),
  };
}

export type ControleAnexos = ReturnType<typeof useAnexos>;
