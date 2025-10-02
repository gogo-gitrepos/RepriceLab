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
  BarChart3,
  Trash2,
  Download,
  Zap,
  ChevronDown,
  Filter
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
  repricing_strategy?: string;
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
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(new Set());
  const [bulkStrategy, setBulkStrategy] = useState<'win_buybox'|'maximize_profit'|'boost_sales'>('win_buybox');
  const [repricingFilter, setRepricingFilter] = useState<'all'|'active'|'paused'>('all');
  const [showBulkDropdown, setShowBulkDropdown] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Demo user ID (in production, get from auth context)
  const userId = 2;

  useEffect(() => {
    loadStores();
  }, []);

  useEffect(() => {
    if (selectedStore !== null) {
      loadProducts();
      loadStats();
    }
  }, [selectedStore]);

  const loadStores = async () => {
    try {
      const response = await fetch(`/api/auth/amazon/stores`);
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
      const response = await fetch(`/api/products/?user_id=${userId}${storeParam}&limit=50`);
      const data = await response.json();
      if (response.ok && data.products) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch(`/api/products/stats/summary`);
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
      const response = await fetch(`/api/products/sync/${selectedStore}`, {
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
      const response = await fetch(`/api/products/${productId}/repricing/toggle?enabled=${enabled}`, {
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

  const toggleSelectProduct = (productId: number) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedProducts.size === filteredProducts.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(filteredProducts.map(p => p.id)));
    }
  };

  const bulkDelete = async () => {
    if (selectedProducts.size === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedProducts.size} products?`)) return;

    try {
      const promises = Array.from(selectedProducts).map(id =>
        fetch(`/api/products/${id}`, { method: 'DELETE' })
      );
      await Promise.all(promises);
      setSelectedProducts(new Set());
      loadProducts();
      loadStats();
      alert(`✅ Successfully deleted ${selectedProducts.size} products`);
    } catch (error) {
      console.error('Bulk delete failed:', error);
      alert('❌ Bulk delete failed');
    }
  };

  const bulkDownloadCSV = () => {
    if (selectedProducts.size === 0) return;

    const selected = products.filter(p => selectedProducts.has(p.id));
    const csvHeader = 'SKU,ASIN,Title,Price,Currency,Stock,Buy Box,Repricing,Strategy\n';
    const csvRows = selected.map(p => 
      `${p.sku},${p.asin},"${p.title}",${p.price},${p.currency},${p.stock_qty},${p.buybox_owning},${p.repricing_enabled},${p.repricing_strategy || 'none'}`
    ).join('\n');
    
    const csv = csvHeader + csvRows;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `products_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const bulkAssignStrategy = async () => {
    if (selectedProducts.size === 0) return;

    try {
      const response = await fetch('/api/repricing/set-strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_ids: Array.from(selectedProducts),
          strategy: bulkStrategy,
          enabled: true,
          target_margin_percent: 15
        })
      });

      if (response.ok) {
        setSelectedProducts(new Set());
        loadProducts();
        loadStats();
        alert(`✅ Successfully assigned "${bulkStrategy.replace('_', ' ')}" strategy to ${selectedProducts.size} products`);
      } else {
        alert('❌ Failed to assign strategy');
      }
    } catch (error) {
      console.error('Bulk assign strategy failed:', error);
      alert('❌ Bulk assign strategy failed');
    }
  };

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

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.asin?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRepricing = repricingFilter === 'all' ? true :
      repricingFilter === 'active' ? product.repricing_enabled :
      repricingFilter === 'paused' ? !product.repricing_enabled : true;
    
    return matchesSearch && matchesRepricing;
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">📦 {t('products.title')}</h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          Manage your Amazon product listings and repricing settings
        </p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total Products</p>
                  <p className="text-xl sm:text-2xl font-bold">{stats.total_products}</p>
                </div>
                <Package className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Buy Box Win Rate</p>
                  <p className="text-xl sm:text-2xl font-bold">{stats.buybox_win_rate}%</p>
                </div>
                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Repricing Coverage</p>
                  <p className="text-xl sm:text-2xl font-bold">{stats.repricing_coverage}%</p>
                </div>
                <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Inventory Value</p>
                  <p className="text-xl sm:text-2xl font-bold">${stats.total_inventory_value.toLocaleString()}</p>
                </div>
                <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Control Panel */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <RotateCw className="h-4 w-4 sm:h-5 sm:w-5" />
            Product Synchronization
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 sm:gap-4">
            <div className="flex-1">
              <Label htmlFor="store-select" className="text-sm">Select Store</Label>
              <select
                id="store-select"
                className="w-full px-3 py-2 border rounded-md bg-background text-sm sm:text-base"
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
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <RotateCw className={`h-3 w-3 sm:h-4 sm:w-4 ${syncing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">{syncing ? 'Syncing...' : 'Sync Products'}</span>
                <span className="sm:hidden">{syncing ? 'Sync...' : 'Sync'}</span>
              </Button>
              <Button
                variant="outline"
                onClick={loadProducts}
                disabled={loading}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Refresh</span>
                <span className="sm:hidden">Reload</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>


      {/* Product Table */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-base sm:text-lg">Product Listings ({filteredProducts.length})</CardTitle>
        </CardHeader>
        
        {/* Filter, Search and Bulk Actions Bar */}
        <div className="px-4 sm:px-6 pb-4 flex flex-wrap items-center gap-3">
          {/* Filter Dropdown */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              {repricingFilter === 'all' ? 'All Products' : repricingFilter === 'active' ? 'Active' : 'Paused'}
              <ChevronDown className="h-3 w-3" />
            </Button>
            {showFilterDropdown && (
              <div className="absolute left-0 top-full mt-1 w-40 bg-white border rounded-md shadow-lg z-10">
                <button
                  onClick={() => { setRepricingFilter('all'); setShowFilterDropdown(false); }}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${repricingFilter === 'all' ? 'bg-purple-50 text-purple-700 font-medium' : ''}`}
                >
                  All Products
                </button>
                <button
                  onClick={() => { setRepricingFilter('active'); setShowFilterDropdown(false); }}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${repricingFilter === 'active' ? 'bg-purple-50 text-purple-700 font-medium' : ''}`}
                >
                  Active
                </button>
                <button
                  onClick={() => { setRepricingFilter('paused'); setShowFilterDropdown(false); }}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${repricingFilter === 'paused' ? 'bg-purple-50 text-purple-700 font-medium' : ''}`}
                >
                  Paused
                </button>
              </div>
            )}
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('products.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Bulk Actions Button - Always Visible */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowBulkDropdown(!showBulkDropdown)}
              className="h-9 px-4 flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white"
            >
              <span className="text-sm font-semibold">Bulk Actions</span>
              {selectedProducts.size > 0 && (
                <Badge className="bg-purple-800 text-white">{selectedProducts.size}</Badge>
              )}
              <ChevronDown className="h-4 w-4" />
            </Button>
            {showBulkDropdown && (
              <div className="absolute right-0 top-full mt-1 w-56 bg-white border rounded-md shadow-lg z-20">
                <div className="p-2 border-b">
                  <p className="text-xs font-semibold text-gray-600">BULK ACTIONS</p>
                </div>
                <div className="p-2 space-y-1">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-600">Assign Strategy:</label>
                    <select
                      value={bulkStrategy}
                      onChange={(e) => setBulkStrategy(e.target.value as any)}
                      className="w-full px-2 py-1 border rounded text-sm bg-white"
                    >
                      <option value="win_buybox">Win Buy Box</option>
                      <option value="maximize_profit">Maximize Profit</option>
                      <option value="boost_sales">Boost Sales</option>
                    </select>
                    <button
                      onClick={() => { 
                        if (selectedProducts.size === 0) {
                          alert('Please select products first');
                          return;
                        }
                        bulkAssignStrategy(); 
                        setShowBulkDropdown(false); 
                      }}
                      className="w-full px-3 py-2 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 flex items-center justify-center gap-2"
                    >
                      <Zap className="w-4 h-4" />
                      Apply Strategy
                    </button>
                  </div>
                  <hr className="my-2" />
                  <button
                    onClick={() => { 
                      if (selectedProducts.size === 0) {
                        alert('Please select products first');
                        return;
                      }
                      bulkDownloadCSV(); 
                      setShowBulkDropdown(false); 
                    }}
                    className="w-full px-3 py-2 text-sm hover:bg-gray-50 rounded flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download CSV
                  </button>
                  <button
                    onClick={() => { 
                      if (selectedProducts.size === 0) {
                        alert('Please select products first');
                        return;
                      }
                      bulkDelete(); 
                      setShowBulkDropdown(false); 
                    }}
                    className="w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Selected
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <CardContent className="p-0 sm:p-6">
          {loading ? (
            <div className="text-center py-8 px-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-sm sm:text-base text-muted-foreground">Loading products...</p>
            </div>
          ) : (
            <>
              {filteredProducts.length > 0 && (
                <div className="p-4 bg-blue-50 border border-blue-200 text-blue-800 font-semibold">
                  ✅ {filteredProducts.length} products loaded successfully
                </div>
              )}
              <div className="overflow-x-auto">
            <table className="w-full caption-bottom text-sm border">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-20">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedProducts.size === filteredProducts.length && filteredProducts.length > 0}
                        onChange={toggleSelectAll}
                        className="peer sr-only"
                      />
                      <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:bg-green-500 peer-checked:border-green-500 flex items-center justify-center transition-all">
                        <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </label>
                  </TableHead>
                  <TableHead>{t('products.sku')}</TableHead>
                  <TableHead>{t('products.asin')}</TableHead>
                  <TableHead>{t('products.title_field')}</TableHead>
                  <TableHead className="text-right">{t('products.price')}</TableHead>
                  <TableHead>{t('products.buyboxOwner')}</TableHead>
                  <TableHead className="text-center">{t('products.stock')}</TableHead>
                  <TableHead className="text-center">Strategy</TableHead>
                  <TableHead className="text-center">Repricing</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <tr><td colSpan={10} className="p-4 bg-yellow-100">DEBUG: About to render {filteredProducts.length} rows</td></tr>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedProducts.has(product.id)}
                          onChange={() => toggleSelectProduct(product.id)}
                          className="peer sr-only"
                        />
                        <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:bg-green-500 peer-checked:border-green-500 flex items-center justify-center transition-all">
                          <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </label>
                    </TableCell>
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
                      {product.repricing_strategy ? (
                        <Badge variant="outline" className="capitalize">
                          {product.repricing_strategy.replace('_', ' ')}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">None</span>
                      )}
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
                    <TableCell colSpan={10} className="h-24 text-center">
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
            </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}