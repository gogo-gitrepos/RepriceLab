'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <BarChart3 className="w-6 h-6" />
        <h1 className="text-3xl font-bold">Reports</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Performance Reports</CardTitle>
          <CardDescription>
            Generate detailed reports on sales performance, repricing effectiveness, and ROI.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32 text-center">
            <div>
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-muted-foreground">Performance reports coming soon</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}