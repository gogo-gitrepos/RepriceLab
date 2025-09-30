'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, BookOpen, Download, Clock } from 'lucide-react';

export default function EbooksPage() {
  const router = useRouter();
  
  const ebooks = [
    {
      title: 'The Complete Guide to Amazon Repricing',
      pages: '87 pages',
      readTime: '2 hours',
      cover: '📘',
      description: 'Master Amazon repricing strategies from beginner to advanced. Learn how to optimize prices, win the Buy Box, and maximize profits.',
      topics: [
        'Repricing fundamentals',
        'Advanced strategies',
        'Buy Box optimization',
        'Competitor analysis',
        'Profit protection'
      ]
    },
    {
      title: 'Buy Box Mastery: Win More, Sell More',
      pages: '64 pages',
      readTime: '90 minutes',
      cover: '🏆',
      description: 'Unlock the secrets of Amazon\'s Buy Box algorithm. Understand exactly what Amazon looks for and how to position yourself as the winner.',
      topics: [
        'Buy Box algorithm explained',
        'Performance metrics that matter',
        'Pricing psychology',
        'Seller rating optimization',
        'Case studies'
      ]
    },
    {
      title: 'Automated Pricing for Amazon Sellers',
      pages: '52 pages',
      readTime: '75 minutes',
      cover: '⚡',
      description: 'Learn how to set up automated repricing rules that work while you sleep. Save time and increase sales with smart automation.',
      topics: [
        'Rule-based repricing',
        'Time-saving automation',
        'Setting price boundaries',
        'Avoiding common mistakes',
        'ROI optimization'
      ]
    },
    {
      title: 'Amazon Multi-Marketplace Strategy',
      pages: '96 pages',
      readTime: '2.5 hours',
      cover: '🌍',
      description: 'Expand your Amazon business globally. Learn how to manage pricing across multiple marketplaces effectively.',
      topics: [
        'Global marketplace overview',
        'Currency considerations',
        'Localized pricing strategies',
        'Tax and compliance',
        'Logistics and fulfillment'
      ]
    },
    {
      title: 'Data-Driven Selling on Amazon',
      pages: '73 pages',
      readTime: '2 hours',
      cover: '📊',
      description: 'Use analytics and data to make smarter business decisions. Learn which metrics matter and how to track them.',
      topics: [
        'Key performance indicators',
        'Analytics dashboards',
        'Profit calculations',
        'Trend analysis',
        'Forecasting demand'
      ]
    },
    {
      title: 'Competitive Intelligence for Amazon',
      pages: '58 pages',
      readTime: '90 minutes',
      cover: '🔍',
      description: 'Learn how to monitor, analyze, and outsmart your competition on Amazon. Stay one step ahead with competitive intelligence.',
      topics: [
        'Competitor tracking',
        'Price monitoring',
        'Market positioning',
        'Differentiation strategies',
        'Strategic pricing'
      ]
    }
  ];
  
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

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-6">Free eBooks</h1>
          <p className="text-xl text-purple-100">
            Download our comprehensive guides to master Amazon selling and repricing
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {ebooks.map((ebook, index) => (
            <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <div className="text-6xl mb-4">{ebook.cover}</div>
                <CardTitle className="text-white text-xl mb-2">{ebook.title}</CardTitle>
                <div className="flex items-center gap-4 text-purple-300 text-sm">
                  <div className="flex items-center">
                    <BookOpen className="w-4 h-4 mr-2" />
                    {ebook.pages}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {ebook.readTime}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-purple-100">{ebook.description}</p>
                <div>
                  <p className="text-white font-semibold mb-2">What You'll Learn:</p>
                  <ul className="space-y-1">
                    {ebook.topics.map((topic, i) => (
                      <li key={i} className="text-purple-200 text-sm">• {topic}</li>
                    ))}
                  </ul>
                </div>
                <Button 
                  className="w-full bg-white text-purple-900 hover:bg-gray-100"
                  onClick={() => router.push('/contact')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Free
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="pt-8">
              <h2 className="text-2xl font-bold text-white mb-4">Want More Resources?</h2>
              <p className="text-purple-100 mb-6">
                Subscribe to get notified when we publish new eBooks and guides
              </p>
              <div className="flex justify-center gap-2 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-purple-300"
                />
                <Button className="bg-white text-purple-900 hover:bg-gray-100">
                  Subscribe
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
