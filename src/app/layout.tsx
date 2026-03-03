import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/layout/providers';

// Font imports (self-hosted via Fontsource - no big tech CDNs)
import '@fontsource/space-mono/400.css';
import '@fontsource/space-mono/700.css';
import '@fontsource/space-grotesk/400.css';
import '@fontsource/space-grotesk/500.css';
import '@fontsource/space-grotesk/600.css';
import '@fontsource/space-grotesk/700.css';
import '@fontsource/archivo-black';
// Buurtsauna Löyly brand fonts (public landing page)
import '@fontsource/cinzel/400.css';
import '@fontsource/cinzel/700.css';
import '@fontsource/lora/400.css';
import '@fontsource/lora/400-italic.css';
import '@fontsource/lora/700.css';

export const metadata: Metadata = {
  title: 'Community Sauna',
  description: 'Book your sauna session',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
