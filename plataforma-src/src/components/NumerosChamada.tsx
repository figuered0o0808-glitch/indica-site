import type { Idioma } from '@/i18n/idiomas';
import { textos } from '@/i18n/strings';
import { moeda, numero } from '@/lib/format';
import type { Call } from '@/lib/types';

import styles from './NumerosChamada.module.css';

/** Os mesmos números publicados no edital, com o orçamento global em primeiro plano. */
export function NumerosChamada({ idioma, edital, compacto = false }: {
  idioma: Idioma;
  edital: Call;
  compacto?: boolean;
}) {
  const t = textos(idioma).editais;
  const vagas = edital.vagas;
  if (edital.valorTotal == null && !vagas) return null;

  return (
    <dl className={`${styles.numeros} ${compacto ? styles.compacto : ''}`}>
      {edital.valorTotal != null ? (
        <div className={styles.orcamento}>
          <dt>{t.destaque.orcamento}</dt>
          <dd>
            {edital.valorTotalAte ? <span className={styles.ate}>{t.valorAte}</span> : null}
            <span className={styles.valor}>{moeda(edital.valorTotal, idioma)}</span>
          </dd>
        </div>
      ) : null}
      {vagas ? (
        <div className={styles.propostas}>
          <dt>{t.destaque.propostas}</dt>
          <dd>{vagas.min === vagas.max ? numero(vagas.max, idioma) : `${numero(vagas.min, idioma)}–${numero(vagas.max, idioma)}`}</dd>
        </div>
      ) : null}
    </dl>
  );
}
