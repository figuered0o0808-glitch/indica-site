'use client';

import { useMemo, useState, type ReactNode } from 'react';

import { Botao } from '@/components/Botao';
import { EstadoVazio } from '@/components/EstadoVazio';
import type { Idioma } from '@/i18n/idiomas';
import { textos } from '@/i18n/strings';
import type { Call, StatusEdital, TipoEdital } from '@/lib/types';

import { CartaoEdital } from './_CartaoEdital';
import { ChamadaDestaque } from './_ChamadaDestaque';

/** Ordem canonica de exibicao dos filtros. So aparece o que existe nos dados. */
const ORDEM_STATUS: StatusEdital[] = ['aberta', 'em-avaliacao', 'encerrada', 'consulta'];
const ORDEM_TIPO: TipoEdital[] = [
  'tema-amplo',
  'macrotema',
  'pauta-especifica',
  'edital-organizacao',
];
/* Chamada sem publico declarado vale para criadores: e o caso da maioria. */
const ORDEM_PUBLICO: NonNullable<Call['publico']>[] = ['criadores', 'organizacoes', 'ambos'];
function publicoDe(edital: Call): NonNullable<Call['publico']> {
  return edital.publico ?? 'criadores';
}

interface Opcao {
  valor: string;
  rotulo: string;
  total: number;
}

/** Pilula de filtro, no padrao de botao da marca. A cor do estado vem do CSS (.aba[aria-pressed]). */
function Pilula({
  ativo,
  aoClicar,
  children,
}: {
  ativo: boolean;
  aoClicar: () => void;
  children: ReactNode;
}) {
  return (
    <button type="button" className="aba" aria-pressed={ativo} onClick={aoClicar}>
      {children}
    </button>
  );
}

/**
 * Linha de filtro: rotulo curto e pilulas, na mesma densidade do controle da
 * Biblioteca. Tres linhas cabem numa faixa so, e a primeira chamada entra na
 * tela sem rolar.
 */
function LinhaFiltro({
  rotulo,
  rotuloTodos,
  total,
  opcoes,
  valor,
  aoEscolher,
}: {
  rotulo: string;
  rotuloTodos: string;
  total: number;
  opcoes: Opcao[];
  valor: string;
  aoEscolher: (valor: string) => void;
}) {
  return (
    <div className="filtros__linha">
      <p className="filtros__rotulo">{rotulo}</p>
      <div className="filtros__opcoes" role="group" aria-label={rotulo}>
        <Pilula ativo={valor === ''} aoClicar={() => aoEscolher('')}>
          {`${rotuloTodos} (${total})`}
        </Pilula>
        {opcoes.map((opcao) => (
          <Pilula
            key={opcao.valor}
            ativo={valor === opcao.valor}
            aoClicar={() => aoEscolher(opcao.valor)}
          >
            {`${opcao.rotulo} (${opcao.total})`}
          </Pilula>
        ))}
      </div>
    </div>
  );
}

export function ListaEditais({ idioma, editais }: { idioma: Idioma; editais: Call[] }) {
  const t = textos(idioma);
  const [status, setStatus] = useState<string>('');
  const [tipo, setTipo] = useState<string>('');
  const [publico, setPublico] = useState<string>('');

  const opcoesStatus = useMemo<Opcao[]>(
    () =>
      ORDEM_STATUS.map((valor) => ({
        valor,
        rotulo: t.comum.status[valor],
        total: editais.filter((edital) => edital.status === valor).length,
      })).filter((opcao) => opcao.total > 0),
    [editais, t],
  );

  const opcoesTipo = useMemo<Opcao[]>(
    () =>
      ORDEM_TIPO.map((valor) => ({
        valor,
        rotulo: t.comum.tiposEdital[valor],
        total: editais.filter((edital) => edital.tipo === valor).length,
      })).filter((opcao) => opcao.total > 0),
    [editais, t],
  );

  const opcoesPublico = useMemo<Opcao[]>(
    () =>
      ORDEM_PUBLICO.map((valor) => ({
        valor,
        rotulo: t.comum.publicoEdital[valor],
        total: editais.filter((edital) => publicoDe(edital) === valor).length,
      })).filter((opcao) => opcao.total > 0),
    [editais, t],
  );

  /* "Para criadores e organizacoes" atende os dois filtros, e nao so o proprio. */
  const filtrados = useMemo(
    () =>
      editais.filter(
        (edital) =>
          (status === '' || edital.status === status) &&
          (tipo === '' || edital.tipo === tipo) &&
          (publico === '' || publicoDe(edital) === publico || publicoDe(edital) === 'ambos'),
      ),
    [editais, status, tipo, publico],
  );

  const temFiltro = status !== '' || tipo !== '' || publico !== '';
  const limpar = () => {
    setStatus('');
    setTipo('');
    setPublico('');
  };

  /*
   * Sem nenhuma chamada publicada nao ha o que filtrar nem contar: a pagina
   * mostra o bloco SemChamadas no lugar desta lista. Com uma unica chamada,
   * filtro e contagem tambem nao acrescentam nada, e ela e publicada em
   * largura inteira: meia grade faria a unica chamada do programa parecer
   * uma lista pela metade.
   */
  if (editais.length === 0) return null;
  if (editais.length === 1) {
    return <ChamadaDestaque idioma={idioma} edital={editais[0]} />;
  }

  return (
    <>
      <section className="filtros" aria-label={t.editais.filtrosTitulo}>
        <LinhaFiltro
          rotulo={t.editais.filtroStatus}
          rotuloTodos={t.editais.todasSituacoes}
          total={editais.length}
          opcoes={opcoesStatus}
          valor={status}
          aoEscolher={setStatus}
        />
        <LinhaFiltro
          rotulo={t.editais.filtroTipo}
          rotuloTodos={t.editais.todosTipos}
          total={editais.length}
          opcoes={opcoesTipo}
          valor={tipo}
          aoEscolher={setTipo}
        />
        {opcoesPublico.length > 1 ? (
          <LinhaFiltro
            rotulo={t.editais.filtroPublico}
            rotuloTodos={t.editais.todosPublicos}
            total={editais.length}
            opcoes={opcoesPublico}
            valor={publico}
            aoEscolher={setPublico}
          />
        ) : null}
      </section>

      <div className="barra-resultado">
        <p style={{ margin: 0 }} aria-live="polite">
          {`${filtrados.length} ${
            filtrados.length === 1 ? t.editais.contagemUma : t.editais.contagemVarias
          }`}
        </p>
        {temFiltro ? (
          <Botao variante="discreto" tamanho="pequeno" onClick={limpar}>
            {t.editais.limparFiltros}
          </Botao>
        ) : null}
      </div>

      {filtrados.length === 0 ? (
        <EstadoVazio
          titulo={t.editais.vazioTitulo}
          desenho="busca"
          acao={
            <Botao variante="secundario" tamanho="pequeno" onClick={limpar}>
              {t.editais.limparFiltros}
            </Botao>
          }
        />
      ) : (
        <div className="grade--2">
          {filtrados.map((edital) => (
            <CartaoEdital key={edital.slug} idioma={idioma} edital={edital} />
          ))}
        </div>
      )}
    </>
  );
}
