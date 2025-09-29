'use client';
import { useEffect, useState } from 'react';
import { apiClient, Product } from '../../lib/api';
import { useI18n } from '@/lib/i18n';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function ProductsPage() {
  const { t } = useI18n();
  const [items, setItems] = useState<Product[]>([]);
  const [q, setQ] = useState('');

  useEffect(() => { apiClient.getProducts().then(setItems); }, []);

  const filtered = items.filter(p => (
    p.asin.toLowerCase().includes(q.toLowerCase()) ||
    p.sku.toLowerCase().includes(q.toLowerCase()) ||
    p.title.toLowerCase().includes(q.toLowerCase())
  ));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{t('products.title')}</h2>
        <input 
          value={q} 
          onChange={e=>setQ(e.target.value)} 
          placeholder={t('products.search')} 
          className="px-3 py-2 border rounded-md bg-background"
        />
      </div>
      
      <Card>
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
              {filtered.map(p => (
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
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <p className="text-muted-foreground">{t('products.noResults')}</p>
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