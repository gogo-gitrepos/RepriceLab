'use client';
import { useI18n } from '@/lib/i18n';
import { LanguageSwitcher } from '@/components/language-switcher';

export function NavigationContent() {
  const { t } = useI18n();

  return (
    <aside className="w-64 border-r bg-card p-4 hidden md:block">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">BuyBox SaaS</h1>
        <LanguageSwitcher />
      </div>
      <nav className="space-y-2">
        <a className="block px-3 py-2 rounded-md hover:bg-accent" href="/">
          {t('nav.dashboard')}
        </a>
        <a className="block px-3 py-2 rounded-md hover:bg-accent" href="/products">
          {t('nav.products')}
        </a>
        <a className="block px-3 py-2 rounded-md hover:bg-accent" href="/settings">
          {t('nav.settings')}
        </a>
      </nav>
      <div className="mt-6 text-xs text-muted-foreground">
        API: {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}
      </div>
    </aside>
  );
}