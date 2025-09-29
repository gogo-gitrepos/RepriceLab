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
        className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors ${
          isActive 
            ? 'bg-purple-100 text-purple-700 border-r-2 border-purple-600' 
            : 'text-gray-700 hover:bg-gray-100'
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
        className={`flex items-center space-x-3 px-6 py-2 rounded-md text-sm transition-colors ${
          isActive 
            ? 'bg-purple-100 text-purple-700' 
            : 'text-gray-600 hover:bg-gray-50'
        }`}
      >
        <Icon className="w-4 h-4" />
        <span>{children}</span>
      </Link>
    );
  };

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 tracking-wider">
      {children}
    </h3>
  );

  const LabLogo = () => (
    <div className="relative w-8 h-8">
      {/* Laboratory Flask */}
      <svg 
        viewBox="0 0 32 32" 
        className="w-8 h-8 text-purple-600"
        fill="currentColor"
      >
        <path d="M12 4h8v6l6 12H6l6-12V4z" stroke="currentColor" strokeWidth="2" fill="none"/>
        <path d="M10 4h12" stroke="currentColor" strokeWidth="2"/>
        <circle cx="16" cy="18" r="6" fill="currentColor" opacity="0.2"/>
      </svg>
      {/* R Symbol in the center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white font-bold text-xs">R</span>
      </div>
    </div>
  );

  const NavigationHeader = () => (
    <div className="p-4 border-b">
      <div className="flex items-center space-x-2 mb-4">
        <LabLogo />
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
  );

  const NavigationMenu = () => (
    <div className="flex-1 overflow-y-auto p-4">
      <nav className="space-y-6">
        {/* Dashboard */}
        <div>
          <MenuItem href="/" icon={LayoutDashboard}>
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
            {/* Settings Dropdown */}
            <div>
              <button
                onClick={() => setSettingsDropdownOpen(!settingsDropdownOpen)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                  pathname.startsWith('/settings') 
                    ? 'bg-purple-100 text-purple-700 border-r-2 border-purple-600' 
                    : 'text-gray-700 hover:bg-gray-100'
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
                  <DropdownMenuItem href="/settings/company" icon={Building2}>
                    Company Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem href="/settings/users" icon={UserPlus}>
                    Users
                  </DropdownMenuItem>
                  <DropdownMenuItem href="/settings/channels" icon={Radio}>
                    Channels
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
            <NavigationHeader />
            <NavigationMenu />
            <div className="p-4 border-t">
              <LanguageSwitcher />
            </div>
          </div>
        </>
      )}

      {/* Desktop Sidebar */}
      <aside className="border-r bg-white flex-col hidden md:flex">
        <NavigationHeader />

        <NavigationMenu />
        
        {/* Language Switcher */}
        <div className="p-4 border-t">
          <LanguageSwitcher />
        </div>
      </aside>
    </>
  );
}