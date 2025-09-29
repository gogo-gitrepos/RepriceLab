import './globals.css';
import React from 'react';
import { ClientProviders } from './client-providers';
import { ConditionalLayout } from './conditional-layout';

export const metadata = { title: 'RepriceLab', description: 'Advanced Amazon Repricer Dashboard' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground">
        <ClientProviders>
          <ConditionalLayout>{children}</ConditionalLayout>
        </ClientProviders>
      </body>
    </html>
  );
}