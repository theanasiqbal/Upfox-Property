'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/lib/auth-context';
import { Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import Image from 'next/image';

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  const [generalError, setGeneralError] = useState<string>('');

  const onSubmit = async (data: LoginFormData) => {
    try {
      setGeneralError('');
      const user = await login(data.email, data.password);
      if (user.role === 'admin' || user.role === 'subadmin') {
        router.push('/admin');
      } else {
        router.push('/dashboard/user');
      }
    } catch (error) {
      setGeneralError(error instanceof Error ? error.message : 'Login failed. Please try again.');
    }
  };

  const inputClass = (hasError: boolean) =>
    `w-full pl-11 pr-4 py-3 bg-white/5 hover:bg-white/10 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/50 focus:border-accent-purple text-white placeholder:text-white/50 transition-all duration-300 ${
      hasError 
        ? 'border-red-500 bg-red-500/10' 
        : 'border-white/10 hover:border-white/20'
    }`;

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      
      {/* --- BACKGROUND IMAGE & OVERLAYS --- */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Premium Architecture"
          fill
          priority
          className="object-cover"
        />
        {/* Deep, minimal overlay focusing the user on the form */}
        <div className="absolute inset-0 bg-navy-900/85 backdrop-blur-[3px]" />
        
        {/* Subtle accent glows behind the card */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-purple/20 rounded-full blur-[120px] pointer-events-none" />
      </div>

      {/* --- TOP LEFT LOGO --- */}
      <div className="absolute top-6 left-6 md:top-8 md:left-10 z-20">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 overflow-hidden rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.2)] group-hover:scale-105 transition-all duration-300">
            <Image
              src="/upfoxx logo.png"
              alt="Upfoxx Floors"
              fill
              className="object-cover"
            />
          </div>
          <span className="text-xl font-bold text-white font-heading tracking-wide drop-shadow-md">
            Upfoxx Floors
          </span>
        </Link>
      </div>

      {/* --- CENTERED FORM CARD --- */}
      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Heading */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2 font-heading tracking-tight drop-shadow-sm">
            Welcome back
          </h1>
          <p className="text-white/70 text-sm">
            Please enter your details to sign in.
          </p>
        </div>

        {/* Error Message */}
        {generalError && (
          <div className="flex gap-3 p-4 mb-6 bg-red-500/10 border border-red-500/20 rounded-xl backdrop-blur-md animate-in fade-in zoom-in-95">
            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
            <p className="text-sm text-red-200 font-medium leading-relaxed">{generalError}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          
          {/* Email Field */}
          <div className="space-y-1.5 group">
            <label htmlFor="email" className="block text-sm font-semibold text-white/90 group-focus-within:text-accent-purple-light transition-colors mt-1">
              Email address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 group-focus-within:text-accent-purple-light transition-colors" />
              <input
                id="email"
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
                })}
                className={inputClass(!!errors.email)}
                placeholder="name@example.com"
              />
            </div>
            {errors.email && (
              <p className="text-red-400 text-xs font-medium mt-1 animate-in slide-in-from-top-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-1.5 group">
            <label htmlFor="password" className="block text-sm font-semibold text-white/90 group-focus-within:text-accent-purple-light transition-colors mt-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 group-focus-within:text-accent-purple-light transition-colors" />
              <input
                id="password"
                type="password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Minimum 6 characters required' },
                })}
                className={inputClass(!!errors.password)}
                placeholder="••••••••"
              />
            </div>
            {errors.password && (
              <p className="text-red-400 text-xs font-medium mt-1 animate-in slide-in-from-top-1">{errors.password.message}</p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 peer appearance-none rounded border-2 border-white/20 bg-white/5 checked:border-accent-purple checked:bg-accent-purple transition-all duration-200 cursor-pointer" 
                />
                <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <span className="text-sm text-white/70 group-hover:text-white transition-colors">
                Remember me
              </span>
            </label>
            
            <a href="#" className="text-sm font-semibold text-accent-cyan hover:text-white transition-colors">
              Forgot password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full relative group overflow-hidden py-3.5 mt-2 btn-gradient rounded-xl text-base font-bold shadow-lg shadow-black/20 hover:shadow-accent-purple/30 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 border border-white/10"
          >
            <span className="relative z-10 flex items-center justify-center gap-2 text-white">
              {isLoading ? 'Signing in...' : 'Sign In'}
              {!isLoading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </span>
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-white/70 text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="font-bold text-white hover:text-accent-cyan transition-colors">
              Sign up for free
            </Link>
          </p>
        </div>

      </div>
    
    </div>
  );
}
