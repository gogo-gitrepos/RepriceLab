'use client';

import { useState } from 'react';
import { apiClient } from '../../lib/api';
import { useI18n } from '@/lib/i18n';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Settings, Zap, TrendingUp, Shield, Target } from 'lucide-react';

export default function RepricingRulesPage() {
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
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Settings className="w-6 h-6" />
        <h1 className="text-3xl font-bold">Repricing Rules</h1>
      </div>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="font-medium">Active Rules</div>
                <p className="text-sm text-muted-foreground">1 rule configured</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="font-medium">Products Monitored</div>
                <p className="text-sm text-muted-foreground">5 products</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="font-medium">Strategy</div>
                <p className="text-sm text-muted-foreground capitalize">{strategy}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Repricing Rules Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Pricing Rules Configuration
          </CardTitle>
          <CardDescription>
            Set up intelligent repricing strategies to maintain competitive pricing and maximize Buy Box ownership.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="minPrice">{t('settings.minPrice')}</Label>
                <Input 
                  id="minPrice"
                  type="number" 
                  step="0.01" 
                  value={minPrice} 
                  onChange={e=>setMinPrice(parseFloat(e.target.value))} 
                />
                <p className="text-xs text-muted-foreground">Set the lowest price you're willing to sell at</p>
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
            </div>
            
            <div className="space-y-4">
              <Label htmlFor="strategy">{t('settings.strategy')}</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card 
                  className={`cursor-pointer border-2 transition-colors ${strategy === 'aggressive' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                  onClick={() => setStrategy('aggressive')}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Zap className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">Aggressive</div>
                        <p className="text-sm text-muted-foreground">Compete aggressively for Buy Box</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card 
                  className={`cursor-pointer border-2 transition-colors ${strategy === 'defensive' ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}
                  onClick={() => setStrategy('defensive')}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Shield className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium">Defensive</div>
                        <p className="text-sm text-muted-foreground">Maintain margins while staying competitive</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div className="flex items-center gap-4 pt-4 border-t">
              <Button type="submit" className="px-8">
                {t('settings.save')} Rules
              </Button>
              {msg && <div className="text-sm text-green-600">{msg}</div>}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Advanced Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Advanced Settings</CardTitle>
          <CardDescription>Fine-tune your repricing behavior</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Auto-repricing frequency</div>
              <p className="text-sm text-muted-foreground">How often to check and update prices</p>
            </div>
            <select className="px-3 py-2 border rounded-md bg-background">
              <option value="15">Every 15 minutes</option>
              <option value="30">Every 30 minutes</option>
              <option value="60">Every hour</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Pause repricing during weekends</div>
              <p className="text-sm text-muted-foreground">Reduce activity during low-traffic periods</p>
            </div>
            <input type="checkbox" className="w-4 h-4" />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Emergency stop threshold</div>
              <p className="text-sm text-muted-foreground">Stop repricing if losing Buy Box for X consecutive times</p>
            </div>
            <Input type="number" value="5" className="w-20" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}