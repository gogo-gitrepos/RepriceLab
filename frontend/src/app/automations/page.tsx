'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wrench, Play, Pause, Plus, Zap, Clock, Target, AlertTriangle } from 'lucide-react';

export default function AutomationsPage() {
  const [automations, setAutomations] = useState([
    {
      id: 1,
      name: "Buy Box Recovery",
      description: "Automatically adjust prices when losing Buy Box",
      status: "active",
      triggered: 47,
      lastRun: "2 minutes ago"
    },
    {
      id: 2,
      name: "Competitor Price Matching",
      description: "Match competitor prices within margin limits",
      status: "active", 
      triggered: 23,
      lastRun: "15 minutes ago"
    },
    {
      id: 3,
      name: "Inventory-Based Pricing",
      description: "Increase prices when inventory is low",
      status: "paused",
      triggered: 12,
      lastRun: "2 hours ago"
    }
  ]);

  const toggleAutomation = (id: number) => {
    setAutomations(prev => prev.map(auto => 
      auto.id === id 
        ? { ...auto, status: auto.status === 'active' ? 'paused' : 'active' }
        : auto
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Wrench className="w-6 h-6" />
          <h1 className="text-3xl font-bold">Automations</h1>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Automation
        </Button>
      </div>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Play className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="font-medium">Active</div>
                <p className="text-sm text-muted-foreground">2 automations</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Pause className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <div className="font-medium">Paused</div>
                <p className="text-sm text-muted-foreground">1 automation</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="font-medium">Total Triggers</div>
                <p className="text-sm text-muted-foreground">82 this week</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="font-medium">Success Rate</div>
                <p className="text-sm text-muted-foreground">94.2%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Automations */}
      <Card>
        <CardHeader>
          <CardTitle>Your Automations</CardTitle>
          <CardDescription>
            Manage your automated repricing workflows and rules
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {automations.map((automation) => (
              <div key={automation.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    automation.status === 'active' 
                      ? 'bg-green-100' 
                      : 'bg-gray-100'
                  }`}>
                    {automation.status === 'active' ? (
                      <Play className="w-5 h-5 text-green-600" />
                    ) : (
                      <Pause className="w-5 h-5 text-gray-600" />
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium">{automation.name}</h3>
                      <Badge variant={automation.status === 'active' ? 'default' : 'secondary'}>
                        {automation.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{automation.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span>Triggered {automation.triggered} times</span>
                      <span>Last run: {automation.lastRun}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => toggleAutomation(automation.id)}
                  >
                    {automation.status === 'active' ? 'Pause' : 'Start'}
                  </Button>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Automation Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Automation Templates</CardTitle>
          <CardDescription>Pre-built automation workflows you can customize</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                  <Target className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-medium mb-2">Buy Box Guardian</h3>
                <p className="text-sm text-muted-foreground">Automatically win back Buy Box when lost</p>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                  <Clock className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-medium mb-2">Time-Based Pricing</h3>
                <p className="text-sm text-muted-foreground">Adjust prices based on time of day or season</p>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                  <AlertTriangle className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-medium mb-2">Margin Protector</h3>
                <p className="text-sm text-muted-foreground">Prevent prices from dropping below profit thresholds</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}