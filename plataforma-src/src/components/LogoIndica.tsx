import { arquivoPublico } from '@/lib/format';

export function LogoIndica({ altura = 28, rotulo = 'INDICA', className }: { altura?: number; rotulo?: string; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img className={className} src={arquivoPublico('/marca/indica.png')} alt={rotulo}
      width={Math.round(altura * 3228 / 968)} height={altura}
      style={{ display: 'block', width: 'auto', maxWidth: '100%', height: altura, objectFit: 'contain' }} />
  );
}
