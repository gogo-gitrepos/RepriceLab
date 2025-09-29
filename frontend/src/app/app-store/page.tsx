'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Store } from 'lucide-react';

export default function AppStorePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Store className="w-6 h-6" />
        <h1 className="text-3xl font-bold">App Store</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>RepriceLab App Store</CardTitle>
          <CardDescription>
            Discover and install extensions, integrations, and add-ons to enhance your repricing capabilities.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32 text-center">
            <div>
              <Store className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-muted-foreground">App marketplace coming soon</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}