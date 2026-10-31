'use client';

import { Botao } from '@/components/Botao';
import { Marcador } from '@/components/Marcador';
import { Vagas } from '@/components/Vagas';
import type { Idioma } from '@/i18n/idiomas';
import { textos } from '@/i18n/strings';
import { data } from '@/lib/format';
import { rota } from '@/lib/rotas';
import type { Call } from '@/lib/types';
import { useApp } from '@/state/AppState';

import { DocumentoEdital } from '../_DocumentoEdital';
import { prazoDaChamada } from '../_prazo';

/** Etapa de divulgacao do resultado, quando existe no cronograma da chamada. */
function previsaoDoResultado(idioma: Idioma, edital: Call): string | null {
  const termo = textos(idioma).editais.termoEtapaResultado;
  const etapa = edital.cronograma.find((item) => {
    const nome = item.etapa.toLowerCase();
    return nome.includes(termo);
  });
  return etapa ? etapa.data : null;
}

function ancoras(idioma: Idioma, edital: Call): { id: string; rotulo: string }[] {
  const { secoes } = textos(idioma).editais;
  const itens: { id: string; rotulo: string }[] = [];
  if (edital.status === 'encerrada' && edital.resultado) {
    itens.push({ id: 'resultado', rotulo: secoes.resultado });
  }
  itens.push(
    { id: 'apresentacao', rotulo: secoes.apresentacao },
    ...(edital.escopo.length > 0 ? [{ id: 'escopo', rotulo: secoes.escopo }] : []),
    ...(edital.naoApoiado.length > 0 ? [{ id: 'nao-apoiado', rotulo: secoes.naoApoiado }] : []),
    ...(edital.criterios.length > 0 || edital.criteriosDescricao ? [{ id: 'criterios', rotulo: secoes.criterios }] : []),
    /* A pagina so publica cronograma quando ha etapas. */
    ...(edital.cronograma.length > 0 ? [{ id: 'cronograma', rotulo: secoes.cronograma }] : []),
    ...(edital.banca.length > 0 || edital.bancaDescricao ? [{ id: 'banca', rotulo: secoes.banca }] : []),
    ...(edital.distribuicao.length > 0 ? [{ id: 'distribuicao', rotulo: secoes.distribuicao }] : []),
    ...(edital.secoesComplementares ?? []).map((secao) => ({ id: secao.id, rotulo: secao.titulo })),
  );
  return itens;
}

/** Par de data com rotulo curto, usado no cartao de candidatura. */
function Data({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div>
      <p className="texto-mini" style={{ margin: 0 }}>
        {rotulo}
      </p>
      <p style={{ margin: '2px 0 0' }}>{valor}</p>
    </div>
  );
}

export function Lateral({ idioma, edital }: { idioma: Idioma; edital: Call }) {
  const t = textos(idioma);
  const tc = t.fluxos.candidatura;
  const { cadastrado } = useApp();
  const previsao = previsaoDoResultado(idioma, edital);
  const prazo = prazoDaChamada(idioma, edital);

  /*
   * A lateral e a coluna rosa da home que continuou: mesma superficie, mesmo
   * marcador de pontos no lugar de icone, as vagas como fileira de pontos. O
   * documento ao lado fica em branco; a cor e da acao, nao do texto.
   */
  return (
    <aside className="lateral">
      <div className="coluna coluna--rosa coluna--solta">
        <div className="coluna__cabeca">
          <Marcador arranjo={1} />
          <span className="rotulo">{edital.status === 'consulta' ? t.editais.consultaTitulo : t.editais.candidaturaTitulo}</span>
        </div>

        <Vagas idioma={idioma} chamada={edital} />

        {edital.status === 'aberta' ? (
          <>
            <Data rotulo={prazo.rotulo} valor={prazo.valor} />
            {cadastrado ? (
              <Botao href={rota(idioma, `oportunidades/${edital.slug}/candidatura`)} largo>
                {t.comum.acoes.candidatarProjeto}
              </Botao>
            ) : (
              <Botao href={rota(idioma, `cadastro/?retorno=${encodeURIComponent(edital.slug)}`)} largo>
                {tc.cadastro.acao}
              </Botao>
            )}
          </>
        ) : null}

        {edital.status === 'consulta' ? (
          <>
            <p className="texto-pequeno texto-secundario" style={{ margin: 0 }}>{t.editais.consultaAviso}</p>
            <DocumentoEdital idioma={idioma} edital={edital} />
            <Botao href={rota(idioma, 'oportunidades')} variante="secundario" largo>{t.editais.voltarLista}</Botao>
          </>
        ) : null}

        {edital.status === 'em-avaliacao' ? (
          <>
            <p className="texto-pequeno texto-secundario" style={{ margin: 0 }}>
              {t.editais.emAvaliacaoAviso}
            </p>
            {previsao ? (
              <Data rotulo={t.editais.resultadoPrevistoPara} valor={data(previsao, idioma)} />
            ) : null}
            <Botao href={rota(idioma, 'oportunidades')} variante="secundario" largo>
              {t.editais.voltarLista}
            </Botao>
          </>
        ) : null}

        {edital.status === 'encerrada' ? (
          <>
            <p className="texto-pequeno texto-secundario" style={{ margin: 0 }}>
              {t.editais.encerradaAviso}
            </p>
            {edital.resultado ? (
              <>
                <Data
                  rotulo={t.editais.resultadoPublicadoEm}
                  valor={data(edital.resultado.publicadoEm, idioma)}
                />
                <Botao href="#resultado" largo>
                  {t.editais.verResultado}
                </Botao>
              </>
            ) : null}
            <Botao href={rota(idioma, 'oportunidades')} variante="secundario" largo>
              {t.editais.voltarLista}
            </Botao>
          </>
        ) : null}
      </div>

      <nav className="cartao cartao--compacto" aria-label={t.editais.nestaPagina}>
        <p className="olho" style={{ margin: 0 }}>
          {t.editais.nestaPagina}
        </p>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }} className="pilha--p">
          {ancoras(idioma, edital).map((item) => (
            <li key={item.id} style={{ margin: 0 }}>
              <a href={`#${item.id}`} className="texto-pequeno">
                {item.rotulo}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
