import './globals.css';
import React from 'react';
import { ClientProviders } from './client-providers';
import { NavigationContent } from './navigation';
import { TopHeader } from './top-header';

export const metadata = { title: 'RepriceLab', description: 'Advanced Amazon Repricer Dashboard' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className="min-h-screen bg-background text-foreground">
        <ClientProviders>
          <div className="flex min-h-screen">
            <NavigationContent />
            <div className="flex-1 flex flex-col">
              <div className="w-full">
                <TopHeader />
              </div>
              <main className="flex-1 p-4 md:p-8">{children}</main>
            </div>
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}