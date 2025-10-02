'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Store, Plus, CheckCircle, AlertCircle, Loader2, ExternalLink, Radio } from 'lucide-react';

interface StoreConnection {
  id: number;
  store_name: string;
  selling_partner_id: string;
  region: string;
  marketplace_ids: string;
  is_active: boolean;
  last_sync: string | null;
}

export default function MultichannelPage() {
  const [stores, setStores] = useState<StoreConnection[]>([]);
  const [loading, setLoading] = useState(false);
  const [connectingAmazon, setConnectingAmazon] = useState(false);

  useEffect(() => {
    loadStores();
  }, []);

  const loadStores = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/stores?user_id=2');
      
      if (response.ok) {
        const data = await response.json();
        setStores(data.stores || []);
      }
    } catch (error) {
      console.error('Failed to load stores:', error);
    } finally {
      setLoading(false);
    }
  };

  const connectAmazon = async () => {
    try {
      setConnectingAmazon(true);
      const response = await fetch('/api/auth/amazon/connect?user_id=2');
      
      if (response.ok) {
        const data = await response.json();
        if (data.authorization_url) {
          window.location.href = data.authorization_url;
        }
      }
    } catch (error) {
      console.error('Failed to initiate Amazon connection:', error);
      alert('Failed to connect Amazon account. Please try again.');
    } finally {
      setConnectingAmazon(false);
    }
  };

  const getRegionName = (region: string) => {
    const regions: { [key: string]: string } = {
      'NA': 'North America',
      'EU': 'Europe',
      'FE': 'Far East'
    };
    return regions[region] || region;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Radio className="w-6 h-6" />
          <div>
            <h1 className="text-3xl font-bold">Multichannel</h1>
            <p className="text-muted-foreground mt-1">
              Connect and manage your Amazon and Walmart seller accounts
            </p>
          </div>
        </div>
      </div>

      {/* Connection Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Amazon Connection */}
        <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                <Store className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-xl">Amazon Seller Central</div>
                <div className="text-sm font-normal text-muted-foreground">
                  Connect via SP-API
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Connect your Amazon Seller Central account to automatically sync products, 
              prices, and inventory data in real-time.
            </p>
            
            {stores.length > 0 ? (
              <div className="space-y-3">
                {stores.map((store) => (
                  <div key={store.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <div>
                        <div className="font-medium">{store.store_name}</div>
                        <div className="text-xs text-muted-foreground">
                          {getRegionName(store.region)} • {store.selling_partner_id}
                        </div>
                      </div>
                    </div>
                    <Badge variant={store.is_active ? "default" : "secondary"}>
                      {store.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                ))}
                <Button
                  onClick={connectAmazon}
                  disabled={connectingAmazon}
                  variant="outline"
                  className="w-full"
                >
                  {connectingAmazon ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Another Store
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <Button
                onClick={connectAmazon}
                disabled={connectingAmazon}
                className="w-full bg-orange-500 hover:bg-orange-600"
              >
                {connectingAmazon ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Connecting to Amazon...
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Connect Amazon Account
                  </>
                )}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Walmart Connection */}
        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <Store className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-xl">Walmart Marketplace</div>
                <div className="text-sm font-normal text-muted-foreground">
                  Coming soon
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Walmart integration is coming soon. Sync your Walmart Marketplace products 
              and prices automatically.
            </p>
            
            <Button disabled className="w-full" variant="outline">
              <AlertCircle className="w-4 h-4 mr-2" />
              Coming Soon
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle>How to Connect Your Store</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-sm">
                1
              </div>
              <div>
                <div className="font-medium">Click "Connect Amazon Account"</div>
                <div className="text-sm text-muted-foreground">
                  You'll be redirected to Amazon Seller Central to authorize RepriceLab
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-sm">
                2
              </div>
              <div>
                <div className="font-medium">Grant Permissions</div>
                <div className="text-sm text-muted-foreground">
                  RepriceLab needs access to read products, pricing, and inventory data
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-sm">
                3
              </div>
              <div>
                <div className="font-medium">Automatic Sync</div>
                <div className="text-sm text-muted-foreground">
                  Your products will sync automatically and repricing will begin
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}