'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';

export default function OrdersPage() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center space-x-2 sm:space-x-3">
        <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
        <h1 className="text-2xl sm:text-3xl font-bold">Orders</h1>
      </div>
      
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-base sm:text-lg">Order Analytics</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Track order performance, revenue, and trends across all your marketplaces.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-center h-32 text-center">
            <div>
              <ShoppingCart className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm sm:text-base text-muted-foreground">Order analytics coming soon</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}