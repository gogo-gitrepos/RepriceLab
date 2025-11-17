'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Settings, Globe, ShoppingCart, Store, Radio } from 'lucide-react';

export default function ChannelsPage() {
  const [channels, setChannels] = useState([
    {
      id: 1,
      name: 'Amazon US',
      type: 'Amazon',
      region: 'United States',
      status: 'Connected',
      active: true,
      products: 147,
      lastSync: '2 hours ago'
    },
    {
      id: 2,
      name: 'Amazon UK',
      type: 'Amazon',
      region: 'United Kingdom',
      status: 'Connected',
      active: true,
      products: 89,
      lastSync: '5 hours ago'
    },
    {
      id: 3,
      name: 'eBay US',
      type: 'eBay',
      region: 'United States',
      status: 'Disconnected',
      active: false,
      products: 0,
      lastSync: 'Never'
    }
  ]);

  const toggleChannel = (id: number) => {
    setChannels(prev => prev.map(channel => 
      channel.id === id 
        ? { ...channel, active: !channel.active }
        : channel
    ));
  };

  const getChannelIcon = (type: string) => {
    switch (type) {
      case 'Amazon':
        return <ShoppingCart className="w-5 h-5 text-orange-600" />;
      case 'eBay':
        return <Store className="w-5 h-5 text-blue-600" />;
      default:
        return <Globe className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Radio className="w-6 h-6" />
          <h1 className="text-3xl font-bold">Channels</h1>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Channel
        </Button>
      </div>
      
      {/* Channel Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Radio className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="font-medium">Total Channels</div>
                <p className="text-sm text-muted-foreground">{channels.length} connected</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="font-medium">Active</div>
                <p className="text-sm text-muted-foreground">{channels.filter(c => c.active).length} channels</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="font-medium">Total Products</div>
                <p className="text-sm text-muted-foreground">{channels.reduce((sum, c) => sum + c.products, 0)} products</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Store className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <div className="font-medium">Marketplaces</div>
                <p className="text-sm text-muted-foreground">{new Set(channels.map(c => c.type)).size} platforms</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Connected Channels */}
      <Card>
        <CardHeader>
          <CardTitle>Connected Marketplaces</CardTitle>
          <CardDescription>
            Manage your marketplace connections and synchronization settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {channels.map((channel) => (
              <div key={channel.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    {getChannelIcon(channel.type)}
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium">{channel.name}</h3>
                      <Badge variant={channel.status === 'Connected' ? 'default' : 'secondary'}>
                        {channel.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{channel.region}</p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                      <span>{channel.products} products</span>
                      <span>Last sync: {channel.lastSync}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <label htmlFor={`active-${channel.id}`} className="text-sm font-medium">
                      Active
                    </label>
                    <input
                      type="checkbox"
                      id={`active-${channel.id}`}
                      checked={channel.active}
                      onChange={() => toggleChannel(channel.id)}
                      disabled={channel.status !== 'Connected'}
                      className="w-4 h-4"
                    />
                  </div>
                  
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

    </div>
  );
}