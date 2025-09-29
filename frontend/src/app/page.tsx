'use client';
import React, { useState, useEffect } from 'react';
import { apiClient, MetricsSummary, Product } from '../lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useI18n } from '@/lib/i18n';
import { ChevronDown, MessageCircle, Phone, Mail, BarChart3, TrendingUp, Users, Activity, Target, Zap, ShoppingCart, Award } from 'lucide-react';

export default function DashboardPage() {
  const { t } = useI18n();
  const [metrics, setMetrics] = useState<MetricsSummary | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    setError(null);
    try {
      const [m, p] = await Promise.all([apiClient.getMetrics(), apiClient.getProducts()]);
      setMetrics(m); 
      setProducts(p);
    } catch (e: any) { 
      setError(e.message); 
    }
  };

  useEffect(() => { refresh(); }, []);

  // Demo data for the dashboard
  const insightsData = [
    { label: 'Category A', percentage: 75, color: 'bg-blue-500' },
    { label: 'Category B', percentage: 60, color: 'bg-green-500' },
    { label: 'Category C', percentage: 45, color: 'bg-purple-500' },
    { label: 'Category D', percentage: 30, color: 'bg-orange-500' },
    { label: 'Category E', percentage: 20, color: 'bg-red-500' },
  ];

  const competitorsData = [
    { name: 'TechInnovate Plus', percentage: 85 },
    { name: 'ElectroWorld Store', percentage: 70 },
    { name: 'DigitalSolutions Pro', percentage: 55 },
    { name: 'SmartChoice Market', percentage: 40 },
    { name: 'TechValue Express', percentage: 25 },
  ];

  const CircularProgress = ({ percentage, size = 120, strokeWidth = 8, showLabel = false }: { 
    percentage: number; 
    size?: number; 
    strokeWidth?: number;
    showLabel?: boolean;
  }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#3b82f6"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        {showLabel && (
          <div className="absolute flex flex-col items-center">
            <span className="text-2xl font-bold">{percentage}%</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Account Status Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium mb-1">Your account is currently running in Safe Mode</h3>
            <p className="text-sm text-purple-100">All repricing actions are paused. Contact support to enable full mode.</p>
          </div>
          <Button variant="secondary" size="sm">
            Learn More
          </Button>
        </div>
      </div>

      {/* Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">$0.00</div>
            <p className="text-sm text-muted-foreground">Spent this period</p>
            <p className="text-xs text-muted-foreground mt-1">vs previous period</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">$0.00</div>
            <p className="text-sm text-muted-foreground">Daily limit remaining</p>
            <p className="text-xs text-muted-foreground mt-1">Refreshes at midnight</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <div className="font-medium">Your Onboarding Specialist: Colton</div>
                <p className="text-sm text-muted-foreground">Here to help with your first sale!</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <MessageCircle className="w-4 h-4 mr-2" />
                Send a message
              </div>
              <div className="flex items-center text-sm">
                <Phone className="w-4 h-4 mr-2" />
                Request a call
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Data Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Sales data unavailable for this period
            </CardTitle>
            <Button variant="outline" size="sm">
              Settings
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-muted-foreground">No data available for the selected period</p>
              <p className="text-sm text-muted-foreground mt-1">Data will appear once sales are recorded</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insights and Profitability Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insightsData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <span className="text-sm font-medium min-w-0 flex-1">{item.label}</span>
                    <span className="text-sm text-muted-foreground">{item.percentage}%</span>
                  </div>
                  <div className="w-24">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${item.color}`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">No products found.</p>
              <p className="text-sm text-muted-foreground">Start adding your insights here!</p>
            </div>
          </CardContent>
        </Card>

        {/* Profitability */}
        <Card>
          <CardHeader>
            <CardTitle>Profitability</CardTitle>
            <CardDescription>Profitability of sales</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <div className="relative">
                <CircularProgress percentage={84} size={140} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold">84%</div>
                    <div className="text-xs text-muted-foreground">Profitable</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm">8.4K Products without ads are profitable</p>
              <p className="text-xs text-muted-foreground mt-1">Based on current sales data analysis</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Repricing Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Repricing Insights
          </CardTitle>
          <CardDescription>Live Repricer activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="font-medium text-sm mb-2">Optimized listings</div>
              <div className="text-2xl font-bold">{metrics?.total_products || 5}</div>
              <div className="text-xs text-muted-foreground">of {metrics?.total_products || 5}</div>
            </div>
            
            <div className="text-center">
              <div className="font-medium text-sm mb-2">Repricing listings</div>
              <div className="text-2xl font-bold text-blue-600">{Math.floor((metrics?.total_products || 5) * 0.8)}</div>
              <div className="text-xs text-muted-foreground">of {metrics?.total_products || 5}</div>
            </div>
            
            <div className="text-center">
              <div className="font-medium text-sm mb-2">Underpriced listings</div>
              <div className="text-2xl font-bold text-orange-600">{Math.floor((metrics?.total_products || 5) * 0.2)}</div>
              <div className="text-xs text-muted-foreground">of {metrics?.total_products || 5}</div>
            </div>
            
            <div className="text-center">
              <div className="font-medium text-sm mb-2">Buy box loss listings</div>
              <div className="text-2xl font-bold text-red-600">{Math.floor((metrics?.total_products || 5) * 0.4)}</div>
              <div className="text-xs text-muted-foreground">of {metrics?.total_products || 5}</div>
            </div>
            
            <div className="text-center">
              <div className="font-medium text-sm mb-2">Latest price listings</div>
              <div className="text-2xl font-bold text-green-600">{Math.floor((metrics?.total_products || 5) * 0.6)}</div>
              <div className="text-xs text-muted-foreground">of {metrics?.total_products || 5}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity History and Buy Box Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity History */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Activity History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="text-2xl font-bold">68,724</div>
              <p className="text-sm text-muted-foreground">Total pricing events processed in the last 30 days</p>
            </div>
            <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Activity className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-muted-foreground">Activity chart visualization</p>
                <p className="text-sm text-muted-foreground mt-1">Historical repricing data will appear here</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Buy Box Ownership */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Buy Box Ownership
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <CircularProgress percentage={Math.round(metrics?.buybox_ownership_pct || 60)} size={120} showLabel={true} />
              <div className="mt-4 text-center">
                <div className="text-sm font-medium">Current Buy Box Rate</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {Math.round(metrics?.buybox_ownership_pct || 60)}% of your listings own the Buy Box
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Competitors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Top Competitors
          </CardTitle>
          <CardDescription>Most frequently competing sellers across your listings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {competitorsData.map((competitor, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <span className="text-sm font-medium min-w-0 flex-1">{competitor.name}</span>
                  <span className="text-sm text-muted-foreground">{competitor.percentage}%</span>
                </div>
                <div className="w-32">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-blue-500"
                      style={{ width: `${competitor.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Button variant="outline" size="sm">
              View All Competitors
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}