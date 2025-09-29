'use client';
import React, { useState, useEffect } from 'react';
import { apiClient, MetricsSummary, Product } from '../lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useI18n } from '@/lib/i18n';

export default function DashboardPage() {
  const { t } = useI18n();
  const [metrics, setMetrics] = useState<MetricsSummary | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    setError(null);
    try {
      const [m, p] = await Promise.all([apiClient.getMetrics(), apiClient.getProducts()]);
      setMetrics(m); 
      setProducts(p);
    } catch (e: any) { 
      setError(e.message); 
    }
  };

  useEffect(() => { refresh(); }, []);

  const doSync = async () => {
    setLoading(true); 
    setError(null);
    try { 
      await apiClient.syncProducts(); 
      await refresh(); 
    }
    catch (e: any) { 
      setError(e.message); 
    }
    finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h2 className="text-3xl font-bold tracking-tight">{t('dashboard.title')}</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refresh}>
            {t('dashboard.refresh')}
          </Button>
          <Button onClick={doSync} disabled={loading}>
            {loading ? t('dashboard.syncing') : t('dashboard.sync')}
          </Button>
        </div>
      </div>

      {error && (
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="pt-6">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.totalProducts')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.total_products ?? '-'}</div>
            <p className="text-xs text-muted-foreground">
              {t('dashboard.activeProducts')}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.buyboxOwnership')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics ? metrics.buybox_ownership_pct.toFixed(1) + '%' : '-'}
            </div>
            <p className="text-xs text-muted-foreground">
              {t('dashboard.ownershipPercentage')}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.last7Days')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics && metrics.last7days_ownership.length === 0 ? t('dashboard.noData') : '—'}
            </div>
            <p className="text-xs text-muted-foreground">
              {t('dashboard.trendAnalysis')}
            </p>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t('dashboard.products')}</CardTitle>
            <Button variant="link" asChild>
              <a href="/products">{t('dashboard.viewAll')}</a>
            </Button>
          </div>
          <CardDescription>
            {t('dashboard.recentProducts')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('products.sku')}</TableHead>
                <TableHead>{t('products.asin')}</TableHead>
                <TableHead>{t('products.title_field')}</TableHead>
                <TableHead className="text-right">{t('products.price')}</TableHead>
                <TableHead>{t('products.buyboxOwner')}</TableHead>
                <TableHead className="text-center">{t('products.stock')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.slice(0, 10).map(p => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.sku}</TableCell>
                  <TableCell>
                    <Button variant="link" className="h-auto p-0" asChild>
                      <a href={`/products/${p.asin}`}>{p.asin}</a>
                    </Button>
                  </TableCell>
                  <TableCell className="max-w-[300px] truncate">{p.title}</TableCell>
                  <TableCell className="text-right">
                    {p.price.toFixed(2)} {p.currency}
                  </TableCell>
                  <TableCell>
                    {p.buybox_owning ? (
                      <Badge variant="default">{t('products.you')}</Badge>
                    ) : p.buybox_owner ? (
                      <Badge variant="secondary">{p.buybox_owner}</Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">{p.stock_qty}</TableCell>
                </TableRow>
              ))}
              {products.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <p className="text-muted-foreground">{t('dashboard.noProducts')}</p>
                      <Button variant="outline" onClick={doSync} disabled={loading}>
                        {t('dashboard.syncProducts')}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}