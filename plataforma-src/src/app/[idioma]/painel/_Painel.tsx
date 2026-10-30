'use client';

/**
 * Painel unico da plataforma: a area de trabalho de quem tem cadastro, com
 * as candidaturas enviadas e os cursos.
 *
 * Tres estados, nesta ordem:
 *
 * 1. Cadastro fechado (`cadastroAberto()` falso, que e o estado de hoje):
 *    nao existe cadastro possivel nem dado para mostrar. A pagina fica em
 *    duas linhas e dois links. Sem tabela, sem indicador.
 * 2. Cadastro aberto e visitante sem cadastro: convite.
 * 3. Cadastro aberto e pessoa cadastrada: o painel propriamente dito, que
 *    volta inteiro assim que houver conteudo publicado.
 *
 * O painel nao esta na navegacao e so e alcancado por link direto, o que
 * basta enquanto ele nao tem o que mostrar.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';

import { Botao } from '@/components/Botao';
import { CabecalhoPagina } from '@/components/CabecalhoPagina';
import { Selo } from '@/components/Selo';
import type { Idioma } from '@/i18n/idiomas';
import { textos } from '@/i18n/strings';
import { rota } from '@/lib/rotas';
import { data } from '@/lib/format';
import type { Call, Course } from '@/lib/types';
import { useApp } from '@/state/AppState';

import { Candidaturas, candidaturasDoPainel } from './_Candidaturas';
import { Cursos, cursosDoPainel } from './_Cursos';
import { ResumoPainel, SecaoPainel } from './_PainelUI';

/** Estado de hoje: o painel abre junto com o cadastro. */
function PainelFechado({ idioma }: { idioma: Idioma }) {
  const s = textos(idioma).paineis;
  const f = s.fechado;

  return (
    <>
      <CabecalhoPagina estreito olho={s.olho} titulo={f.titulo} descricao={f.descricao} />

      <div className="secao secao--curta">
        <div className="container-estreito">
          <div className="linha">
            <Botao href={rota(idioma, 'oportunidades')} variante="secundario">
              {s.verOportunidades}
            </Botao>
            <Botao href={rota(idioma, 'biblioteca')} variante="secundario">
              {s.verBiblioteca}
            </Botao>
          </div>
        </div>
      </div>
    </>
  );
}

/** Cadastro aberto, visitante ainda sem cadastro: a mesma abertura das outras paginas. */
function Convite({ idioma }: { idioma: Idioma }) {
  const s = textos(idioma).paineis;

  return (
    <>
      <CabecalhoPagina estreito olho={s.olho} titulo={s.convite.titulo} />

      <div className="secao secao--curta">
        <div className="container-estreito">
          <div className="linha">
            <Botao href={rota(idioma, 'cadastro')}>{s.convite.acao}</Botao>
            <Botao href={rota(idioma, 'oportunidades')} variante="secundario">
              {s.verOportunidades}
            </Botao>
          </div>
        </div>
      </div>
    </>
  );
}

export function Painel({
  idioma,
  aberto,
  abertas,
  catalogoEditais,
  catalogo,
}: {
  idioma: Idioma;
  /** Se o cadastro esta aberto (ha chamada ou turma aceitando inscricao). */
  aberto: boolean;
  /** Chamadas com inscricao aberta, para o estado vazio das candidaturas. */
  abertas: Call[];
  /** Todas as chamadas publicadas, inclusive as que nao recebem inscricoes. */
  catalogoEditais: Call[];
  /** Catalogo de cursos, para cruzar com as inscricoes deste navegador. */
  catalogo: Course[];
}) {
  const { candidaturas, cadastrado, cursosInscritos, recibos, atualizarRecibos, hidratado, nome } = useApp();

  const s = textos(idioma).paineis;
  const envio = textos(idioma).comum.envio;
  const [tokenUrl, setTokenUrl] = useState<string>();
  const [atualizando, setAtualizando] = useState(false);
  const [consulta, setConsulta] = useState<'ok' | 'erro'>();
  const atualizar = useCallback(async (token?: string) => {
    setAtualizando(true); setConsulta(undefined);
    try { setConsulta(await atualizarRecibos(token) ? 'ok' : 'erro'); }
    catch { setConsulta('erro'); }
    finally { setAtualizando(false); }
  }, [atualizarRecibos]);
  useEffect(() => {
    if (!hidratado) return;
    const token = new URLSearchParams(window.location.search).get('recibo')?.trim() || undefined;
    setTokenUrl(token);
    if (token || recibos.length || candidaturas.some((c) => c.reciboToken)) void atualizar(token);
    // Uma consulta por entrada/hidratação. Resultados não disparam nova consulta.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hidratado, atualizar]);

  const candidaturasAtuais = useMemo(
    () => candidaturasDoPainel(catalogoEditais, candidaturas),
    [catalogoEditais, candidaturas],
  );

  const linhasCursos = useMemo(
    () => cursosDoPainel(catalogo, cursosInscritos, recibos),
    [catalogo, cursosInscritos, recibos],
  );

  const emAvaliacao = candidaturasAtuais.filter(
    (candidatura) => ['em-avaliacao', 'enviada', 'recebida'].includes(candidatura.status),
  ).length;
  const aprovadas = candidaturasAtuais.filter((candidatura) => ['aprovada', 'selecionada'].includes(candidatura.status)).length;

  // Sem chamada aberta e sem curso com turma aberta nao ha cadastro possivel,
  // e sem cadastro nao ha o que acompanhar.
  // Enquanto o estado nao foi lido do navegador, nada e desenhado: assim a
  // pagina nao pisca entre o convite e o painel.
  if (!hidratado) return <div className="secao" style={{ minHeight: '60vh' }} />;

  const temComprovante = recibos.length > 0 || candidaturas.length > 0 || Boolean(tokenUrl);
  if (!aberto && !cadastrado && !temComprovante) return <PainelFechado idioma={idioma} />;
  if (!cadastrado && !temComprovante) return <Convite idioma={idioma} />;

  // A faixa de indicadores so aparece quando ha algo para contar: quatro
  // zeros lado a lado nao informam nada.
  const temRegistro = candidaturasAtuais.length > 0 || linhasCursos.length > 0;

  return (
    <>
      <CabecalhoPagina
        olho={s.olho}
        titulo={nome || s.titulo}
        acoes={
          <Botao href={rota(idioma, 'oportunidades')} variante="secundario">
            {s.verOportunidades}
          </Botao>
        }
      />

      {temComprovante ? <SecaoPainel id="comprovantes" titulo={envio.comprovantes} acoes={
        <Botao onClick={() => void atualizar(tokenUrl)} disabled={atualizando} variante="secundario" tamanho="pequeno">{atualizando ? envio.atualizando : envio.atualizar}</Botao>
      }>
        {atualizando ? <p role="status">{envio.consulta}</p> : null}
        {consulta ? <p role={consulta === 'erro' ? 'alert' : 'status'} className={consulta === 'erro' ? 'campo__erro' : 'nota'}>{consulta === 'erro' ? envio.semAtualizacao : envio.atualizado}</p> : null}
        {recibos.length ? <div className="pilha">
          {recibos.map((recibo) => <article className="cartao" key={recibo.reciboToken}>
            <h3 className="cartao__titulo">{recibo.titulo}</h3>
            <dl className="definicoes definicoes--2">
              {recibo.protocolo ? <div><dt>{envio.protocolo}</dt><dd>{recibo.protocolo}</dd></div> : null}
              <div><dt>{envio.enviadaEm}</dt><dd>{data(recibo.enviadaEm.slice(0, 10), idioma)}</dd></div>
              <div><dt>{envio.situacao}</dt><dd><Selo idioma={idioma} status={recibo.estado} /></dd></div>
            </dl>
            <Botao href={rota(idioma, `painel/?recibo=${encodeURIComponent(recibo.reciboToken)}`)} tamanho="pequeno" variante="secundario">{envio.linkComprovante}</Botao>
            <p className="nota">{envio.linkPrivado}</p>
          </article>)}
        </div> : null}
      </SecaoPainel> : null}

      {temRegistro ? (
        <div className="secao secao--curta">
          <div className="container">
            <ResumoPainel
              itens={[
                { rotulo: s.resumo.enviadas, valor: String(candidaturasAtuais.length) },
                { rotulo: s.resumo.emAvaliacao, valor: String(emAvaliacao) },
                { rotulo: s.resumo.aprovadas, valor: String(aprovadas) },
                ...(catalogo.length > 0
                  ? [{ rotulo: s.resumo.cursos, valor: String(linhasCursos.length) }]
                  : []),
              ]}
            />
          </div>
        </div>
      ) : null}

      {cadastrado || candidaturasAtuais.length ? <SecaoPainel id="candidaturas" titulo={s.candidaturasTitulo}>
        <Candidaturas idioma={idioma} candidaturas={candidaturasAtuais} abertas={abertas} />
      </SecaoPainel> : null}

      {catalogo.length > 0 ? (
        <SecaoPainel
          id="cursos"
          titulo={s.cursosTitulo}
          marcador={3}
          fundo
          acoes={
            linhasCursos.length > 0 ? (
              <Botao href={rota(idioma, 'biblioteca')} variante="secundario" tamanho="pequeno">
                {s.verBiblioteca}
              </Botao>
            ) : null
          }
        >
          <Cursos idioma={idioma} linhas={linhasCursos} />
        </SecaoPainel>
      ) : null}
    </>
  );
}
