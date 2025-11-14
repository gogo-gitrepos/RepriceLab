'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Check, Zap, Star, Crown } from 'lucide-react';

export default function PricingPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string>('Plus');
  
  const plans = [
    {
      name: 'Plus',
      price: '$99',
      period: '/month',
      description: 'For growing businesses',
      popular: true,
      icon: <Zap className="w-6 h-6 text-blue-600" />,
      features: [
        'Up to 5,000 products',
        'Advanced repricing strategies',
        'Email support',
        'Multi-marketplace support',
        'Advanced analytics',
        'Inventory management',
        'Buy Box monitoring',
        'Competitor tracking'
      ]
    },
    {
      name: 'Pro',
      price: '$199',
      period: '/month',
      description: 'For serious sellers',
      popular: false,
      icon: <Star className="w-6 h-6 text-purple-600" />,
      features: [
        '10,000+ products',
        'AI-powered repricing',
        'Priority email support',
        'All marketplace integrations',
        'Custom analytics dashboard',
        'Advanced inventory management',
        'Real-time Buy Box alerts',
        'Competitor intelligence',
        'API access',
        'Custom automations'
      ]
    },
    {
      name: 'Enterprise',
      price: '$299',
      period: '/month',
      description: 'For large operations',
      popular: false,
      icon: <Crown className="w-6 h-6 text-yellow-600" />,
      features: [
        'Unlimited products',
        'White-label solution',
        'Dedicated account manager',
        'All integrations',
        'Custom reporting',
        'Advanced team management',
        'SLA guarantee',
        'Custom development',
        'Priority API access',
        'Advanced security features',
        'Custom training',
        'Dedicated infrastructure'
      ]
    }
  ];
  
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
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl text-purple-100 max-w-3xl mx-auto mb-4">
          Choose the perfect plan for your Amazon business
        </p>
        <p className="text-lg text-purple-200">
          All plans include 14-day free trial • No credit card required
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card 
              key={plan.name}
              className={`relative cursor-pointer transition-all duration-300 ${
                selectedPlan === plan.name
                  ? 'scale-105 shadow-2xl ring-4 ring-white/50'
                  : plan.popular 
                    ? 'bg-white border-4 border-blue-400 shadow-2xl' 
                    : 'bg-white/10 backdrop-blur-sm border-white/20 hover:scale-105'
              }`}
              onClick={() => setSelectedPlan(plan.name)}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-full font-semibold text-sm shadow-lg flex items-center">
                    <Zap className="w-4 h-4 mr-1" />
                    Most Popular
                  </div>
                </div>
              )}
              
              <CardHeader className={`pb-8 pt-8 ${selectedPlan === plan.name ? 'bg-gradient-to-br from-purple-50 to-indigo-50' : ''}`}>
                <div className="flex justify-center mb-3">
                  {plan.icon}
                </div>
                <CardTitle className={`text-center ${plan.popular || selectedPlan === plan.name ? 'text-gray-900' : 'text-white'}`}>
                  {plan.name}
                </CardTitle>
                <div className="mt-4 text-center">
                  <span className={`text-5xl font-bold ${plan.popular || selectedPlan === plan.name ? 'text-gray-900' : 'text-white'}`}>
                    {plan.price}
                  </span>
                  <span className={plan.popular || selectedPlan === plan.name ? 'text-gray-600' : 'text-purple-200'}>
                    {plan.period}
                  </span>
                </div>
                <p className={`mt-2 text-center ${plan.popular || selectedPlan === plan.name ? 'text-gray-600' : 'text-purple-200'}`}>
                  {plan.description}
                </p>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className={`w-5 h-5 mr-3 flex-shrink-0 ${
                        plan.popular || selectedPlan === plan.name ? 'text-green-600' : 'text-green-400'
                      }`} />
                      <span className={plan.popular || selectedPlan === plan.name ? 'text-gray-700' : 'text-purple-100'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full h-12 text-base font-semibold ${
                    selectedPlan === plan.name
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg'
                      : 'bg-white text-purple-900 hover:bg-gray-100'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/login?plan=${plan.name.toLowerCase()}`);
                  }}
                >
                  Start Free Trial
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white text-lg">Can I change plans anytime?</CardTitle>
                <p className="text-purple-200 mt-2">
                  Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
                </p>
              </CardHeader>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white text-lg">What happens after the free trial?</CardTitle>
                <p className="text-purple-200 mt-2">
                  After 14 days, you'll be charged for your selected plan. Cancel anytime during the trial with no charges.
                </p>
              </CardHeader>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white text-lg">Do you offer refunds?</CardTitle>
                <p className="text-purple-200 mt-2">
                  Yes, we offer a 30-day money-back guarantee. If you're not satisfied, we'll refund your payment.
                </p>
              </CardHeader>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white text-lg">What happens if I exceed my product limit?</CardTitle>
                <p className="text-purple-200 mt-2">
                  We'll notify you when you're close to your limit. You can upgrade to continue adding products.
                </p>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
