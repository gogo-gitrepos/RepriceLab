'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';

export default function RepricingRulesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Settings className="w-6 h-6" />
        <h1 className="text-3xl font-bold">Repricing Rules</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Automated Pricing Rules</CardTitle>
          <CardDescription>
            Set up intelligent repricing strategies to maintain competitive pricing and maximize Buy Box ownership.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32 text-center">
            <div>
              <Settings className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-muted-foreground">Repricing rules configuration coming soon</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}