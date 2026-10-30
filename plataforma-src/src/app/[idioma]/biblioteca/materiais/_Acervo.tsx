'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { EstadoVazio } from '@/components/EstadoVazio';
import type { Idioma } from '@/i18n/idiomas';
import { textos } from '@/i18n/strings';
import type { Article, Trilha } from '@/lib/types';

import { Estante, rotuloTrilha } from './_Estante';
import {
  CAMPOS_FACETADOS,
  SELECAO_VAZIA,
  alvoDeBusca,
  ehOrdem,
  ordensDisponiveis,
  prateleiras,
  termosDaBusca,
  valorDoCampo,
  valoresDistintos,
  type CampoFacetado,
  type Opcao,
  type Ordem,
  type Selecao,
} from './_regras';

/** Nome de cada filtro no endereco, para que uma busca possa ser enviada a alguem. */
const PARAMETRO: Record<CampoFacetado, string> = {
  trilha: 'trilha',
  tema: 'tema',
  organizacao: 'org',
  formato: 'formato',
};

/**
 * Pilula de filtro. Desabilitada quando a opcao nao devolveria nada, para que
 * nenhum clique leve a lista vazia. A pilula que desfaz o filtro (fixa) nunca
 * desabilita: e por ela que se volta.
 */
function Pilula({
  ativo,
  total,
  rotulo,
  fixa,
  aoClicar,
}: {
  ativo: boolean;
  total?: number;
  rotulo: string;
  fixa?: boolean;
  aoClicar: () => void;
}) {
  return (
    <button
      type="button"
      className="bib-pilula"
      aria-pressed={ativo}
      disabled={!fixa && total === 0 && !ativo}
      onClick={aoClicar}
    >
      {rotulo}
      {total === undefined ? null : <span className="bib-pilula__n">{total}</span>}
    </button>
  );
}

interface Grupo {
  campo: CampoFacetado;
  rotulo: string;
  opcoes: Opcao[];
  total: number;
}

/**
 * Acervo navegavel: busca por texto, filtros tirados do proprio conteudo,
 * ordenacao e contagem.
 *
 * As opcoes de cada filtro sao contadas contra os outros filtros ativos, de modo
 * que nenhuma combinacao clicavel leva a lista vazia. Filtro com uma unica opcao
 * nao aparece, e com um material so a pagina mostra apenas a contagem: e por
 * isso que a biblioteca ja se comporta como acervo tendo uma publicacao.
 */
export function Acervo({ idioma, materiais }: { idioma: Idioma; materiais: Article[] }) {
  const t = textos(idioma);
  const a = t.aprendizado.materiais.acervo;

  const [busca, setBusca] = useState('');
  const [selecao, setSelecao] = useState<Selecao>(SELECAO_VAZIA);
  const [ordem, setOrdem] = useState<Ordem>('atualizacao');
  const [lido, setLido] = useState(false);
  const campoBusca = useRef<HTMLInputElement>(null);

  /* O endereco carrega o estado da busca: um recorte do acervo pode ser enviado. */
  useEffect(() => {
    const parametros = new URLSearchParams(window.location.search);
    const vindo: Selecao = { ...SELECAO_VAZIA };
    for (const campo of CAMPOS_FACETADOS) {
      const valor = parametros.get(PARAMETRO[campo]) ?? '';
      if (valor && valoresDistintos(materiais, campo).includes(valor)) vindo[campo] = valor;
    }
    setSelecao(vindo);
    setBusca(parametros.get('busca') ?? '');
    /* So entra pela URL uma ordem que o controle tambem oferece para este acervo. */
    const ordemVinda = parametros.get('ordem') ?? '';
    if (ehOrdem(ordemVinda) && ordensDisponiveis(materiais).includes(ordemVinda)) setOrdem(ordemVinda);
    setLido(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!lido) return;
    const parametros = new URLSearchParams();
    if (busca.trim()) parametros.set('busca', busca.trim());
    for (const campo of CAMPOS_FACETADOS) {
      if (selecao[campo]) parametros.set(PARAMETRO[campo], selecao[campo]);
    }
    if (ordem !== 'atualizacao') parametros.set('ordem', ordem);
    const consulta = parametros.toString();
    window.history.replaceState(
      null,
      '',
      consulta ? `${window.location.pathname}?${consulta}` : window.location.pathname,
    );
  }, [lido, busca, selecao, ordem]);

  /* Barra de espaco da ferramenta: a tecla / leva o cursor para a busca. */
  useEffect(() => {
    function aoTeclar(evento: KeyboardEvent) {
      if (evento.key !== '/' || evento.metaKey || evento.ctrlKey || evento.altKey) return;
      const alvo = evento.target as HTMLElement | null;
      const etiqueta = alvo?.tagName;
      if (etiqueta === 'INPUT' || etiqueta === 'TEXTAREA' || etiqueta === 'SELECT') return;
      if (alvo?.isContentEditable) return;
      evento.preventDefault();
      campoBusca.current?.focus();
    }
    window.addEventListener('keydown', aoTeclar);
    return () => window.removeEventListener('keydown', aoTeclar);
  }, []);

  const itens = useMemo(
    () => materiais.map((material) => ({ material, alvo: alvoDeBusca(material) })),
    [materiais],
  );
  const termos = useMemo(() => termosDaBusca(busca), [busca]);
  const porBusca = useMemo(
    () => itens.filter((item) => termos.every((termo) => item.alvo.includes(termo))),
    [itens, termos],
  );

  const filtrados = useMemo(
    () =>
      porBusca
        .filter((item) =>
          CAMPOS_FACETADOS.every(
            (campo) => !selecao[campo] || valorDoCampo(item.material, campo) === selecao[campo],
          ),
        )
        .map((item) => item.material),
    [porBusca, selecao],
  );

  /*
   * A estante em prateleiras: uma so nas ordens planas, uma por valor nas
   * agrupadas. Quando o recorte deixa uma prateleira so (filtro por tema e
   * ver por tema, por exemplo), o cabecalho repetiria o filtro e a contagem
   * logo acima: some, e a estante volta a ser plana.
   */
  const estante = useMemo(() => {
    const lista = prateleiras(filtrados, ordem);
    return lista.length === 1 ? lista.map((p) => ({ ...p, rotulo: '' })) : lista;
  }, [filtrados, ordem]);

  /* O nome de cada ordem e o mesmo do filtro correspondente: e o mesmo campo. */
  const rotuloDaOrdem: Record<Ordem, string> = {
    atualizacao: a.ordemAtualizacao,
    titulo: a.ordemTitulo,
    tema: a.filtroTema,
    organizacao: a.filtroOrganizacao,
    formato: a.filtroFormato,
    ano: a.ordemAno,
  };

  const grupos = useMemo<Grupo[]>(() => {
    function rotuloDoCampo(campo: CampoFacetado): string {
      if (campo === 'trilha') return a.filtroTrilha;
      if (campo === 'tema') return a.filtroTema;
      if (campo === 'organizacao') return a.filtroOrganizacao;
      return a.filtroFormato;
    }

    return CAMPOS_FACETADOS.map((campo) => {
      const valores = valoresDistintos(materiais, campo);
      /* Filtro de uma opcao so nao informa nada: fica de fora. */
      if (valores.length < 2) return null;

      const parciais = porBusca.filter((item) =>
        CAMPOS_FACETADOS.every(
          (outro) =>
            outro === campo || !selecao[outro] || valorDoCampo(item.material, outro) === selecao[outro],
        ),
      );

      return {
        campo,
        rotulo: rotuloDoCampo(campo),
        total: parciais.length,
        opcoes: valores.map((valor) => ({
          valor,
          rotulo: campo === 'trilha' ? rotuloTrilha(idioma, valor as Trilha) : valor,
          total: parciais.filter((item) => valorDoCampo(item.material, campo) === valor).length,
        })),
      };
    }).filter((grupo): grupo is Grupo => grupo !== null);
  }, [materiais, porBusca, selecao, idioma, a]);

  const total = materiais.length;
  const recortado =
    busca.trim() !== '' || CAMPOS_FACETADOS.some((campo) => selecao[campo] !== '');
  const temControles = total > 1;

  function escolher(campo: CampoFacetado, valor: string) {
    setSelecao((atual) => ({ ...atual, [campo]: atual[campo] === valor ? '' : valor }));
  }

  function limpar() {
    setBusca('');
    setSelecao(SELECAO_VAZIA);
  }

  return (
    <div className="pilha">
      {temControles ? (
        <div className="bib-controles">
          <div className="bib-busca">
            <input
              ref={campoBusca}
              type="search"
              value={busca}
              aria-label={a.busca}
              aria-keyshortcuts="/"
              placeholder={a.buscaDica}
              onChange={(evento) => setBusca(evento.target.value)}
            />
          </div>

          {/*
           * Ver por: as ordens planas e as agrupadas no mesmo controle. Um
           * campo que nao varia (uma organizacao so, um ano so) nao vira
           * opcao: agrupar por ele daria uma prateleira unica com tudo.
           */}
          <div className="bib-linha">
            <p className="bib-linha__rotulo">{a.ordem}</p>
            <div className="bib-opcoes" role="group" aria-label={a.ordem}>
              {ordensDisponiveis(materiais).map((opcao) => (
                <Pilula
                  key={opcao}
                  ativo={ordem === opcao}
                  rotulo={rotuloDaOrdem[opcao]}
                  aoClicar={() => setOrdem(opcao)}
                />
              ))}
            </div>
          </div>

          {grupos.map((grupo) => (
            <div key={grupo.campo} className="bib-linha">
              <p className="bib-linha__rotulo">{grupo.rotulo}</p>
              <div className="bib-opcoes" role="group" aria-label={grupo.rotulo}>
                <Pilula
                  fixa
                  ativo={selecao[grupo.campo] === ''}
                  total={grupo.total}
                  rotulo={a.tudo}
                  aoClicar={() => escolher(grupo.campo, '')}
                />
                {grupo.opcoes.map((opcao) => (
                  <Pilula
                    key={opcao.valor}
                    ativo={selecao[grupo.campo] === opcao.valor}
                    total={opcao.total}
                    rotulo={opcao.rotulo}
                    aoClicar={() => escolher(grupo.campo, opcao.valor)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <div className="bib-contagem">
        <p style={{ margin: 0 }} aria-live="polite">
          {recortado ? (
            <>
              <strong>{filtrados.length}</strong> {a.de} {total} {a.contagemVarios}
            </>
          ) : (
            <>
              <strong>{total}</strong> {total === 1 ? a.contagemUm : a.contagemVarios}
            </>
          )}
        </p>
        {recortado ? (
          <button type="button" className="bib-pilula" onClick={limpar}>
            {a.limpar}
          </button>
        ) : null}
      </div>

      {filtrados.length === 0 ? (
        <EstadoVazio
          titulo={t.comum.rotulos.nenhumResultado}
          desenho="busca"
          acao={
            <button type="button" className="bib-pilula" onClick={limpar}>
              {a.limpar}
            </button>
          }
        />
      ) : (
        <div className="pilha--g">
          {estante.map((prateleira) => (
            <section
              key={prateleira.chave || 'tudo'}
              className={prateleira.rotulo ? 'bib-prateleira' : undefined}
              aria-labelledby={prateleira.rotulo ? `prateleira-${prateleira.chave}` : undefined}
            >
              {prateleira.rotulo ? (
                <div className="bib-prateleira__cabeca">
                  <h2 className="bib-prateleira__titulo" id={`prateleira-${prateleira.chave}`}>
                    {prateleira.rotulo}
                  </h2>
                  <span className="bib-prateleira__n">
                    {prateleira.itens.length}{' '}
                    {prateleira.itens.length === 1 ? a.contagemUm : a.contagemVarios}
                  </span>
                </div>
              ) : null}
              <Estante idioma={idioma} materiais={prateleira.itens} />
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
