'use client';

const BASE = '';

async function api<T>(path: string, init?: RequestInit): Promise<T> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    const res = await fetch(`${BASE}${path}`, {
        ...init,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            ...(init?.headers || {}),
        },
        cache: 'no-store',
    });
    if (!res.ok) {
        const txt = await res.text();
        throw new Error(`API ${path} failed: ${res.status} ${txt}`);
    }
    return res.json() as Promise<T>;
}

export type Product = {
    id: number;
    sku: string;
    asin: string;
    title: string;
    price: number;
    currency: string;
    stock_qty: number;
    buybox_owner?: string | null;
    buybox_owning: boolean;
};

export type MetricsSummary = {
    total_products: number;
    buybox_ownership_pct: number;
    last7days_ownership: Array<[string, number]>;
};

export type PricingPreview = {
    asin: string;
    current_price: number;
    competitor_min?: number | null;
    min_price: number;
    max_price: number;
    suggested_price: number;
};

export type UserStatus = {
    id: number;
    email: string;
    name: string;
    picture?: string | null;
    created_at: string;
    has_connected_stores: boolean;
    has_products: boolean;
};

export const apiClient = {
    getMetrics: () => api<MetricsSummary>('/api/metrics/summary'),
    getProducts: () => api<Product[]>('/api/products/'),
    getUserStatus: () => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
        if (!token) {
            return Promise.resolve(null);
        }
        return api<UserStatus>('/api/auth/me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    },
    syncProducts: () => api<{ synced: number }>('/api/products/sync', { method: 'POST' }),
    getPreview: (asin: string) => api<PricingPreview>(`/api/pricing/preview/${asin}`),
    setRule: (body: { min_price: number; max_price_formula: string; strategy: string }) =>
        api<{ ok: boolean }>('/api/pricing/rule', { method: 'POST', body: JSON.stringify(body) }),
};