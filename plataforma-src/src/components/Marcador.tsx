import { AssinaturaIndica } from '@/components/AssinaturaIndica';

/** Assinatura compacta; mantém a mesma ordem e cores em todas as seções. */
export function Marcador({ tamanho = 22 }: { arranjo?: 1 | 2 | 3; tamanho?: number }) {
  return <AssinaturaIndica tamanho={Math.round(tamanho * 0.4)} className="marcador" />;
}
