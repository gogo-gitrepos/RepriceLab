'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Check, Star, Zap, Crown, Shield } from 'lucide-react';

export default function SubscriptionPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<string>('Plus');

  const plans = [
    {
      name: 'Plus',
      description: 'For growing businesses',
      price: { monthly: 99, yearly: 990 },
      badge: 'Most Popular',
      features: [
        'Up to 5,000 products',
        'Advanced repricing strategies',
        'Priority email support',
        'Multi-marketplace support',
        'Advanced analytics',
        'Inventory management',
        'Buy Box monitoring',
        'Competitor tracking'
      ],
      limitations: [],
      buttonText: 'Upgrade to Plus',
      buttonVariant: 'default' as const,
      popular: true
    },
    {
      name: 'Pro',
      description: 'For serious sellers',
      price: { monthly: 199, yearly: 1990 },
      badge: 'Best Value',
      features: [
        '10,000+ products',
        'AI-powered repricing',
        'Phone + email support',
        'All marketplace integrations',
        'Custom analytics dashboard',
        'Advanced inventory management',
        'Real-time Buy Box alerts',
        'Competitor intelligence',
        'API access',
        'Custom automations'
      ],
      limitations: [],
      buttonText: 'Upgrade to Pro',
      buttonVariant: 'default' as const,
      popular: false
    },
    {
      name: 'Enterprise',
      description: 'For large operations',
      price: { monthly: 299, yearly: 2990 },
      badge: 'Enterprise',
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
      ],
      limitations: [],
      buttonText: 'Contact Sales',
      buttonVariant: 'outline' as const,
      popular: false
    }
  ];

  const getDiscount = () => {
    if (billingCycle === 'yearly') {
      return 'Save 17%';
    }
    return null;
  };

  const getPlanIcon = (planName: string) => {
    switch (planName) {
      case 'Plus':
        return <Zap className="w-5 h-5 text-blue-600" />;
      case 'Pro':
        return <Star className="w-5 h-5 text-purple-600" />;
      case 'Enterprise':
        return <Crown className="w-5 h-5 text-yellow-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center space-x-2 sm:space-x-3">
        <CreditCard className="w-5 h-5 sm:w-6 sm:h-6" />
        <h1 className="text-2xl sm:text-3xl font-bold">Subscription</h1>
      </div>
      
      {/* Current Plan Info */}
      <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <div>
              <h3 className="text-base sm:text-lg font-medium">Your Current Plan</h3>
              <p className="text-sm sm:text-base text-purple-700">Free Trial - 14 days remaining</p>
              <p className="text-xs sm:text-sm text-purple-600 mt-1">Upgrade now to unlock all features and continue your repricing success!</p>
            </div>
            <Button className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-sm sm:text-base">
              Upgrade Now
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Billing Toggle */}
      <div className="flex justify-center">
        <div className="bg-gray-100 p-1 rounded-lg flex">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 sm:px-5 py-2.5 sm:py-2 min-h-10 rounded-md text-sm font-medium transition-colors ${
              billingCycle === 'monthly'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-4 sm:px-5 py-2.5 sm:py-2 min-h-10 rounded-md text-sm font-medium transition-colors ${
              billingCycle === 'yearly'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600'
            }`}
          >
            Yearly {getDiscount() && <span className="text-green-600 ml-1">{getDiscount()}</span>}
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {plans.map((plan) => (
          <Card 
            key={plan.name} 
            className={`relative cursor-pointer transition-all duration-300 ${
              selectedPlan === plan.name
                ? 'lg:scale-105 shadow-2xl ring-4 ring-purple-500/50'
                : plan.popular 
                  ? 'border-2 border-blue-500 shadow-lg lg:hover:scale-105' 
                  : 'border lg:hover:scale-105'
            }`}
            onClick={() => setSelectedPlan(plan.name)}
          >
            {plan.badge && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge 
                  className={`px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm ${
                    plan.popular 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-800 text-white'
                  }`}
                >
                  {plan.badge}
                </Badge>
              </div>
            )}
            
            <CardHeader className="text-center pb-3 sm:pb-4 p-4 sm:p-6">
              <div className="flex justify-center mb-2">
                {getPlanIcon(plan.name)}
              </div>
              <CardTitle className="text-lg sm:text-xl">{plan.name}</CardTitle>
              <CardDescription className="text-sm">{plan.description}</CardDescription>
              
              <div className="pt-3 sm:pt-4">
                <div className="text-2xl sm:text-3xl font-bold">
                  ${plan.price[billingCycle]}
                  {plan.price[billingCycle] > 0 && (
                    <span className="text-base sm:text-lg text-muted-foreground font-normal">
                      /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                    </span>
                  )}
                </div>
                {billingCycle === 'yearly' && plan.price.yearly > 0 && (
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    ${Math.round(plan.price.yearly / 12)}/month billed annually
                  </p>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="pt-0 p-4 sm:p-6">
              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                <Button 
                  className={`w-full text-sm sm:text-base ${
                    selectedPlan === plan.name 
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white' 
                      : ''
                  }`}
                  variant={selectedPlan === plan.name ? 'default' : plan.buttonVariant}
                  onClick={(e) => e.stopPropagation()}
                >
                  {selectedPlan === plan.name ? 'Selected Plan' : plan.buttonText}
                </Button>
                
                {(plan.name === 'Plus' || plan.name === 'Pro') && (
                  <Button 
                    className="w-full text-sm sm:text-base" 
                    variant="outline"
                  >
                    Start Free Trial
                  </Button>
                )}
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Everything in {plan.name}:</h4>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {plan.limitations.length > 0 && (
                  <div className="pt-3 border-t">
                    <h4 className="font-medium text-sm text-gray-600 mb-2">Limitations:</h4>
                    <ul className="space-y-1">
                      {plan.limitations.map((limitation, index) => (
                        <li key={index} className="text-xs text-gray-500">
                          • {limitation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Feature Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Feature Comparison</CardTitle>
          <CardDescription>
            Compare plans and features to find the perfect fit for your business
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Features</th>
                  <th className="text-center py-3 px-4">Plus</th>
                  <th className="text-center py-3 px-4">Pro</th>
                  <th className="text-center py-3 px-4">Enterprise</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Products</td>
                  <td className="text-center py-3 px-4">5,000</td>
                  <td className="text-center py-3 px-4">10,000+</td>
                  <td className="text-center py-3 px-4">Unlimited</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Repricing Rules</td>
                  <td className="text-center py-3 px-4">Advanced</td>
                  <td className="text-center py-3 px-4">AI-Powered</td>
                  <td className="text-center py-3 px-4">Custom</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Marketplaces</td>
                  <td className="text-center py-3 px-4">Multi</td>
                  <td className="text-center py-3 px-4">All</td>
                  <td className="text-center py-3 px-4">All + Custom</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Support</td>
                  <td className="text-center py-3 px-4">Priority Email</td>
                  <td className="text-center py-3 px-4">Phone + Email</td>
                  <td className="text-center py-3 px-4">Dedicated Manager</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">API Access</td>
                  <td className="text-center py-3 px-4">-</td>
                  <td className="text-center py-3 px-4">✓</td>
                  <td className="text-center py-3 px-4">Priority</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Can I change my plan anytime?</h4>
            <p className="text-sm text-muted-foreground">
              Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">What happens if I exceed my product limit?</h4>
            <p className="text-sm text-muted-foreground">
              We'll notify you when you're close to your limit. You can upgrade to continue adding products.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Is there a setup fee?</h4>
            <p className="text-sm text-muted-foreground">
              No setup fees. You only pay the monthly or yearly subscription fee.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}