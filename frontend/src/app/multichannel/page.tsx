'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap } from 'lucide-react';

export default function MultichannelPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Zap className="w-6 h-6" />
        <h1 className="text-3xl font-bold">Multichannel</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Cross-Platform Management</CardTitle>
          <CardDescription>
            Manage your products across multiple marketplaces from a single dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32 text-center">
            <div>
              <Zap className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-muted-foreground">Multichannel management coming soon</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}