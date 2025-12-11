'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  CreditCard, 
  AlertTriangle, 
  Activity,
  Store,
  Package,
  TrendingUp,
  RefreshCw,
  ArrowLeft
} from 'lucide-react';

interface DashboardData {
  users: {
    total: number;
    new_24h: number;
    new_7d: number;
    new_30d: number;
  };
  subscriptions: Record<string, number>;
  subscription_statuses: Record<string, number>;
  stores: {
    total: number;
    active: number;
  };
  products: {
    total: number;
    repricing_active: number;
  };
  errors: {
    total: number;
    unresolved: number;
    last_24h: number;
  };
  activity: {
    price_changes_24h: number;
  };
}

export default function AdminDashboard() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      
      if (!token) {
        router.push('/admin/login');
        return;
      }
      
      const response = await fetch('/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        router.push('/admin/login');
        return;
      }
      
      if (!response.ok) throw new Error('Failed to fetch dashboard');
      
      const result = await response.json();
      setData(result);
    } catch (err: any) {
      setError(err.message);
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
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-purple-600" />
          <p className="mt-2 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => router.push('/admin/login')}>
              Go to Admin Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={fetchDashboard} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" onClick={() => {
              localStorage.removeItem('admin_token');
              localStorage.removeItem('admin_user');
              router.push('/admin/login');
            }}>
              Logout
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/admin/users')}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
              <Users className="w-5 h-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{data?.users.total || 0}</div>
              <p className="text-sm text-green-600 mt-1">+{data?.users.new_24h || 0} last 24h</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/admin/subscriptions')}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Subscriptions</CardTitle>
              <CreditCard className="w-5 h-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {(data?.subscriptions.plus || 0) + (data?.subscriptions.pro || 0) + (data?.subscriptions.enterprise || 0)}
              </div>
              <p className="text-sm text-gray-500 mt-1">Paid subscribers</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/admin/errors')}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Errors</CardTitle>
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{data?.errors.unresolved || 0}</div>
              <p className="text-sm text-red-600 mt-1">{data?.errors.last_24h || 0} in last 24h</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Activity</CardTitle>
              <Activity className="w-5 h-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{data?.activity.price_changes_24h || 0}</div>
              <p className="text-sm text-gray-500 mt-1">Price changes (24h)</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Subscription Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Free</span>
                  <Badge variant="secondary">{data?.subscriptions.free || 0}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Plus ($99/mo)</span>
                  <Badge className="bg-blue-100 text-blue-800">{data?.subscriptions.plus || 0}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Pro ($199/mo)</span>
                  <Badge className="bg-purple-100 text-purple-800">{data?.subscriptions.pro || 0}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Enterprise ($299/mo)</span>
                  <Badge className="bg-orange-100 text-orange-800">{data?.subscriptions.enterprise || 0}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Status Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Trial</span>
                  <Badge variant="secondary">{data?.subscription_statuses.trial || 0}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Active</span>
                  <Badge className="bg-green-100 text-green-800">{data?.subscription_statuses.active || 0}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Canceled</span>
                  <Badge className="bg-red-100 text-red-800">{data?.subscription_statuses.canceled || 0}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Past Due</span>
                  <Badge className="bg-yellow-100 text-yellow-800">{data?.subscription_statuses.past_due || 0}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="w-5 h-5" />
                Stores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">{data?.stores.total || 0}</p>
                  <p className="text-sm text-gray-500">Total stores</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-green-600">{data?.stores.active || 0}</p>
                  <p className="text-sm text-gray-500">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">{data?.products.total || 0}</p>
                  <p className="text-sm text-gray-500">Total products</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-purple-600">{data?.products.repricing_active || 0}</p>
                  <p className="text-sm text-gray-500">Repricing active</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 flex gap-4">
          <Button onClick={() => router.push('/admin/users')} className="flex-1">
            <Users className="w-4 h-4 mr-2" />
            Manage Users
          </Button>
          <Button onClick={() => router.push('/admin/errors')} variant="outline" className="flex-1">
            <AlertTriangle className="w-4 h-4 mr-2" />
            View Errors
          </Button>
        </div>
      </div>
    </div>
  );
}
