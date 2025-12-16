'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Settings,
  ArrowLeft,
  Shield,
  Globe,
  Bell,
  Database,
  LogOut,
  CheckCircle,
  XCircle,
  RefreshCw,
  Users,
  Clock,
  Zap,
  CreditCard,
  AlertTriangle
} from 'lucide-react';

interface SettingsData {
  public_registration: boolean;
  amazon_sp_api: {
    configured: boolean;
    mode: string;
  };
  stripe: {
    configured: boolean;
  };
  scheduler: {
    interval_minutes: number;
    status: string;
  };
  system_status: {
    database: string;
    api_server: string;
  };
  admin_count: number;
}

interface SystemHealth {
  database: string;
  api_server: string;
  amazon_sp_api: string;
  stripe_webhooks: string;
}

export default function AdminSettings() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<any>(null);
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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
    fetchSettings();
    fetchHealth();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/settings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHealth = async () => {
    try {
      setRefreshing(true);
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/system-health', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setHealth(data);
      }
    } catch (err) {
      console.error('Failed to fetch health:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'operational') {
      return (
        <Badge className="bg-green-900/50 text-green-400 border-green-700">
          <CheckCircle className="w-3 h-3 mr-1" />
          Operational
        </Badge>
      );
    } else if (status === 'not_configured') {
      return (
        <Badge className="bg-yellow-900/50 text-yellow-400 border-yellow-700">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Not Configured
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-red-900/50 text-red-400 border-red-700">
          <XCircle className="w-3 h-3 mr-1" />
          Error
        </Badge>
      );
    }
  };

  const systemStatusItems = [
    { name: 'Database', key: 'database', icon: Database },
    { name: 'API Server', key: 'api_server', icon: Globe },
    { name: 'Amazon SP-API', key: 'amazon_sp_api', icon: Shield },
    { name: 'Stripe Webhooks', key: 'stripe_webhooks', icon: Bell },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => router.push('/admin')} className="text-gray-300 hover:text-white hover:bg-gray-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">Settings</h1>
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

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="border-b border-gray-700">
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-orange-500" />
                Admin Account
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <label className="text-sm text-gray-400">Email</label>
                <p className="text-white font-medium">{adminUser?.email || 'Loading...'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Name</label>
                <p className="text-white font-medium">{adminUser?.name || 'Admin'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Role</label>
                <Badge className="bg-red-900/50 text-red-400 border-red-700 mt-1">Administrator</Badge>
              </div>
              <div>
                <label className="text-sm text-gray-400">Total Admins</label>
                <p className="text-white font-medium flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  {settings?.admin_count || 0}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="border-b border-gray-700 flex flex-row items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-500" />
                System Status
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={fetchHealth}
                disabled={refreshing}
                className="text-gray-400 hover:text-white"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              </Button>
            </CardHeader>
            <CardContent className="pt-6 space-y-3">
              {systemStatusItems.map((item) => (
                <div key={item.name} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5 text-gray-400" />
                    <span className="text-white">{item.name}</span>
                  </div>
                  {health ? getStatusBadge(health[item.key as keyof SystemHealth]) : (
                    <Badge className="bg-gray-700 text-gray-400">Loading...</Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 lg:col-span-2">
            <CardHeader className="border-b border-gray-700">
              <CardTitle className="text-white">Platform Configuration</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-gray-700/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm text-gray-400">Public Registration</label>
                    <Badge className={settings?.public_registration 
                      ? "bg-green-900/50 text-green-400 border-green-700" 
                      : "bg-red-900/50 text-red-400 border-red-700"
                    }>
                      {settings?.public_registration ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                  <p className="text-white font-medium mt-1">
                    {settings?.public_registration ? 'Open for signups' : 'Invite only'}
                  </p>
                  <p className="text-gray-500 text-xs mt-2">
                    Change via PUBLIC_REGISTRATION_ENABLED in deployment settings
                  </p>
                </div>
                
                <div className="p-4 bg-gray-700/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm text-gray-400">Amazon SP-API</label>
                    <Badge className={settings?.amazon_sp_api?.configured 
                      ? "bg-green-900/50 text-green-400 border-green-700" 
                      : "bg-yellow-900/50 text-yellow-400 border-yellow-700"
                    }>
                      {settings?.amazon_sp_api?.configured ? 'Configured' : 'Not Set'}
                    </Badge>
                  </div>
                  <p className="text-white font-medium mt-1">
                    {settings?.amazon_sp_api?.mode === 'public_app' ? 'Public App Mode' : 'Not Configured'}
                  </p>
                  <p className="text-gray-500 text-xs mt-2">Multi-tenant OAuth flow</p>
                </div>
                
                <div className="p-4 bg-gray-700/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm text-gray-400">Stripe Integration</label>
                    <Badge className={settings?.stripe?.configured 
                      ? "bg-green-900/50 text-green-400 border-green-700" 
                      : "bg-yellow-900/50 text-yellow-400 border-yellow-700"
                    }>
                      {settings?.stripe?.configured ? 'Connected' : 'Not Set'}
                    </Badge>
                  </div>
                  <p className="text-white font-medium mt-1 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-gray-400" />
                    {settings?.stripe?.configured ? 'Webhooks Active' : 'Setup Required'}
                  </p>
                  <p className="text-gray-500 text-xs mt-2">Subscription billing</p>
                </div>
                
                <div className="p-4 bg-gray-700/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm text-gray-400">Repricing Scheduler</label>
                    <Badge className="bg-green-900/50 text-green-400 border-green-700">
                      <Zap className="w-3 h-3 mr-1" />
                      Running
                    </Badge>
                  </div>
                  <p className="text-white font-medium mt-1 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    Every {settings?.scheduler?.interval_minutes || 10} minutes
                  </p>
                  <p className="text-gray-500 text-xs mt-2">Automatic price updates</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 lg:col-span-2">
            <CardHeader className="border-b border-gray-700">
              <CardTitle className="text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                Environment Variables
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-gray-400 mb-4">
                These settings are controlled via environment variables in deployment configuration:
              </p>
              <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-purple-400">PUBLIC_REGISTRATION_ENABLED</span>
                  <span className="text-gray-500">=</span>
                  <span className={settings?.public_registration ? "text-green-400" : "text-red-400"}>
                    {settings?.public_registration ? 'true' : 'false'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-purple-400">AMAZON_SP_API_CLIENT_ID</span>
                  <span className="text-gray-500">=</span>
                  <span className={settings?.amazon_sp_api?.configured ? "text-green-400" : "text-gray-500"}>
                    {settings?.amazon_sp_api?.configured ? '***configured***' : 'not set'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-purple-400">STRIPE_SECRET_KEY</span>
                  <span className="text-gray-500">=</span>
                  <span className={settings?.stripe?.configured ? "text-green-400" : "text-gray-500"}>
                    {settings?.stripe?.configured ? '***configured***' : 'not set'}
                  </span>
                </div>
              </div>
              <p className="text-gray-500 text-xs mt-4">
                To change these values, go to Replit Deployment Settings and update the environment variables.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
