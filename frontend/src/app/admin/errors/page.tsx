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
  Filter
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
      const token = localStorage.getItem('access_token');
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
      
      if (response.status === 403) {
        setError('Admin access required');
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
    fetchErrors();
  }, [page, typeFilter, resolvedFilter]);

  const viewErrorDetails = async (errorId: number) => {
    try {
      setDetailsLoading(true);
      const token = localStorage.getItem('access_token');
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
      const token = localStorage.getItem('access_token');
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
        return <Badge className="bg-blue-100 text-blue-800">API</Badge>;
      case 'amazon_error':
        return <Badge className="bg-orange-100 text-orange-800">Amazon</Badge>;
      case 'stripe_error':
        return <Badge className="bg-purple-100 text-purple-800">Stripe</Badge>;
      case 'repricing_error':
        return <Badge className="bg-yellow-100 text-yellow-800">Repricing</Badge>;
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  if (error === 'Admin access required') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => router.push('/dashboard')}>
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => router.push('/admin')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <AlertTriangle className="w-8 h-8" />
            Error Logs
          </h1>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-4 flex-wrap">
              <select
                value={typeFilter}
                onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
                className="px-3 py-2 border rounded-md"
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
                className="px-3 py-2 border rounded-md"
              >
                <option value="">All Status</option>
                <option value="false">Unresolved</option>
                <option value="true">Resolved</option>
              </select>
              <Button variant="outline" onClick={fetchErrors}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Errors ({data?.total || 0})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto text-purple-600" />
                </div>
              ) : (
                <>
                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {data?.errors.map((err) => (
                      <div 
                        key={err.id} 
                        className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                          selectedError?.id === err.id ? 'border-purple-500 bg-purple-50' : ''
                        }`}
                        onClick={() => viewErrorDetails(err.id)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getTypeBadge(err.error_type)}
                            {err.resolved ? (
                              <Badge className="bg-green-100 text-green-800">Resolved</Badge>
                            ) : (
                              <Badge className="bg-red-100 text-red-800">Open</Badge>
                            )}
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(err.created_at).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 line-clamp-2">{err.message}</p>
                        {err.endpoint && (
                          <p className="text-xs text-gray-400 mt-1">{err.endpoint}</p>
                        )}
                      </div>
                    ))}
                  </div>

                  {data && data.pages > 1 && (
                    <div className="flex items-center justify-between mt-6">
                      <p className="text-sm text-gray-500">
                        Page {data.page} of {data.pages}
                      </p>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          disabled={page === 1}
                          onClick={() => setPage(p => p - 1)}
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          disabled={page === data.pages}
                          onClick={() => setPage(p => p + 1)}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Error Details</CardTitle>
            </CardHeader>
            <CardContent>
              {detailsLoading ? (
                <div className="text-center py-12">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto text-purple-600" />
                </div>
              ) : selectedError ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getTypeBadge(selectedError.error_type)}
                      {selectedError.error_code && (
                        <Badge variant="outline">{selectedError.error_code}</Badge>
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
                    <label className="text-sm font-medium text-gray-600">Message</label>
                    <p className="mt-1 text-gray-900">{selectedError.message}</p>
                  </div>

                  {selectedError.user && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">User</label>
                      <p className="mt-1 text-gray-900">
                        {selectedError.user.name} ({selectedError.user.email})
                      </p>
                    </div>
                  )}

                  {selectedError.endpoint && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Endpoint</label>
                      <p className="mt-1 text-gray-900 font-mono text-sm">{selectedError.endpoint}</p>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium text-gray-600">Timestamp</label>
                    <p className="mt-1 text-gray-900">
                      {new Date(selectedError.created_at).toLocaleString()}
                    </p>
                  </div>

                  {selectedError.stack_trace && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Stack Trace</label>
                      <pre className="mt-1 p-3 bg-gray-100 rounded text-xs overflow-x-auto max-h-[200px]">
                        {selectedError.stack_trace}
                      </pre>
                    </div>
                  )}

                  {selectedError.request_data && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Request Data</label>
                      <pre className="mt-1 p-3 bg-gray-100 rounded text-xs overflow-x-auto max-h-[150px]">
                        {selectedError.request_data}
                      </pre>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Eye className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p>Select an error to view details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
