'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowLeft,
  Zap, 
  Target, 
  BarChart3, 
  Shield,
  Clock,
  Award,
  TrendingUp,
  RefreshCw,
  Bell,
  Users,
  Settings,
  Globe
} from 'lucide-react';

export default function FeaturesPage() {
  const router = useRouter();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800">
      {/* Header */}
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

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-6 py-16 text-center">
        <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
          Powerful Features for Amazon Sellers
        </h1>
        <p className="text-xl text-purple-100 max-w-3xl mx-auto">
          Everything you need to win the Buy Box and maximize your profits on Amazon
        </p>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-200">
            <CardHeader>
              <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <CardTitle className="text-white">Lightning Fast Repricing</CardTitle>
              <CardDescription className="text-purple-200">
                Price changes in seconds, not minutes. React instantly to competitor moves and market changes.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-200">
            <CardHeader>
              <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <Target className="w-7 h-7 text-white" />
              </div>
              <CardTitle className="text-white">Smart Algorithms</CardTitle>
              <CardDescription className="text-purple-200">
                Advanced AI-powered repricing strategies to maximize profits while maintaining competitiveness.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-200">
            <CardHeader>
              <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <CardTitle className="text-white">Real-time Analytics</CardTitle>
              <CardDescription className="text-purple-200">
                Comprehensive insights and actionable data at your fingertips to make informed decisions.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-200">
            <CardHeader>
              <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <Award className="w-7 h-7 text-white" />
              </div>
              <CardTitle className="text-white">Buy Box Winner</CardTitle>
              <CardDescription className="text-purple-200">
                Proven algorithms to help you win and hold the Buy Box more often than competitors.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-200">
            <CardHeader>
              <div className="w-14 h-14 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <CardTitle className="text-white">Profit Optimization</CardTitle>
              <CardDescription className="text-purple-200">
                Automatically adjust prices to maximize profit margins while maintaining sales velocity.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-200">
            <CardHeader>
              <div className="w-14 h-14 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <RefreshCw className="w-7 h-7 text-white" />
              </div>
              <CardTitle className="text-white">24/7 Automation</CardTitle>
              <CardDescription className="text-purple-200">
                Set it and forget it. Our system works round the clock monitoring and adjusting prices.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-200">
            <CardHeader>
              <div className="w-14 h-14 bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <Bell className="w-7 h-7 text-white" />
              </div>
              <CardTitle className="text-white">Smart Notifications</CardTitle>
              <CardDescription className="text-purple-200">
                Get alerted to important events like Buy Box loss, stock issues, or pricing anomalies.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-200">
            <CardHeader>
              <div className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <Users className="w-7 h-7 text-white" />
              </div>
              <CardTitle className="text-white">Competitor Analysis</CardTitle>
              <CardDescription className="text-purple-200">
                Track competitor prices, shipping costs, and seller ratings to stay ahead of the game.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-200">
            <CardHeader>
              <div className="w-14 h-14 bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <Settings className="w-7 h-7 text-white" />
              </div>
              <CardTitle className="text-white">Flexible Rules Engine</CardTitle>
              <CardDescription className="text-purple-200">
                Create custom repricing rules with min/max prices, formulas, and conditional logic.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-200">
            <CardHeader>
              <div className="w-14 h-14 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <Globe className="w-7 h-7 text-white" />
              </div>
              <CardTitle className="text-white">Multi-Marketplace</CardTitle>
              <CardDescription className="text-purple-200">
                Support for all major Amazon marketplaces including US, UK, EU, and more.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-200">
            <CardHeader>
              <div className="w-14 h-14 bg-gradient-to-r from-violet-500 to-violet-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <CardTitle className="text-white">Safe Mode</CardTitle>
              <CardDescription className="text-purple-200">
                Test your strategies without publishing prices. See what would change before going live.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-200">
            <CardHeader>
              <div className="w-14 h-14 bg-gradient-to-r from-rose-500 to-rose-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <Clock className="w-7 h-7 text-white" />
              </div>
              <CardTitle className="text-white">Historical Data</CardTitle>
              <CardDescription className="text-purple-200">
                Access complete pricing history and Buy Box ownership trends for better decision making.
              </CardDescription>
            </CardHeader>
          </Card>

        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-purple-200 mb-8">
              Join thousands of successful Amazon sellers using RepriceLab
            </p>
            <Button 
              size="lg" 
              className="h-14 px-8 text-lg font-semibold bg-white text-purple-900 hover:bg-gray-100 shadow-xl"
              onClick={() => router.push('/login')}
            >
              Start Free Trial
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
