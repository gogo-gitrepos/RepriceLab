'use client';
import { usePathname } from 'next/navigation';
import { NavigationContent } from './navigation';
import { TopHeader } from './top-header';

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublicPage = pathname === '/' || 
                       pathname === '/login' || 
                       pathname === '/register' ||
                       pathname === '/features' || 
                       pathname === '/pricing' || 
                       pathname === '/contact' ||
                       pathname.startsWith('/product/') ||
                       pathname.startsWith('/resources/') ||
                       pathname.startsWith('/company/') ||
                       pathname.startsWith('/legal/');

  if (isPublicPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr] grid-cols-[256px_1fr]">
      <div className="col-span-2">
        <TopHeader />
      </div>
      <NavigationContent />
      <main className="p-4 md:p-8">{children}</main>
    </div>
  );
}
