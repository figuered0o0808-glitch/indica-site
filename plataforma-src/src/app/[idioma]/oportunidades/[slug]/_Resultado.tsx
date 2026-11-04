import type { Idioma } from '@/i18n/idiomas';
import { textos } from '@/i18n/strings';
import { data, numero } from '@/lib/format';
import type { ResultadoEdital } from '@/lib/types';
import { ClassificacaoPublica, type LinhaClassificacao } from './_Classificacao';

/** Par de numero do resultado. As cores vao inline por causa do fundo preto. */
function Numero({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div>
      <dt style={{ color: 'rgba(255, 255, 255, 0.6)' }}>{rotulo}</dt>
      <dd style={{ color: 'var(--preto)' }}>
        <span className="numero-grande">{valor}</span>
      </dd>
    </div>
  );
}

/**
 * Bloco de transparencia do resultado, ancorado em preto no topo da pagina da
 * chamada encerrada, com os projetos selecionados. Valor nao e publicado.
 */
export function Resultado({
  idioma,
  resultado,
}: {
  idioma: Idioma;
  resultado: ResultadoEdital;
}) {
  const t = textos(idioma);
  const exibirNotas = resultado.exibirNotas === true;
  const exibirClassificacao = resultado.exibirClassificacao === true;
  const somenteSelecionados = resultado.somenteSelecionados !== false;
  const selecionada = (i: LinhaClassificacao) => ['selecionada', 'aguardando-aceite'].includes(i.situacao);
  // Envia ao componente interativo somente os campos escolhidos para publicação.
  const linhas: LinhaClassificacao[] | null = Array.isArray(resultado.classificacao) ? resultado.classificacao
    .filter(i => !somenteSelecionados || selecionada(i))
    .map(i => ({ protocolo: i.protocolo, situacao: i.situacao, nome: i.nome, projeto: i.projeto,
      ...(exibirClassificacao && Number.isFinite(i.posicao) ? { posicao: i.posicao } : {}),
      ...(exibirNotas && Number.isFinite(i.nota) ? { nota: i.nota } : {}),
    })) : null;
  const totalSelecionadas = linhas ? linhas.filter(selecionada).length : resultado.apoiados.length;
  const selecionadasRotulo = { pt: 'Propostas selecionadas', en: 'Selected proposals', es: 'Propuestas seleccionadas' }[idioma];

  return (
    <section id="resultado" className="secao secao--preto">
      <div className="container">
        <div className="linha linha--fim" style={{ alignItems: 'flex-end', gap: 'var(--esp-24)' }}>
          <h2 style={{ margin: 0 }}>{t.editais.secoes.resultado}</h2>
          <p className="texto-pequeno" style={{ margin: 0 }}>
            {`${t.editais.publicadoEm} ${data(resultado.publicadoEm.slice(0, 10), idioma)}`}
          </p>
        </div>

        {resultado.fundamentacao.trim() ? <div style={{ marginTop: 28 }}>
          <div className="registro">
            <p className="registro__rotulo">{t.editais.resultadoFundamentacao}</p>
            <p style={{ margin: 0, maxWidth: '66ch', whiteSpace: 'pre-line' }}>{resultado.fundamentacao}</p>
          </div>
        </div> : null}

        <dl
          className="definicoes"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
            margin: '32px 0',
            gap: 24,
          }}
        >
          <Numero
            rotulo={t.editais.inscricoesRecebidas}
            valor={numero(resultado.inscricoesRecebidas, idioma)}
          />
          <Numero
            rotulo={selecionadasRotulo}
            valor={numero(totalSelecionadas, idioma)}
          />
        </dl>

        {linhas !== null ? <ClassificacaoPublica idioma={idioma} itens={linhas} exibirNotas={exibirNotas} exibirClassificacao={exibirClassificacao} somenteSelecionados={somenteSelecionados} notaMaxima={exibirNotas ? resultado.notaMaxima : undefined} /> : <>
        <h3 style={{ marginBottom: 14 }}>{t.editais.resultadoTabelaTitulo}</h3>

        <div className="tabela-rolagem">
          <table className="tabela">
            <caption className="sr-only">{t.editais.resultadoTabelaTitulo}</caption>
            <thead>
              <tr>
                <th scope="col">{t.editais.resultadoColunas.apoiado}</th>
                <th scope="col">{t.editais.resultadoColunas.projeto}</th>
              </tr>
            </thead>
            <tbody>
              {resultado.apoiados.map((apoiado) => (
                <tr key={`${apoiado.nome}-${apoiado.projeto}`}>
                  <td>{apoiado.nome}</td>
                  <td>{apoiado.projeto}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </>}
      </div>
    </section>
  );
}
