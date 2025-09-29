'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wrench } from 'lucide-react';

export default function AutomationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Wrench className="w-6 h-6" />
        <h1 className="text-3xl font-bold">Automations</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Workflow Automation</CardTitle>
          <CardDescription>
            Create automated workflows for repricing, inventory management, and marketplace operations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32 text-center">
            <div>
              <Wrench className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-muted-foreground">Automation workflows coming soon</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}