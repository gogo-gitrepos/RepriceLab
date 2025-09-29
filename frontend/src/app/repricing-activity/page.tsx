'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity } from 'lucide-react';

export default function RepricingActivityPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Activity className="w-6 h-6" />
        <h1 className="text-3xl font-bold">Repricing Activity</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Repricing Activity Log</CardTitle>
          <CardDescription>
            Monitor all repricing events, price changes, and system activity in real-time.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32 text-center">
            <div>
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-muted-foreground">Activity monitoring coming soon</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}