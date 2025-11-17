'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, DollarSign, Users, TrendingUp, Award } from 'lucide-react';

export default function AffiliatesPage() {
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
          <h1 className="text-5xl font-bold text-white mb-6">Affiliate Program</h1>
          <p className="text-xl text-purple-100">
            Earn generous commissions by referring Amazon sellers to RepriceLab
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <DollarSign className="w-6 h-6 mr-3 text-green-400" />
                30% Recurring Commission
              </CardTitle>
            </CardHeader>
            <CardContent className="text-purple-100">
              Earn 30% commission on every payment from customers you refer for their entire lifetime.
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Users className="w-6 h-6 mr-3 text-blue-400" />
                90-Day Cookie
              </CardTitle>
            </CardHeader>
            <CardContent className="text-purple-100">
              Long cookie duration means you get credit for referrals up to 90 days after the initial click.
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <TrendingUp className="w-6 h-6 mr-3 text-purple-400" />
                Marketing Resources
              </CardTitle>
            </CardHeader>
            <CardContent className="text-purple-100">
              Access banners, landing pages, and marketing materials to maximize your conversions.
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Award className="w-6 h-6 mr-3 text-yellow-400" />
                Dedicated Support
              </CardTitle>
            </CardHeader>
            <CardContent className="text-purple-100">
              Get help from our affiliate team with promotions, strategies, and technical questions.
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-12">
          <CardHeader>
            <CardTitle className="text-white text-2xl">How It Works</CardTitle>
          </CardHeader>
          <CardContent className="text-purple-100 space-y-4">
            <div>
              <h3 className="font-semibold text-white mb-2">1. Apply to Join</h3>
              <p>Fill out our simple application form. We review and approve applications within 1-2 business days.</p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">2. Get Your Links</h3>
              <p>Receive your unique affiliate links and access to marketing materials.</p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">3. Promote RepriceLab</h3>
              <p>Share your links with your audience through your blog, social media, or email list.</p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">4. Earn Commissions</h3>
              <p>Receive 30% recurring commissions on all referred customers' payments.</p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button 
            size="lg"
            className="h-14 px-8 text-lg font-semibold bg-white text-purple-900 hover:bg-gray-100 shadow-xl"
            onClick={() => router.push('/contact')}
          >
            Apply to Affiliate Program
          </Button>
          <p className="text-purple-200 mt-4">Questions? Please use our <a href="/contact" className="text-white hover:underline font-semibold">Contact Us form</a> to get in touch.</p>
        </div>
      </div>
    </div>
  );
}
