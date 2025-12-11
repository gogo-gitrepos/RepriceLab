'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle,
  ArrowLeft,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Eye,
  LogOut,
  FileWarning
} from 'lucide-react';

interface ErrorLog {
  id: number;
  user_id: number | null;
  error_type: string;
  error_code: string | null;
  message: string;
  endpoint: string | null;
  resolved: boolean;
  created_at: string;
}

interface ErrorsResponse {
  total: number;
  page: number;
  limit: number;
  pages: number;
  errors: ErrorLog[];
}

export default function AdminErrors() {
  const router = useRouter();
  const [data, setData] = useState<ErrorsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState('');
  const [resolvedFilter, setResolvedFilter] = useState<string>('');
  const [selectedError, setSelectedError] = useState<any>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const fetchErrors = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      
      if (!token) {
        router.push('/admin/login');
        return;
      }
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '50'
      });
      if (typeFilter) params.append('error_type', typeFilter);
      if (resolvedFilter !== '') params.append('resolved', resolvedFilter);
      
      const response = await fetch(`/api/admin/errors?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('admin_token');
        router.push('/admin/login');
        return;
      }
      
      if (!response.ok) throw new Error('Failed to fetch errors');
      
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
    fetchErrors();
  }, [page, typeFilter, resolvedFilter]);

  const viewErrorDetails = async (errorId: number) => {
    try {
      setDetailsLoading(true);
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/errors/${errorId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch error details');
      
      const result = await response.json();
      setSelectedError(result);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setDetailsLoading(false);
    }
  };

  const resolveError = async (errorId: number) => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/errors/${errorId}/resolve`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to resolve error');
      
      fetchErrors();
      if (selectedError?.id === errorId) {
        setSelectedError({ ...selectedError, resolved: true });
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'api_error':
        return <Badge className="bg-blue-900/50 text-blue-400 border-blue-700">API</Badge>;
      case 'amazon_error':
        return <Badge className="bg-orange-900/50 text-orange-400 border-orange-700">Amazon</Badge>;
      case 'stripe_error':
        return <Badge className="bg-purple-900/50 text-purple-400 border-purple-700">Stripe</Badge>;
      case 'repricing_error':
        return <Badge className="bg-yellow-900/50 text-yellow-400 border-yellow-700">Repricing</Badge>;
      default:
        return <Badge className="bg-gray-700 text-gray-300">{type}</Badge>;
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
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                <FileWarning className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">Error Logs</h1>
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
            <div className="flex gap-4 flex-wrap">
              <select
                value={typeFilter}
                onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
                className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              >
                <option value="">All Types</option>
                <option value="api_error">API Error</option>
                <option value="amazon_error">Amazon Error</option>
                <option value="stripe_error">Stripe Error</option>
                <option value="repricing_error">Repricing Error</option>
              </select>
              <select
                value={resolvedFilter}
                onChange={(e) => { setResolvedFilter(e.target.value); setPage(1); }}
                className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              >
                <option value="">All Status</option>
                <option value="false">Unresolved</option>
                <option value="true">Resolved</option>
              </select>
              <Button variant="outline" onClick={fetchErrors} className="border-gray-600 text-gray-300 hover:bg-gray-700">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="border-b border-gray-700">
              <CardTitle className="text-white">Errors ({data?.total || 0})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="text-center py-12">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto text-orange-500" />
                </div>
              ) : data?.errors.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <p className="text-gray-400">No errors found</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-700 max-h-[600px] overflow-y-auto">
                  {data?.errors.map((err) => (
                    <div 
                      key={err.id} 
                      className={`p-4 cursor-pointer hover:bg-gray-750 transition-colors ${
                        selectedError?.id === err.id ? 'bg-gray-750 border-l-2 border-orange-500' : ''
                      }`}
                      onClick={() => viewErrorDetails(err.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getTypeBadge(err.error_type)}
                          {err.resolved ? (
                            <Badge className="bg-green-900/50 text-green-400 border-green-700">Resolved</Badge>
                          ) : (
                            <Badge className="bg-red-900/50 text-red-400 border-red-700">Open</Badge>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(err.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300 line-clamp-2">{err.message}</p>
                      {err.endpoint && (
                        <p className="text-xs text-gray-500 mt-1 font-mono">{err.endpoint}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

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

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="border-b border-gray-700">
              <CardTitle className="text-white">Error Details</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {detailsLoading ? (
                <div className="text-center py-12">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto text-orange-500" />
                </div>
              ) : selectedError ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getTypeBadge(selectedError.error_type)}
                      {selectedError.error_code && (
                        <Badge variant="outline" className="border-gray-600 text-gray-300">{selectedError.error_code}</Badge>
                      )}
                    </div>
                    {!selectedError.resolved && (
                      <Button 
                        size="sm" 
                        onClick={() => resolveError(selectedError.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Resolve
                      </Button>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-400">Message</label>
                    <p className="mt-1 text-white">{selectedError.message}</p>
                  </div>

                  {selectedError.user && (
                    <div>
                      <label className="text-sm font-medium text-gray-400">User</label>
                      <p className="mt-1 text-white">
                        {selectedError.user.name} ({selectedError.user.email})
                      </p>
                    </div>
                  )}

                  {selectedError.endpoint && (
                    <div>
                      <label className="text-sm font-medium text-gray-400">Endpoint</label>
                      <p className="mt-1 text-white font-mono text-sm bg-gray-700 p-2 rounded">{selectedError.endpoint}</p>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium text-gray-400">Timestamp</label>
                    <p className="mt-1 text-white">
                      {new Date(selectedError.created_at).toLocaleString()}
                    </p>
                  </div>

                  {selectedError.stack_trace && (
                    <div>
                      <label className="text-sm font-medium text-gray-400">Stack Trace</label>
                      <pre className="mt-1 p-3 bg-gray-700 rounded text-xs overflow-x-auto max-h-[200px] text-gray-300">
                        {selectedError.stack_trace}
                      </pre>
                    </div>
                  )}

                  {selectedError.request_data && (
                    <div>
                      <label className="text-sm font-medium text-gray-400">Request Data</label>
                      <pre className="mt-1 p-3 bg-gray-700 rounded text-xs overflow-x-auto max-h-[150px] text-gray-300">
                        {selectedError.request_data}
                      </pre>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Eye className="w-12 h-12 mx-auto mb-3 text-gray-600" />
                  <p>Select an error to view details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
