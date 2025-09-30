'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Handshake, Zap, Package, TrendingUp, Globe, BarChart } from 'lucide-react';

export default function PartnersPage() {
  const router = useRouter();
  
  const partners = [
    {
      icon: <Package className="w-10 h-10 text-blue-400" />,
      name: 'Amazon Seller Central',
      category: 'Official Integration',
      description: 'Direct integration with Amazon SP-API for seamless product and pricing management across all marketplaces.'
    },
    {
      icon: <Zap className="w-10 h-10 text-yellow-400" />,
      name: 'SellerCloud',
      category: 'Inventory Management',
      description: 'Sync inventory levels and pricing data between RepriceLab and SellerCloud for unified multichannel management.'
    },
    {
      icon: <TrendingUp className="w-10 h-10 text-green-400" />,
      name: 'Helium 10',
      category: 'Analytics & Research',
      description: 'Combine Helium 10\'s product research with RepriceLab\'s automated repricing for data-driven decisions.'
    },
    {
      icon: <Globe className="w-10 h-10 text-purple-400" />,
      name: 'ShipStation',
      category: 'Shipping & Fulfillment',
      description: 'Connect shipping data with pricing strategies to optimize fulfillment costs and margins.'
    },
    {
      icon: <BarChart className="w-10 h-10 text-orange-400" />,
      name: 'QuickBooks',
      category: 'Accounting',
      description: 'Export pricing and sales data to QuickBooks for comprehensive financial tracking and reporting.'
    },
    {
      icon: <Handshake className="w-10 h-10 text-red-400" />,
      name: 'Zapier',
      category: 'Automation',
      description: 'Create custom workflows connecting RepriceLab with 5,000+ apps through Zapier integration.'
    }
  ];

  const benefits = [
    {
      title: 'Seamless Integration',
      description: 'Connect your existing tools and workflows without disruption'
    },
    {
      title: 'Unified Data',
      description: 'All your eCommerce data in one place for better decision-making'
    },
    {
      title: 'Automated Workflows',
      description: 'Reduce manual work by connecting multiple platforms'
    },
    {
      title: 'Enhanced Features',
      description: 'Unlock powerful capabilities through partner integrations'
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
          <h1 className="text-5xl font-bold text-white mb-6">Partner Integrations</h1>
          <p className="text-xl text-purple-100">
            Connect RepriceLab with your favorite eCommerce tools and platforms
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {partners.map((partner, index) => (
            <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <div className="mb-4">{partner.icon}</div>
                <CardTitle className="text-white text-xl mb-2">{partner.name}</CardTitle>
                <p className="text-purple-300 text-sm">{partner.category}</p>
              </CardHeader>
              <CardContent>
                <p className="text-purple-100 text-sm">{partner.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-12">
          <CardHeader>
            <CardTitle className="text-white text-2xl text-center">Why Partner with RepriceLab?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="space-y-2">
                  <h3 className="text-white font-semibold text-lg">{benefit.title}</h3>
                  <p className="text-purple-200">{benefit.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="pt-8">
            <div className="text-center">
              <Handshake className="w-16 h-16 text-purple-400 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-white mb-4">Become a Partner</h2>
              <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
                Are you a software provider interested in partnering with RepriceLab? 
                Join our partner ecosystem and help Amazon sellers succeed together.
              </p>
              <div className="flex justify-center gap-4">
                <Button 
                  size="lg"
                  className="h-12 px-8 bg-white text-purple-900 hover:bg-gray-100"
                  onClick={() => router.push('/contact')}
                >
                  Partner Inquiry
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="h-12 px-8 border-2 border-white text-white hover:bg-white/10"
                >
                  View API Docs
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
