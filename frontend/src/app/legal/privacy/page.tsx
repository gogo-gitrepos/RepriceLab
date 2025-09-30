'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicyPage() {
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

      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-5xl font-bold text-white mb-6">Privacy Policy</h1>
        <p className="text-purple-200 mb-8">Last updated: September 30, 2025</p>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="pt-8 space-y-8 text-purple-100">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
              <p className="mb-4">
                At RepriceLab, we collect information that you provide directly to us, including:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Account information (name, email address, password)</li>
                <li>Amazon Seller Central API credentials</li>
                <li>Product and pricing data from your Amazon store</li>
                <li>Payment and billing information</li>
                <li>Communications with our support team</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
              <p className="mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide, maintain, and improve our repricing services</li>
                <li>Process transactions and send related information</li>
                <li>Send technical notices, updates, and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Monitor and analyze trends and usage</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. Information Sharing</h2>
              <p className="mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share your 
                information only in the following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>With your consent</li>
                <li>To comply with legal obligations</li>
                <li>To protect our rights and prevent fraud</li>
                <li>With service providers who help us operate our platform</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal information 
                against unauthorized access, alteration, disclosure, or destruction. All Amazon API credentials are 
                encrypted at rest and in transit.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Your Rights</h2>
              <p className="mb-4">
                You have the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to processing of your data</li>
                <li>Export your data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at:
                <br />
                <a href="mailto:privacy@repricelab.com" className="text-blue-300 hover:text-blue-200 underline">
                  privacy@repricelab.com
                </a>
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
