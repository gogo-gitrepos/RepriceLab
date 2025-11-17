'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Store, Plus, CheckCircle, AlertCircle, Loader2, ExternalLink, Radio } from 'lucide-react';
import { apiClient } from '@/lib/api';

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
  const router = useRouter();
  const [stores, setStores] = useState<StoreConnection[]>([]);
  const [loading, setLoading] = useState(false);
  const [connectingAmazon, setConnectingAmazon] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    // Check for success message in URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('connected') === 'success') {
      setShowSuccessMessage(true);
      // Remove query params from URL
      window.history.replaceState({}, '', '/multichannel');
      // Hide message after 5 seconds
      setTimeout(() => setShowSuccessMessage(false), 5000);
    }
    
    initializePage();
  }, []);

  const initializePage = async () => {
    try {
      // Get user status to retrieve user ID
      const userStatus = await apiClient.getUserStatus();
      
      if (!userStatus) {
        // Not authenticated - redirect to login
        router.push('/login');
        return;
      }

      setUserId(userStatus.id);
      
      // Load stores for this user
      await loadStores(userStatus.id);
    } catch (error) {
      console.error('Failed to initialize page:', error);
      router.push('/login');
    }
  };

  const loadStores = async (uid: number) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      const response = await fetch(`/api/stores?user_id=${uid}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
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
    if (!userId) {
      alert('Please log in first');
      router.push('/login');
      return;
    }

    try {
      setConnectingAmazon(true);
      const token = localStorage.getItem('access_token');
      const response = await fetch(`/api/auth/amazon/connect?user_id=${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.authorization_url) {
          window.location.href = data.authorization_url;
        } else {
          alert('Failed to get Amazon authorization URL. Please try again.');
        }
      } else {
        const errorData = await response.json();
        alert(errorData.detail || 'Failed to connect Amazon account. Please try again.');
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
              Connect and manage your Amazon seller accounts
            </p>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {showSuccessMessage && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-900">Amazon Store Connected Successfully!</h3>
                <p className="text-sm text-green-700">Your Amazon Seller Central account has been linked. Products will sync shortly.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Connection Cards */}
      <div className="grid gap-6 max-w-3xl">
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