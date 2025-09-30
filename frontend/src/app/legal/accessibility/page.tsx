'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

export default function AccessibilityPage() {
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
        <h1 className="text-5xl font-bold text-white mb-6">Accessibility Statement</h1>
        <p className="text-purple-200 mb-8">Last updated: September 30, 2025</p>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="pt-8 space-y-8 text-purple-100">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Our Commitment</h2>
              <p>
                RepriceLab is committed to ensuring digital accessibility for people with disabilities. We are 
                continually improving the user experience for everyone and applying the relevant accessibility standards.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Conformance Status</h2>
              <p>
                We aim to conform to WCAG 2.1 Level AA standards. These guidelines explain how to make web content 
                more accessible for people with disabilities and more user-friendly for everyone.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Accessibility Features</h2>
              <p className="mb-4">Our platform includes:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Keyboard navigation support</li>
                <li>Screen reader compatibility</li>
                <li>Sufficient color contrast ratios</li>
                <li>Resizable text without loss of functionality</li>
                <li>Clear and consistent navigation</li>
                <li>Descriptive link text and labels</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Known Limitations</h2>
              <p>
                Despite our best efforts, some areas of our platform may not be fully accessible. We are working to 
                address these issues and appreciate your patience as we continue to improve.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Feedback</h2>
              <p>
                We welcome your feedback on the accessibility of RepriceLab. If you encounter any barriers or have 
                suggestions for improvement, please contact us:
                <br />
                <br />
                Email: <a href="mailto:accessibility@repricelab.com" className="text-blue-300 hover:text-blue-200 underline">
                  accessibility@repricelab.com
                </a>
                <br />
                <br />
                We aim to respond to accessibility feedback within 5 business days.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Technical Specifications</h2>
              <p>
                RepriceLab relies on the following technologies to work with web browsers and assistive technologies:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
                <li>HTML5</li>
                <li>CSS3</li>
                <li>JavaScript</li>
                <li>ARIA (Accessible Rich Internet Applications)</li>
              </ul>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
