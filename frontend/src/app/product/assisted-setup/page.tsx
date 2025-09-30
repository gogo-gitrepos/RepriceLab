'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Sparkles, Clock, Target, Users, Zap } from 'lucide-react';

export default function AssistedSetupPage() {
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
          <Sparkles className="w-20 h-20 text-yellow-400 mx-auto mb-6" />
          <h1 className="text-5xl font-bold text-white mb-6">Assisted Setup</h1>
          <p className="text-xl text-purple-100">
            Get expert help configuring your repricing strategy for optimal results
          </p>
        </div>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-8">
          <CardContent className="pt-8">
            <div className="text-purple-100 space-y-4">
              <p className="text-lg">
                Our Assisted Setup service pairs you with a RepriceLab expert who will help you 
                configure your repricing rules, optimize your strategy, and ensure you're set up 
                for maximum profitability from day one.
              </p>
              <p>
                Whether you're new to repricing or transitioning from another platform, we'll guide 
                you through every step to get you winning the Buy Box faster.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Clock className="w-6 h-6 mr-3 text-blue-400" />
                Save Time
              </CardTitle>
            </CardHeader>
            <CardContent className="text-purple-100">
              <p>Skip the learning curve and start repricing effectively within hours, not weeks. 
              Our experts know exactly what works for your product category.</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Target className="w-6 h-6 mr-3 text-green-400" />
                Optimized Strategy
              </CardTitle>
            </CardHeader>
            <CardContent className="text-purple-100">
              <p>Get a custom repricing strategy tailored to your business goals, whether that's 
              maximizing Buy Box wins, protecting margins, or balancing both.</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Users className="w-6 h-6 mr-3 text-purple-400" />
                Expert Guidance
              </CardTitle>
            </CardHeader>
            <CardContent className="text-purple-100">
              <p>Work one-on-one with Amazon repricing specialists who understand your market 
              and competition. Ask questions and get personalized advice.</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Zap className="w-6 h-6 mr-3 text-yellow-400" />
                Quick Results
              </CardTitle>
            </CardHeader>
            <CardContent className="text-purple-100">
              <p>See immediate improvements in Buy Box ownership and sales velocity. Our setup 
              process is designed to deliver results fast.</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-8">
          <CardHeader>
            <CardTitle className="text-white text-2xl">What's Included</CardTitle>
          </CardHeader>
          <CardContent className="text-purple-100">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-white">Setup Session (60 min)</h3>
                <ul className="space-y-2">
                  <li>• Account configuration</li>
                  <li>• Amazon store connection</li>
                  <li>• Product import and review</li>
                  <li>• Competition analysis</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-white">Strategy Session (45 min)</h3>
                <ul className="space-y-2">
                  <li>• Custom repricing rules</li>
                  <li>• Min/max price boundaries</li>
                  <li>• Buy Box optimization</li>
                  <li>• Testing and validation</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-white">Follow-up Support</h3>
                <ul className="space-y-2">
                  <li>• 30-day email support</li>
                  <li>• Performance review call</li>
                  <li>• Rule adjustments</li>
                  <li>• Best practices guide</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-white">Training Materials</h3>
                <ul className="space-y-2">
                  <li>• Video tutorials</li>
                  <li>• Strategy documentation</li>
                  <li>• Tips and tricks guide</li>
                  <li>• Community access</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="pt-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Available for Pro & Enterprise Plans</h2>
            <p className="text-purple-100 mb-6">
              Assisted Setup is included free with Pro and Enterprise plans. Contact us to schedule 
              your setup session and start maximizing your Amazon sales.
            </p>
            <div className="flex justify-center gap-4">
              <Button 
                size="lg"
                className="h-14 px-8 text-lg font-semibold bg-white text-purple-900 hover:bg-gray-100 shadow-xl"
                onClick={() => router.push('/pricing')}
              >
                View Plans
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="h-14 px-8 text-lg font-semibold border-2 border-white text-white hover:bg-white/10"
                onClick={() => router.push('/contact')}
              >
                Schedule Setup
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
