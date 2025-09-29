'use client';
import { useI18n, Language } from '@/lib/i18n';
import { Button } from '@/components/ui/button';

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useI18n();

  return (
    <div className="flex gap-1">
      <Button
        variant={language === 'tr' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setLanguage('tr')}
      >
        TR
      </Button>
      <Button
        variant={language === 'en' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setLanguage('en')}
      >
        EN
      </Button>
    </div>
  );
}