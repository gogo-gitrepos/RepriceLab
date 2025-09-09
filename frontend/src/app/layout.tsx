import './globals.css';
import React from 'react';


export const metadata = { title: 'BuyBox SaaS', description: 'Buy Box tracker' };


export default function RootLayout({ children }: { children: React.ReactNode }) {
return (
<html lang="tr">
<body className="min-h-screen bg-gray-50 text-gray-900">
<div className="flex min-h-screen">
<aside className="w-64 border-r bg-white/80 backdrop-blur p-4 hidden md:block">
<h1 className="text-xl font-bold mb-4">BuyBox SaaS</h1>
<nav className="space-y-2">
<a className="block px-3 py-2 rounded-md hover:bg-gray-100" href="/">Dashboard</a>
<a className="block px-3 py-2 rounded-md hover:bg-gray-100" href="/products">Ürünler</a>
<a className="block px-3 py-2 rounded-md hover:bg-gray-100" href="/settings">Ayarlar</a>
</nav>
<div className="mt-6 text-xs text-gray-500">API: {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}</div>
</aside>
<main className="flex-1 p-4 md:p-8">{children}</main>
</div>
</body>
</html>
);
}