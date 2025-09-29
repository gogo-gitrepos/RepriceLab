'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '../../lib/api';
import { useI18n } from '@/lib/i18n';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Store, Plus, Trash2, TestTube } from 'lucide-react';

interface AmazonStore {
  id: number;
  store_name: string;
  selling_partner_id: string;
  region: string;
  marketplace_ids: string[];
  last_sync: string;
  created_at: string;
  is_active: boolean;
}

export default function SettingsPage() {
  const { t } = useI18n();
  const [minPrice, setMinPrice] = useState(7.0);
  const [maxFormula, setMaxFormula] = useState('current_price * 1.9');
  const [strategy, setStrategy] = useState<'aggressive'|'defensive'>('aggressive');
  const [msg, setMsg] = useState<string| null>(null);
  
  // Amazon store management state
  const [stores, setStores] = useState<AmazonStore[]>([]);
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);

  // Demo user ID (in production, get from auth context)
  const userId = 2;

  useEffect(() => {
    loadStores();
    
    // Check for connection success in URL params
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('connected') === 'success') {
      setConnectionStatus('success');
      setTimeout(() => setConnectionStatus(null), 5000);
      loadStores(); // Refresh stores list
    }
  }, []);

  const loadStores = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/auth/amazon/stores?user_id=${userId}`);
      const data = await response.json();
      if (response.ok) {
        setStores(data.stores || []);
      }
    } catch (error) {
      console.error("Failed to load stores:", error);
    }
  };

  const connectAmazonStore = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8000/api/auth/amazon/connect?user_id=${userId}`);
      const data = await response.json();
      
      if (response.ok && data.authorization_url) {
        // Redirect to Amazon OAuth
        window.location.href = data.authorization_url;
      } else {
        console.error("Failed to initiate Amazon connection:", data.detail);
      }
    } catch (error) {
      console.error("Error connecting Amazon store:", error);
    } finally {
      setLoading(false);
    }
  };

  const disconnectStore = async (storeId: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/auth/amazon/disconnect/${storeId}`, {
        method: 'POST'
      });
      
      if (response.ok) {
        loadStores(); // Refresh stores list
      }
    } catch (error) {
      console.error("Failed to disconnect store:", error);
    }
  };

  const testConnection = async (storeId: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/auth/amazon/test-connection/${storeId}`, {
        method: 'POST'
      });
      const data = await response.json();
      
      alert(data.success ? "✅ Connection successful!" : `❌ Connection failed: ${data.message}`);
    } catch (error) {
      console.error("Failed to test connection:", error);
      alert("❌ Test connection failed");
    }
  };

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
    <div className="max-w-4xl space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">{t('settings.title')}</h2>
      
      {/* Connection Success Alert */}
      {connectionStatus === 'success' && (
        <div className="p-4 border border-green-200 bg-green-50 rounded-lg flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <div className="text-green-800">
            🎉 Amazon store connected successfully! You can now manage your products and pricing.
          </div>
        </div>
      )}

      {/* Amazon Store Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            Amazon Store Connections
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Connect your Amazon Seller Central account to enable automatic repricing
              </p>
            </div>
            <Button onClick={connectAmazonStore} disabled={loading} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {loading ? "Connecting..." : "Connect Amazon Store"}
            </Button>
          </div>

          {stores.length > 0 && (
            <div className="space-y-3">
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Connected Stores ({stores.length})</h4>
                {stores.map((store) => (
                  <div
                    key={store.id}
                    className="flex items-center justify-between p-3 border rounded-lg bg-slate-50"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h5 className="font-medium">{store.store_name}</h5>
                        <Badge variant={store.is_active ? "default" : "secondary"}>
                          {store.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        🔗 Partner ID: {store.selling_partner_id} • 🌍 Region: {store.region}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        📅 Last synced: {new Date(store.last_sync).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => testConnection(store.id)}
                        className="flex items-center gap-1"
                      >
                        <TestTube className="h-3 w-3" />
                        Test
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => disconnectStore(store.id)}
                        className="text-red-600 hover:text-red-700 flex items-center gap-1"
                      >
                        <Trash2 className="h-3 w-3" />
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {stores.length === 0 && (
            <div className="text-center py-8 text-muted-foreground border rounded-lg bg-slate-50">
              <Store className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="font-medium">No Amazon stores connected yet</p>
              <p className="text-sm">Connect your first store to start automatic repricing</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Pricing Rules */}
      <Card>
        <CardHeader>
          <CardTitle>⚙️ Repricing Rules</CardTitle>
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