'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, BarChart, TrendingUp, DollarSign, Target, Activity, PieChart } from 'lucide-react';

export default function AnalyticsPage() {
  const router = useRouter();
  
  const features = [
    {
      icon: <BarChart className="w-10 h-10 text-blue-400" />,
      title: 'Buy Box Tracking',
      description: 'Monitor your Buy Box win rate in real-time. See exactly when you win or lose the Buy Box and understand why.',
      metrics: ['Win rate percentage', 'Hourly tracking', 'Competitor analysis', 'Historical trends']
    },
    {
      icon: <DollarSign className="w-10 h-10 text-green-400" />,
      title: 'Profit Analytics',
      description: 'Track your profitability with detailed P&L reports. Know exactly how repricing affects your bottom line.',
      metrics: ['Revenue tracking', 'Cost analysis', 'Margin calculations', 'ROI reports']
    },
    {
      icon: <TrendingUp className="w-10 h-10 text-purple-400" />,
      title: 'Sales Performance',
      description: 'Visualize how price changes impact your sales velocity. Identify optimal price points for each product.',
      metrics: ['Sales trends', 'Conversion rates', 'Price elasticity', 'Velocity metrics']
    },
    {
      icon: <Target className="w-10 h-10 text-orange-400" />,
      title: 'Competition Insights',
      description: 'Analyze competitor pricing strategies and behavior. Stay ahead with actionable competitive intelligence.',
      metrics: ['Competitor prices', 'Market positioning', 'Price movements', 'Strategy patterns']
    },
    {
      icon: <Activity className="w-10 h-10 text-red-400" />,
      title: 'Repricing Activity',
      description: 'See every price change, when it happened, and why. Complete audit trail for all repricing decisions.',
      metrics: ['Change history', 'Rule triggers', 'Success rate', 'Time analysis']
    },
    {
      icon: <PieChart className="w-10 h-10 text-yellow-400" />,
      title: 'Custom Reports',
      description: 'Build custom dashboards with the metrics that matter to your business. Export to Excel or PDF.',
      metrics: ['Custom metrics', 'Scheduled reports', 'Data exports', 'Dashboard widgets']
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
          <BarChart className="w-20 h-20 text-blue-400 mx-auto mb-6" />
          <h1 className="text-5xl font-bold text-white mb-6">Analytics Dashboard</h1>
          <p className="text-xl text-purple-100">
            Data-driven insights to optimize your repricing strategy and maximize profits
          </p>
        </div>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-12">
          <CardContent className="pt-8">
            <p className="text-purple-100 text-center text-lg">
              RepriceLab's advanced analytics turn your pricing data into actionable insights. 
              Track performance, understand trends, and make informed decisions backed by real data.
            </p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <div className="mb-4">{feature.icon}</div>
                <CardTitle className="text-white text-xl mb-2">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-purple-100">{feature.description}</p>
                <div>
                  <p className="text-white font-semibold text-sm mb-2">Key Metrics:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {feature.metrics.map((metric, i) => (
                      <div key={i} className="text-purple-200 text-sm">• {metric}</div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-8">
          <CardHeader>
            <CardTitle className="text-white text-2xl text-center">Real-Time Dashboard Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-4xl font-bold text-white mb-2">15 sec</div>
                <p className="text-purple-200">Data refresh rate</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-2">365 days</div>
                <p className="text-purple-200">Historical data</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-2">Unlimited</div>
                <p className="text-purple-200">Custom reports</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="pt-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Make Smarter Pricing Decisions</h2>
            <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
              Stop guessing. Start knowing. RepriceLab's analytics give you the insights you need 
              to optimize every aspect of your repricing strategy.
            </p>
            <Button 
              size="lg"
              className="h-14 px-8 text-lg font-semibold bg-white text-purple-900 hover:bg-gray-100 shadow-xl"
              onClick={() => router.push('/pricing')}
            >
              Start Free Trial
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
