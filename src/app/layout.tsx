import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/layout/providers';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';

// Font imports (self-hosted via Fontsource - no big tech CDNs)
import '@fontsource/space-mono/400.css';
import '@fontsource/space-mono/700.css';
import '@fontsource/space-grotesk/400.css';
import '@fontsource/space-grotesk/500.css';
import '@fontsource/space-grotesk/600.css';
import '@fontsource/space-grotesk/700.css';

export const metadata: Metadata = {
  title: 'Community Sauna',
  description: 'Book your sauna session',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            {children}
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
