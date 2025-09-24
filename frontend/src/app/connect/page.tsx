"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { apiClientEx, InventoryItemOut, Offer } from "../../lib/api";

function useInterval(cb: () => void, ms: number, enabled: boolean) {
  const saved = useRef(cb);
  useEffect(() => { saved.current = cb; }, [cb]);
  useEffect(() => {
    if (!enabled) return;
    const id = setInterval(() => saved.current(), ms);
    return () => clearInterval(id);
  }, [ms, enabled]);
}

export default function ConnectAmazonPage() {
  const [connected, setConnected] = useState(false);
  const [store, setStore] = useState<any>(null);
  const [items, setItems] = useState<InventoryItemOut[]>([]);
  const [selectedAsin, setSelectedAsin] = useState<string>("");
  const [offers, setOffers] = useState<Offer[] | null>(null);
  const [polling, setPolling] = useState(true);

  const refresh = async () => {
    try {
      const s = await apiClientEx.storeStatus();
      setConnected(!!s.connected);
      setStore(s);
      const inv = await apiClientEx.storeInventory();
      setItems(inv);
      if (selectedAsin) {
        const of = await apiClientEx.storeOffers(selectedAsin);
        setOffers(of.offers);
      }
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    if (sp.get("status") === "ok") { toast.success("Amazon bağlandı"); }
    apiClientEx.storeStatus().then(s => {
      setConnected(!!s.connected); setStore(s);
      if (s.connected) refresh();
    }).catch(e => toast.error(e.message));
  }, []);

  useInterval(() => { refresh(); }, 10_000, polling && connected);

  const connect = async () => {
    try {
      const { authorize_url } = await apiClientEx.authConnect();
      window.location.href = authorize_url;
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Amazon Bağlantısı</h2>
        {!connected && (
          <button onClick={connect} className="px-4 py-2 rounded-md bg-amber-600 text-white hover:bg-amber-700">Amazon'a Bağlan</button>
        )}
        {connected && (
          <button onClick={() => setPolling(p => !p)} className="px-3 py-2 rounded-md border">
            {polling ? "Canlı: Açık" : "Canlı: Kapalı"}
          </button>
        )}
      </div>

      {store && (
        <div className="rounded-2xl shadow-sm border bg-white p-4">
          <h3 className="font-semibold mb-2">Store</h3>
          <pre className="text-xs bg-gray-50 p-3 rounded-md overflow-auto">{JSON.stringify(store, null, 2)}</pre>
        </div>
      )}

      <div className="rounded-2xl shadow-sm border bg-white">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold">Envanter</h3>
          <button onClick={refresh} className="px-3 py-2 rounded-md bg-gray-200 hover:bg-gray-300">Yenile</button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left">SKU</th>
                <th className="p-3 text-left">ASIN</th>
                <th className="p-3 text-left">Başlık</th>
                <th className="p-3 text-right">Fiyat</th>
                <th className="p-3 text-center">BB</th>
                <th className="p-3 text-center">Rakipler</th>
              </tr>
            </thead>
            <tbody>
              {items.map(it => (
                <tr key={it.asin} className="border-t hover:bg-gray-50">
                  <td className="p-3">{it.sku}</td>
                  <td className="p-3">{it.asin}</td>
                  <td className="p-3">{it.title}</td>
                  <td className="p-3 text-right">{it.price.toFixed(2)} {it.currency}</td>
                  <td className="p-3 text-center">{it.buybox_owning ? "✅" : (it.buybox_owner || "—")}</td>
                  <td className="p-3 text-center">
                    <button onClick={() => { setSelectedAsin(it.asin); setOffers(null); apiClientEx.storeOffers(it.asin).then(r => setOffers(r.offers)); }}
                            className="px-2 py-1 border rounded-md">Gör</button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && <tr><td className="p-4 text-gray-500" colSpan={6}>Kayıt yok.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {selectedAsin && (
        <div className="rounded-2xl shadow-sm border bg-white p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Rakipler · {selectedAsin}</h3>
            <button onClick={() => setSelectedAsin("")} className="text-sm text-blue-600">Kapat</button>
          </div>
          {!offers ? <div>Yükleniyor…</div> : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50"><tr>
                  <th className="p-3 text-left">Seller</th>
                  <th className="p-3 text-right">Fiyat</th>
                  <th className="p-3 text-right">Kargo</th>
                  <th className="p-3 text-center">Buy Box</th>
                </tr></thead>
                <tbody>
                  {offers.map((o, i) => (
                    <tr key={i} className="border-t hover:bg-gray-50">
                      <td className="p-3">{o.seller_id}</td>
                      <td className="p-3 text-right">{o.price.toFixed(2)}</td>
                      <td className="p-3 text-right">{o.shipping.toFixed(2)}</td>
                      <td className="p-3 text-center">{o.is_buybox ? "🏆" : "—"}</td>
                    </tr>
                  ))}
                  {offers.length === 0 && <tr><td className="p-4 text-gray-500" colSpan={4}>Teklif yok.</td></tr>}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
