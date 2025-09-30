'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Search, BookOpen, Video, MessageSquare, FileText } from 'lucide-react';

export default function HelpCenterPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  
  const categories = [
    {
      icon: <BookOpen className="w-8 h-8 text-blue-400" />,
      title: 'Getting Started',
      articles: [
        'How to connect your Amazon store',
        'Setting up your first repricing rule',
        'Understanding the dashboard',
        'Importing your products'
      ]
    },
    {
      icon: <Video className="w-8 h-8 text-purple-400" />,
      title: 'Video Tutorials',
      articles: [
        'RepriceLab walkthrough (10 min)',
        'Creating advanced repricing rules',
        'Analyzing your Buy Box performance',
        'Multi-marketplace setup guide'
      ]
    },
    {
      icon: <FileText className="w-8 h-8 text-green-400" />,
      title: 'Repricing Rules',
      articles: [
        'Understanding rule types',
        'Setting minimum and maximum prices',
        'Competitor filtering strategies',
        'Scheduling repricing cycles'
      ]
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-orange-400" />,
      title: 'Troubleshooting',
      articles: [
        'Common Amazon API errors',
        'Why prices are not updating',
        'Resolving Buy Box issues',
        'Product sync problems'
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

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-6">Help Center</h1>
          <p className="text-xl text-purple-100 mb-8">
            Find answers, guides, and resources to help you succeed with RepriceLab
          </p>
          
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
            <input
              type="text"
              placeholder="Search for help articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-lg bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white placeholder:text-purple-300 focus:outline-none focus:ring-2 focus:ring-white/50 text-lg"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {categories.map((category, index) => (
            <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <div className="mb-4">{category.icon}</div>
                <CardTitle className="text-white text-2xl">{category.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {category.articles.map((article, i) => (
                    <li key={i}>
                      <button className="text-purple-200 hover:text-white text-left transition-colors">
                        {article}
                      </button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="pt-8 text-center">
              <MessageSquare className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-white font-bold text-lg mb-2">Live Chat</h3>
              <p className="text-purple-200 mb-4 text-sm">Chat with our support team</p>
              <Button 
                className="bg-white text-purple-900 hover:bg-gray-100 w-full"
                onClick={() => router.push('/contact')}
              >
                Start Chat
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="pt-8 text-center">
              <FileText className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-white font-bold text-lg mb-2">Documentation</h3>
              <p className="text-purple-200 mb-4 text-sm">Complete API & feature docs</p>
              <Button 
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 w-full"
              >
                View Docs
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="pt-8 text-center">
              <Video className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-white font-bold text-lg mb-2">Video Library</h3>
              <p className="text-purple-200 mb-4 text-sm">Watch tutorial videos</p>
              <Button 
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 w-full"
              >
                Watch Videos
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
