'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '../../lib/api';
import { useI18n } from '@/lib/i18n';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Settings, Zap, TrendingUp, Shield, Target, Trophy, DollarSign } from 'lucide-react';

interface Product {
  id: number;
  sku: string;
  title: string;
  repricing_enabled: boolean;
  repricing_strategy: string;
  target_margin_percent: number;
}

export default function RepricingRulesPage() {
  const { t } = useI18n();
  const [minPrice, setMinPrice] = useState(7.0);
  const [maxFormula, setMaxFormula] = useState('current_price * 1.9');
  const [strategy, setStrategy] = useState<'win_buybox'|'maximize_profit'|'boost_sales'>('win_buybox');
  const [targetMargin, setTargetMargin] = useState(15.0);
  const [products, setProducts] = useState<Product[]>([]);
  const [msg, setMsg] = useState<string| null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/products?user_id=2`);
      const data = await response.json();
      setProducts(data.products || []);
      
      // Set strategy from first product if available
      if (data.products && data.products.length > 0 && data.products[0].repricing_strategy) {
        setStrategy(data.products[0].repricing_strategy);
        setTargetMargin(data.products[0].target_margin_percent || 15.0);
      }
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  };

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setMsg(null);
    setLoading(true);
    
    try {
      const productIds = products.map(p => p.id);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      
      // Use new repricing API
      const response = await fetch(`${apiUrl}/api/repricing/set-strategy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_ids: productIds,
          strategy: strategy,
          enabled: true,
          target_margin_percent: targetMargin
        })
      });
      
      if (response.ok) {
        await loadProducts();
        setMsg('✅ Rules saved successfully! All products updated.');
      } else {
        setMsg('Failed to save rules. Please try again.');
      }
    } catch (e: any) { 
      setMsg('Error: ' + e.message); 
    } finally {
      setLoading(false);
    }
  };

  const getStrategyStats = () => {
    const activeCount = products.filter(p => p.repricing_enabled).length;
    return {
      active: activeCount,
      total: products.length,
      strategy: strategy
    };
  };

  const stats = getStrategyStats();

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
                <div className="font-medium">Active Products</div>
                <p className="text-sm text-muted-foreground">{stats.active} of {stats.total} products</p>
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
                <p className="text-sm text-muted-foreground">{products.length} products</p>
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
                <div className="font-medium">Current Strategy</div>
                <p className="text-sm text-muted-foreground capitalize">{strategy.replace('_', ' ')}</p>
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
            Repricing Strategy Configuration
          </CardTitle>
          <CardDescription>
            Choose your repricing strategy - changes apply to all products instantly
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSave} className="space-y-6">
            <div className="space-y-4">
              <Label htmlFor="strategy">Select Repricing Strategy</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Win Buy Box Strategy */}
                <Card 
                  className={`cursor-pointer border-2 transition-all duration-200 ${
                    strategy === 'win_buybox' 
                      ? 'border-yellow-500 bg-yellow-50 ring-2 ring-yellow-200 shadow-lg' 
                      : 'border-gray-200 hover:border-yellow-300'
                  }`}
                  onClick={() => setStrategy('win_buybox')}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col space-y-3">
                      <div className="flex items-center justify-between">
                        <Trophy className="w-8 h-8 text-yellow-500" />
                        {strategy === 'win_buybox' && (
                          <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-lg">Win Buy Box</div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Aggressively win Buy Box with smart pricing
                        </p>
                      </div>
                      <div className="pt-2 border-t border-gray-200 text-xs space-y-1">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Price below:</span>
                          <span className="font-semibold">$0.01</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Min profit:</span>
                          <span className="font-semibold text-green-600">10%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Maximize Profit Strategy */}
                <Card 
                  className={`cursor-pointer border-2 transition-all duration-200 ${
                    strategy === 'maximize_profit' 
                      ? 'border-green-500 bg-green-50 ring-2 ring-green-200 shadow-lg' 
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                  onClick={() => setStrategy('maximize_profit')}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col space-y-3">
                      <div className="flex items-center justify-between">
                        <DollarSign className="w-8 h-8 text-green-500" />
                        {strategy === 'maximize_profit' && (
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-lg">Maximize Profit</div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Balance profit margins with Buy Box wins
                        </p>
                      </div>
                      <div className="pt-2 border-t border-gray-200 text-xs space-y-1">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Price below:</span>
                          <span className="font-semibold">$0.05</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Min profit:</span>
                          <span className="font-semibold text-green-600">15%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Boost Sales Strategy */}
                <Card 
                  className={`cursor-pointer border-2 transition-all duration-200 ${
                    strategy === 'boost_sales' 
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200 shadow-lg' 
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => setStrategy('boost_sales')}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col space-y-3">
                      <div className="flex items-center justify-between">
                        <TrendingUp className="w-8 h-8 text-blue-500" />
                        {strategy === 'boost_sales' && (
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-lg">Boost Sales</div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Drive high sales velocity with competitive pricing
                        </p>
                      </div>
                      <div className="pt-2 border-t border-gray-200 text-xs space-y-1">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Price below:</span>
                          <span className="font-semibold">$0.10</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Min profit:</span>
                          <span className="font-semibold text-green-600">8%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Target Margin */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="targetMargin">Target Profit Margin (%)</Label>
                <Input 
                  id="targetMargin"
                  type="number" 
                  step="0.1" 
                  value={targetMargin} 
                  onChange={e=>setTargetMargin(parseFloat(e.target.value))} 
                />
                <p className="text-xs text-muted-foreground">
                  Minimum profit margin to maintain while repricing
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 pt-4 border-t">
              <Button 
                type="submit" 
                className="px-8 bg-gradient-to-r from-purple-600 to-indigo-600"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Rules & Apply to All Products'}
              </Button>
              {msg && (
                <div className={`text-sm ${msg.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
                  {msg}
                </div>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Products List */}
      <Card>
        <CardHeader>
          <CardTitle>Products Using This Strategy</CardTitle>
          <CardDescription>
            {stats.active} products have repricing enabled with "{strategy.replace('_', ' ')}" strategy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {products.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No products found. Add products to start repricing.
              </div>
            ) : (
              products.map(product => (
                <div 
                  key={product.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <div className="font-medium">{product.title}</div>
                    <div className="text-sm text-muted-foreground">SKU: {product.sku}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm">
                      {product.repricing_enabled ? (
                        <span className="text-green-600 font-medium">✓ Active</span>
                      ) : (
                        <span className="text-gray-400">Inactive</span>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground capitalize">
                      {product.repricing_strategy?.replace('_', ' ')}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Zap className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-blue-900 mb-1">How It Works</h3>
              <p className="text-sm text-blue-800">
                When you save a strategy here, it applies to all your products instantly. 
                The same strategy will be shown in the Smart Repricing page. 
                Our algorithm continuously monitors competitors and adjusts your prices automatically based on your chosen strategy.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
