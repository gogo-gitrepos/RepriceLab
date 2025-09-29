'use client';
import React, { useState, useEffect } from 'react';
import { apiClient, MetricsSummary, Product } from '../lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function DashboardPage() {
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
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refresh}>
            Yenile
          </Button>
          <Button onClick={doSync} disabled={loading}>
            {loading ? 'Senkronize ediliyor…' : 'Ürünleri Senkronize Et'}
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
            <CardTitle className="text-sm font-medium">Toplam Ürün</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.total_products ?? '-'}</div>
            <p className="text-xs text-muted-foreground">
              Aktif ürün sayısı
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Buy Box Sahiplik</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics ? metrics.buybox_ownership_pct.toFixed(1) + '%' : '-'}
            </div>
            <p className="text-xs text-muted-foreground">
              Sahip olduğunuz ürün oranı
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Son 7 Gün</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics && metrics.last7days_ownership.length === 0 ? 'Veri yok' : '—'}
            </div>
            <p className="text-xs text-muted-foreground">
              Trend analizi
            </p>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Ürünler</CardTitle>
            <Button variant="link" asChild>
              <a href="/products">Tümünü gör</a>
            </Button>
          </div>
          <CardDescription>
            Son eklenen ürünlerinizin özeti
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>ASIN</TableHead>
                <TableHead>Başlık</TableHead>
                <TableHead className="text-right">Fiyat</TableHead>
                <TableHead>BB Sahibi</TableHead>
                <TableHead className="text-center">Stok</TableHead>
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
                      <Badge variant="default">Siz</Badge>
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
                      <p className="text-muted-foreground">Henüz ürün yok.</p>
                      <Button variant="outline" onClick={doSync} disabled={loading}>
                        Ürünleri Senkronize Et
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