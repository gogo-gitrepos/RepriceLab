'use client';

import { useState } from 'react';
import { Bell, MessageSquare, HelpCircle, ChevronDown, Settings, CreditCard, LogOut, Package, Star, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function TopHeader() {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  return (
    <header className="h-16 bg-gray-800 flex items-center justify-end px-6 border-b">
      <div className="flex items-center space-x-4">
        {/* Notification Bell */}
        <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-gray-700">
          <Bell className="w-5 h-5" />
        </Button>

        {/* Message Icon */}
        <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-gray-700">
          <MessageSquare className="w-5 h-5" />
        </Button>

        {/* Help Icon */}
        <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-gray-700">
          <HelpCircle className="w-5 h-5" />
        </Button>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center space-x-2 text-gray-300 hover:text-white bg-gray-700 rounded-full px-3 py-2 transition-colors"
          >
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">GG</span>
            </div>
            <ChevronDown className="w-4 h-4" />
          </button>

          {profileDropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setProfileDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border z-20">
                <div className="p-4 border-b">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">GG</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Gokhan Gozubuyuk</p>
                      <p className="text-sm text-gray-500">gokhan@repricer.com</p>
                    </div>
                  </div>
                </div>

                <div className="py-2">
                  <a href="/settings/account" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <Settings className="w-4 h-4 mr-3" />
                    Settings
                  </a>
                  <a href="/settings/account" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <CreditCard className="w-4 h-4 mr-3" />
                    Change password
                  </a>
                  <a href="/settings/subscription" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <CreditCard className="w-4 h-4 mr-3" />
                    Pay now
                  </a>
                </div>

                <div className="border-t py-2">
                  <div className="px-4 py-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Products</p>
                  </div>
                  <a href="/feedback/overview" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <Star className="w-4 h-4 mr-3" />
                    Feedback
                  </a>
                  <div className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <div className="flex items-center">
                      <Package className="w-4 h-4 mr-3" />
                      Repricer
                    </div>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Trial</span>
                  </div>
                  <div className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <div className="flex items-center">
                      <Monitor className="w-4 h-4 mr-3" />
                      eDesk
                    </div>
                    <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">Try Now!</span>
                  </div>
                </div>

                <div className="border-t py-2">
                  <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <LogOut className="w-4 h-4 mr-3" />
                    Logout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}