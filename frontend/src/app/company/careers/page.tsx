'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, MapPin, Clock, Briefcase } from 'lucide-react';

export default function CareersPage() {
  const router = useRouter();
  
  const jobs = [
    {
      title: 'Senior Backend Engineer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      description: 'Build scalable backend systems for our Amazon repricing platform.'
    },
    {
      title: 'Product Manager',
      department: 'Product',
      location: 'Remote',
      type: 'Full-time',
      description: 'Drive product strategy and roadmap for new features.'
    },
    {
      title: 'Customer Success Manager',
      department: 'Customer Success',
      location: 'Remote',
      type: 'Full-time',
      description: 'Help Amazon sellers succeed with our platform.'
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
          <h1 className="text-5xl font-bold text-white mb-6">Join Our Team</h1>
          <p className="text-xl text-purple-100">
            Help us build the world's best Amazon repricing platform
          </p>
        </div>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-12">
          <CardContent className="pt-8">
            <div className="text-purple-100 space-y-4">
              <p className="text-lg">
                At RepriceLab, we're on a mission to empower Amazon sellers with intelligent automation 
                and data-driven insights. We're a fast-growing team passionate about building tools that 
                make a real difference for thousands of businesses worldwide.
              </p>
              <p>
                We offer competitive compensation, flexible remote work, comprehensive benefits, and the 
                opportunity to work on challenging problems at scale.
              </p>
            </div>
          </CardContent>
        </Card>

        <h2 className="text-3xl font-bold text-white mb-8">Open Positions</h2>
        
        <div className="space-y-6">
          {jobs.map((job, index) => (
            <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-200">
              <CardHeader>
                <CardTitle className="text-white text-2xl">{job.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="flex items-center text-purple-200">
                    <Briefcase className="w-4 h-4 mr-2" />
                    {job.department}
                  </div>
                  <div className="flex items-center text-purple-200">
                    <MapPin className="w-4 h-4 mr-2" />
                    {job.location}
                  </div>
                  <div className="flex items-center text-purple-200">
                    <Clock className="w-4 h-4 mr-2" />
                    {job.type}
                  </div>
                </div>
                <p className="text-purple-100 mb-6">{job.description}</p>
                <Button 
                  className="bg-white text-purple-900 hover:bg-gray-100"
                  onClick={() => router.push('/contact')}
                >
                  Apply Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-purple-200 mb-4">Don't see a position that fits?</p>
          <Button 
            variant="outline"
            className="border-2 border-white text-white hover:bg-white/10"
            onClick={() => router.push('/contact')}
          >
            Send Us Your Resume
          </Button>
        </div>
      </div>
    </div>
  );
}
