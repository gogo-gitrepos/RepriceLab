'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Shield, Lock, Database, FileText } from 'lucide-react';

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

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Shield className="w-20 h-20 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-purple-200 text-lg">Last updated: November 17, 2025</p>
          <p className="text-purple-300 mt-4">Amazon SP-API Data Protection Policy Compliant</p>
        </div>

        <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-2xl">
          <CardContent className="pt-8 space-y-8 text-gray-800">
            
            {/* Quick Navigation */}
            <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
              <h3 className="font-bold text-purple-900 mb-3 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Quick Navigation
              </h3>
              <div className="grid md:grid-cols-2 gap-2 text-sm">
                <a href="#information-collected" className="text-purple-600 hover:underline">1. Information We Collect</a>
                <a href="#how-we-use" className="text-purple-600 hover:underline">2. How We Use Your Information</a>
                <a href="#data-sharing" className="text-purple-600 hover:underline">3. Data Sharing & Disclosure</a>
                <a href="#amazon-spapi" className="text-purple-600 hover:underline">4. Amazon SP-API Data Protection</a>
                <a href="#security" className="text-purple-600 hover:underline">5. Data Security Measures</a>
                <a href="#your-rights" className="text-purple-600 hover:underline">6. Your Rights</a>
              </div>
            </div>

            {/* Introduction */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Introduction</h2>
              <p className="leading-relaxed">
                RepriceLab ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Amazon repricing service. We are an Amazon SP-API solution provider and comply with all Amazon Data Protection Policy requirements.
              </p>
            </section>

            {/* Information Collected */}
            <section id="information-collected">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center">
                <Database className="w-8 h-8 mr-3 text-purple-600" />
                1. Information We Collect
              </h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">1.1 Account Information</h3>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li><strong>Personal Data:</strong> Name, email address, password (encrypted with bcrypt)</li>
                <li><strong>Payment Information:</strong> Processed securely through Stripe (PCI DSS Level 1 compliant). We do not store credit card details.</li>
                <li><strong>Contact Information:</strong> Information provided when contacting support</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">1.2 Amazon Seller Data (via SP-API OAuth)</h3>
              <p className="mb-3">When you connect your Amazon Seller Central account, we access:</p>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li><strong>Product Listings:</strong> SKU, ASIN, titles, descriptions, images, categories</li>
                <li><strong>Inventory Data:</strong> Stock levels, fulfillment methods (FBA/FBM)</li>
                <li><strong>Pricing Information:</strong> Current prices, competitive offers, Buy Box status</li>
                <li><strong>Order Data:</strong> Order history for analytics (read-only access)</li>
                <li><strong>Seller Metrics:</strong> Account health, performance indicators</li>
                <li><strong>Marketplace Participations:</strong> Active marketplaces and regions</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">1.3 Automatically Collected Data</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Usage Data:</strong> Pages visited, features used, time spent on platform</li>
                <li><strong>Device Information:</strong> IP address, browser type, operating system</li>
                <li><strong>Log Data:</strong> API calls, repricing actions, error logs</li>
                <li><strong>Cookies:</strong> Session management, authentication tokens (JWT)</li>
              </ul>
            </section>

            {/* How We Use Data */}
            <section id="how-we-use">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Repricing Services</h4>
                  <p className="text-gray-700">Automated price adjustments based on your configured rules, Buy Box ownership analysis, and competitor monitoring</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Analytics & Reporting</h4>
                  <p className="text-gray-700">Dashboard metrics, sales insights, profitability analysis, historical data tracking</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Service Operations</h4>
                  <p className="text-gray-700">Account management, billing, customer support, service improvements</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Security & Compliance</h4>
                  <p className="text-gray-700">Fraud prevention, security monitoring, legal compliance, incident response</p>
                </div>
              </div>
            </section>

            {/* Data Sharing */}
            <section id="data-sharing">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">3. Data Sharing and Disclosure</h2>
              
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-6">
                <h4 className="font-bold text-green-900 mb-2">✓ We DO NOT Sell Your Data</h4>
                <p className="text-green-800">We never sell, rent, or trade your personal information or Amazon seller data to third parties for marketing purposes.</p>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3.1 Service Providers</h3>
              <p className="mb-3">We share data only with trusted service providers who help operate our service:</p>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li><strong>Amazon Web Services (AWS):</strong> Cloud hosting, infrastructure (SOC 2, ISO 27001 certified)</li>
                <li><strong>Stripe:</strong> Payment processing (PCI DSS Level 1 compliant)</li>
                <li><strong>Email Service Providers:</strong> Transactional emails and notifications</li>
              </ul>
              <p className="text-sm text-gray-600 mb-6">All service providers are contractually bound to protect your data and use it only for specified purposes.</p>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3.2 Legal Requirements</h3>
              <p>We may disclose information when required by:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Law, regulation, or court order</li>
                <li>Government or regulatory authority requests</li>
                <li>Protection of our legal rights or prevention of fraud</li>
                <li>Emergency situations involving safety or security</li>
              </ul>
            </section>

            {/* Amazon SP-API Compliance */}
            <section id="amazon-spapi">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center">
                <Lock className="w-8 h-8 mr-3 text-purple-600" />
                4. Amazon SP-API Data Protection
              </h2>
              <p className="mb-4 font-semibold text-purple-900">
                As an Amazon SP-API solution provider, we comply with Amazon's Data Protection Policy requirements:
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-900 mb-2">Access Control</h4>
                  <ul className="text-sm space-y-1 text-gray-700">
                    <li>• Role-based access (RBAC)</li>
                    <li>• Least privilege principle</li>
                    <li>• Multi-factor authentication (MFA)</li>
                    <li>• Regular access reviews</li>
                  </ul>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-900 mb-2">Data Encryption</h4>
                  <ul className="text-sm space-y-1 text-gray-700">
                    <li>• TLS 1.2+ in transit</li>
                    <li>• AES-256 encryption at rest</li>
                    <li>• Encrypted backups</li>
                    <li>• Secure key management</li>
                  </ul>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-900 mb-2">Data Retention</h4>
                  <ul className="text-sm space-y-1 text-gray-700">
                    <li>• Active account: data retained</li>
                    <li>• Account closure: 30-day grace</li>
                    <li>• Permanent deletion after 30 days</li>
                    <li>• Compliance logs: 7 years</li>
                  </ul>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-900 mb-2">Token Security</h4>
                  <ul className="text-sm space-y-1 text-gray-700">
                    <li>• OAuth refresh tokens encrypted</li>
                    <li>• Secure storage in PostgreSQL</li>
                    <li>• Auto-revocation on disconnect</li>
                    <li>• No token logging</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Security Measures */}
            <section id="security">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">5. Data Security Measures</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Technical Safeguards</h3>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li><strong>Authentication:</strong> JWT-based secure authentication, bcrypt password hashing (cost factor 12)</li>
                <li><strong>Network Security:</strong> AWS VPC isolation, security groups, DDoS protection</li>
                <li><strong>Database Security:</strong> PostgreSQL with encrypted connections, parameterized queries (SQL injection prevention)</li>
                <li><strong>Infrastructure:</strong> AWS infrastructure with SOC 2, ISO 27001, and PCI DSS compliance</li>
                <li><strong>Monitoring:</strong> 24/7 security monitoring, intrusion detection, automated alerts</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Operational Safeguards</h3>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li><strong>Backups:</strong> Automated daily encrypted backups, 30-day retention</li>
                <li><strong>Incident Response:</strong> Documented procedures, 24-hour response time</li>
                <li><strong>Vulnerability Management:</strong> Regular security scans, patch management</li>
                <li><strong>Employee Access:</strong> Background checks, NDA agreements, security training</li>
                <li><strong>Audits:</strong> Annual third-party security assessments</li>
              </ul>
            </section>

            {/* Your Rights */}
            <section id="your-rights">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">6. Your Rights (GDPR & KVKK Compliant)</h2>
              <p className="mb-4">You have the following rights regarding your personal data:</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border border-gray-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Right to Access</h4>
                  <p className="text-sm text-gray-700">Request a copy of all personal data we hold about you</p>
                </div>
                <div className="border border-gray-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Right to Rectification</h4>
                  <p className="text-sm text-gray-700">Correct inaccurate or incomplete information</p>
                </div>
                <div className="border border-gray-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Right to Deletion</h4>
                  <p className="text-sm text-gray-700">Request permanent deletion of your account and data</p>
                </div>
                <div className="border border-gray-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Right to Portability</h4>
                  <p className="text-sm text-gray-700">Export your data in machine-readable format (JSON/CSV)</p>
                </div>
                <div className="border border-gray-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Right to Revoke Consent</h4>
                  <p className="text-sm text-gray-700">Disconnect Amazon account and revoke API access anytime</p>
                </div>
                <div className="border border-gray-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Right to Object</h4>
                  <p className="text-sm text-gray-700">Object to processing for specific purposes</p>
                </div>
              </div>

              <p className="mt-6">
                To exercise these rights, contact us at{' '}
                <a href="mailto:repricelab@gmail.com" className="text-purple-600 hover:underline font-semibold">
                  repricelab@gmail.com
                </a>{' '}
                or use our{' '}
                <a href="/contact" className="text-purple-600 hover:underline font-semibold">
                  Contact Form
                </a>.
                We will respond within 30 days.
              </p>
            </section>

            {/* International Transfers */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">7. International Data Transfers</h2>
              <p className="mb-4">
                Your data may be transferred to and processed in countries outside your residence. We ensure appropriate safeguards:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Standard Contractual Clauses (SCCs):</strong> For EU data transfers</li>
                <li><strong>AWS Global Infrastructure:</strong> Data centers with compliance certifications</li>
                <li><strong>Data Localization:</strong> Stored in geographically appropriate AWS regions</li>
              </ul>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">8. Cookies and Tracking Technologies</h2>
              <div className="space-y-3">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                  <h4 className="font-semibold text-blue-900">Essential Cookies (Required)</h4>
                  <p className="text-sm text-blue-800 mt-1">Authentication tokens (JWT), session management, security features</p>
                </div>
                <div className="bg-gray-50 border-l-4 border-gray-400 p-4">
                  <h4 className="font-semibold text-gray-900">Analytics Cookies (Optional)</h4>
                  <p className="text-sm text-gray-700 mt-1">Usage patterns, feature adoption - requires user consent</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-600">You can manage cookie preferences in your browser settings.</p>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">9. Children's Privacy</h2>
              <p>
                RepriceLab is intended for business use by individuals 18 years or older. We do not knowingly collect information from children under 18. If you believe we have collected data from a minor, contact us immediately.
              </p>
            </section>

            {/* Changes to Policy */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">10. Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy periodically. Material changes will be communicated via:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Email notification to registered users</li>
                <li>Dashboard notification banner</li>
                <li>Updated "Last Updated" date at the top of this page</li>
              </ul>
              <p className="mt-3">Continued use of our service after changes constitutes acceptance of the updated policy.</p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">11. Contact Information</h2>
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-lg border border-purple-200">
                <h4 className="font-bold text-purple-900 mb-4">Privacy Questions or Concerns?</h4>
                <div className="space-y-2 text-gray-800">
                  <p><strong>Email:</strong> <a href="mailto:repricelab@gmail.com" className="text-purple-600 hover:underline">repricelab@gmail.com</a></p>
                  <p><strong>Contact Form:</strong> <a href="/contact" className="text-purple-600 hover:underline">https://repricelab.com/contact</a></p>
                  <p><strong>Response Time:</strong> Within 48 hours for privacy inquiries</p>
                </div>
              </div>
            </section>

            {/* Compliance Certifications */}
            <section className="mt-8 pt-8 border-t-2 border-gray-200">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Compliance & Certifications</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900">✓ GDPR Compliant</h4>
                  <p className="text-sm text-green-800 mt-1">European General Data Protection Regulation</p>
                </div>
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900">✓ KVKK Compliant</h4>
                  <p className="text-sm text-green-800 mt-1">Turkish Personal Data Protection Law</p>
                </div>
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900">✓ Amazon SP-API DPP</h4>
                  <p className="text-sm text-green-800 mt-1">Amazon Data Protection Policy Certified</p>
                </div>
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900">✓ PCI DSS via Stripe</h4>
                  <p className="text-sm text-green-800 mt-1">Payment Card Industry Data Security Standard</p>
                </div>
              </div>
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
