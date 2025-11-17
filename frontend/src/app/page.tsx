'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  TrendingUp, 
  Target, 
  BarChart3, 
  Shield, 
  Clock, 
  Award,
  ChevronRight,
  CheckCircle2,
  Star,
  ArrowRight,
  Facebook,
  Twitter,
  Youtube,
  Linkedin,
  Instagram,
  Mail,
  FlaskConical
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Login failed');
      }

      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      router.push('/dashboard');
    } catch (err: any) {
      setLoginError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const response = await fetch('/api/auth/google/login');
      const data = await response.json();
      
      if (data.auth_url) {
        window.location.href = data.auth_url;
      }
    } catch (error) {
      console.error('Failed to initiate Google login:', error);
      alert('Failed to initiate Google login. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-4 sm:px-6 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-200">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl sm:rounded-2xl"></div>
              <FlaskConical className="w-6 h-6 sm:w-7 sm:h-7 text-white relative z-10 drop-shadow-lg" />
            </div>
            <span className="text-lg sm:text-2xl font-bold text-white tracking-tight">
              <span className="bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent drop-shadow-lg">RepriceLab</span>
              <span className="text-purple-300">.com</span>
            </span>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button 
              variant="ghost" 
              className="hidden md:inline-flex text-white hover:bg-white/10 font-medium"
              onClick={() => router.push('/features')}
            >
              Features
            </Button>
            <Button 
              variant="ghost" 
              className="hidden md:inline-flex text-white hover:bg-white/10 font-medium"
              onClick={() => router.push('/pricing')}
            >
              Pricing
            </Button>
            <Button 
              variant="ghost" 
              className="hidden sm:inline-flex text-white hover:bg-white/10 font-medium"
              onClick={() => router.push('/contact')}
            >
              Contact
            </Button>
            <Button 
              variant="ghost"
              className="text-white hover:bg-white/10 font-medium"
              onClick={() => router.push('/login')}
            >
              Login
            </Button>
            <Button 
              className="bg-white text-purple-900 hover:bg-gray-100 font-semibold px-4 sm:px-6 text-sm sm:text-base"
              onClick={() => router.push('/register')}
            >
              Sign Up Free
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left side - Hero content */}
          <div className="space-y-6 sm:space-y-8 order-2 lg:order-1">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/20">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-300 fill-yellow-300" />
              <span className="text-xs sm:text-sm font-semibold text-white">Trusted by thousands of pro sellers worldwide</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Maximize Sales and Profits with the World's #1 Repricer
            </h1>
            
            <p className="text-base sm:text-lg lg:text-xl text-purple-100 leading-relaxed">
              Automate price changes. Secure the Buy Box. Boost your sales with intelligent repricing algorithms trusted by professional Amazon sellers.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-2 sm:pt-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-2 sm:p-4 border border-white/20">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">5B+</div>
                <div className="text-xs sm:text-sm text-purple-200 mt-0.5 sm:mt-1">Price changes/week</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-2 sm:p-4 border border-white/20">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">99.9%</div>
                <div className="text-xs sm:text-sm text-purple-200 mt-0.5 sm:mt-1">Uptime guarantee</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-2 sm:p-4 border border-white/20">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">24/7</div>
                <div className="text-xs sm:text-sm text-purple-200 mt-0.5 sm:mt-1">Automation</div>
              </div>
            </div>

            {/* Features list */}
            <div className="space-y-2 sm:space-y-3 pt-2 sm:pt-4">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" />
                <span className="text-white font-medium text-sm sm:text-base">14-day free trial • No credit card required</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" />
                <span className="text-white font-medium text-sm sm:text-base">Guided setup & onboarding support</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" />
                <span className="text-white font-medium text-sm sm:text-base">Advanced Buy Box algorithms</span>
              </div>
            </div>
          </div>

          {/* Right side - Login form */}
          <div className="lg:pl-8 order-1 lg:order-2">
            <Card className="bg-white/95 backdrop-blur-xl shadow-2xl border-0">
              <CardHeader className="space-y-2 pb-4 sm:pb-6">
                <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900">Welcome Back</CardTitle>
                <CardDescription className="text-sm sm:text-base text-gray-600">
                  Sign in to access your repricing dashboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
                  {loginError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                      {loginError}
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs sm:text-sm font-semibold text-gray-700">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@repricerlab.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-10 sm:h-12 text-sm sm:text-base border-gray-300 focus:border-purple-500 focus:ring-purple-500 bg-white [&:-webkit-autofill]:!bg-white [&:-webkit-autofill:hover]:!bg-white [&:-webkit-autofill:focus]:!bg-white"
                      style={{ backgroundColor: 'white' }}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-xs sm:text-sm font-semibold text-gray-700">
                        Password
                      </Label>
                      <button type="button" className="text-xs sm:text-sm font-medium text-purple-600 hover:text-purple-700">
                        Forgot password?
                      </button>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-10 sm:h-12 text-sm sm:text-base border-gray-300 focus:border-purple-500 focus:ring-purple-500 bg-white [&:-webkit-autofill]:!bg-white [&:-webkit-autofill:hover]:!bg-white [&:-webkit-autofill:focus]:!bg-white"
                      style={{ backgroundColor: 'white' }}
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-10 sm:h-12 text-sm sm:text-base font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    disabled={isLoggingIn}
                  >
                    {isLoggingIn ? 'Signing In...' : 'Sign In to Dashboard'}
                    {!isLoggingIn && <ArrowRight className="w-5 h-5 ml-2" />}
                  </Button>

                  <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
                    </div>
                  </div>

                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full h-12 text-base font-semibold border-2 border-gray-300 hover:bg-gray-50"
                    onClick={handleGoogleLogin}
                  >
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Sign in with Google
                  </Button>

                  <div className="text-center pt-4">
                    <p className="text-sm text-gray-600">
                      Don't have an account?{' '}
                      <button 
                        type="button" 
                        className="font-semibold text-purple-600 hover:text-purple-700"
                        onClick={() => router.push('/register')}
                      >
                        Start free trial
                      </button>
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Trust badges */}
            <div className="mt-6 flex items-center justify-center space-x-8">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-400" />
                <span className="text-sm text-white font-medium">Bank-level security</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-blue-400" />
                <span className="text-sm text-white font-medium">Setup in minutes</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 sm:mb-4">
            Why Choose RepriceLab?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-purple-200">
            Powerful features to help you dominate the Buy Box
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-200">
            <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Lightning Fast</h3>
            <p className="text-purple-200">Price changes in seconds, not minutes. React instantly to competitor moves.</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-200">
            <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
              <Target className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Smart Algorithms</h3>
            <p className="text-purple-200">Advanced AI-powered repricing strategies to maximize profits.</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-200">
            <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
              <BarChart3 className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Real-time Analytics</h3>
            <p className="text-purple-200">Comprehensive insights and actionable data at your fingertips.</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-200">
            <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
              <Award className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Buy Box Winner</h3>
            <p className="text-purple-200">Proven algorithms to help you win and hold the Buy Box.</p>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20 text-center">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 border border-white/20">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">
            Start Repricing with the #1 Trusted Repricer
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-purple-200 mb-6 sm:mb-8">
            Join thousands of successful Amazon sellers using RepriceLab
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">
            <Button 
              size="lg" 
              className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg font-semibold bg-white text-purple-900 hover:bg-gray-100 shadow-xl"
              onClick={() => router.push('/pricing')}
            >
              Start Free Trial
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg font-semibold bg-white text-purple-900 hover:bg-gray-100 shadow-xl border-2 border-white"
              onClick={() => router.push('/contact')}
            >
              Book a Demo
            </Button>
          </div>
          <p className="text-xs sm:text-sm text-purple-200 mt-4 sm:mt-6">
            14-day trial • No credit card required • Guided setup
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 bg-gray-900 border-t border-white/10 mt-12 sm:mt-16 lg:mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 lg:gap-12">
            {/* Logo and Description */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center space-x-3">
                <div className="relative w-12 h-12 bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
                  <FlaskConical className="w-7 h-7 text-white relative z-10 drop-shadow-lg" />
                </div>
                <span className="text-xl font-bold text-white">RepriceLab<span className="text-purple-400">.com</span></span>
              </div>
              <p className="text-purple-300 text-sm leading-relaxed max-w-sm">
                Maximize Sales & Profits with the World's #1 Repricer
              </p>
              <div className="space-y-3">
                <p className="text-sm text-purple-400 font-semibold">Want monthly eCommerce tips, trends and news direct to your inbox?</p>
                <div className="flex gap-2">
                  <Input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 h-10"
                  />
                  <Button className="bg-purple-600 hover:bg-purple-700 h-10 px-6">
                    Subscribe
                  </Button>
                </div>
              </div>
            </div>

            {/* Product */}
            <div>
              <h3 className="text-white font-bold mb-4">Product</h3>
              <ul className="space-y-3">
                <li><a href="/product/repricing-basics" className="text-purple-300 hover:text-white text-sm transition-colors">Repricing Basics</a></li>
                <li><a href="/product/pricing-strategies" className="text-purple-300 hover:text-white text-sm transition-colors">Pricing Strategies</a></li>
                <li><a href="/product/integrations" className="text-purple-300 hover:text-white text-sm transition-colors">Integrations</a></li>
                <li><a href="/product/analytics" className="text-purple-300 hover:text-white text-sm transition-colors">Analytics</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-white font-bold mb-4">Resources</h3>
              <ul className="space-y-3">
                <li><a href="/resources/blog" className="text-purple-300 hover:text-white text-sm transition-colors">Blog</a></li>
                <li><a href="/resources/help-center" className="text-purple-300 hover:text-white text-sm transition-colors">Help Center</a></li>
                <li><a href="/resources/partners" className="text-purple-300 hover:text-white text-sm transition-colors">Partners</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-white font-bold mb-4">Company</h3>
              <ul className="space-y-3">
                <li><a href="/contact" className="text-purple-300 hover:text-white text-sm transition-colors">Contact Us</a></li>
                <li><a href="/company/affiliates" className="text-purple-300 hover:text-white text-sm transition-colors">Affiliates</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              {/* Social Media */}
              <div className="flex items-center gap-1">
                <p className="text-sm text-purple-400 font-semibold mr-3">Follow along with us</p>
                <a href="https://www.linkedin.com/company/codexia-llc/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 hover:bg-purple-600 rounded-lg flex items-center justify-center transition-colors">
                  <Linkedin className="w-5 h-5 text-purple-300" />
                </a>
                <a href="https://www.instagram.com/codexiallc?igsh=MWxkOWk4Mmx5YjRhag%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 hover:bg-purple-600 rounded-lg flex items-center justify-center transition-colors">
                  <Instagram className="w-5 h-5 text-purple-300" />
                </a>
                <a href="https://www.facebook.com/share/172YsGyYSb/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 hover:bg-purple-600 rounded-lg flex items-center justify-center transition-colors">
                  <Facebook className="w-5 h-5 text-purple-300" />
                </a>
                <a href="https://x.com/codexiallc?s=21" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 hover:bg-purple-600 rounded-lg flex items-center justify-center transition-colors">
                  <Twitter className="w-5 h-5 text-purple-300" />
                </a>
              </div>

              {/* Legal Links */}
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <a href="/legal/privacy" className="text-purple-300 hover:text-white transition-colors">Privacy Policy</a>
                <a href="/legal/terms" className="text-purple-300 hover:text-white transition-colors">Terms and Conditions</a>
                <a href="/legal/accessibility" className="text-purple-300 hover:text-white transition-colors">Accessibility Statement</a>
                <span className="text-purple-400">© Copyright 2025 Codexia LLC, All Rights Reserved</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

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
