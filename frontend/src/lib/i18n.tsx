'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'tr' | 'en';

interface Translations {
  tr: Record<string, string>;
  en: Record<string, string>;
}

const translations: Translations = {
  tr: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.products': 'Ürünler',
    'nav.settings': 'Ayarlar',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.refresh': 'Yenile',
    'dashboard.sync': 'Ürünleri Senkronize Et',
    'dashboard.syncing': 'Senkronize ediliyor…',
    'dashboard.totalProducts': 'Toplam Ürün',
    'dashboard.buyboxOwnership': 'Buy Box Sahiplik',
    'dashboard.last7Days': 'Son 7 Gün',
    'dashboard.activeProducts': 'Aktif ürün sayısı',
    'dashboard.ownershipPercentage': 'Sahip olduğunuz ürün oranı',
    'dashboard.trendAnalysis': 'Trend analizi',
    'dashboard.noData': 'Veri yok',
    'dashboard.products': 'Ürünler',
    'dashboard.viewAll': 'Tümünü gör',
    'dashboard.recentProducts': 'Son eklenen ürünlerinizin özeti',
    'dashboard.noProducts': 'Henüz ürün yok.',
    'dashboard.syncProducts': 'Ürünleri Senkronize Et',
    
    // Products
    'products.title': 'Ürünler',
    'products.search': 'Ara...',
    'products.sku': 'SKU',
    'products.asin': 'ASIN',
    'products.title_field': 'Başlık',
    'products.price': 'Fiyat',
    'products.buyboxOwner': 'BB Sahibi',
    'products.stock': 'Stok',
    'products.noResults': 'Kayıt bulunamadı.',
    'products.you': 'Siz',
    'products.back': '← Geri',
    'products.loading': 'Yükleniyor…',
    
    // Product Detail
    'productDetail.title': 'Ürün: {asin}',
    'productDetail.pricePreview': 'Fiyat Önizleme',
    'productDetail.currentPrice': 'Mevcut fiyat:',
    'productDetail.competitorMin': 'Rakip min:',
    'productDetail.minMax': 'Min/Max:',
    'productDetail.suggested': 'Önerilen:',
    'productDetail.notes': 'Notlar',
    'productDetail.demoNote': 'Bu sayfa demo verilerle SP-API olmadan çalışır. Gerçek entegrasyonda teklif verileri ve Buy Box sahibi backend\'den gelir.',
    
    // Settings
    'settings.title': 'Ayarlar · Fiyatlandırma Kuralı',
    'settings.minPrice': 'Minimum Fiyat',
    'settings.maxPriceFormula': 'Maksimum Fiyat Formülü',
    'settings.strategy': 'Strateji',
    'settings.aggressive': 'Aggressive',
    'settings.defensive': 'Defensive',
    'settings.save': 'Kaydet',
    'settings.ruleSaved': 'Kural kaydedildi.',
    'settings.formulaExample': 'Örn: {example}',
    
    // Language
    'language.switch': 'Dil',
    'language.turkish': 'Türkçe',
    'language.english': 'English',
  },
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.products': 'Products',
    'nav.settings': 'Settings',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.refresh': 'Refresh',
    'dashboard.sync': 'Sync Products',
    'dashboard.syncing': 'Syncing…',
    'dashboard.totalProducts': 'Total Products',
    'dashboard.buyboxOwnership': 'Buy Box Ownership',
    'dashboard.last7Days': 'Last 7 Days',
    'dashboard.activeProducts': 'Active product count',
    'dashboard.ownershipPercentage': 'Your product ownership ratio',
    'dashboard.trendAnalysis': 'Trend analysis',
    'dashboard.noData': 'No data',
    'dashboard.products': 'Products',
    'dashboard.viewAll': 'View all',
    'dashboard.recentProducts': 'Summary of your recently added products',
    'dashboard.noProducts': 'No products yet.',
    'dashboard.syncProducts': 'Sync Products',
    
    // Products
    'products.title': 'Products',
    'products.search': 'Search...',
    'products.sku': 'SKU',
    'products.asin': 'ASIN',
    'products.title_field': 'Title',
    'products.price': 'Price',
    'products.buyboxOwner': 'BB Owner',
    'products.stock': 'Stock',
    'products.noResults': 'No records found.',
    'products.you': 'You',
    'products.back': '← Back',
    'products.loading': 'Loading…',
    
    // Product Detail
    'productDetail.title': 'Product: {asin}',
    'productDetail.pricePreview': 'Price Preview',
    'productDetail.currentPrice': 'Current price:',
    'productDetail.competitorMin': 'Competitor min:',
    'productDetail.minMax': 'Min/Max:',
    'productDetail.suggested': 'Suggested:',
    'productDetail.notes': 'Notes',
    'productDetail.demoNote': 'This page works with demo data without SP-API. In real integration, offer data and Buy Box owner come from the backend.',
    
    // Settings
    'settings.title': 'Settings · Pricing Rule',
    'settings.minPrice': 'Minimum Price',
    'settings.maxPriceFormula': 'Maximum Price Formula',
    'settings.strategy': 'Strategy',
    'settings.aggressive': 'Aggressive',
    'settings.defensive': 'Defensive',
    'settings.save': 'Save',
    'settings.ruleSaved': 'Rule saved.',
    'settings.formulaExample': 'Example: {example}',
    
    // Language
    'language.switch': 'Language',
    'language.turkish': 'Türkçe',
    'language.english': 'English',
  },
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('tr');

  const t = (key: string, params?: Record<string, string>): string => {
    let text = translations[language][key] || key;
    
    if (params) {
      Object.entries(params).forEach(([paramKey, value]) => {
        text = text.replace(`{${paramKey}}`, value);
      });
    }
    
    return text;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}