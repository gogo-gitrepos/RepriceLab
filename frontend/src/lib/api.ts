"use client";
const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    cache: "no-store",
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`API ${path} failed: ${res.status} ${txt}`);
  }
  return res.json() as Promise<T>;
}

export type InventoryItemOut = {
  sku: string; asin: string; title: string; price: number; currency: string; stock_qty: number; buybox_owner?: string|null; buybox_owning: boolean;
};
export type StoreStatus = { connected: boolean; region?: string; marketplace_ids?: string[]; selling_partner_id?: string };
export type Offer = { seller_id: string; price: number; shipping: number; is_buybox: boolean };
export type OffersResponse = { asin: string; offers: Offer[] };

export const apiClientEx = {
  authConnect: (): Promise<{ authorize_url: string }> => api("/auth/connect"),
  storeStatus: (): Promise<StoreStatus> => api("/store/"),
  storeInventory: (): Promise<InventoryItemOut[]> => api("/store/inventory"),
  storeOffers: (asin: string): Promise<OffersResponse> => api(`/store/offers/${asin}`),
  buyboxLeaderboard: (): Promise<{ rows: { seller_id: string; buybox_wins: number }[] }> => api("/store/buybox/leaderboard"),
};
