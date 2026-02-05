import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/layout/providers';
import { Header } from '@/components/layout/header';

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
          <Header />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
