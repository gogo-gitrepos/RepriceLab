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
  XCircle
} from 'lucide-react';

export default function AdminSettings() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<any>(null);

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
  }, []);

  const systemStatus = [
    { name: 'Database', status: 'operational', icon: Database },
    { name: 'API Server', status: 'operational', icon: Globe },
    { name: 'Amazon SP-API', status: 'operational', icon: Shield },
    { name: 'Stripe Webhooks', status: 'operational', icon: Bell },
  ];

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
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="border-b border-gray-700">
              <CardTitle className="text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-500" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-3">
              {systemStatus.map((item) => (
                <div key={item.name} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5 text-gray-400" />
                    <span className="text-white">{item.name}</span>
                  </div>
                  {item.status === 'operational' ? (
                    <Badge className="bg-green-900/50 text-green-400 border-green-700">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Operational
                    </Badge>
                  ) : (
                    <Badge className="bg-red-900/50 text-red-400 border-red-700">
                      <XCircle className="w-3 h-3 mr-1" />
                      Down
                    </Badge>
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
                  <label className="text-sm text-gray-400">Public Registration</label>
                  <p className="text-white font-medium mt-1">Disabled</p>
                  <p className="text-gray-500 text-xs mt-1">Set PUBLIC_REGISTRATION_ENABLED=true to enable</p>
                </div>
                <div className="p-4 bg-gray-700/50 rounded-lg">
                  <label className="text-sm text-gray-400">Amazon SP-API</label>
                  <p className="text-white font-medium mt-1">Public App</p>
                  <p className="text-gray-500 text-xs mt-1">Multi-tenant OAuth enabled</p>
                </div>
                <div className="p-4 bg-gray-700/50 rounded-lg">
                  <label className="text-sm text-gray-400">Stripe Integration</label>
                  <p className="text-white font-medium mt-1">Connected</p>
                  <p className="text-gray-500 text-xs mt-1">Webhooks active</p>
                </div>
                <div className="p-4 bg-gray-700/50 rounded-lg">
                  <label className="text-sm text-gray-400">Repricing Scheduler</label>
                  <p className="text-white font-medium mt-1">Every 10 minutes</p>
                  <p className="text-gray-500 text-xs mt-1">Automatic price updates</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
