'use client';
import { useState } from 'react';
import { apiClient } from '../../lib/api';


export default function SettingsPage() {
const [minPrice, setMinPrice] = useState(7.0);
const [maxFormula, setMaxFormula] = useState('current_price * 1.9');
const [strategy, setStrategy] = useState<'aggressive'|'defensive'>('aggressive');
const [msg, setMsg] = useState<string| null>(null);


const onSave = async (e: React.FormEvent) => {
e.preventDefault(); setMsg(null);
try {
await apiClient.setRule({ min_price: Number(minPrice), max_price_formula: maxFormula, strategy });
setMsg('Kural kaydedildi.');
} catch (e: any) { setMsg(e.message); }
};


return (
<div className="max-w-xl space-y-6">
<h2 className="text-2xl font-semibold">Ayarlar · Fiyatlandırma Kuralı</h2>
<form onSubmit={onSave} className="space-y-4">
<div>
<label className="block text-sm text-gray-600 mb-1">Minimum Fiyat</label>
<input type="number" step="0.01" className="w-full px-3 py-2 border rounded-md" value={minPrice} onChange={e=>setMinPrice(parseFloat(e.target.value))} />
</div>
<div>
<label className="block text-sm text-gray-600 mb-1">Maksimum Fiyat Formülü</label>
<input className="w-full px-3 py-2 border rounded-md" value={maxFormula} onChange={e=>setMaxFormula(e.target.value)} />
<p className="text-xs text-gray-500 mt-1">Örn: <code>current_price * 1.9</code></p>
</div>
<div>
<label className="block text-sm text-gray-600 mb-1">Strateji</label>
<select className="w-full px-3 py-2 border rounded-md" value={strategy} onChange={e=>setStrategy(e.target.value as any)}>
<option value="aggressive">Aggressive</option>
<option value="defensive">Defensive</option>
</select>
</div>
<div className="flex gap-2">
<button type="submit" className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">Kaydet</button>
{msg && <div className="text-sm text-gray-700">{msg}</div>}
</div>
</form>
</div>
);
}