'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Package, 
  RotateCw, 
  Search, 
  Eye, 
  ToggleLeft, 
  ToggleRight,
  TrendingUp,
  DollarSign,
  BarChart3
} from 'lucide-react';

interface Product {
  id: number;
  sku: string;
  asin: string;
  title: string;
  marketplace_id: string;
  condition_type: string;
  listing_status: string;
  fulfillment_channel: string;
  price: number;
  currency: string;
  stock_qty: number;
  buybox_owning: boolean;
  repricing_enabled: boolean;
  last_synced_at: string;
  sync_status: string;
  created_at: string;
  updated_at: string;
  store_id: number;
}

interface ProductStats {
  total_products: number;
  active_products: number;
  repricing_enabled: number;
  buybox_winning: number;
  total_inventory_value: number;
  buybox_win_rate: number;
  repricing_coverage: number;
}

interface Store {
  id: number;
  store_name: string;
  selling_partner_id: string;
  region: string;
  is_active: boolean;
}

export default function ProductsPage() {
  const { t } = useI18n();
  const [products, setProducts] = useState<Product[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [stats, setStats] = useState<ProductStats | null>(null);
  const [selectedStore, setSelectedStore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Demo user ID (in production, get from auth context)
  const userId = 2;

  useEffect(() => {
    loadStores();
    loadProducts();
    loadStats();
  }, [selectedStore]);

  const loadStores = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/auth/amazon/stores`);
      const data = await response.json();
      if (response.ok) {
        setStores(data.stores || []);
        if (data.stores.length > 0 && !selectedStore) {
          setSelectedStore(data.stores[0].id);
        }
      }
    } catch (error) {
      console.error("Failed to load stores:", error);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const storeParam = selectedStore ? `&store_id=${selectedStore}` : '';
      const response = await fetch(`http://localhost:8000/api/products/?${storeParam ? storeParam.substring(1) + '&' : ''}limit=50`);
      const data = await response.json();
      if (response.ok) {
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/products/stats/summary`);
      const data = await response.json();
      if (response.ok) {
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  const syncProducts = async () => {
    if (!selectedStore) {
      alert('Please select a store first');
      return;
    }

    try {
      setSyncing(true);
      const response = await fetch(`http://localhost:8000/api/products/sync/${selectedStore}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      
      if (response.ok) {
        alert(`✅ Sync completed! ${data.synced_count} products synced, ${data.error_count} errors`);
        loadProducts();
        loadStats();
      } else {
        alert(`❌ Sync failed: ${data.detail}`);
      }
    } catch (error) {
      console.error("Failed to sync products:", error);
      alert('❌ Sync failed due to network error');
    } finally {
      setSyncing(false);
    }
  };

  const toggleRepricing = async (productId: number, enabled: boolean) => {
    try {
      const response = await fetch(`http://localhost:8000/api/products/${productId}/repricing/toggle?enabled=${enabled}`, {
        method: 'POST'
      });
      
      if (response.ok) {
        loadProducts();
        loadStats();
      } else {
        alert('Failed to update repricing setting');
      }
    } catch (error) {
      console.error("Failed to toggle repricing:", error);
    }
  };

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.asin.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'synced': return 'bg-blue-100 text-blue-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">📦 {t('products.title')}</h2>
          <p className="text-muted-foreground">
            Manage your Amazon product listings and repricing settings
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('products.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                  <p className="text-2xl font-bold">{stats.total_products}</p>
                </div>
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Buy Box Win Rate</p>
                  <p className="text-2xl font-bold">{stats.buybox_win_rate}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Repricing Coverage</p>
                  <p className="text-2xl font-bold">{stats.repricing_coverage}%</p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Inventory Value</p>
                  <p className="text-2xl font-bold">${stats.total_inventory_value.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RotateCw className="h-5 w-5" />
            Product Synchronization
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label htmlFor="store-select">Select Store</Label>
              <select
                id="store-select"
                className="w-full px-3 py-2 border rounded-md bg-background"
                value={selectedStore || ''}
                onChange={(e) => setSelectedStore(Number(e.target.value))}
              >
                <option value="">Select a store...</option>
                {stores.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.store_name} ({store.region})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={syncProducts}
                disabled={syncing || !selectedStore}
                className="flex items-center gap-2"
              >
                <RotateCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
                {syncing ? 'Syncing...' : 'Sync Products'}
              </Button>
              <Button
                variant="outline"
                onClick={loadProducts}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product Table */}
      <Card>
        <CardHeader>
          <CardTitle>Product Listings ({filteredProducts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading products...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('products.sku')}</TableHead>
                  <TableHead>{t('products.asin')}</TableHead>
                  <TableHead>{t('products.title_field')}</TableHead>
                  <TableHead className="text-right">{t('products.price')}</TableHead>
                  <TableHead>{t('products.buyboxOwner')}</TableHead>
                  <TableHead className="text-center">{t('products.stock')}</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Repricing</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.sku}</TableCell>
                    <TableCell>
                      <Button variant="link" className="h-auto p-0" asChild>
                        <a href={`/products/${product.asin}`}>{product.asin}</a>
                      </Button>
                    </TableCell>
                    <TableCell className="max-w-[300px] truncate">{product.title}</TableCell>
                    <TableCell className="text-right">
                      {product.price.toFixed(2)} {product.currency}
                    </TableCell>
                    <TableCell>
                      {product.buybox_owning ? (
                        <Badge variant="default">🏆 {t('products.you')}</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">{product.stock_qty}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex gap-1">
                        <Badge className={getStatusColor(product.listing_status)}>
                          {product.listing_status}
                        </Badge>
                        <Badge className={getStatusColor(product.sync_status)}>
                          {product.sync_status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleRepricing(product.id, !product.repricing_enabled)}
                        className="h-8 w-16 p-0"
                      >
                        {product.repricing_enabled ? (
                          <ToggleRight className="h-5 w-5 text-green-600" />
                        ) : (
                          <ToggleLeft className="h-5 w-5 text-gray-400" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredProducts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Package className="h-12 w-12 opacity-50" />
                        <p className="font-medium">
                          {products.length === 0 ? "No products found" : t('products.noResults')}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {products.length === 0 
                            ? "Connect an Amazon store and sync products to get started"
                            : "Try adjusting your search criteria"
                          }
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}