'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ErroAnexos } from '@/i18n/anexos';
import { ErroEnvio } from '@/lib/envio';
import type { AnexoCandidatura, CategoriaAnexo, ConsultaAnexos } from '@/lib/types';
import { useApp } from '@/state/AppState';

export interface ArquivoNaFila {
  chave: string;
  categoria: CategoriaAnexo;
  arquivo: File;
  estado: 'aguardando' | 'enviando' | 'erro';
  erro?: ErroAnexos;
}
interface Estado {
  chave: string;
  consulta: ConsultaAnexos | null;
  fila: ArquivoNaFila[];
  carregando: boolean;
  operacao: string | null;
  erro?: ErroAnexos;
  erroNome?: string;
  precisaConferir: boolean;
  progresso?: { total: number; processados: number; nome: string };
}
export interface ResultadoEnvioAnexos { ok: boolean; ids: string[]; erro?: ErroAnexos }
const vazio = (chave: string): Estado => ({ chave, consulta: null, fila: [], carregando: false, operacao: null, precisaConferir: false });
let proximaSelecao = 0;

/** A fila fica só em memória; anexos confirmados são recuperados do servidor privado. */
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
    mudar(a => ({ ...a, carregando: true, erro: undefined, erroNome: undefined }));
    try {
      const consulta = await carregarAnexos(slug);
      if (!montado.current || dono.current !== chave || ciclo.current !== geracao || leitura.current !== pedido) return false;
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

  function selecionar(categoria: CategoriaAnexo, arquivos: File[]): boolean {
    const e = atual.current, requisitos = e.consulta?.requisitos;
    if (e.operacao || e.carregando || !requisitos || !e.consulta?.aceitaEnvio) return false;
    if (!arquivos.length) return true;
    const permitidos = requisitos.categorias.find(c => c.id === categoria)?.tiposPermitidos ?? requisitos.tiposPermitidos;
    let erro: ErroAnexos | undefined, erroNome: string | undefined;
    for (const arquivo of arquivos) {
      const extensao = `.${arquivo.name.split('.').pop()?.toLowerCase() ?? ''}`;
      if (!permitidos.includes(extensao)) erro = categoria === 'identificacao' ? 'tipoIdentificacao' : 'tipo';
      else if (!arquivo.size || arquivo.size > requisitos.maxArquivoBytes) erro = 'tamanho';
      if (erro) { erroNome = arquivo.name; break; }
    }
    if (!erro && e.consulta.uso.arquivos + e.fila.length + arquivos.length > requisitos.maxArquivos) erro = 'quantidade';
    if (!erro && e.consulta.uso.totalBytes + [...e.fila.map(a => a.arquivo), ...arquivos].reduce((n, f) => n + f.size, 0) > requisitos.maxTotalBytes) erro = 'total';
    if (erro) { mudar(a => ({ ...a, erro, erroNome })); return false; }
    const novos: ArquivoNaFila[] = arquivos.map(arquivo => ({ chave: `selecao-${++proximaSelecao}`, categoria, arquivo, estado: 'aguardando' }));
    mudar(a => ({ ...a, fila: [...a.fila, ...novos], erro: undefined, erroNome: undefined, progresso: undefined }));
    return true;
  }

  function removerSelecionado(id: string) {
    if (atual.current.operacao) return;
    mudar(a => ({ ...a, fila: a.fila.filter(f => f.chave !== id), erro: undefined, erroNome: undefined, progresso: undefined }));
  }

  async function enviarTodos(): Promise<ResultadoEnvioAnexos> {
    const geracao = ciclo.current, vigente = () => montado.current && dono.current === chave && ciclo.current === geracao;
    const ids = () => atual.current.consulta?.anexos.map(a => a.id) ?? [];
    if (atual.current.operacao) return { ok: false, ids: ids(), erro: 'ocupado' };
    // A ausência de anexos é válida e não depende de um upload ou de uma leitura bem-sucedida.
    if (!atual.current.fila.length) return { ok: true, ids: ids() };
    mudar(a => ({ ...a, operacao: 'fila', erro: undefined, erroNome: undefined }));
    const confirmados: { selecao: ArquivoNaFila; anexo: AnexoCandidatura }[] = [];
    try {
      if (!atual.current.consulta || atual.current.precisaConferir) {
        if (!await recarregar() || !vigente()) return { ok: false, ids: [], erro: 'leitura' };
      }
      if (!atual.current.consulta?.aceitaEnvio) {
        mudar(a => ({ ...a, erro: 'fechado' }));
        return { ok: false, ids: ids(), erro: 'fechado' };
      }
      const lote = [...atual.current.fila];
      for (let i = 0; i < lote.length; i++) {
        if (!vigente()) return { ok: false, ids: [] };
        const selecao = lote[i];
        mudar(a => ({ ...a, fila: a.fila.map(f => f.chave === selecao.chave ? { ...f, estado: 'enviando', erro: undefined } : f),
          progresso: { total: lote.length, processados: i, nome: selecao.arquivo.name } }));
        try {
          const anexo = await adicionarAnexo(slug, selecao.categoria, selecao.arquivo);
          if (!vigente()) return { ok: false, ids: [] };
          confirmados.push({ selecao, anexo });
          mudar(a => {
            const anexos = [...(a.consulta?.anexos ?? []).filter(x => x.id !== anexo.id), anexo];
            return { ...a, fila: a.fila.filter(f => f.chave !== selecao.chave), consulta: a.consulta ? { ...a.consulta, anexos,
              uso: { arquivos: anexos.length, totalBytes: anexos.reduce((n, x) => n + x.tamanho, 0) } } : null };
          });
        } catch (erro) {
          if (!vigente()) return { ok: false, ids: [] };
          const motivo: ErroAnexos = erro instanceof ErroEnvio && erro.status === 413 ? 'tamanho'
            : erro instanceof ErroEnvio && erro.status === 415 ? (selecao.categoria === 'identificacao' ? 'tipoIdentificacao' : 'tipo') : 'upload';
          mudar(a => ({ ...a, fila: a.fila.map(f => f.chave === selecao.chave ? { ...f, estado: 'erro', erro: motivo } : f) }));
        }
        if (vigente()) mudar(a => ({ ...a, progresso: { total: lote.length, processados: i + 1, nome: '' } }));
      }
      const conferido = await recarregar();
      if (!vigente()) return { ok: false, ids: [] };
      if (conferido) {
        // Uma alteração em outro aparelho não pode retirar silenciosamente arquivos deste lote.
        const presentes = new Set(ids());
        const ausentes = confirmados.filter(c => !presentes.has(c.anexo.id));
        if (ausentes.length) mudar(a => ({ ...a, fila: [...a.fila, ...ausentes.map(c => ({ ...c.selecao, estado: 'erro' as const, erro: 'upload' as const }))] }));
      }
      const ok = atual.current.fila.length === 0;
      mudar(a => ({ ...a, erro: ok ? undefined : 'upload', erroNome: undefined }));
      return { ok, ids: ids(), ...(ok ? {} : { erro: 'upload' as const }) };
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
      if (vigente()) { const conferido = await recarregar(); if (conferido) mudar(a => ({ ...a, erro: 'remover' })); }
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
    if (atual.current.operacao) return 'ocupado';
    if (atual.current.fila.length) return 'pendentes';
    return undefined;
  }

  const exposto = estado.chave === chave ? estado : vazio(chave);
  return { ...exposto, selecionar, removerSelecionado, enviarTodos, remover, baixar, recarregar, validar,
    ids: exposto.consulta?.anexos.map(a => a.id) ?? [], ocupado: exposto.carregando || Boolean(exposto.operacao) };
}

export type ControleAnexos = ReturnType<typeof useAnexos>;
