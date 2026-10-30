import { arquivoPublico } from '@/lib/format';

/**
 * Uma organizacao, mostrada pela marca e nao pelo nome. Regra do cliente:
 * sempre que a INDICA aparecer, aparece a logo. O nome fica no alt, para
 * leitor de tela e para o caso de a imagem nao carregar. Sem logo declarada,
 * sai o nome mesmo.
 */
export function Organizacao({
  nome,
  logo,
  altura = 15,
}: {
  nome: string;
  logo?: string | null;
  /** Altura da marca em px; a largura acompanha. */
  altura?: number;
}) {
  if (!logo) return <>{nome}</>;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={arquivoPublico(logo)}
      alt={nome}
      style={{ height: altura, width: 'auto', display: 'inline-block', verticalAlign: 'middle' }}
    />
  );
}
