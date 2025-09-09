'use client';
import React, { useState, useEffect } from 'react';
import { apiClient, MetricsSummary, Product } from '../lib/api';


export default function DashboardPage() {
const [metrics, setMetrics] = useState<MetricsSummary | null>(null);
const [products, setProducts] = useState<Product[]>([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);


const refresh = async () => {
setError(null);
try {
const [m, p] = await Promise.all([apiClient.getMetrics(), apiClient.getProducts()]);
setMetrics(m); setProducts(p);
} catch (e: any) { setError(e.message); }
};


useEffect(() => { refresh(); }, []);


const doSync = async () => {
setLoading(true); setError(null);
try { await apiClient.syncProducts(); await refresh(); }
catch (e: any) { setError(e.message); }
finally { setLoading(false); }
};


return (
<div className="space-y-6">
<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
<h2 className="text-2xl font-semibold">Dashboard</h2>
<div className="flex gap-2">
<button onClick={refresh} className="px-3 py-2 rounded-md bg-gray-200 hover:bg-gray-300">Yenile</button>
<button onClick={doSync} disabled={loading} className="px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60">
{loading ? 'Senkronize ediliyor…' : 'Ürünleri Senkronize Et'}
</button>
</div>
</div>


{error && <div className="p-3 rounded-md bg-red-100 text-red-700">{error}</div>}


<section className="grid grid-cols-1 md:grid-cols-3 gap-4">
<div className="rounded-2xl shadow-sm border bg-white p-4">
<div className="text-sm text-gray-500">Toplam Ürün</div>
<div className="text-3xl font-bold">{metrics?.total_products ?? '-'}</div>
</div>
<div className="rounded-2xl shadow-sm border bg-white p-4">
<div className="text-sm text-gray-500">Buy Box Sahiplik</div>
<div className="text-3xl font-bold">{metrics ? metrics.buybox_ownership_pct.toFixed(1) + '%' : '-'}</div>
</div>
<div className="rounded-2xl shadow-sm border bg-white p-4">
<div className="text-sm text-gray-500">Son 7 Gün</div>
<div className="text-lg">{metrics && metrics.last7days_ownership.length === 0 ? 'Veri yok' : '—'}</div>
</div>
</section>


<section className="rounded-2xl shadow-sm border bg-white overflow-hidden">
<div className="p-4 border-b flex items-center justify-between">
<h3 className="font-semibold">Ürünler</h3>
<a className="text-sm text-blue-600 hover:underline" href="/products">Tümünü gör</a>
</div>
<div className="overflow-x-auto">
<table className="min-w-full text-sm">
<thead className="bg-gray-50">
<tr>
<th className="text-left p-3">SKU</th>
<th className="text-left p-3">ASIN</th>
<th className="text-left p-3">Başlık</th>
<th className="text-right p-3">Fiyat</th>
<th className="text-left p-3">BB Sahibi</th>
<th className="text-center p-3">Stok</th>
</tr>
</thead>
<tbody>
{products.slice(0, 10).map(p => (
<tr key={p.id} className="border-t hover:bg-gray-50">
<td className="p-3">{p.sku}</td>
<td className="p-3"><a className="text-blue-600 hover:underline" href={`/products/${p.asin}`}>{p.asin}</a></td>
<td className="p-3">{p.title}</td>
<td className="p-3 text-right">{p.price.toFixed(2)} {p.currency}</td>
<td className="p-3">{p.buybox_owner || (p.buybox_owning ? 'Siz' : '-')}</td>
<td className="p-3 text-center">{p.stock_qty}</td>
</tr>
))}
{products.length === 0 && (
<tr><td className="p-4 text-gray-500" colSpan={6}>Henüz ürün yok. "Ürünleri Senkronize Et" butonunu kullan.</td></tr>
)}
</tbody>
</table>
</div>
</section>
</div>
);
}