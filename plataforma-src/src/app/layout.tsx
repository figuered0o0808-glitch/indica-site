import type { Metadata, Viewport } from 'next';

import './globals.css';

import { PROGRAM_NAME, PROGRAM_TAGLINE } from '@/config/program';
import { BASE, ORIGEM, enderecoDeArquivo } from '@/lib/seo';
import { AppProvider } from '@/state/AppState';

/*
 * O que toda pagina herda: a marca na aba e no atalho do celular, e a imagem
 * que aparece quando um link do site circula. Titulo e descricao de cada
 * pagina viram og:title e og:description sozinhos.
 */
export const metadata: Metadata = {
  metadataBase: new URL(`${ORIGEM}${BASE}/`),
  title: PROGRAM_NAME,
  description: PROGRAM_TAGLINE,
  icons: {
    icon: [
      { url: enderecoDeArquivo('/marca/icone.svg'), type: 'image/svg+xml' },
      { url: enderecoDeArquivo('/marca/icone-32.png'), sizes: '32x32', type: 'image/png' },
      { url: enderecoDeArquivo('/marca/icone-192.png'), sizes: '192x192', type: 'image/png' },
    ],
    apple: enderecoDeArquivo('/marca/icone-180.png'),
  },
  openGraph: {
    siteName: PROGRAM_NAME,
    type: 'website',
    images: [{ url: enderecoDeArquivo('/marca/compartilhar.png'), width: 1200, height: 630, alt: PROGRAM_NAME }],
  },
  twitter: { card: 'summary_large_image' },
};

export const viewport: Viewport = { themeColor: '#000000' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
