import { arquivoPublico } from '@/lib/format';
import { eletrificacaoJa } from '@/lib/eletrificacao';

import styles from './MarcaEletrificacao.module.css';

/** Assinatura da campanha, preservando a arte e as cores da marca original. */
export function MarcaEletrificacao({ className }: { className?: string }) {
  return (
    <div className={[styles.assinatura, className].filter(Boolean).join(' ')}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={styles.marca}
        src={arquivoPublico(eletrificacaoJa.marca.arquivo)}
        alt="Eletrifica Já"
        width={eletrificacaoJa.marca.largura}
        height={eletrificacaoJa.marca.altura}
      />
    </div>
  );
}
