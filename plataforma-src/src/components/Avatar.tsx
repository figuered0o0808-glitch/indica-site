import { iniciais } from '@/lib/format';
import type { CorChip } from '@/components/Chip';

/** Avatar de iniciais sobre fundo da paleta. Nunca foto de pessoa. */
export function Avatar({
  nome,
  cor = 'areia',
  tamanho = 'normal',
}: {
  nome: string;
  cor?: CorChip;
  tamanho?: 'pequeno' | 'normal' | 'grande';
}) {
  const sufixo = tamanho === 'grande' ? ' avatar--g' : tamanho === 'pequeno' ? ' avatar--p' : '';
  return (
    <span className={`avatar avatar--${cor}${sufixo}`} aria-hidden="true">
      {iniciais(nome)}
    </span>
  );
}
