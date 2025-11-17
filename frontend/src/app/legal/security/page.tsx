'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Shield, Lock, Database, Server, Eye, AlertTriangle } from 'lucide-react';

export default function SecurityPolicyPage() {
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
            <Lock className="w-20 h-20 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">Data Protection & Security Policy</h1>
          <p className="text-purple-200 text-lg">Amazon SP-API Compliance Documentation</p>
          <p className="text-purple-300 mt-2">Last updated: November 17, 2025</p>
        </div>

        <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-2xl">
          <CardContent className="pt-8 space-y-8 text-gray-800">
            
            {/* Executive Summary */}
            <section className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-lg border-2 border-purple-300">
              <h2 className="text-2xl font-bold text-purple-900 mb-3 flex items-center">
                <Shield className="w-7 h-7 mr-3" />
                Executive Summary
              </h2>
              <p className="text-gray-800 leading-relaxed">
                RepriceLab is an Amazon SP-API solution provider committed to the highest standards of data protection and security. This document outlines our comprehensive security measures, compliance certifications, and operational practices that protect Amazon seller data and ensure compliance with Amazon's Data Protection Policy.
              </p>
            </section>

            {/* Infrastructure Security */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center">
                <Server className="w-8 h-8 mr-3 text-purple-600" />
                1. Infrastructure Security
              </h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">1.1 Cloud Infrastructure</h3>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
                <p><strong>Provider:</strong> Amazon Web Services (AWS)</p>
                <p className="mt-2"><strong>Certifications:</strong></p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>SOC 2 Type II compliant</li>
                  <li>ISO 27001 certified</li>
                  <li>PCI DSS Level 1 (via Stripe)</li>
                  <li>GDPR & KVKK compliant infrastructure</li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">1.2 Network Security</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>VPC Isolation:</strong> Private Virtual Private Cloud with isolated subnets</li>
                <li><strong>Security Groups:</strong> Firewall rules restricting inbound/outbound traffic</li>
                <li><strong>DDoS Protection:</strong> AWS Shield Standard protection</li>
                <li><strong>WAF (Web Application Firewall):</strong> Protection against common web exploits</li>
                <li><strong>CDN:</strong> Content delivery with edge caching and SSL/TLS termination</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">1.3 Server Security</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Operating System:</strong> Hardened Linux servers with automatic security patches</li>
                <li><strong>Access Control:</strong> SSH key-based authentication only (no password login)</li>
                <li><strong>Intrusion Detection:</strong> Automated monitoring for suspicious activities</li>
                <li><strong>Log Management:</strong> Centralized logging with 90-day retention</li>
              </ul>
            </section>

            {/* Data Encryption */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center">
                <Lock className="w-8 h-8 mr-3 text-purple-600" />
                2. Data Encryption
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <h4 className="font-bold text-green-900 mb-2">✓ Data in Transit</h4>
                  <ul className="text-sm space-y-1 text-gray-700">
                    <li>• TLS 1.2+ for all HTTPS connections</li>
                    <li>• Perfect Forward Secrecy (PFS)</li>
                    <li>• Strong cipher suites only</li>
                    <li>• HSTS (HTTP Strict Transport Security)</li>
                  </ul>
                </div>
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <h4 className="font-bold text-green-900 mb-2">✓ Data at Rest</h4>
                  <ul className="text-sm space-y-1 text-gray-700">
                    <li>• AES-256 encryption for databases</li>
                    <li>• Encrypted EBS volumes (AWS)</li>
                    <li>• Encrypted backups</li>
                    <li>• Encrypted log files</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2.1 Key Management</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>AWS KMS:</strong> AWS Key Management Service for encryption key management</li>
                <li><strong>Key Rotation:</strong> Automatic annual key rotation</li>
                <li><strong>Access Control:</strong> IAM policies restricting key usage</li>
                <li><strong>Audit Trail:</strong> All key usage logged in CloudTrail</li>
              </ul>
            </section>

            {/* Amazon SP-API Security */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center">
                <Database className="w-8 h-8 mr-3 text-purple-600" />
                3. Amazon SP-API Data Protection
              </h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.1 OAuth Token Management</h3>
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg mb-4">
                <h4 className="font-bold text-yellow-900 mb-2">Critical Security Measures</h4>
                <ul className="text-sm space-y-2 text-yellow-800">
                  <li>✓ Refresh tokens encrypted using industry-standard encryption (AES-256)</li>
                  <li>✓ Tokens stored in encrypted PostgreSQL database</li>
                  <li>✓ Tokens never logged or exposed in error messages</li>
                  <li>✓ Automatic token revocation upon account disconnection</li>
                  <li>✓ Token expiration and renewal handled securely</li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3.2 SP-API Access Control</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Least Privilege:</strong> Only requested permissions granted (listings, pricing, orders read-only)</li>
                <li><strong>Role-Based Access:</strong> User can only access their own connected stores</li>
                <li><strong>API Rate Limiting:</strong> Compliance with Amazon's SP-API rate limits</li>
                <li><strong>Request Validation:</strong> All SP-API requests validated before execution</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3.3 Seller Data Handling</h3>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="font-semibold text-blue-900 mb-2">Data Minimization Principle</p>
                <p className="text-sm text-blue-800">
                  We collect and process only the minimum Amazon seller data required to provide repricing services:
                </p>
                <ul className="text-sm mt-2 space-y-1 text-blue-800 list-disc pl-5">
                  <li>Product listings (SKU, ASIN, price, inventory)</li>
                  <li>Competitive offers (for Buy Box analysis only)</li>
                  <li>Order history (read-only, for analytics)</li>
                </ul>
                <p className="text-sm mt-3 text-blue-800">
                  <strong>We do NOT collect:</strong> Customer PII, payment details, or unnecessary seller data
                </p>
              </div>
            </section>

            {/* Application Security */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">4. Application Security</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">4.1 Authentication & Authorization</h3>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li><strong>Password Security:</strong> Bcrypt hashing with cost factor 12 (64,000+ iterations)</li>
                <li><strong>Session Management:</strong> JWT (JSON Web Tokens) with HMAC-SHA256 signing</li>
                <li><strong>Token Expiration:</strong> Short-lived access tokens (1 hour), long-lived refresh tokens</li>
                <li><strong>OAuth 2.0:</strong> Standard OAuth flow for Amazon and Google authentication</li>
                <li><strong>CSRF Protection:</strong> State parameter validation in OAuth flows</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">4.2 Input Validation & Sanitization</h3>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li><strong>SQL Injection Prevention:</strong> Parameterized queries via SQLAlchemy ORM</li>
                <li><strong>XSS Prevention:</strong> React automatic escaping, Content Security Policy (CSP)</li>
                <li><strong>API Input Validation:</strong> Pydantic schema validation on all API endpoints</li>
                <li><strong>File Upload Security:</strong> Type validation, size limits, virus scanning</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">4.3 API Security</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Rate Limiting:</strong> 100 requests per minute per user</li>
                <li><strong>Request Throttling:</strong> Prevents abuse and DDoS attacks</li>
                <li><strong>API Versioning:</strong> Backward-compatible API changes</li>
                <li><strong>Error Handling:</strong> Generic error messages (no sensitive data leakage)</li>
              </ul>
            </section>

            {/* Monitoring & Incident Response */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center">
                <Eye className="w-8 h-8 mr-3 text-purple-600" />
                5. Monitoring & Incident Response
              </h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">5.1 Security Monitoring</h3>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-300">
                  <h4 className="font-semibold text-gray-900 mb-2">Automated Monitoring</h4>
                  <ul className="text-sm space-y-1 text-gray-700">
                    <li>• 24/7 server health monitoring</li>
                    <li>• Real-time intrusion detection</li>
                    <li>• Failed login attempt tracking</li>
                    <li>• Unusual API activity alerts</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-300">
                  <h4 className="font-semibold text-gray-900 mb-2">Logging & Auditing</h4>
                  <ul className="text-sm space-y-1 text-gray-700">
                    <li>• Centralized log aggregation</li>
                    <li>• 90-day log retention</li>
                    <li>• Audit trail for all admin actions</li>
                    <li>• Compliance logs (7-year retention)</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">5.2 Incident Response Plan</h3>
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <h4 className="font-bold text-red-900 mb-3 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Security Incident Response Procedure
                </h4>
                <ol className="text-sm space-y-2 text-red-800 list-decimal pl-5">
                  <li><strong>Detection (0-1 hour):</strong> Automated alerts notify security team</li>
                  <li><strong>Assessment (1-4 hours):</strong> Severity assessment, impact analysis</li>
                  <li><strong>Containment (4-24 hours):</strong> Isolate affected systems, prevent spread</li>
                  <li><strong>Eradication (24-48 hours):</strong> Remove threat, patch vulnerabilities</li>
                  <li><strong>Recovery (48-72 hours):</strong> Restore services, verify security</li>
                  <li><strong>Communication:</strong> Notify affected users within 72 hours (GDPR requirement)</li>
                  <li><strong>Post-Incident Review:</strong> Root cause analysis, preventive measures</li>
                </ol>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">5.3 Data Breach Notification</h3>
              <p className="mb-3">In the event of a data breach affecting Amazon seller data:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Amazon notified within <strong>24 hours</strong> (as required by SP-API DPP)</li>
                <li>Affected users notified within <strong>72 hours</strong> (GDPR/KVKK requirement)</li>
                <li>Regulatory authorities notified as required by law</li>
                <li>Public disclosure if legally required</li>
              </ul>
            </section>

            {/* Backup & Disaster Recovery */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">6. Backup & Disaster Recovery</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">6.1 Backup Strategy</h3>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li><strong>Automated Daily Backups:</strong> Full database backups at 2:00 AM UTC</li>
                <li><strong>Incremental Backups:</strong> Every 6 hours for critical data</li>
                <li><strong>Retention Period:</strong> 30-day rolling retention</li>
                <li><strong>Encryption:</strong> All backups encrypted with AES-256</li>
                <li><strong>Geographic Redundancy:</strong> Backups stored in multiple AWS regions</li>
                <li><strong>Testing:</strong> Monthly backup restoration tests</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">6.2 Disaster Recovery</h3>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p><strong>Recovery Time Objective (RTO):</strong> 4 hours</p>
                <p className="mt-2"><strong>Recovery Point Objective (RPO):</strong> 6 hours (max data loss)</p>
                <p className="mt-2"><strong>Failover Strategy:</strong> Multi-region deployment with automatic failover</p>
              </div>
            </section>

            {/* Access Control */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">7. Personnel & Access Control</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">7.1 Employee Access</h3>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li><strong>Background Checks:</strong> Criminal and employment verification for all staff</li>
                <li><strong>NDA Agreements:</strong> Mandatory confidentiality agreements</li>
                <li><strong>Security Training:</strong> Annual security awareness training</li>
                <li><strong>Least Privilege:</strong> Employees granted minimum necessary access</li>
                <li><strong>Access Reviews:</strong> Quarterly reviews of all user permissions</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">7.2 Production Access</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>MFA Required:</strong> Multi-factor authentication for all admin access</li>
                <li><strong>Jump Boxes:</strong> Bastion hosts for production server access</li>
                <li><strong>Audit Logging:</strong> All admin actions logged and reviewed</li>
                <li><strong>Time-Limited Access:</strong> Temporary credentials with automatic expiration</li>
              </ul>
            </section>

            {/* Compliance */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">8. Compliance & Certifications</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-300 p-4 rounded-lg">
                  <h4 className="font-bold text-green-900 mb-2">✓ Amazon SP-API DPP</h4>
                  <p className="text-sm text-green-800">Fully compliant with Amazon's Data Protection Policy</p>
                </div>
                <div className="bg-green-50 border border-green-300 p-4 rounded-lg">
                  <h4 className="font-bold text-green-900 mb-2">✓ GDPR Compliant</h4>
                  <p className="text-sm text-green-800">EU General Data Protection Regulation</p>
                </div>
                <div className="bg-green-50 border border-green-300 p-4 rounded-lg">
                  <h4 className="font-bold text-green-900 mb-2">✓ KVKK Compliant</h4>
                  <p className="text-sm text-green-800">Turkish Personal Data Protection Law</p>
                </div>
                <div className="bg-green-50 border border-green-300 p-4 rounded-lg">
                  <h4 className="font-bold text-green-900 mb-2">✓ PCI DSS (via Stripe)</h4>
                  <p className="text-sm text-green-800">Payment Card Industry Data Security Standard</p>
                </div>
                <div className="bg-green-50 border border-green-300 p-4 rounded-lg">
                  <h4 className="font-bold text-green-900 mb-2">✓ SOC 2 Type II</h4>
                  <p className="text-sm text-green-800">AWS infrastructure certification</p>
                </div>
                <div className="bg-green-50 border border-green-300 p-4 rounded-lg">
                  <h4 className="font-bold text-green-900 mb-2">✓ ISO 27001</h4>
                  <p className="text-sm text-green-800">Information Security Management</p>
                </div>
              </div>
            </section>

            {/* Vulnerability Management */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">9. Vulnerability Management</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">9.1 Security Testing</h3>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li><strong>Automated Scans:</strong> Weekly vulnerability scans using industry-standard tools</li>
                <li><strong>Penetration Testing:</strong> Annual third-party penetration tests</li>
                <li><strong>Code Reviews:</strong> Security-focused code reviews for all changes</li>
                <li><strong>Dependency Scanning:</strong> Automated scanning for vulnerable dependencies</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">9.2 Patch Management</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Critical Patches:</strong> Applied within 24 hours</li>
                <li><strong>High Priority:</strong> Applied within 7 days</li>
                <li><strong>Regular Updates:</strong> Monthly patch cycle for non-critical updates</li>
                <li><strong>Testing:</strong> All patches tested in staging before production deployment</li>
              </ul>
            </section>

            {/* Contact */}
            <section className="pt-8 border-t-2 border-gray-200">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">10. Security Contact</h2>
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-lg border border-purple-200">
                <h4 className="font-bold text-purple-900 mb-4">Report Security Vulnerabilities</h4>
                <div className="space-y-2 text-gray-800">
                  <p><strong>Email:</strong> <a href="mailto:repricelab@gmail.com" className="text-purple-600 hover:underline">repricelab@gmail.com</a></p>
                  <p><strong>Subject Line:</strong> [SECURITY] Vulnerability Report</p>
                  <p><strong>Response Time:</strong> Within 24 hours for critical security issues</p>
                  <p className="mt-4 text-sm text-gray-600">
                    We appreciate responsible disclosure of security vulnerabilities and will acknowledge and address all legitimate reports.
                  </p>
                </div>
              </div>
            </section>

          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-purple-200 text-sm">
            © 2025 RepriceLab. All rights reserved. | <a href="/legal/privacy" className="hover:underline">Privacy Policy</a> | <a href="/legal/terms" className="hover:underline">Terms of Service</a>
          </p>
        </div>
      </div>
    </div>
  );
}
