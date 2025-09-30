'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Calendar, User } from 'lucide-react';

export default function BlogPage() {
  const router = useRouter();
  
  const posts = [
    {
      title: '10 Amazon Repricing Strategies That Actually Work in 2025',
      excerpt: 'Learn the most effective repricing strategies used by top Amazon sellers to maximize their Buy Box wins and profits.',
      author: 'Sarah Johnson',
      date: 'September 28, 2025',
      category: 'Strategy'
    },
    {
      title: 'How to Win the Buy Box: Complete Guide for Amazon Sellers',
      excerpt: 'Everything you need to know about Amazon\'s Buy Box algorithm and how to position yourself as the winner.',
      author: 'Michael Chen',
      date: 'September 25, 2025',
      category: 'Education'
    },
    {
      title: 'Case Study: How One Seller Increased Sales by 340% with Automated Repricing',
      excerpt: 'Real results from an Amazon seller who implemented intelligent repricing strategies with RepriceLab.',
      author: 'Emily Rodriguez',
      date: 'September 20, 2025',
      category: 'Case Study'
    },
    {
      title: 'Understanding Amazon\'s New Pricing Policies: What Sellers Need to Know',
      excerpt: 'Stay compliant with Amazon\'s latest pricing rules while maintaining competitive prices.',
      author: 'David Park',
      date: 'September 15, 2025',
      category: 'Policy Updates'
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
          <h1 className="text-5xl font-bold text-white mb-6">RepriceLab Blog</h1>
          <p className="text-xl text-purple-100">
            Amazon selling tips, repricing strategies, and eCommerce insights
          </p>
        </div>

        <div className="space-y-6">
          {posts.map((post, index) => (
            <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-200">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-purple-500 text-white text-xs px-3 py-1 rounded-full">
                    {post.category}
                  </span>
                </div>
                <CardTitle className="text-white text-2xl mb-3">{post.title}</CardTitle>
                <div className="flex items-center gap-4 text-purple-300 text-sm">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    {post.author}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {post.date}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-purple-100 mb-4">{post.excerpt}</p>
                <Button 
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white/10"
                >
                  Read More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-purple-200 mb-4">Want to stay updated with our latest posts?</p>
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
        </div>
      </div>
    </div>
  );
}
