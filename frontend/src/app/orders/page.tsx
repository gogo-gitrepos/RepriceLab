'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <ShoppingCart className="w-6 h-6" />
        <h1 className="text-3xl font-bold">Orders</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Order Analytics</CardTitle>
          <CardDescription>
            Track order performance, revenue, and trends across all your marketplaces.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32 text-center">
            <div>
              <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-muted-foreground">Order analytics coming soon</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}