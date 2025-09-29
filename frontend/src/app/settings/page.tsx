'use client';
import { useState } from 'react';
import { apiClient } from '../../lib/api';
import { useI18n } from '@/lib/i18n';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function SettingsPage() {
  const { t } = useI18n();
  const [minPrice, setMinPrice] = useState(7.0);
  const [maxFormula, setMaxFormula] = useState('current_price * 1.9');
  const [strategy, setStrategy] = useState<'aggressive'|'defensive'>('aggressive');
  const [msg, setMsg] = useState<string| null>(null);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setMsg(null);
    try {
      await apiClient.setRule({ min_price: Number(minPrice), max_price_formula: maxFormula, strategy });
      setMsg(t('settings.ruleSaved'));
    } catch (e: any) { 
      setMsg(e.message); 
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">{t('settings.title')}</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('settings.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSave} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="minPrice">{t('settings.minPrice')}</Label>
              <Input 
                id="minPrice"
                type="number" 
                step="0.01" 
                value={minPrice} 
                onChange={e=>setMinPrice(parseFloat(e.target.value))} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maxFormula">{t('settings.maxPriceFormula')}</Label>
              <Input 
                id="maxFormula"
                value={maxFormula} 
                onChange={e=>setMaxFormula(e.target.value)} 
              />
              <p className="text-xs text-muted-foreground">
                {t('settings.formulaExample', { example: 'current_price * 1.9' })}
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="strategy">{t('settings.strategy')}</Label>
              <select 
                id="strategy"
                className="w-full px-3 py-2 border rounded-md bg-background" 
                value={strategy} 
                onChange={e=>setStrategy(e.target.value as any)}
              >
                <option value="aggressive">{t('settings.aggressive')}</option>
                <option value="defensive">{t('settings.defensive')}</option>
              </select>
            </div>
            
            <div className="flex items-center gap-4">
              <Button type="submit">{t('settings.save')}</Button>
              {msg && <div className="text-sm text-muted-foreground">{msg}</div>}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}