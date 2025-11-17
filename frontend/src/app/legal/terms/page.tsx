'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
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
        <h1 className="text-5xl font-bold text-white mb-6">Terms and Conditions</h1>
        <p className="text-purple-200 mb-8">Last updated: September 30, 2025</p>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="pt-8 space-y-8 text-purple-100">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using RepriceLab's services, you accept and agree to be bound by these Terms and Conditions. 
                If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Service Description</h2>
              <p>
                RepriceLab provides automated repricing services for Amazon sellers. Our platform monitors marketplace 
                conditions and adjusts your product prices according to the rules you configure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. User Responsibilities</h2>
              <p className="mb-4">You agree to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Comply with Amazon's Terms of Service and policies</li>
                <li>Monitor your repricing rules and adjust as needed</li>
                <li>Not use the service for any illegal purposes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Pricing and Payment</h2>
              <p>
                Subscription fees are billed according to your selected plan. All fees are non-refundable except as 
                required by law or as explicitly stated in our refund policy. We reserve the right to change pricing 
                with 30 days' notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Limitation of Liability</h2>
              <p>
                RepriceLab is not liable for any direct, indirect, incidental, or consequential damages arising from 
                your use of our services, including but not limited to lost profits, lost sales, or pricing errors. 
                You are responsible for reviewing and approving all repricing rules.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Service Availability</h2>
              <p>
                While we strive for 99.9% uptime, we do not guarantee uninterrupted service. We may suspend service 
                temporarily for maintenance, security reasons, or technical issues.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Termination</h2>
              <p>
                You may cancel your subscription at any time. We reserve the right to suspend or terminate accounts 
                that violate these terms or Amazon's policies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">8. Contact</h2>
              <p>
                For questions about these terms, please use our{' '}
                <a href="/contact" className="text-blue-300 hover:text-blue-200 underline font-semibold">
                  Contact Us form
                </a>
                {' '}to get in touch with us.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
