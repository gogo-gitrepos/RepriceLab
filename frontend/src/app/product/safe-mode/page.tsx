'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Shield, CheckCircle2, AlertTriangle, Zap } from 'lucide-react';

export default function SafeModePage() {
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
          <Shield className="w-20 h-20 text-blue-400 mx-auto mb-6" />
          <h1 className="text-5xl font-bold text-white mb-6">Safe Mode</h1>
          <p className="text-xl text-purple-100">
            Test and validate your repricing strategies before going live
          </p>
        </div>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-8">
          <CardContent className="pt-8">
            <div className="text-purple-100 space-y-4">
              <p className="text-lg">
                Safe Mode lets you simulate repricing changes without actually updating prices on Amazon. 
                It's the perfect way to test new strategies, validate rules, and ensure everything works 
                exactly as intended before committing to live price changes.
              </p>
              <p>
                Think of it as a sandbox environment for your repricing rules—all the insights, 
                none of the risk.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <CheckCircle2 className="w-6 h-6 mr-3 text-green-400" />
                What Safe Mode Does
              </CardTitle>
            </CardHeader>
            <CardContent className="text-purple-100">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>Shows what prices would change to</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>Calculates potential profit impacts</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>Identifies rule conflicts</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>Validates min/max boundaries</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>Tests competitor matching logic</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <AlertTriangle className="w-6 h-6 mr-3 text-yellow-400" />
                What Safe Mode Prevents
              </CardTitle>
            </CardHeader>
            <CardContent className="text-purple-100">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2">✗</span>
                  <span>Accidental price changes</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2">✗</span>
                  <span>Pricing below cost</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2">✗</span>
                  <span>Exceeding maximum prices</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2">✗</span>
                  <span>Conflicting rule interactions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2">✗</span>
                  <span>Unexpected competitor matches</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-8">
          <CardHeader>
            <CardTitle className="text-white text-2xl">How to Use Safe Mode</CardTitle>
          </CardHeader>
          <CardContent className="text-purple-100 space-y-4">
            <div>
              <h3 className="font-semibold text-white mb-2">1. Enable Safe Mode</h3>
              <p>Toggle Safe Mode on in your dashboard settings or when creating a new repricing rule.</p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">2. Configure Your Rules</h3>
              <p>Set up your repricing strategies just as you would for live repricing.</p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">3. Review Simulated Changes</h3>
              <p>See exactly what would happen with detailed reports showing all price changes and their impacts.</p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">4. Refine and Test</h3>
              <p>Adjust your rules based on the simulation results until you're satisfied.</p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">5. Go Live with Confidence</h3>
              <p>When everything looks perfect, disable Safe Mode to start real repricing.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="pt-8 text-center">
            <Zap className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Perfect for New Strategies</h2>
            <p className="text-purple-100 mb-6">
              Testing new repricing approaches? Entering a new marketplace? Safe Mode gives you 
              the confidence to experiment without risk. See the results before they happen.
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
