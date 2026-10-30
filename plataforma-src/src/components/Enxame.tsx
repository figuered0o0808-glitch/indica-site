import { LogoIndica } from '@/components/LogoIndica';
import { AssinaturaIndica } from '@/components/AssinaturaIndica';

export function Enxame({ largura = 560, rotulo = 'INDICA' }: { largura?: number; rotulo?: string }) {
  return <div className="marca-indica" style={{ width: largura, maxWidth: '100%' }}><LogoIndica altura={168} rotulo={rotulo} /></div>;
}

export function Ponte({ rotulo }: { rotulo?: string }) {
  return <div className="ponte">
    <AssinaturaIndica />
    {rotulo ? <span className="ponte__rotulo">{rotulo}</span> : null}
  </div>;
}
