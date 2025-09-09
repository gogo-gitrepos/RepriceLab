'use client';
import { useEffect, useState } from 'react';
import { apiClient, PricingPreview } from '../../../lib/api';

export default function ProductDetail({ params }: { params: { asin: string } }) {
    const { asin } = params;
    const [preview, setPreview] = useState<PricingPreview | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        apiClient.getPreview(asin)
            .then(setPreview)
            .catch(e => setError(e.message));
    }, [asin]);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Ürün: {asin}</h2>
                <a className="text-sm text-blue-600 hover:underline" href="/products">← Geri</a>
            </div>
            {error && <div className="p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}
            {!preview && !error && <div>Yükleniyor…</div>}
            {preview && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-2xl shadow-sm border bg-white p-4">
                        <h3 className="font-semibold mb-2">Fiyat Önizleme</h3>
                        <ul className="space-y-1 text-sm">
                            <li>
                                <span className="text-gray-500">Mevcut fiyat:</span>{' '}
                                <b>{preview.current_price.toFixed(2)}</b>
                            </li>
                            <li>
                                <span className="text-gray-500">Rakip min:</span>{' '}
                                <b>{preview.competitor_min !== undefined && preview.competitor_min !== null ? preview.competitor_min.toFixed(2) : '-'}</b>
                            </li>
                            <li>
                                <span className="text-gray-500">Min/Max:</span>{' '}
                                <b>{preview.min_price.toFixed(2)}</b> / <b>{preview.max_price.toFixed(2)}</b>
                            </li>
                            <li>
                                <span className="text-gray-500">Önerilen:</span>{' '}
                                <b className="text-blue-700">{preview.suggested_price.toFixed(2)}</b>
                            </li>
                        </ul>
                    </div>
                    <div className="rounded-2xl shadow-sm border bg-white p-4">
                        <h3 className="font-semibold mb-2">Notlar</h3>
                        <p className="text-sm text-gray-600">
                            Bu sayfa demo verilerle SP-API olmadan çalışır. Gerçek entegrasyonda teklif verileri ve Buy Box sahibi backend’den gelir.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}