import type { Idioma } from '@/i18n/idiomas';
import { textos } from '@/i18n/strings';
import { data, numero } from '@/lib/format';
import type { ResultadoEdital } from '@/lib/types';

/** Par de numero do resultado. As cores vao inline por causa do fundo preto. */
function Numero({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div>
      <dt style={{ color: 'rgba(255, 255, 255, 0.6)' }}>{rotulo}</dt>
      <dd style={{ color: 'var(--branco)' }}>
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

  return (
    <section id="resultado" className="secao secao--preto">
      <div className="container">
        <div className="linha linha--fim" style={{ alignItems: 'flex-end', gap: 'var(--esp-24)' }}>
          <h2 style={{ margin: 0 }}>{t.editais.secoes.resultado}</h2>
          <p className="texto-pequeno" style={{ margin: 0 }}>
            {`${t.editais.publicadoEm} ${data(resultado.publicadoEm, idioma)}`}
          </p>
        </div>

        <div style={{ marginTop: 28 }}>
          <div className="registro">
            <p className="registro__rotulo">{t.editais.resultadoFundamentacao}</p>
            <p style={{ margin: 0, maxWidth: '66ch', whiteSpace: 'pre-line' }}>{resultado.fundamentacao}</p>
          </div>
        </div>

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
            rotulo={t.editais.projetosApoiados}
            valor={numero(resultado.apoiados.length, idioma)}
          />
        </dl>

        <h3 style={{ marginBottom: 14 }}>{t.editais.resultadoTabelaTitulo}</h3>

        <div className="tabela-rolagem">
          <table className="tabela">
            <caption className="sr-only">{t.editais.resultadoTabelaTitulo}</caption>
            <thead>
              <tr>
                <th scope="col">{t.editais.resultadoColunas.apoiado}</th>
                <th scope="col">{t.editais.resultadoColunas.projeto}</th>
                <th scope="col">{t.editais.resultadoColunas.formato}</th>
                <th scope="col">{t.editais.resultadoColunas.uf}</th>
              </tr>
            </thead>
            <tbody>
              {resultado.apoiados.map((apoiado) => (
                <tr key={`${apoiado.nome}-${apoiado.projeto}`}>
                  <td>{apoiado.nome}</td>
                  <td>{apoiado.projeto}</td>
                  <td>{apoiado.formato}</td>
                  <td>{apoiado.uf}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
