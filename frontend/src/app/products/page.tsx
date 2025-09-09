'use client';
import { useEffect, useState } from 'react';
import { apiClient, Product } from '../../lib/api';


export default function ProductsPage() {
const [items, setItems] = useState<Product[]>([]);
const [q, setQ] = useState('');


useEffect(() => { apiClient.getProducts().then(setItems); }, []);


const filtered = items.filter(p => (
p.asin.toLowerCase().includes(q.toLowerCase()) ||
p.sku.toLowerCase().includes(q.toLowerCase()) ||
p.title.toLowerCase().includes(q.toLowerCase())
));


return (
<div className="space-y-4">
<div className="flex items-center justify-between">
<h2 className="text-2xl font-semibold">Ürünler</h2>
<input value={q} onChange={e=>setQ(e.target.value)} placeholder="Ara..." className="px-3 py-2 border rounded-md" />
</div>
<div className="rounded-2xl shadow-sm border bg-white overflow-hidden">
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
{filtered.map(p => (
<tr key={p.id} className="border-t hover:bg-gray-50">
<td className="p-3">{p.sku}</td>
<td className="p-3"><a className="text-blue-600 hover:underline" href={`/products/${p.asin}`}>{p.asin}</a></td>
<td className="p-3">{p.title}</td>
<td className="p-3 text-right">{p.price.toFixed(2)} {p.currency}</td>
<td className="p-3">{p.buybox_owner || (p.buybox_owning ? 'Siz' : '-')}</td>
<td className="p-3 text-center">{p.stock_qty}</td>
</tr>
))}
{filtered.length === 0 && (
<tr><td className="p-4 text-gray-500" colSpan={6}>Kayıt bulunamadı.</td></tr>
)}
</tbody>
</table>
</div>
</div>
</div>
);
}