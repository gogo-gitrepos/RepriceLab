'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

export default function CompetitorsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Users className="w-6 h-6" />
        <h1 className="text-3xl font-bold">Competitors</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Competitor Analysis</CardTitle>
          <CardDescription>
            Track competitor pricing strategies, Buy Box ownership, and market positioning.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32 text-center">
            <div>
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-muted-foreground">Competitor tracking coming soon</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}