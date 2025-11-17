'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, FileText, AlertTriangle } from 'lucide-react';

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

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <FileText className="w-20 h-20 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">Terms of Service</h1>
          <p className="text-purple-200 text-lg">Last updated: November 17, 2025</p>
        </div>

        <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-2xl">
          <CardContent className="pt-8 space-y-8 text-gray-800">
            
            {/* Agreement Notice */}
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg flex items-start">
              <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-yellow-900 mb-1">Important Legal Agreement</h4>
                <p className="text-sm text-yellow-800">
                  By using RepriceLab, you agree to these Terms of Service. If you do not agree, please do not use our service.
                </p>
              </div>
            </div>

            {/* Introduction */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="leading-relaxed">
                These Terms of Service ("Terms") govern your access to and use of RepriceLab's automated Amazon repricing services ("Service"). By creating an account, connecting your Amazon Seller Central account, or using any of our features, you agree to be bound by these Terms and our{' '}
                <a href="/legal/privacy" className="text-purple-600 hover:underline font-semibold">Privacy Policy</a>.
              </p>
              <p className="mt-4 leading-relaxed">
                These Terms constitute a legally binding agreement between you ("User," "you," or "your") and RepriceLab ("we," "us," or "our"), a United States-based company.
              </p>
            </section>

            {/* Service Description */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">2. Service Description</h2>
              <p className="mb-4">RepriceLab provides the following services to Amazon sellers:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Automated Repricing:</strong> Real-time price adjustments based on user-configured rules</li>
                <li><strong>Buy Box Monitoring:</strong> Tracking Buy Box ownership and competitive positioning</li>
                <li><strong>Competitor Analysis:</strong> Monitoring competitor offers and pricing strategies</li>
                <li><strong>Analytics & Reporting:</strong> Dashboard metrics, sales insights, profitability analysis</li>
                <li><strong>Repricing Strategies:</strong> Win Buy Box, Maximize Profit, Boost Sales algorithms</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2.1 Service Availability</h3>
              <p>
                We target 99.9% uptime but cannot guarantee uninterrupted service. We reserve the right to suspend service temporarily for:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Scheduled maintenance (with advance notice)</li>
                <li>Emergency security updates</li>
                <li>Technical issues beyond our control</li>
                <li>Amazon SP-API outages or rate limiting</li>
              </ul>
            </section>

            {/* Amazon Seller Requirements */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">3. Amazon Seller Requirements</h2>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.1 Eligibility</h3>
              <p className="mb-3">To use RepriceLab, you must:</p>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li>Have an active Amazon Seller Central account in good standing</li>
                <li>Be at least 18 years old and legally capable of entering contracts</li>
                <li>Provide accurate and complete registration information</li>
                <li>Comply with all Amazon Terms of Service and policies</li>
                <li>Have legal authority to manage pricing for the connected seller account</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.2 Amazon OAuth Authorization</h3>
              <p className="mb-3">By connecting your Amazon account, you grant RepriceLab permission to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Read your product listings, inventory, and pricing data</li>
                <li>Update product prices on your behalf based on your repricing rules</li>
                <li>Access order history for analytics purposes (read-only)</li>
                <li>Monitor Buy Box status and competitor offers</li>
              </ul>
              <p className="mt-4 text-sm text-gray-600">
                You can revoke this authorization at any time by disconnecting your Amazon store from your RepriceLab dashboard.
              </p>
            </section>

            {/* User Responsibilities */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">4. User Responsibilities</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">4.1 Account Security</h3>
              <p className="mb-3">You are responsible for:</p>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized access</li>
                <li>Using strong, unique passwords and enabling 2FA when available</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">4.2 Repricing Rules</h3>
              <p className="mb-3">You agree to:</p>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li><strong>Review and configure repricing rules carefully</strong> before activating</li>
                <li>Set appropriate minimum and maximum price limits</li>
                <li>Monitor repricing activity and adjust rules as needed</li>
                <li>Take full responsibility for all price changes made by our system</li>
                <li>Ensure your pricing complies with Amazon policies and applicable laws</li>
              </ul>

              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <h4 className="font-bold text-red-900 mb-2">⚠️ Important Disclaimer</h4>
                <p className="text-sm text-red-800">
                  RepriceLab automates pricing based on YOUR configured rules. We are not responsible for pricing errors, lost sales, or Buy Box loss resulting from misconfigured rules. You remain solely responsible for all pricing decisions.
                </p>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">4.3 Prohibited Activities</h3>
              <p className="mb-3">You may NOT:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Violate any Amazon policies, including price manipulation or anti-competitive practices</li>
                <li>Use our service for illegal purposes or fraudulent activities</li>
                <li>Attempt to reverse engineer, decompile, or hack our platform</li>
                <li>Share your account credentials with unauthorized parties</li>
                <li>Overload or interfere with our systems or infrastructure</li>
                <li>Use automated bots or scripts (except our official API if available)</li>
                <li>Scrape competitor data for purposes other than your own repricing</li>
              </ul>
            </section>

            {/* Pricing and Payment */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">5. Pricing and Payment</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">5.1 Subscription Plans</h3>
              <div className="grid md:grid-cols-4 gap-4 mb-6">
                <div className="border border-gray-300 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900">Free Plan</h4>
                  <p className="text-sm text-gray-600 mt-1">1 store, 50 products</p>
                  <p className="text-sm text-gray-600">14-day trial</p>
                </div>
                <div className="border border-purple-300 p-4 rounded-lg bg-purple-50">
                  <h4 className="font-bold text-purple-900">Plus - $99/mo</h4>
                  <p className="text-sm text-purple-700 mt-1">3 stores, 5,000 products</p>
                </div>
                <div className="border border-purple-300 p-4 rounded-lg bg-purple-50">
                  <h4 className="font-bold text-purple-900">Pro - $199/mo</h4>
                  <p className="text-sm text-purple-700 mt-1">10 stores, 10,000 products</p>
                </div>
                <div className="border border-purple-300 p-4 rounded-lg bg-purple-50">
                  <h4 className="font-bold text-purple-900">Enterprise - $299/mo</h4>
                  <p className="text-sm text-purple-700 mt-1">Unlimited stores & products</p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">5.2 Billing Terms</h3>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li><strong>Billing Cycle:</strong> Monthly subscriptions billed in advance on the same day each month</li>
                <li><strong>Payment Method:</strong> Credit/debit card processed securely via Stripe</li>
                <li><strong>Auto-Renewal:</strong> Subscriptions renew automatically unless cancelled</li>
                <li><strong>Failed Payments:</strong> Account suspended after 3 failed payment attempts</li>
                <li><strong>Currency:</strong> All prices in USD</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">5.3 Refund Policy</h3>
              <p className="mb-3">
                Subscription fees are <strong>non-refundable</strong> except:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Service outage exceeding 48 continuous hours (prorated refund)</li>
                <li>Duplicate charges (full refund within 30 days)</li>
                <li>As required by law in your jurisdiction</li>
              </ul>
              <p className="mt-4 text-sm text-gray-600">
                Refund requests must be submitted via email to repricelab@gmail.com within 30 days of the charge.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">5.4 Price Changes</h3>
              <p>
                We reserve the right to change subscription pricing with <strong>30 days' advance notice</strong> via email. Price changes apply to renewals after the notice period. Current subscriptions remain at the original price until renewal.
              </p>
            </section>

            {/* Cancellation */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">6. Cancellation and Termination</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">6.1 Cancellation by User</h3>
              <p className="mb-3">You may cancel your subscription at any time:</p>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li>Access remains active until the end of your current billing period</li>
                <li>No refunds for partial months</li>
                <li>Amazon store connections automatically disconnect upon cancellation</li>
                <li>Data retained for 30 days, then permanently deleted</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">6.2 Termination by RepriceLab</h3>
              <p className="mb-3">We may suspend or terminate your account immediately if:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>You violate these Terms of Service</li>
                <li>You engage in fraudulent or illegal activities</li>
                <li>Your Amazon Seller account is suspended or closed</li>
                <li>Payment failures exceed 3 attempts</li>
                <li>We detect security threats or abuse</li>
              </ul>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">7. Limitation of Liability</h2>
              
              <div className="bg-gray-100 border-l-4 border-gray-600 p-4 rounded-r-lg mb-4">
                <p className="font-semibold text-gray-900 mb-2">DISCLAIMER OF WARRANTIES</p>
                <p className="text-sm text-gray-700">
                  THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
                </p>
              </div>

              <p className="mb-4"><strong>RepriceLab is NOT liable for:</strong></p>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li><strong>Pricing Errors:</strong> Incorrect prices resulting from misconfigured rules or system bugs</li>
                <li><strong>Lost Sales:</strong> Reduced sales due to repricing decisions</li>
                <li><strong>Buy Box Loss:</strong> Loss of Amazon Buy Box ownership</li>
                <li><strong>Amazon Penalties:</strong> Seller suspensions or violations of Amazon policies</li>
                <li><strong>Third-Party Services:</strong> Amazon SP-API outages, Stripe payment issues, AWS downtime</li>
                <li><strong>Data Loss:</strong> Loss of data due to technical failures (though we maintain regular backups)</li>
                <li><strong>Indirect Damages:</strong> Lost profits, lost revenue, business interruption, or consequential damages</li>
              </ul>

              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Maximum Liability</h4>
                <p className="text-sm text-blue-800">
                  Our total liability to you for any claim arising from these Terms or use of the Service shall not exceed the amount you paid us in the 12 months preceding the claim, or $100 USD, whichever is greater.
                </p>
              </div>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">8. Intellectual Property</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">8.1 RepriceLab IP</h3>
              <p className="mb-3">
                All rights, title, and interest in RepriceLab's platform, including software, algorithms, design, trademarks, and content, are owned by RepriceLab. You are granted a limited, non-exclusive, non-transferable license to use the Service.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">8.2 Your Data</h3>
              <p>
                You retain all rights to your Amazon seller data. By using our Service, you grant us a license to process this data solely for providing repricing services. We do not claim ownership of your product listings, pricing, or business data.
              </p>
            </section>

            {/* Indemnification */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">9. Indemnification</h2>
              <p>
                You agree to indemnify and hold harmless RepriceLab, its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Your violation of these Terms of Service</li>
                <li>Your violation of Amazon's Terms of Service or policies</li>
                <li>Pricing errors or decisions made by your repricing rules</li>
                <li>Your unauthorized use of the Service</li>
                <li>Infringement of any third-party rights</li>
              </ul>
            </section>

            {/* Dispute Resolution */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">10. Dispute Resolution</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">10.1 Informal Resolution</h3>
              <p className="mb-4">
                Before initiating formal legal action, parties agree to attempt good-faith informal resolution by contacting repricelab@gmail.com with a detailed description of the dispute.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">10.2 Governing Law</h3>
              <p className="mb-4">
                These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to conflict of law principles.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">10.3 Arbitration</h3>
              <p className="mb-3">
                Any disputes not resolved informally shall be settled through binding arbitration administered by the American Arbitration Association (AAA) under its Commercial Arbitration Rules. The arbitration will be conducted in English and held in Delaware, or remotely via videoconference.
              </p>
              <p className="text-sm text-gray-600">
                Each party bears its own costs unless otherwise awarded by the arbitrator. You agree to waive the right to participate in a class action lawsuit or class-wide arbitration.
              </p>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">11. Changes to Terms</h2>
              <p className="mb-3">
                We may update these Terms periodically. Material changes will be communicated via:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Email notification to all active users</li>
                <li>Dashboard notification banner</li>
                <li>Updated "Last Updated" date at the top of this page</li>
              </ul>
              <p>
                Continued use of the Service after changes take effect constitutes acceptance of the updated Terms. If you do not agree to changes, you must cancel your account.
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">12. Contact Information</h2>
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-lg border border-purple-200">
                <h4 className="font-bold text-purple-900 mb-4">Questions About These Terms?</h4>
                <div className="space-y-2 text-gray-800">
                  <p><strong>Email:</strong> <a href="mailto:repricelab@gmail.com" className="text-purple-600 hover:underline">repricelab@gmail.com</a></p>
                  <p><strong>Contact Form:</strong> <a href="/contact" className="text-purple-600 hover:underline">https://repricelab.com/contact</a></p>
                  <p><strong>Response Time:</strong> Within 48 hours for Terms inquiries</p>
                </div>
              </div>
            </section>

            {/* Severability */}
            <section className="pt-8 border-t-2 border-gray-200">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">13. Severability</h2>
              <p>
                If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.
              </p>
            </section>

            {/* Entire Agreement */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">14. Entire Agreement</h2>
              <p>
                These Terms, together with our Privacy Policy, constitute the entire agreement between you and RepriceLab regarding the Service and supersede all prior agreements and understandings.
              </p>
            </section>

          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-purple-200 text-sm">
            © 2025 RepriceLab. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
