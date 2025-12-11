'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  Search,
  ArrowLeft,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Eye,
  Store,
  Package,
  Shield,
  LogOut
} from 'lucide-react';

interface User {
  id: number;
  email: string;
  name: string | null;
  picture: string | null;
  is_admin: boolean;
  subscription_plan: string;
  subscription_status: string;
  trial_ends_at: string | null;
  stripe_customer_id: string | null;
  created_at: string;
  store_count: number;
  product_count: number;
}

interface UsersResponse {
  total: number;
  page: number;
  limit: number;
  pages: number;
  users: User[];
}

export default function AdminUsers() {
  const router = useRouter();
  const [data, setData] = useState<UsersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [planFilter, setPlanFilter] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      
      if (!token) {
        router.push('/admin/login');
        return;
      }
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20'
      });
      if (search) params.append('search', search);
      if (planFilter) params.append('plan', planFilter);
      
      const response = await fetch(`/api/admin/users?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('admin_token');
        router.push('/admin/login');
        return;
      }
      
      if (!response.ok) throw new Error('Failed to fetch users');
      
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
    fetchUsers();
  }, [page, planFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case 'enterprise':
        return <Badge className="bg-orange-900/50 text-orange-400 border-orange-700">Enterprise</Badge>;
      case 'pro':
        return <Badge className="bg-purple-900/50 text-purple-400 border-purple-700">Pro</Badge>;
      case 'plus':
        return <Badge className="bg-blue-900/50 text-blue-400 border-blue-700">Plus</Badge>;
      default:
        return <Badge className="bg-gray-700 text-gray-300">Free</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-900/50 text-green-400 border-green-700">Active</Badge>;
      case 'trial':
        return <Badge className="bg-yellow-900/50 text-yellow-400 border-yellow-700">Trial</Badge>;
      case 'canceled':
        return <Badge className="bg-red-900/50 text-red-400 border-red-700">Canceled</Badge>;
      default:
        return <Badge className="bg-gray-700 text-gray-300">{status}</Badge>;
    }
  };

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
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">User Management</h1>
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
        <Card className="bg-gray-800 border-gray-700 mb-6">
          <CardContent className="pt-6">
            <form onSubmit={handleSearch} className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <Input
                  placeholder="Search by email or name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
              <select
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value)}
                className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              >
                <option value="">All Plans</option>
                <option value="free">Free</option>
                <option value="plus">Plus</option>
                <option value="pro">Pro</option>
                <option value="enterprise">Enterprise</option>
              </select>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
              <Button type="button" variant="outline" onClick={fetchUsers} className="border-gray-600 text-gray-300 hover:bg-gray-700">
                <RefreshCw className="w-4 h-4" />
              </Button>
            </form>
          </CardContent>
        </Card>

        {loading ? (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-orange-500" />
            <p className="mt-2 text-gray-400">Loading users...</p>
          </div>
        ) : (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="border-b border-gray-700">
              <CardTitle className="text-white">Users ({data?.total || 0})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700 bg-gray-750">
                      <th className="text-left py-4 px-4 font-medium text-gray-400 text-sm">User</th>
                      <th className="text-left py-4 px-4 font-medium text-gray-400 text-sm">Plan</th>
                      <th className="text-left py-4 px-4 font-medium text-gray-400 text-sm">Status</th>
                      <th className="text-left py-4 px-4 font-medium text-gray-400 text-sm">Stores</th>
                      <th className="text-left py-4 px-4 font-medium text-gray-400 text-sm">Joined</th>
                      <th className="text-left py-4 px-4 font-medium text-gray-400 text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.users.map((user) => (
                      <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-750">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            {user.picture ? (
                              <img src={user.picture} alt="" className="w-10 h-10 rounded-full" />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                                <span className="text-white font-medium">
                                  {(user.name || user.email)[0].toUpperCase()}
                                </span>
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-white flex items-center gap-2">
                                {user.name || 'No name'}
                                {user.is_admin && (
                                  <Badge className="bg-red-900/50 text-red-400 border-red-700 text-xs">
                                    <Shield className="w-3 h-3 mr-1" />
                                    Admin
                                  </Badge>
                                )}
                              </p>
                              <p className="text-sm text-gray-400">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">{getPlanBadge(user.subscription_plan)}</td>
                        <td className="py-4 px-4">{getStatusBadge(user.subscription_status)}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1 text-gray-300">
                            <Store className="w-4 h-4 text-gray-500" />
                            {user.store_count}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-400">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4">
                          <Button 
                            size="sm" 
                            className="bg-gray-700 hover:bg-gray-600 text-white"
                            onClick={() => router.push(`/admin/users/${user.id}`)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {data && data.pages > 1 && (
                <div className="flex items-center justify-between p-4 border-t border-gray-700">
                  <p className="text-sm text-gray-400">
                    Page {data.page} of {data.pages}
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={page === 1}
                      onClick={() => setPage(p => p - 1)}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={page === data.pages}
                      onClick={() => setPage(p => p + 1)}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
