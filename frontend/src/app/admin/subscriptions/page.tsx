'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard,
  ArrowLeft,
  RefreshCw,
  DollarSign,
  TrendingUp,
  Users,
  LogOut
} from 'lucide-react';

interface SubscriptionStats {
  plans: Record<string, number>;
  statuses: Record<string, number>;
  total_revenue: number;
  paying_customers: number;
}

export default function AdminSubscriptions() {
  const router = useRouter();
  const [stats, setStats] = useState<SubscriptionStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      
      if (!token) {
        router.push('/admin/login');
        return;
      }
      
      const response = await fetch('/api/admin/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('admin_token');
        router.push('/admin/login');
        return;
      }
      
      if (!response.ok) throw new Error('Failed to fetch data');
      
      const data = await response.json();
      const paying = (data.subscriptions.plus || 0) + (data.subscriptions.pro || 0) + (data.subscriptions.enterprise || 0);
      const revenue = ((data.subscriptions.plus || 0) * 99) + ((data.subscriptions.pro || 0) * 199) + ((data.subscriptions.enterprise || 0) * 299);
      
      setStats({
        plans: data.subscriptions,
        statuses: data.subscription_statuses,
        total_revenue: revenue,
        paying_customers: paying
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => router.push('/admin')} className="text-gray-300 hover:text-white hover:bg-gray-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">Subscriptions</h1>
            </div>
            <Button onClick={() => {
              localStorage.removeItem('admin_token');
              localStorage.removeItem('admin_user');
              router.push('/admin/login');
            }} variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-700">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-orange-500" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-green-600 to-green-700 border-0">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">Monthly Revenue</p>
                      <p className="text-4xl font-bold text-white mt-1">${stats?.total_revenue || 0}</p>
                    </div>
                    <DollarSign className="w-12 h-12 text-green-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-0">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">Paying Customers</p>
                      <p className="text-4xl font-bold text-white mt-1">{stats?.paying_customers || 0}</p>
                    </div>
                    <Users className="w-12 h-12 text-blue-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-600 to-purple-700 border-0">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">Avg Revenue/User</p>
                      <p className="text-4xl font-bold text-white mt-1">
                        ${stats?.paying_customers ? Math.round(stats.total_revenue / stats.paying_customers) : 0}
                      </p>
                    </div>
                    <TrendingUp className="w-12 h-12 text-purple-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="border-b border-gray-700">
                  <CardTitle className="text-white">Plan Distribution</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                    <div>
                      <p className="text-white font-medium">Free</p>
                      <p className="text-gray-400 text-sm">$0/month</p>
                    </div>
                    <Badge className="bg-gray-600 text-white text-lg px-4 py-1">{stats?.plans.free || 0}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-blue-900/30 rounded-lg border border-blue-700">
                    <div>
                      <p className="text-white font-medium">Plus</p>
                      <p className="text-blue-400 text-sm">$99/month</p>
                    </div>
                    <Badge className="bg-blue-600 text-white text-lg px-4 py-1">{stats?.plans.plus || 0}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-purple-900/30 rounded-lg border border-purple-700">
                    <div>
                      <p className="text-white font-medium">Pro</p>
                      <p className="text-purple-400 text-sm">$199/month</p>
                    </div>
                    <Badge className="bg-purple-600 text-white text-lg px-4 py-1">{stats?.plans.pro || 0}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-orange-900/30 rounded-lg border border-orange-700">
                    <div>
                      <p className="text-white font-medium">Enterprise</p>
                      <p className="text-orange-400 text-sm">$299/month</p>
                    </div>
                    <Badge className="bg-orange-600 text-white text-lg px-4 py-1">{stats?.plans.enterprise || 0}</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="border-b border-gray-700">
                  <CardTitle className="text-white">Status Overview</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center justify-between p-4 bg-yellow-900/20 rounded-lg">
                    <p className="text-white">Trial</p>
                    <Badge className="bg-yellow-600 text-white">{stats?.statuses.trial || 0}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-green-900/20 rounded-lg">
                    <p className="text-white">Active</p>
                    <Badge className="bg-green-600 text-white">{stats?.statuses.active || 0}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-red-900/20 rounded-lg">
                    <p className="text-white">Canceled</p>
                    <Badge className="bg-red-600 text-white">{stats?.statuses.canceled || 0}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-orange-900/20 rounded-lg">
                    <p className="text-white">Past Due</p>
                    <Badge className="bg-orange-600 text-white">{stats?.statuses.past_due || 0}</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
