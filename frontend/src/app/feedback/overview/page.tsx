'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';

export default function FeedbackOverviewPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Star className="w-6 h-6" />
        <h1 className="text-3xl font-bold">Feedback Overview</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Customer Feedback Analytics</CardTitle>
          <CardDescription>
            Monitor and analyze customer feedback across all your products and marketplaces.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32 text-center">
            <div>
              <Star className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-muted-foreground">Feedback analytics coming soon</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}