'use client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function ContactPage() {
  const router = useRouter();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 p-8">
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          className="text-white hover:bg-white/10 mb-8"
          onClick={() => router.push('/')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20">
          <h1 className="text-5xl font-bold text-white mb-6">Contact Us</h1>
          <p className="text-xl text-purple-100">
            Get in touch with our team. We're here to help you succeed with RepriceLab.
          </p>
          
          <div className="mt-12 text-purple-200">
            <p>Contact form coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
