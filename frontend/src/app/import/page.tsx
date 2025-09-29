'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload } from 'lucide-react';

export default function ImportPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Upload className="w-6 h-6" />
        <h1 className="text-3xl font-bold">Import</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Bulk Product Import</CardTitle>
          <CardDescription>
            Import products, pricing data, and configurations from CSV files or other sources.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32 text-center">
            <div>
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-muted-foreground">Bulk import functionality coming soon</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}