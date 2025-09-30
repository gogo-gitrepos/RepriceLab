'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Calendar, Sparkles, Zap, Shield, BarChart } from 'lucide-react';

export default function WhatsNewPage() {
  const router = useRouter();
  
  const updates = [
    {
      date: 'September 2025',
      version: 'v3.5',
      icon: <Sparkles className="w-8 h-8 text-yellow-400" />,
      title: 'AI-Powered Price Predictions',
      description: 'Introducing machine learning algorithms that predict optimal prices based on historical data and market trends.',
      features: [
        'Predictive pricing engine',
        'Demand forecasting',
        'Seasonal price optimization',
        'Smart competitor analysis'
      ]
    },
    {
      date: 'August 2025',
      version: 'v3.4',
      icon: <Zap className="w-8 h-8 text-purple-400" />,
      title: 'Instant Repricing Updates',
      description: 'Reduced repricing latency from 15 minutes to near real-time. React to competitor changes within seconds.',
      features: [
        'Sub-60 second price updates',
        'Real-time competitor monitoring',
        'Instant Buy Box notifications',
        'Priority processing for Pro plans'
      ]
    },
    {
      date: 'July 2025',
      version: 'v3.3',
      icon: <Shield className="w-8 h-8 text-blue-400" />,
      title: 'Enhanced Security & Compliance',
      description: 'Advanced encryption and SOC 2 Type II compliance for enterprise customers.',
      features: [
        'SOC 2 Type II certified',
        'End-to-end encryption',
        'Two-factor authentication',
        'Audit logs and compliance reports'
      ]
    },
    {
      date: 'June 2025',
      version: 'v3.2',
      icon: <BarChart className="w-8 h-8 text-green-400" />,
      title: 'Advanced Analytics Dashboard',
      description: 'New analytics suite with customizable reports, profit tracking, and performance insights.',
      features: [
        'Custom report builder',
        'Profit & loss tracking',
        'Competitor price history',
        'Export to CSV/Excel'
      ]
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

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-6">What's New</h1>
          <p className="text-xl text-purple-100">
            Latest features, updates, and improvements to RepriceLab
          </p>
        </div>

        <div className="space-y-8">
          {updates.map((update, index) => (
            <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div>{update.icon}</div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-white text-2xl">{update.title}</CardTitle>
                        <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                          {update.version}
                        </span>
                      </div>
                      <div className="flex items-center text-purple-300 text-sm">
                        <Calendar className="w-4 h-4 mr-2" />
                        {update.date}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-purple-100">{update.description}</p>
                <div>
                  <p className="text-white font-semibold mb-2">New Features:</p>
                  <ul className="grid md:grid-cols-2 gap-2">
                    {update.features.map((feature, i) => (
                      <li key={i} className="text-purple-200">• {feature}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="pt-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-4">Stay Updated</h2>
                <p className="text-purple-100 mb-6">
                  Get notified about new features and updates as soon as they're released
                </p>
                <div className="flex justify-center gap-2 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-purple-300"
                  />
                  <Button className="bg-white text-purple-900 hover:bg-gray-100">
                    Subscribe
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
