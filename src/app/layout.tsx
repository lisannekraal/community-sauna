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
// Löyly public brand font (self-hosted, not loaded from Google CDN)
import '@fontsource/playfair-display/400.css';
import '@fontsource/playfair-display/400-italic.css';
import '@fontsource/playfair-display/600.css';
import '@fontsource/playfair-display/700.css';
import '@fontsource/playfair-display/800.css';

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
