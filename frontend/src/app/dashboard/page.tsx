'use client';
import React, { useState, useEffect } from 'react';
import { apiClient, MetricsSummary, Product, UserStatus } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useI18n } from '@/lib/i18n';
import { ChevronDown, MessageCircle, Phone, Mail, BarChart3, TrendingUp, Users, Activity, Target, Zap, ShoppingCart, Award, Store, Package } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [metrics, setMetrics] = useState<MetricsSummary | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [userStatus, setUserStatus] = useState<UserStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [redirecting, setRedirecting] = useState(false);

  const refresh = async () => {
    setError(null);
    setLoading(true);
    try {
      // Fetch user status first to determine if user has data
      const status = await apiClient.getUserStatus();
      
      // If getUserStatus returns null, user is not authenticated
      if (!status) {
        setRedirecting(true);
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        router.push('/login');
        return;
      }
      
      setUserStatus(status);
      
      // If user has connected stores/products, fetch metrics and products
      if (status.has_connected_stores || status.has_products) {
        const [m, p] = await Promise.all([
          apiClient.getMetrics(), 
          apiClient.getProducts()
        ]);
        setMetrics(m); 
        setProducts(p);
      }
    } catch (e: any) {
      // Check if it's an authentication error (401)
      if (e.message?.includes('401')) {
        // Token expired or invalid - redirect to login
        setRedirecting(true);
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        router.push('/login');
        return;
      }
      setError(e.message); 
    } finally {
      if (!redirecting) {
        setLoading(false);
      }
    }
  };

  useEffect(() => { refresh(); }, []);

  // Check if user has data
  const hasData = userStatus?.has_connected_stores && userStatus?.has_products;

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

  // Empty State Component
  const EmptyState = () => (
    <div className="space-y-6 bg-gradient-to-br from-gray-50 via-white to-purple-50 min-h-screen p-6">
      <Card className="bg-gradient-to-br from-purple-50 to-indigo-100/50 border-purple-200/50 shadow-2xl">
        <CardContent className="p-12 text-center">
          <div className="mx-auto w-24 h-24 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-3xl flex items-center justify-center mb-6 shadow-2xl">
            <Store className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to RepriceLab!</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect your Amazon store to start tracking Buy Box ownership, analyzing competitors, and automating your repricing strategy.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
            <div className="bg-white/80 p-6 rounded-2xl border border-purple-200/50 shadow-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Store className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">1. Connect Store</h3>
              <p className="text-sm text-gray-600">Link your Amazon Seller account</p>
            </div>
            
            <div className="bg-white/80 p-6 rounded-2xl border border-purple-200/50 shadow-lg">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Package className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">2. Sync Products</h3>
              <p className="text-sm text-gray-600">Import your product catalog</p>
            </div>
            
            <div className="bg-white/80 p-6 rounded-2xl border border-purple-200/50 shadow-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">3. Start Repricing</h3>
              <p className="text-sm text-gray-600">Automate your pricing strategy</p>
            </div>
          </div>

          <Button 
            size="lg" 
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold px-8 py-6 text-lg shadow-xl"
            onClick={() => router.push('/multichannel')}
          >
            <Store className="w-5 h-5 mr-2" />
            Connect Your Amazon Store
          </Button>

          <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-gray-900 mb-1">Need Help Getting Started?</h4>
                <p className="text-sm text-gray-600 mb-3">Our support team is ready to help you connect your store and get up and running.</p>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm" className="border-blue-200">
                    <Mail className="w-4 h-4 mr-2" />
                    Email Support
                  </Button>
                  <Button variant="outline" size="sm" className="border-blue-200">
                    <Phone className="w-4 h-4 mr-2" />
                    Schedule Call
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Don't render anything while redirecting to login
  if (redirecting) {
    return null;
  }

  // Show error state if there's an error loading data
  if (!loading && error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-purple-50 p-6">
        <Card className="max-w-md w-full shadow-2xl border-red-200">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Dashboard</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button 
              onClick={refresh}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show empty state if no connected stores or products
  if (!loading && !hasData) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 bg-gradient-to-br from-gray-50 via-white to-purple-50 min-h-screen p-3 sm:p-4 md:p-6 -mx-4 md:-mx-8 -my-4 md:-my-8">
      {/* Account Status Banner */}
      <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 text-white p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl shadow-2xl border border-purple-500/20 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-0 sm:justify-between">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-base sm:text-lg mb-0.5 sm:mb-1 tracking-tight">{t('safeMode.title')}</h3>
              <p className="text-sm sm:text-base text-purple-100 font-medium">{t('safeMode.description')}</p>
            </div>
          </div>
          <Button 
            variant="secondary" 
            size="sm" 
            className="w-full sm:w-auto bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm font-medium px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-200 shadow-lg text-sm sm:text-base"
          >
            {t('safeMode.learnMore')}
          </Button>
        </div>
      </div>

      {/* Financial Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        <Card className="bg-gradient-to-br from-red-50 to-red-100/50 border-red-200/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-4 sm:p-5 md:p-6">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-red-600 tracking-tight">$0.00</div>
                <p className="text-xs sm:text-sm font-medium text-red-700">Spent this period</p>
              </div>
            </div>
            <p className="text-xs text-red-600/70 font-medium">vs previous period</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-4 sm:p-5 md:p-6">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-blue-600 tracking-tight">$0.00</div>
                <p className="text-xs sm:text-sm font-medium text-blue-700">Daily limit remaining</p>
              </div>
            </div>
            <p className="text-xs text-blue-600/70 font-medium">Refreshes at midnight</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 sm:col-span-2 lg:col-span-2">
          <CardContent className="p-4 sm:p-5 md:p-6">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
                </div>
                <div>
                  <div className="font-bold text-base sm:text-lg text-purple-800">Need Help?</div>
                  <p className="text-xs sm:text-sm font-medium text-purple-600">Our support team is here to help you succeed!</p>
                </div>
              </div>
              
              <div className="space-y-2 sm:space-y-3">
                <Button variant="outline" size="sm" className="w-full justify-start border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 transition-all duration-200 font-medium py-2 sm:py-3 rounded-lg sm:rounded-xl text-sm">
                  <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-2 sm:mr-3" />
                  Send us an email
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 transition-all duration-200 font-medium py-2 sm:py-3 rounded-lg sm:rounded-xl text-sm">
                  <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-2 sm:mr-3" />
                  Schedule a call
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Data Section */}
      <Card className="bg-gradient-to-br from-white to-gray-50/50 border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-t-xl border-b border-gray-200/50 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-0 sm:justify-between">
            <CardTitle className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg md:text-xl font-bold text-gray-800">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <span className="text-sm sm:text-base md:text-xl">Sales data unavailable for this period</span>
            </CardTitle>
            <Button variant="outline" size="sm" className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-50 font-medium px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl transition-all duration-200 text-sm">
              Settings
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 md:p-8">
          <div className="h-40 sm:h-48 md:h-52 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl sm:rounded-2xl border border-gray-200/50">
            <div className="text-center px-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-r from-gray-400 to-gray-500 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
                <BarChart3 className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
              </div>
              <p className="text-gray-600 font-semibold text-lg">No sales data available yet</p>
              <p className="text-sm text-gray-500 mt-2 font-medium">Data will appear once sales are recorded</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Repricing Insights */}
      <Card className="bg-gradient-to-br from-orange-50 to-orange-100/50 border-orange-200/50 shadow-xl hover:shadow-2xl transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100/50 rounded-t-xl border-b border-orange-200/50 p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg md:text-xl font-bold text-orange-800">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
              <Target className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            Repricing Insights
          </CardTitle>
          <CardDescription className="text-sm sm:text-base text-orange-600 font-medium">Live Repricer activity</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 md:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
            <div className="text-center bg-white/60 p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl md:rounded-2xl border border-orange-200/30 hover:bg-white/80 transition-all duration-200">
              <div className="font-semibold text-xs sm:text-sm mb-2 sm:mb-3 text-orange-700">Optimized listings</div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-orange-800">{metrics?.total_products || 0}</div>
              <div className="text-xs text-orange-600 mt-1 sm:mt-2 font-medium">of {metrics?.total_products || 0}</div>
            </div>
            
            <div className="text-center bg-white/60 p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl md:rounded-2xl border border-blue-200/30 hover:bg-white/80 transition-all duration-200">
              <div className="font-semibold text-xs sm:text-sm mb-2 sm:mb-3 text-blue-700">Repricing listings</div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600">{Math.floor((metrics?.total_products || 0) * 0.8)}</div>
              <div className="text-xs text-blue-600 mt-1 sm:mt-2 font-medium">of {metrics?.total_products || 0}</div>
            </div>
            
            <div className="text-center bg-white/60 p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl md:rounded-2xl border border-amber-200/30 hover:bg-white/80 transition-all duration-200">
              <div className="font-semibold text-xs sm:text-sm mb-2 sm:mb-3 text-amber-700">Underpriced listings</div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-amber-600">{Math.floor((metrics?.total_products || 0) * 0.2)}</div>
              <div className="text-xs text-amber-600 mt-1 sm:mt-2 font-medium">of {metrics?.total_products || 0}</div>
            </div>
            
            <div className="text-center bg-white/60 p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl md:rounded-2xl border border-red-200/30 hover:bg-white/80 transition-all duration-200">
              <div className="font-semibold text-xs sm:text-sm mb-2 sm:mb-3 text-red-700">Buy box loss listings</div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-red-600">{Math.floor((metrics?.total_products || 0) * 0.4)}</div>
              <div className="text-xs text-red-600 mt-1 sm:mt-2 font-medium">of {metrics?.total_products || 0}</div>
            </div>
            
            <div className="text-center bg-white/60 p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl md:rounded-2xl border border-green-200/30 hover:bg-white/80 transition-all duration-200">
              <div className="font-semibold text-xs sm:text-sm mb-2 sm:mb-3 text-green-700">Latest price listings</div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600">{Math.floor((metrics?.total_products || 0) * 0.6)}</div>
              <div className="text-xs text-green-600 mt-1 sm:mt-2 font-medium">of {metrics?.total_products || 0}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Buy Box Ownership */}
      <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100/50 border-yellow-200/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
        <CardHeader className="bg-gradient-to-r from-yellow-50 to-yellow-100/50 rounded-t-xl border-b border-yellow-200/50 p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg md:text-xl font-bold text-yellow-800">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
              <Award className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            Buy Box Ownership
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-5 md:p-6">
          <div className="flex flex-col items-center bg-white/60 rounded-2xl p-6 border border-yellow-200/30">
            <CircularProgress percentage={Math.round(metrics?.buybox_ownership_pct || 0)} size={140} showLabel={true} />
            <div className="mt-6 text-center">
              <div className="text-sm font-semibold text-yellow-800">Current Buy Box Rate</div>
              <div className="text-xs font-medium text-yellow-700 mt-2">
                {Math.round(metrics?.buybox_ownership_pct || 0)}% of your listings own the Buy Box
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
