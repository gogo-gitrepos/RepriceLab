'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Target, Shield, Zap, TrendingUp, Award, BarChart } from 'lucide-react';

export default function PricingStrategiesPage() {
  const router = useRouter();
  
  const strategies = [
    {
      icon: <Zap className="w-8 h-8 text-yellow-400" />,
      title: 'Aggressive Buy Box Strategy',
      description: 'Price aggressively to win and maintain the Buy Box. Automatically undercut competitors while respecting your minimum price boundaries.',
      benefits: ['Maximum Buy Box wins', 'Increased sales velocity', 'Quick market share gains']
    },
    {
      icon: <Shield className="w-8 h-8 text-blue-400" />,
      title: 'Defensive Margin Protection',
      description: 'Prioritize profit margins over Buy Box wins. Only compete when prices are favorable, protecting your bottom line.',
      benefits: ['Higher profit margins', 'Sustainable pricing', 'Reduced race-to-bottom risks']
    },
    {
      icon: <Target className="w-8 h-8 text-green-400" />,
      title: 'Balanced Competition',
      description: 'Find the sweet spot between Buy Box wins and healthy margins. Adjust pricing based on competition intensity and demand.',
      benefits: ['Optimal ROI', 'Flexible approach', 'Adaptive to market conditions']
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-purple-400" />,
      title: 'Dynamic Demand-Based',
      description: 'Increase prices during high-demand periods and compete more aggressively during slow seasons.',
      benefits: ['Maximize revenue', 'Seasonal optimization', 'Smart inventory management']
    },
    {
      icon: <Award className="w-8 h-8 text-orange-400" />,
      title: 'Premium Positioning',
      description: 'Maintain higher prices to position your brand as premium. Only reprice when necessary to maintain sales velocity.',
      benefits: ['Brand value protection', 'Customer perception', 'Higher margins']
    },
    {
      icon: <BarChart className="w-8 h-8 text-red-400" />,
      title: 'Data-Driven Analytics',
      description: 'Use historical data and AI to predict optimal pricing. Machine learning adapts to your specific market dynamics.',
      benefits: ['Predictive pricing', 'Continuous improvement', 'Market intelligence']
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
          <h1 className="text-5xl font-bold text-white mb-6">Pricing Strategies</h1>
          <p className="text-xl text-purple-100 max-w-3xl mx-auto">
            Choose the repricing strategy that matches your business goals and watch your sales soar
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {strategies.map((strategy, index) => (
            <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <div className="mb-4">{strategy.icon}</div>
                <CardTitle className="text-white text-2xl">{strategy.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-purple-100">{strategy.description}</p>
                <div>
                  <p className="text-white font-semibold mb-2">Key Benefits:</p>
                  <ul className="space-y-1">
                    {strategy.benefits.map((benefit, i) => (
                      <li key={i} className="text-purple-200 text-sm">• {benefit}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="pt-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Mix & Match Strategies</h2>
            <p className="text-purple-100 text-center mb-6">
              RepriceLab lets you apply different strategies to different products. Use aggressive repricing 
              for fast-moving items while protecting margins on premium products. Customize rules for each 
              product category to maximize your overall profitability.
            </p>
            <div className="text-center">
              <Button 
                size="lg"
                className="h-14 px-8 text-lg font-semibold bg-white text-purple-900 hover:bg-gray-100 shadow-xl"
                onClick={() => router.push('/pricing')}
              >
                Start Free Trial
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
