'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Check, Zap } from 'lucide-react';

export default function PricingPage() {
  const router = useRouter();
  
  const plans = [
    {
      name: 'Starter',
      price: '$49',
      period: '/month',
      description: 'Perfect for new sellers',
      features: [
        'Up to 500 products',
        'Basic repricing rules',
        'Email support',
        'Daily price updates',
        'Buy Box tracking',
        'Basic analytics'
      ]
    },
    {
      name: 'Professional',
      price: '$99',
      period: '/month',
      description: 'Most popular for growing businesses',
      popular: true,
      features: [
        'Up to 2,500 products',
        'Advanced repricing rules',
        'Priority support',
        'Real-time price updates',
        'Advanced Buy Box analytics',
        'Competitor tracking',
        'Multi-marketplace support',
        'Custom strategies'
      ]
    },
    {
      name: 'Enterprise',
      price: '$249',
      period: '/month',
      description: 'For large-scale operations',
      features: [
        'Unlimited products',
        'All repricing features',
        'Dedicated account manager',
        'Lightning-fast updates',
        'Advanced analytics & insights',
        'API access',
        'Custom integrations',
        'White-glove onboarding'
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
              className={`relative ${
                plan.popular 
                  ? 'bg-white border-4 border-purple-400 shadow-2xl scale-105' 
                  : 'bg-white/10 backdrop-blur-sm border-white/20'
              } hover:scale-105 transition-all duration-200`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-2 rounded-full font-semibold text-sm shadow-lg flex items-center">
                    <Zap className="w-4 h-4 mr-1" />
                    Most Popular
                  </div>
                </div>
              )}
              
              <CardHeader className="pb-8 pt-8">
                <CardTitle className={plan.popular ? 'text-gray-900' : 'text-white'}>
                  {plan.name}
                </CardTitle>
                <div className="mt-4">
                  <span className={`text-5xl font-bold ${plan.popular ? 'text-gray-900' : 'text-white'}`}>
                    {plan.price}
                  </span>
                  <span className={plan.popular ? 'text-gray-600' : 'text-purple-200'}>
                    {plan.period}
                  </span>
                </div>
                <p className={`mt-2 ${plan.popular ? 'text-gray-600' : 'text-purple-200'}`}>
                  {plan.description}
                </p>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className={`w-5 h-5 mr-3 flex-shrink-0 ${
                        plan.popular ? 'text-green-600' : 'text-green-400'
                      }`} />
                      <span className={plan.popular ? 'text-gray-700' : 'text-purple-100'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full h-12 text-base font-semibold ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white'
                      : 'bg-white text-purple-900 hover:bg-gray-100'
                  }`}
                  onClick={() => router.push('/login')}
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
          </div>
        </div>
      </div>
    </div>
  );
}
