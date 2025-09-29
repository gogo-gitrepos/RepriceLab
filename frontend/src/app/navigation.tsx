'use client';
import { useI18n } from '@/lib/i18n';
import { LanguageSwitcher } from '@/components/language-switcher';
import { useRouter } from 'next/navigation';
import { Search, LayoutDashboard, Package, Settings, Wrench, Zap, Upload, Star, AlertTriangle, ShoppingCart, Activity, Users, BarChart3, Cog, Store } from 'lucide-react';
import { useState } from 'react';

export function NavigationContent() {
  const { t } = useI18n();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const MenuItem = ({ href, icon: Icon, children, isActive = false }: {
    href: string;
    icon: React.ComponentType<any>;
    children: React.ReactNode;
    isActive?: boolean;
  }) => (
    <a 
      href={href}
      className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors ${
        isActive 
          ? 'bg-purple-100 text-purple-700 border-r-2 border-purple-600' 
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span>{children}</span>
    </a>
  );

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
      {children}
    </h3>
  );

  return (
    <aside className="w-64 border-r bg-white flex flex-col hidden md:flex">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">R</span>
          </div>
          <h1 className="text-lg font-bold text-gray-900">RepriceLab</h1>
          <span className="text-xs text-gray-500">.com</span>
        </div>
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search Title, SKU or ASIN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </form>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4">
        <nav className="space-y-6">
          {/* Dashboard */}
          <div>
            <MenuItem href="/" icon={LayoutDashboard} isActive={true}>
              Dashboard
            </MenuItem>
          </div>

          {/* Repricing Section */}
          <div>
            <SectionTitle>Repricing</SectionTitle>
            <div className="space-y-1">
              <MenuItem href="/products" icon={Package}>
                Products
              </MenuItem>
              <MenuItem href="/repricing-rules" icon={Settings}>
                Repricing Rules
              </MenuItem>
              <MenuItem href="/multichannel" icon={Zap}>
                Multichannel
              </MenuItem>
              <MenuItem href="/automations" icon={Wrench}>
                Automations
              </MenuItem>
              <MenuItem href="/import" icon={Upload}>
                Import
              </MenuItem>
            </div>
          </div>

          {/* Feedback Section */}
          <div>
            <SectionTitle>Feedback</SectionTitle>
            <div className="space-y-1">
              <MenuItem href="/feedback/overview" icon={Star}>
                Overview
              </MenuItem>
              <MenuItem href="/feedback/negative" icon={AlertTriangle}>
                Negative Feedback
              </MenuItem>
            </div>
          </div>

          {/* Insights Section */}
          <div>
            <SectionTitle>Insights</SectionTitle>
            <div className="space-y-1">
              <MenuItem href="/orders" icon={ShoppingCart}>
                Orders
              </MenuItem>
              <MenuItem href="/repricing-activity" icon={Activity}>
                Repricing Activity
              </MenuItem>
              <MenuItem href="/competitors" icon={Users}>
                Competitors
              </MenuItem>
              <MenuItem href="/reports" icon={BarChart3}>
                Reports
              </MenuItem>
            </div>
          </div>

          {/* System Section */}
          <div>
            <SectionTitle>System</SectionTitle>
            <div className="space-y-1">
              <MenuItem href="/settings" icon={Cog}>
                Settings
              </MenuItem>
              <MenuItem href="/app-store" icon={Store}>
                App Store
              </MenuItem>
            </div>
          </div>
        </nav>
      </div>

      {/* Language Switcher */}
      <div className="p-4 border-t">
        <LanguageSwitcher />
      </div>
    </aside>
  );
}