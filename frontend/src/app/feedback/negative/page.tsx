'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

export default function NegativeFeedbackPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <AlertTriangle className="w-6 h-6" />
        <h1 className="text-3xl font-bold">Negative Feedback</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Negative Feedback Management</CardTitle>
          <CardDescription>
            Track and manage negative feedback to maintain high seller ratings and customer satisfaction.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32 text-center">
            <div>
              <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-muted-foreground">Negative feedback tracking coming soon</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}