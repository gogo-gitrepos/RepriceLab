'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CheckCircle2, Zap, TrendingUp, Shield } from 'lucide-react';

export default function RepricingBasicsPage() {
  const router = useRouter();
  
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
          <h1 className="text-5xl font-bold text-white mb-6">Repricing Basics</h1>
          <p className="text-xl text-purple-100">
            Learn the fundamentals of Amazon repricing and how it can boost your sales
          </p>
        </div>

        <div className="space-y-8">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Zap className="w-6 h-6 mr-3 text-yellow-400" />
                What is Amazon Repricing?
              </CardTitle>
            </CardHeader>
            <CardContent className="text-purple-100">
              <p className="mb-4">
                Amazon repricing is the automated process of adjusting your product prices based on market conditions, 
                competitor pricing, and your business rules. Instead of manually updating prices, repricing software 
                monitors the marketplace 24/7 and makes intelligent price adjustments in real-time.
              </p>
              <p>
                This helps you stay competitive, win the Buy Box more often, and maximize your profits without 
                constant manual intervention.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <TrendingUp className="w-6 h-6 mr-3 text-green-400" />
                Why Use Automated Repricing?
              </CardTitle>
            </CardHeader>
            <CardContent className="text-purple-100">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 mr-3 text-green-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Save Time:</strong> No more manual price updates across hundreds or thousands of products</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 mr-3 text-green-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Win More Buy Boxes:</strong> React instantly to competitor price changes</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 mr-3 text-green-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Maximize Profits:</strong> Set intelligent rules to find the optimal price point</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 mr-3 text-green-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Protect Margins:</strong> Set min/max price boundaries to never sell at a loss</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Shield className="w-6 h-6 mr-3 text-blue-400" />
                How RepriceLab Works
              </CardTitle>
            </CardHeader>
            <CardContent className="text-purple-100">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-white mb-2">1. Connect Your Amazon Store</h3>
                  <p>Securely link your Amazon Seller Central account with RepriceLab in just a few clicks.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">2. Set Your Repricing Rules</h3>
                  <p>Define your pricing strategy with customizable rules - be aggressive to win the Buy Box or conservative to protect margins.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">3. Let RepriceLab Work</h3>
                  <p>Our algorithms monitor the marketplace 24/7, automatically adjusting your prices to maximize sales and profits.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">4. Track Your Results</h3>
                  <p>View detailed analytics on Buy Box ownership, sales velocity, and profitability to optimize your strategy.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center pt-8">
            <Button 
              size="lg"
              className="h-14 px-8 text-lg font-semibold bg-white text-purple-900 hover:bg-gray-100 shadow-xl"
              onClick={() => router.push('/pricing')}
            >
              Start Free Trial
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
