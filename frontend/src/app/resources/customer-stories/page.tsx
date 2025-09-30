'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, TrendingUp, DollarSign, Award, BarChart } from 'lucide-react';

export default function CustomerStoriesPage() {
  const router = useRouter();
  
  const stories = [
    {
      company: 'TechGear Solutions',
      owner: 'Jennifer Martinez',
      location: 'Austin, TX',
      products: '2,500+ SKUs',
      metric: '+340%',
      metricLabel: 'Sales Increase',
      icon: <TrendingUp className="w-8 h-8 text-green-400" />,
      quote: "RepriceLab transformed our Amazon business. We went from manually updating prices once a day to automatic repricing every 15 minutes. Our Buy Box win rate jumped from 35% to 89%.",
      results: [
        'Buy Box win rate: 35% → 89%',
        'Sales increased by 340%',
        'Saved 20+ hours per week'
      ]
    },
    {
      company: 'HomeStyle Décor',
      owner: 'Michael Chen',
      location: 'Seattle, WA',
      products: '850 SKUs',
      metric: '+$125K',
      metricLabel: 'Monthly Revenue',
      icon: <DollarSign className="w-8 h-8 text-yellow-400" />,
      quote: "The automated repricing strategies gave us the edge we needed. We protect our margins while staying competitive. RepriceLab paid for itself in the first week.",
      results: [
        'Monthly revenue: +$125,000',
        'Average margin: +12%',
        'ROI: 2,400% in first month'
      ]
    },
    {
      company: 'FitnessPro Equipment',
      owner: 'Sarah Johnson',
      location: 'Miami, FL',
      products: '1,200 SKUs',
      metric: '94%',
      metricLabel: 'Buy Box Rate',
      icon: <Award className="w-8 h-8 text-purple-400" />,
      quote: "As a smaller seller competing with big brands, RepriceLab leveled the playing field. The intelligent repricing keeps us competitive without sacrificing profits.",
      results: [
        'Buy Box ownership: 94%',
        'Profit margins maintained',
        'Expanded to 3 new marketplaces'
      ]
    },
    {
      company: 'BookWise Distributors',
      owner: 'David Park',
      location: 'Chicago, IL',
      products: '5,000+ SKUs',
      metric: '-68%',
      metricLabel: 'Manual Work',
      icon: <BarChart className="w-8 h-8 text-blue-400" />,
      quote: "Managing 5,000+ book listings was impossible before RepriceLab. Now everything runs automatically, and we can focus on growing our catalog instead of updating prices.",
      results: [
        'Time saved: 30+ hours/week',
        'Price update frequency: 15 min',
        'Scaling to 10,000 SKUs'
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
          <h1 className="text-5xl font-bold text-white mb-6">Customer Success Stories</h1>
          <p className="text-xl text-purple-100">
            Real results from Amazon sellers using RepriceLab to grow their businesses
          </p>
        </div>

        <div className="space-y-8">
          {stories.map((story, index) => (
            <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <CardTitle className="text-white text-2xl mb-2">{story.company}</CardTitle>
                    <p className="text-purple-200">{story.owner} • {story.location}</p>
                    <p className="text-purple-300 text-sm">{story.products}</p>
                  </div>
                  <div className="text-right">
                    <div className="mb-2">{story.icon}</div>
                    <div className="text-3xl font-bold text-white">{story.metric}</div>
                    <div className="text-sm text-purple-200">{story.metricLabel}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <blockquote className="text-purple-100 italic border-l-4 border-purple-400 pl-4">
                  "{story.quote}"
                </blockquote>
                <div>
                  <p className="text-white font-semibold mb-2">Key Results:</p>
                  <ul className="space-y-1">
                    {story.results.map((result, i) => (
                      <li key={i} className="text-purple-200">• {result}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="pt-8">
              <h2 className="text-2xl font-bold text-white mb-4">Ready to Write Your Success Story?</h2>
              <p className="text-purple-100 mb-6">
                Join thousands of Amazon sellers who are growing their businesses with RepriceLab
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
    </div>
  );
}
