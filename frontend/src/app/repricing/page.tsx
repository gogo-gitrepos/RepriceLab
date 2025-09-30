'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Target, TrendingUp, DollarSign, Users, Trophy, Sparkles } from 'lucide-react';

interface Strategy {
  key: string;
  name: string;
  description: string;
  price_below_competitor: number;
  buybox_focus: boolean;
  profit_threshold: number;
}

interface DashboardStats {
  total_products: number;
  active_repricing: number;
  buybox_winning: number;
  buybox_win_rate: number;
  strategy_breakdown: Record<string, number>;
  avg_competitor_count: number;
}

export default function RepricingPage() {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [selectedStrategy, setSelectedStrategy] = useState<string>('win_buybox');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [repricing, setRepricing] = useState(false);

  useEffect(() => {
    loadStrategies();
    loadStats();
    loadCurrentStrategy();
  }, []);

  const loadCurrentStrategy = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/products?user_id=2');
      const data = await response.json();
      if (data.products && data.products.length > 0 && data.products[0].repricing_strategy) {
        setSelectedStrategy(data.products[0].repricing_strategy);
      }
    } catch (error) {
      console.error('Failed to load current strategy:', error);
    }
  };

  const loadStrategies = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/repricing/strategies');
      const data = await response.json();
      setStrategies(data.strategies || []);
      setSelectedStrategy(data.default);
    } catch (error) {
      console.error('Failed to load strategies:', error);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/repricing/dashboard-stats?user_id=2');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const activateStrategy = async (strategyKey: string) => {
    setLoading(true);
    try {
      // Get all products first
      const productsResponse = await fetch('http://localhost:8000/api/products?user_id=2');
      const productsData = await productsResponse.json();
      const productIds = productsData.products.map((p: any) => p.id);

      // Set strategy for all products
      const response = await fetch('http://localhost:8000/api/repricing/set-strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_ids: productIds,
          strategy: strategyKey,
          enabled: true,
          target_margin_percent: 15.0
        })
      });

      if (response.ok) {
        setSelectedStrategy(strategyKey);
        await loadStats();
        alert(`✅ ${strategyKey} strategy activated for all products!`);
      }
    } catch (error) {
      console.error('Failed to activate strategy:', error);
      alert('Failed to activate strategy. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const flashReprice = async () => {
    setRepricing(true);
    try {
      const response = await fetch('http://localhost:8000/api/repricing/reprice-now?user_id=2', {
        method: 'POST'
      });
      const data = await response.json();
      
      if (data.success) {
        await loadStats();
        alert(`⚡ Flash Reprice Complete!\n\n${data.repriced_count} products repriced\n${data.skipped_count} products unchanged`);
      }
    } catch (error) {
      console.error('Flash reprice failed:', error);
      alert('Flash reprice failed. Please try again.');
    } finally {
      setRepricing(false);
    }
  };

  const getStrategyIcon = (key: string) => {
    switch (key) {
      case 'win_buybox':
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 'maximize_profit':
        return <DollarSign className="w-6 h-6 text-green-500" />;
      case 'boost_sales':
        return <TrendingUp className="w-6 h-6 text-blue-500" />;
      default:
        return <Target className="w-6 h-6" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-purple-600" />
          Smart Repricing
        </h1>
        <p className="text-muted-foreground mt-2">
          Premium algorithms, simple interface - Win the Buy Box effortlessly
        </p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Buy Box Win Rate</p>
                  <p className="text-3xl font-bold text-green-600">{stats.buybox_win_rate}%</p>
                </div>
                <Trophy className="w-10 h-10 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Repricing</p>
                  <p className="text-3xl font-bold">{stats.active_repricing}</p>
                </div>
                <Zap className="w-10 h-10 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Products Winning</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.buybox_winning}</p>
                </div>
                <Target className="w-10 h-10 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Competitors</p>
                  <p className="text-3xl font-bold">{stats.avg_competitor_count}</p>
                </div>
                <Users className="w-10 h-10 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Flash Reprice Button */}
      <Card className="bg-gradient-to-r from-purple-500 to-indigo-600 border-0 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                <Zap className="w-6 h-6" />
                Flash Reprice
              </h3>
              <p className="text-purple-100">
                Instantly update all product prices based on latest competitor data
              </p>
            </div>
            <Button 
              size="lg"
              onClick={flashReprice}
              disabled={repricing || !stats?.active_repricing}
              className="bg-white text-purple-600 hover:bg-gray-100 font-bold px-8"
            >
              {repricing ? 'Repricing...' : 'Reprice Now ⚡'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Strategy Selection */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Choose Your Strategy</h2>
        <p className="text-muted-foreground mb-6">
          Select one strategy that fits your business goals. We handle the rest.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {strategies.map((strategy) => (
            <Card
              key={strategy.key}
              className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                selectedStrategy === strategy.key
                  ? 'ring-4 ring-purple-500 shadow-2xl'
                  : 'hover:shadow-xl'
              }`}
              onClick={() => activateStrategy(strategy.key)}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  {getStrategyIcon(strategy.key)}
                  {selectedStrategy === strategy.key && (
                    <Badge className="bg-purple-600">Active</Badge>
                  )}
                </div>
                <CardTitle className="text-xl">{strategy.name}</CardTitle>
                <CardDescription>{strategy.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Price Strategy:</span>
                    <span className="font-semibold">
                      ${strategy.price_below_competitor} below lowest
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Min Profit:</span>
                    <span className="font-semibold text-green-600">
                      {strategy.profit_threshold}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Buy Box Focus:</span>
                    <span className="font-semibold">
                      {strategy.buybox_focus ? '✓ Yes' : '✗ No'}
                    </span>
                  </div>
                </div>

                <Button
                  className={`w-full mt-4 ${
                    selectedStrategy === strategy.key
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600'
                      : ''
                  }`}
                  disabled={loading || selectedStrategy === strategy.key}
                >
                  {selectedStrategy === strategy.key ? 'Active ✓' : 'Activate Strategy'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
          <CardDescription>
            Our advanced algorithm works 24/7 to keep you competitive
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="font-bold text-purple-600">1</span>
                </div>
                <h3 className="font-bold">Track Competitors</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                We monitor all competitor prices, stock levels, and Buy Box status in real-time
              </p>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="font-bold text-purple-600">2</span>
                </div>
                <h3 className="font-bold">Smart Calculations</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                AI-powered algorithm calculates optimal price based on your strategy and market conditions
              </p>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="font-bold text-purple-600">3</span>
                </div>
                <h3 className="font-bold">Auto-Update</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Prices updated automatically within seconds, protecting your margins and maximizing wins
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
