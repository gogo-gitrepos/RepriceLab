'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Video, Calendar, Users, Clock } from 'lucide-react';

export default function WebinarsPage() {
  const router = useRouter();
  
  const upcomingWebinars = [
    {
      title: 'Advanced Repricing Strategies for Q4 2025',
      date: 'October 15, 2025',
      time: '2:00 PM EST',
      duration: '60 minutes',
      host: 'Sarah Johnson, Amazon Expert',
      attendees: '247 registered',
      description: 'Prepare for the holiday season with advanced repricing tactics. Learn how to maximize profits during peak shopping periods.',
      topics: [
        'Q4 pricing strategies',
        'Holiday season optimization',
        'Managing increased competition',
        'Inventory-based repricing'
      ]
    },
    {
      title: 'Buy Box Mastery Workshop',
      date: 'October 22, 2025',
      time: '1:00 PM EST',
      duration: '90 minutes',
      host: 'Michael Chen, Repricing Specialist',
      attendees: '189 registered',
      description: 'Deep dive into Amazon\'s Buy Box algorithm. Get actionable insights to improve your Buy Box win rate.',
      topics: [
        'Buy Box algorithm breakdown',
        'Performance metrics optimization',
        'Competitive positioning',
        'Live Q&A session'
      ]
    }
  ];

  const pastWebinars = [
    {
      title: 'Getting Started with RepriceLab',
      date: 'September 20, 2025',
      views: '1,247 views',
      duration: '45 minutes',
      description: 'Complete walkthrough of RepriceLab features for new users.'
    },
    {
      title: 'Multi-Marketplace Repricing Strategies',
      date: 'September 8, 2025',
      views: '892 views',
      duration: '60 minutes',
      description: 'How to manage pricing across multiple Amazon marketplaces effectively.'
    },
    {
      title: 'Protecting Your Margins While Staying Competitive',
      date: 'August 25, 2025',
      views: '1,456 views',
      duration: '55 minutes',
      description: 'Balance profitability and competitiveness with smart repricing rules.'
    },
    {
      title: 'Amazon FBA Seller Success Stories',
      date: 'August 10, 2025',
      views: '2,103 views',
      duration: '75 minutes',
      description: 'Real sellers share their repricing success stories and strategies.'
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
          <h1 className="text-5xl font-bold text-white mb-6">Webinars</h1>
          <p className="text-xl text-purple-100">
            Learn from Amazon selling experts through live and recorded webinars
          </p>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8">Upcoming Webinars</h2>
          <div className="space-y-6">
            {upcomingWebinars.map((webinar, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-white text-2xl mb-3">{webinar.title}</CardTitle>
                      <div className="flex flex-wrap gap-4 text-purple-200 text-sm mb-3">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          {webinar.date} at {webinar.time}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          {webinar.duration}
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-2" />
                          {webinar.attendees}
                        </div>
                      </div>
                      <p className="text-purple-300 text-sm">Hosted by {webinar.host}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-purple-100">{webinar.description}</p>
                  <div>
                    <p className="text-white font-semibold mb-2">Topics Covered:</p>
                    <ul className="grid md:grid-cols-2 gap-2">
                      {webinar.topics.map((topic, i) => (
                        <li key={i} className="text-purple-200 text-sm">• {topic}</li>
                      ))}
                    </ul>
                  </div>
                  <Button 
                    className="bg-white text-purple-900 hover:bg-gray-100"
                    onClick={() => router.push('/contact')}
                  >
                    Register Free
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-bold text-white mb-8">Past Webinars</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {pastWebinars.map((webinar, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <Video className="w-6 h-6 text-purple-400" />
                    <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                      Recorded
                    </span>
                  </div>
                  <CardTitle className="text-white text-lg">{webinar.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-4 text-purple-300 text-sm">
                    <span>{webinar.date}</span>
                    <span>•</span>
                    <span>{webinar.duration}</span>
                  </div>
                  <p className="text-purple-200 text-sm">{webinar.views}</p>
                  <p className="text-purple-100">{webinar.description}</p>
                  <Button 
                    variant="outline"
                    className="w-full border-2 border-white text-white hover:bg-white/10"
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Watch Recording
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="pt-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Never Miss a Webinar</h2>
              <p className="text-purple-100 mb-6">
                Get notified about upcoming webinars and receive recordings
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
