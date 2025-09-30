'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Package, Zap, BarChart, ShoppingCart, Truck, DollarSign } from 'lucide-react';

export default function IntegrationsPage() {
  const router = useRouter();
  
  const integrations = [
    {
      icon: <Package className="w-10 h-10 text-blue-400" />,
      name: 'Amazon Seller Central',
      category: 'Core Integration',
      description: 'Direct API integration with Amazon SP-API for real-time product data, pricing, and inventory synchronization across all marketplaces.',
      features: ['Real-time sync', 'Multi-marketplace', 'Secure OAuth']
    },
    {
      icon: <Zap className="w-10 h-10 text-yellow-400" />,
      name: 'Helium 10',
      category: 'Product Research',
      description: 'Combine product research data with automated repricing to make data-driven pricing decisions.',
      features: ['Product analytics', 'Keyword tracking', 'Market insights']
    },
    {
      icon: <BarChart className="w-10 h-10 text-green-400" />,
      name: 'Jungle Scout',
      category: 'Analytics',
      description: 'Integrate sales estimates and competition data to optimize your repricing strategy.',
      features: ['Sales tracking', 'Competition data', 'Trend analysis']
    },
    {
      icon: <ShoppingCart className="w-10 h-10 text-purple-400" />,
      name: 'Shopify',
      category: 'Multi-Channel',
      description: 'Sync inventory and pricing between your Shopify store and Amazon for unified management.',
      features: ['Inventory sync', 'Price matching', 'Order management']
    },
    {
      icon: <Truck className="w-10 h-10 text-orange-400" />,
      name: 'ShipStation',
      category: 'Fulfillment',
      description: 'Connect shipping costs with pricing decisions to maintain healthy margins.',
      features: ['Shipping cost tracking', 'Carrier integration', 'Label printing']
    },
    {
      icon: <DollarSign className="w-10 h-10 text-red-400" />,
      name: 'QuickBooks',
      category: 'Accounting',
      description: 'Export sales and pricing data for accurate financial reporting and tax preparation.',
      features: ['Financial sync', 'Tax reports', 'Profit tracking']
    }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800">
      <nav className="relative z-10 px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button 
            variant="ghost" 
            className="text-white hover:bg-white/10"
            onClick={() => router.push('/')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <Button 
            className="bg-white text-purple-900 hover:bg-gray-100 font-semibold"
            onClick={() => router.push('/login')}
          >
            Sign In
          </Button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-6">Integrations</h1>
          <p className="text-xl text-purple-100">
            Connect RepriceLab with your favorite Amazon seller tools and platforms
          </p>
        </div>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-12">
          <CardContent className="pt-8">
            <p className="text-purple-100 text-center text-lg">
              RepriceLab seamlessly integrates with the tools you already use. Connect your entire 
              Amazon seller stack for a unified, automated workflow that saves time and boosts profits.
            </p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {integrations.map((integration, index) => (
            <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <div className="mb-4">{integration.icon}</div>
                <CardTitle className="text-white text-xl mb-2">{integration.name}</CardTitle>
                <p className="text-purple-300 text-sm">{integration.category}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-purple-100 text-sm">{integration.description}</p>
                <div>
                  <p className="text-white font-semibold text-sm mb-2">Features:</p>
                  <ul className="space-y-1">
                    {integration.features.map((feature, i) => (
                      <li key={i} className="text-purple-200 text-sm">• {feature}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="pt-8 text-center">
              <Zap className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-white font-bold text-lg mb-2">Easy Setup</h3>
              <p className="text-purple-200 text-sm">One-click OAuth integration. No technical knowledge required.</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="pt-8 text-center">
              <BarChart className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-white font-bold text-lg mb-2">Real-Time Sync</h3>
              <p className="text-purple-200 text-sm">Data updates automatically. Always stay in sync.</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="pt-8 text-center">
              <Package className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-white font-bold text-lg mb-2">Secure & Reliable</h3>
              <p className="text-purple-200 text-sm">Enterprise-grade security. 99.9% uptime guarantee.</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="pt-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Need a Custom Integration?</h2>
            <p className="text-purple-100 mb-6">
              We're always adding new integrations. Don't see the tool you need? Let us know and 
              we'll work to make it happen.
            </p>
            <div className="flex justify-center gap-4">
              <Button 
                size="lg"
                className="h-12 px-8 bg-white text-purple-900 hover:bg-gray-100"
                onClick={() => router.push('/pricing')}
              >
                Get Started
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="h-12 px-8 border-2 border-white text-white hover:bg-white/10"
                onClick={() => router.push('/contact')}
              >
                Request Integration
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
