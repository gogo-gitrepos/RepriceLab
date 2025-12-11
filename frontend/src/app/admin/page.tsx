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
  Shield,
  Store,
  RefreshCw,
  LogOut,
  UserCog,
  FileWarning,
  DollarSign,
  UserPlus,
  Clock,
  CheckCircle,
  XCircle,
  Settings,
  BarChart3
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
  const [adminUser, setAdminUser] = useState<any>(null);

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
    const user = localStorage.getItem('admin_user');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    if (user) {
      setAdminUser(JSON.parse(user));
    }
    fetchDashboard();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-10 h-10 animate-spin mx-auto text-orange-500" />
          <p className="mt-4 text-gray-400">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Card className="max-w-md bg-gray-800 border-gray-700">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Error</h2>
            <p className="text-gray-400 mb-4">{error}</p>
            <Button onClick={() => router.push('/admin/login')} className="bg-orange-600 hover:bg-orange-700">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const paidSubscribers = (data?.subscriptions.plus || 0) + (data?.subscriptions.pro || 0) + (data?.subscriptions.enterprise || 0);
  const monthlyRevenue = ((data?.subscriptions.plus || 0) * 99) + ((data?.subscriptions.pro || 0) * 199) + ((data?.subscriptions.enterprise || 0) * 299);

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">RepriceLab Admin</h1>
                <p className="text-xs text-gray-400">Management Console</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button onClick={fetchDashboard} variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-700">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <div className="text-right hidden sm:block">
                <p className="text-sm text-white">{adminUser?.name || adminUser?.email}</p>
                <p className="text-xs text-gray-400">Administrator</p>
              </div>
              <Button onClick={handleLogout} variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-700">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-0 cursor-pointer hover:scale-105 transition-transform" onClick={() => router.push('/admin/users')}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Users</p>
                  <p className="text-4xl font-bold text-white mt-1">{data?.users.total || 0}</p>
                  <p className="text-blue-200 text-xs mt-2">+{data?.users.new_24h || 0} today</p>
                </div>
                <Users className="w-12 h-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-600 to-green-700 border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Paid Subscribers</p>
                  <p className="text-4xl font-bold text-white mt-1">{paidSubscribers}</p>
                  <p className="text-green-200 text-xs mt-2">${monthlyRevenue}/month</p>
                </div>
                <DollarSign className="w-12 h-12 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-600 to-purple-700 border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Active Stores</p>
                  <p className="text-4xl font-bold text-white mt-1">{data?.stores.active || 0}</p>
                  <p className="text-purple-200 text-xs mt-2">{data?.stores.total || 0} total</p>
                </div>
                <Store className="w-12 h-12 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-600 to-red-700 border-0 cursor-pointer hover:scale-105 transition-transform" onClick={() => router.push('/admin/errors')}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm font-medium">Open Errors</p>
                  <p className="text-4xl font-bold text-white mt-1">{data?.errors.unresolved || 0}</p>
                  <p className="text-red-200 text-xs mt-2">{data?.errors.last_24h || 0} in 24h</p>
                </div>
                <AlertTriangle className="w-12 h-12 text-red-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700 lg:col-span-2">
            <CardHeader className="border-b border-gray-700">
              <CardTitle className="text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-orange-500" />
                Subscription Plans
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-700/50 rounded-xl p-4 text-center">
                  <p className="text-gray-400 text-sm">Free</p>
                  <p className="text-3xl font-bold text-white mt-1">{data?.subscriptions.free || 0}</p>
                  <p className="text-gray-500 text-xs mt-1">$0/mo</p>
                </div>
                <div className="bg-blue-900/30 rounded-xl p-4 text-center border border-blue-700">
                  <p className="text-blue-400 text-sm">Plus</p>
                  <p className="text-3xl font-bold text-white mt-1">{data?.subscriptions.plus || 0}</p>
                  <p className="text-blue-400 text-xs mt-1">$99/mo</p>
                </div>
                <div className="bg-purple-900/30 rounded-xl p-4 text-center border border-purple-700">
                  <p className="text-purple-400 text-sm">Pro</p>
                  <p className="text-3xl font-bold text-white mt-1">{data?.subscriptions.pro || 0}</p>
                  <p className="text-purple-400 text-xs mt-1">$199/mo</p>
                </div>
                <div className="bg-orange-900/30 rounded-xl p-4 text-center border border-orange-700">
                  <p className="text-orange-400 text-sm">Enterprise</p>
                  <p className="text-3xl font-bold text-white mt-1">{data?.subscriptions.enterprise || 0}</p>
                  <p className="text-orange-400 text-xs mt-1">$299/mo</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="border-b border-gray-700">
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-orange-500" />
                User Status
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-yellow-500" />
                  <span className="text-gray-300">Trial</span>
                </div>
                <Badge className="bg-yellow-900/50 text-yellow-400 border-yellow-700">{data?.subscription_statuses.trial || 0}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-gray-300">Active</span>
                </div>
                <Badge className="bg-green-900/50 text-green-400 border-green-700">{data?.subscription_statuses.active || 0}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-500" />
                  <span className="text-gray-300">Canceled</span>
                </div>
                <Badge className="bg-red-900/50 text-red-400 border-red-700">{data?.subscription_statuses.canceled || 0}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  <span className="text-gray-300">Past Due</span>
                </div>
                <Badge className="bg-orange-900/50 text-orange-400 border-orange-700">{data?.subscription_statuses.past_due || 0}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 cursor-pointer transition-colors" onClick={() => router.push('/admin/users')}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center">
                  <UserCog className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-white font-medium">User Management</p>
                  <p className="text-gray-400 text-sm">View and edit users</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 cursor-pointer transition-colors" onClick={() => router.push('/admin/errors')}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-600/20 rounded-xl flex items-center justify-center">
                  <FileWarning className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <p className="text-white font-medium">Error Logs</p>
                  <p className="text-gray-400 text-sm">Monitor and resolve</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 cursor-pointer transition-colors" onClick={() => router.push('/admin/subscriptions')}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-white font-medium">Subscriptions</p>
                  <p className="text-gray-400 text-sm">Billing overview</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 cursor-pointer transition-colors" onClick={() => router.push('/admin/settings')}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center">
                  <Settings className="w-6 h-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-white font-medium">Settings</p>
                  <p className="text-gray-400 text-sm">System configuration</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="border-b border-gray-700">
            <CardTitle className="text-white flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-orange-500" />
              Recent Signups (Last 30 Days)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-gray-400 text-sm">Last 24 Hours</p>
                <p className="text-3xl font-bold text-white mt-1">{data?.users.new_24h || 0}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Last 7 Days</p>
                <p className="text-3xl font-bold text-white mt-1">{data?.users.new_7d || 0}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Last 30 Days</p>
                <p className="text-3xl font-bold text-white mt-1">{data?.users.new_30d || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="border-t border-gray-700 py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">RepriceLab Admin Panel v1.0</p>
        </div>
      </footer>
    </div>
  );
}
