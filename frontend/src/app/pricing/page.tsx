'use client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function PricingPage() {
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
          <h1 className="text-5xl font-bold text-white mb-6">Pricing</h1>
          <p className="text-xl text-purple-100">
            Choose the perfect plan for your Amazon business. All plans include our advanced repricing algorithms.
          </p>
          
          <div className="mt-12 text-purple-200">
            <p>Pricing details coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
