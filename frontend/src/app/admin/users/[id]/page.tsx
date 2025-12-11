'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft,
  RefreshCw,
  User,
  Store,
  Package,
  AlertTriangle,
  Save,
  Shield
} from 'lucide-react';

interface UserDetails {
  user: {
    id: number;
    email: string;
    name: string | null;
    picture: string | null;
    is_admin: boolean;
    google_id: boolean;
    subscription_plan: string;
    subscription_status: string;
    trial_ends_at: string | null;
    subscription_period_end: string | null;
    stripe_customer_id: string | null;
    stripe_subscription_id: string | null;
    created_at: string;
  };
  stores: Array<{
    id: number;
    store_name: string;
    region: string;
    is_active: boolean;
    last_sync: string | null;
    created_at: string;
  }>;
  products_count: number;
  repricing_enabled_count: number;
  recent_errors: Array<{
    id: number;
    error_type: string;
    message: string;
    created_at: string;
    resolved: boolean;
  }>;
}

export default function AdminUserDetail() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;
  
  const [data, setData] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  const [editName, setEditName] = useState('');
  const [editPlan, setEditPlan] = useState('');
  const [editStatus, setEditStatus] = useState('');
  const [editIsAdmin, setEditIsAdmin] = useState(false);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      
      if (!token) {
        router.push('/admin/login');
        return;
      }
      
      const response = await fetch(`/api/admin/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('admin_token');
        router.push('/admin/login');
        return;
      }
      
      if (response.status === 404) {
        setError('User not found');
        return;
      }
      
      if (!response.ok) throw new Error('Failed to fetch user');
      
      const result = await response.json();
      setData(result);
      setEditName(result.user.name || '');
      setEditPlan(result.user.subscription_plan);
      setEditStatus(result.user.subscription_status);
      setEditIsAdmin(result.user.is_admin);
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
    fetchUser();
  }, [userId]);

  const saveChanges = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: editName || null,
          subscription_plan: editPlan,
          subscription_status: editStatus,
          is_admin: editIsAdmin
        })
      });
      
      if (!response.ok) throw new Error('Failed to update user');
      
      await fetchUser();
      alert('User updated successfully!');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case 'enterprise':
        return <Badge className="bg-orange-100 text-orange-800">Enterprise</Badge>;
      case 'pro':
        return <Badge className="bg-purple-100 text-purple-800">Pro</Badge>;
      case 'plus':
        return <Badge className="bg-blue-100 text-blue-800">Plus</Badge>;
      default:
        return <Badge variant="secondary">Free</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => router.push('/admin/users')}>
              Back to Users
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => router.push('/admin/users')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <User className="w-8 h-8" />
            User Details
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Edit User</span>
                {data?.user.is_admin && (
                  <Badge className="bg-red-100 text-red-800">
                    <Shield className="w-3 h-3 mr-1" />
                    Admin
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                {data?.user.picture ? (
                  <img src={data.user.picture} alt="" className="w-16 h-16 rounded-full" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-purple-600 font-bold text-2xl">
                      {(data?.user.name || data?.user.email || 'U')[0].toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-semibold text-lg">{data?.user.email}</p>
                  <p className="text-sm text-gray-500">
                    Joined {new Date(data?.user.created_at || '').toLocaleDateString()}
                  </p>
                  {data?.user.google_id && (
                    <Badge variant="outline" className="mt-1">Google Account</Badge>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="User name"
                  />
                </div>
                <div>
                  <Label htmlFor="plan">Subscription Plan</Label>
                  <select
                    id="plan"
                    value={editPlan}
                    onChange={(e) => setEditPlan(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="free">Free</option>
                    <option value="plus">Plus ($99/mo)</option>
                    <option value="pro">Pro ($199/mo)</option>
                    <option value="enterprise">Enterprise ($299/mo)</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="status">Subscription Status</Label>
                  <select
                    id="status"
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="trial">Trial</option>
                    <option value="active">Active</option>
                    <option value="canceled">Canceled</option>
                    <option value="past_due">Past Due</option>
                    <option value="incomplete">Incomplete</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="isAdmin"
                    checked={editIsAdmin}
                    onChange={(e) => setEditIsAdmin(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="isAdmin">Admin Access</Label>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-medium mb-3">Stripe Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Customer ID:</span>
                    <p className="font-mono">{data?.user.stripe_customer_id || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Subscription ID:</span>
                    <p className="font-mono">{data?.user.stripe_subscription_id || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Trial Ends:</span>
                    <p>{data?.user.trial_ends_at ? new Date(data.user.trial_ends_at).toLocaleDateString() : 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Period End:</span>
                    <p>{data?.user.subscription_period_end ? new Date(data.user.subscription_period_end).toLocaleDateString() : 'N/A'}</p>
                  </div>
                </div>
              </div>

              <Button onClick={saveChanges} disabled={saving} className="w-full">
                {saving ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save Changes
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="w-5 h-5" />
                  Stores ({data?.stores.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {data?.stores.length === 0 ? (
                  <p className="text-gray-500 text-sm">No stores connected</p>
                ) : (
                  <div className="space-y-3">
                    {data?.stores.map((store) => (
                      <div key={store.id} className="p-3 bg-gray-50 rounded-lg">
                        <p className="font-medium">{store.store_name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{store.region.toUpperCase()}</Badge>
                          {store.is_active ? (
                            <Badge className="bg-green-100 text-green-800">Active</Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800">Inactive</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Products</span>
                    <span className="font-medium">{data?.products_count || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Repricing Active</span>
                    <span className="font-medium text-purple-600">{data?.repricing_enabled_count || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Recent Errors
                </CardTitle>
              </CardHeader>
              <CardContent>
                {data?.recent_errors.length === 0 ? (
                  <p className="text-gray-500 text-sm">No recent errors</p>
                ) : (
                  <div className="space-y-2">
                    {data?.recent_errors.slice(0, 5).map((err) => (
                      <div key={err.id} className="p-2 bg-gray-50 rounded text-sm">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">{err.error_type}</Badge>
                          {err.resolved ? (
                            <Badge className="bg-green-100 text-green-800 text-xs">Resolved</Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800 text-xs">Open</Badge>
                          )}
                        </div>
                        <p className="text-gray-600 mt-1 line-clamp-1">{err.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
