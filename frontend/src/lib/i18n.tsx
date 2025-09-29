'use client';
import React, { createContext, useContext, ReactNode } from 'react';

const translations = {
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
  'dashboard.activeProducts': 'Active products',
  'dashboard.ownershipPercentage': 'Products with Buy Box ownership',
  'dashboard.trendAnalysis': 'Trend analysis',
  'dashboard.noData': 'No data available',
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
  'products.buyboxOwner': 'Buy Box Owner',
  'products.stock': 'Stock',
  'products.noResults': 'No records found.',
  'products.you': 'You',
  'products.back': '← Back',
  'products.loading': 'Loading…',
  
  // Product Detail
  'productDetail.title': 'Product: {asin}',
  'productDetail.pricePreview': 'Price Preview',
  'productDetail.currentPrice': 'Current price:',
  'productDetail.competitorMin': 'Competitor minimum:',
  'productDetail.minMax': 'Min/Max:',
  'productDetail.suggested': 'Suggested:',
  'productDetail.notes': 'Notes',
  'productDetail.demoNote': 'This page works with demo data without SP-API. In real integration, offer data and Buy Box owner information comes from the backend.',
  
  // Settings
  'settings.title': 'Settings · Pricing Rules',
  'settings.minPrice': 'Minimum Price',
  'settings.maxPriceFormula': 'Maximum Price Formula',
  'settings.strategy': 'Strategy',
  'settings.aggressive': 'Aggressive',
  'settings.defensive': 'Defensive',
  'settings.save': 'Save',
  'settings.ruleSaved': 'Rule saved.',
  'settings.formulaExample': 'Example: {example}',
};

interface I18nContextType {
  t: (key: string, params?: Record<string, string>) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const t = (key: string, params?: Record<string, string>): string => {
    let text = translations[key] || key;
    
    if (params) {
      Object.entries(params).forEach(([paramKey, value]) => {
        text = text.replace(`{${paramKey}}`, value);
      });
    }
    
    return text;
  };

  return (
    <I18nContext.Provider value={{ t }}>
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