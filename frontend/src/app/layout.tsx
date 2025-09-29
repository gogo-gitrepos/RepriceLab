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
          <div className="min-h-screen grid grid-rows-[auto_1fr] grid-cols-[256px_1fr]">
            {/* Header spanning full width */}
            <div className="col-span-2">
              <TopHeader />
            </div>
            
            {/* Sidebar and main content */}
            <NavigationContent />
            <main className="p-4 md:p-8">{children}</main>
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}