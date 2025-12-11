'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Mail, FlaskConical, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to send reset email');
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 relative overflow-hidden flex items-center justify-center p-6">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative z-10 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="relative w-14 h-14 bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <FlaskConical className="w-8 h-8 text-white relative z-10 drop-shadow-lg" />
              </div>
              <span className="text-3xl font-bold text-white tracking-tight">RepriceLab</span>
            </div>
          </div>

          <Card className="bg-white/95 backdrop-blur-xl shadow-2xl border-0">
            <CardContent className="pt-8 pb-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Check Your Email</h2>
              <p className="text-gray-600 mb-6">
                If an account with <strong>{email}</strong> exists, we've sent a password reset link. Please check your inbox and spam folder.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                The link will expire in 1 hour.
              </p>
              <Button 
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                onClick={() => router.push('/login')}
              >
                Back to Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 relative overflow-hidden flex items-center justify-center p-6">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="absolute top-6 left-6 z-10">
        <Button 
          variant="ghost" 
          className="text-white hover:bg-white/10"
          onClick={() => router.push('/login')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Login
        </Button>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="relative w-14 h-14 bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
              <FlaskConical className="w-8 h-8 text-white relative z-10 drop-shadow-lg" />
            </div>
            <span className="text-3xl font-bold text-white tracking-tight">
              <span className="bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent drop-shadow-lg">RepriceLab</span>
            </span>
          </div>
          <p className="text-purple-200 text-lg">Reset your password</p>
        </div>

        <Card className="bg-white/95 backdrop-blur-xl shadow-2xl border-0">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-3xl font-bold text-gray-900 text-center">Forgot Password?</CardTitle>
            <CardDescription className="text-base text-gray-600 text-center">
              Enter your email address and we'll send you a link to reset your password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 pl-10 text-base border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>

              <div className="text-center pt-4">
                <p className="text-sm text-gray-600">
                  Remember your password?{' '}
                  <button 
                    type="button" 
                    className="font-semibold text-purple-600 hover:text-purple-700"
                    onClick={() => router.push('/login')}
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
