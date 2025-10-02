'use client';
import { useI18n } from '@/lib/i18n';
import { LanguageSwitcher } from '@/components/language-switcher';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Search, LayoutDashboard, Package, Settings, Wrench, Zap, Upload, Star, AlertTriangle, ShoppingCart, Activity, Users, BarChart3, Cog, Store, Menu, X, ChevronDown, ChevronUp, Building2, UserPlus, Radio, CreditCard } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function NavigationContent() {
  const { t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settingsDropdownOpen, setSettingsDropdownOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const isActiveRoute = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const MenuItem = ({ href, icon: Icon, children }: {
    href: string;
    icon: React.ComponentType<any>;
    children: React.ReactNode;
  }) => {
    const isActive = isActiveRoute(href);
    return (
      <Link 
        href={href}
        onClick={() => setMobileMenuOpen(false)}
        className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 font-medium relative ${
          isActive 
            ? 'bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 shadow-lg ring-2 ring-purple-200 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-purple-600 before:rounded-r' 
            : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-purple-50/30 hover:text-purple-600 hover:shadow-md hover:scale-105'
        }`}
      >
        <Icon className="w-4 h-4" />
        <span>{children}</span>
      </Link>
    );
  };

  const DropdownMenuItem = ({ href, icon: Icon, children }: {
    href: string;
    icon: React.ComponentType<any>;
    children: React.ReactNode;
  }) => {
    const isActive = isActiveRoute(href);
    return (
      <Link 
        href={href}
        onClick={() => setMobileMenuOpen(false)}
        className={`flex items-center space-x-3 px-6 py-3 rounded-xl text-sm transition-all duration-200 font-medium ${
          isActive 
            ? 'bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 shadow-md ring-1 ring-purple-200' 
            : 'text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-purple-50/30 hover:text-purple-600 hover:shadow-sm'
        }`}
      >
        <Icon className="w-4 h-4" />
        <span>{children}</span>
      </Link>
    );
  };

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h3 className="px-4 py-3 text-xs font-bold text-purple-600 tracking-wider uppercase bg-gradient-to-r from-purple-50/50 to-transparent rounded-lg mx-2">
      {children}
    </h3>
  );

  const navigationMenuContent = (
    <div className="flex-1 overflow-y-auto p-4">
      <nav className="space-y-6">
        {/* Dashboard */}
        <div>
          <MenuItem href="/dashboard" icon={LayoutDashboard}>
            Dashboard
          </MenuItem>
        </div>

        {/* Repricing Section */}
        <div>
          <SectionTitle>ReprIcIng</SectionTitle>
          <div className="space-y-1">
            <MenuItem href="/products" icon={Package}>
              Products
            </MenuItem>
            <MenuItem href="/multichannel" icon={Radio}>
              Multichannel
            </MenuItem>
            <MenuItem href="/repricing-rules" icon={Zap}>
              Repricing Rules
            </MenuItem>
            <MenuItem href="/automations" icon={Wrench}>
              Automations
            </MenuItem>
            <MenuItem href="/import" icon={Upload}>
              Import
            </MenuItem>
          </div>
        </div>

        {/* Insights Section */}
        <div>
          <SectionTitle>InsIghts</SectionTitle>
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
            {/* Settings Dropdown */}
            <div>
              <button
                onClick={() => setSettingsDropdownOpen(!settingsDropdownOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all duration-200 font-medium relative ${
                  pathname.startsWith('/settings') 
                    ? 'bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 shadow-lg ring-2 ring-purple-200 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-purple-600 before:rounded-r' 
                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-purple-50/30 hover:text-purple-600 hover:shadow-md hover:scale-105'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Cog className="w-4 h-4" />
                  <span>Settings</span>
                </div>
                {settingsDropdownOpen ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
              
              {settingsDropdownOpen && (
                <div className="mt-1 space-y-1">
                  <DropdownMenuItem href="/settings/account" icon={Cog}>
                    Account Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem href="/settings/users" icon={UserPlus}>
                    Users
                  </DropdownMenuItem>
                  <DropdownMenuItem href="/settings/subscription" icon={CreditCard}>
                    Subscription
                  </DropdownMenuItem>
                </div>
              )}
            </div>
            
            <MenuItem href="/app-store" icon={Store}>
              App Store
            </MenuItem>
          </div>
        </div>
      </nav>
    </div>
  );

  const navigationHeader = null;

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button variant="outline" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" 
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed left-0 top-0 h-full w-64 bg-white z-50 flex flex-col md:hidden">
            {navigationHeader}
            {navigationMenuContent}
            <div className="p-4 border-t">
              <LanguageSwitcher />
            </div>
          </div>
        </>
      )}

      {/* Desktop Sidebar */}
      <aside className="border-r border-gray-200/50 bg-gradient-to-b from-white via-gray-50/30 to-purple-50/20 flex-col hidden md:flex shadow-xl backdrop-blur-sm">
        {navigationHeader}

        {navigationMenuContent}
        
        {/* Language Switcher */}
        <div className="p-4 border-t">
          <LanguageSwitcher />
        </div>
      </aside>
    </>
  );
}