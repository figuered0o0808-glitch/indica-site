import type { Idioma } from '@/i18n/idiomas';
import { textos, type Strings } from '@/i18n/strings';

type Chave = keyof Strings['comum']['status'];

const ATIVOS: Chave[] = ['aberta', 'aprovada', 'aberto'];
const APAGADOS: Chave[] = ['encerrada', 'nao-selecionada', 'em-breve', 'concluido'];

/** Selo de estado. O rotulo sai de strings.ts. */
export function Selo({
  status,
  rotulo,
  idioma,
}: {
  status: string;
  rotulo?: string;
  idioma: Idioma;
}) {
  const t = textos(idioma);
  const chave = status as Chave;
  const texto = rotulo ?? t.comum.status[chave] ?? status;
  const modificador = ATIVOS.includes(chave)
    ? 'selo--ativo'
    : APAGADOS.includes(chave)
      ? 'selo--apagado'
      : 'selo--neutro';
  return <span className={`selo ${modificador}`}>{texto}</span>;
}
