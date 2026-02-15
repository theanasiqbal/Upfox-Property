'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/lib/auth-context';
import { User, Mail, Phone, Lock, AlertCircle, Home } from 'lucide-react';

interface SignupFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

export default function SignupPage() {
  const router = useRouter();
  const { signup, isLoading } = useAuth();
  const { register, handleSubmit, formState: { errors }, watch, setError } = useForm<SignupFormData>();
  const [generalError, setGeneralError] = useState<string>('');

  const onSubmit = async (data: SignupFormData) => {
    try {
      setGeneralError('');
      if (!data.terms) { setError('terms', { message: 'You must agree to the terms' }); return; }
      if (data.password !== data.confirmPassword) { setError('confirmPassword', { message: 'Passwords do not match' }); return; }
      await signup(data.name, data.email, data.phone, data.password);
      router.push('/dashboard/seller');
    } catch (error) {
      setGeneralError(error instanceof Error ? error.message : 'Signup failed. Please try again.');
    }
  };

  const inputClass = (hasError: boolean) =>
    `w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-white/5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/30 focus:border-accent-purple text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all ${hasError ? 'border-red-500 bg-red-50 dark:bg-red-500/5' : 'border-gray-200 dark:border-white/10'
    }`;

  return (
    <div className="h-screen bg-gray-50 dark:bg-navy-800 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-accent-purple/10 dark:bg-accent-purple/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-purple/5 dark:bg-accent-cyan/10 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />
      <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-accent-purple/5 dark:bg-accent-purple/10 rounded-full blur-2xl" />

      {/* Dark mode particles */}
      <div className="hidden dark:block particles-container">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="particle" style={{ left: `${Math.random() * 100}%`, animationDuration: `${12 + Math.random() * 18}s`, animationDelay: `${Math.random() * 8}s` }} />
        ))}
      </div>

      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-9 h-9 bg-gradient-to-br from-accent-purple to-accent-purple-dark rounded-xl flex items-center justify-center shadow-lg shadow-accent-purple/25">
            <Home className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">Upfoxx</span>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-0.5">Create an account</h1>
        <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-4">Join our property marketplace</p>

        {/* Error */}
        {generalError && (
          <div className="flex gap-2.5 p-3 mb-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl">
            <AlertCircle className="w-4 h-4 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 dark:text-red-300">{generalError}</p>
          </div>
        )}

        {/* Form Card */}
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-white/5 dark:backdrop-blur-2xl rounded-2xl shadow-lg dark:shadow-none border border-gray-100 dark:border-white/10 p-5 space-y-3">
          {/* Name & Phone row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="name" className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                <input
                  id="name"
                  type="text"
                  {...register('name', { required: 'Required' })}
                  className={inputClass(!!errors.name)}
                  placeholder="John Doe"
                />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-0.5">{errors.name.message}</p>}
            </div>
            <div>
              <label htmlFor="phone" className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                <input
                  id="phone"
                  type="tel"
                  {...register('phone', { required: 'Required' })}
                  className={inputClass(!!errors.phone)}
                  placeholder="+1 555 1234"
                />
              </div>
              {errors.phone && <p className="text-red-500 text-xs mt-0.5">{errors.phone.message}</p>}
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2 w-4 h-4 text-gray-400 dark:text-gray-500" />
              <input
                id="email"
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
                })}
                className={inputClass(!!errors.email)}
                placeholder="you@example.com"
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-0.5">{errors.email.message}</p>}
          </div>

          {/* Password row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="password" className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                <input
                  id="password"
                  type="password"
                  {...register('password', {
                    required: 'Required',
                    minLength: { value: 8, message: 'Min 8 chars' },
                  })}
                  className={inputClass(!!errors.password)}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-0.5">{errors.password.message}</p>}
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Confirm</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                <input
                  id="confirmPassword"
                  type="password"
                  {...register('confirmPassword', { required: 'Required' })}
                  className={inputClass(!!errors.confirmPassword)}
                  placeholder="••••••••"
                />
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-0.5">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-start gap-2">
            <input
              id="terms"
              type="checkbox"
              {...register('terms')}
              className="w-3.5 h-3.5 mt-0.5 text-accent-purple rounded border-gray-300 dark:border-white/20 dark:bg-white/5"
            />
            <label htmlFor="terms" className="text-xs text-gray-500 dark:text-gray-400 leading-tight">
              I agree to the{' '}
              <a href="#" className="text-accent-purple font-medium">Terms</a> and{' '}
              <a href="#" className="text-accent-purple font-medium">Privacy Policy</a>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 btn-gradient text-sm font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        {/* Footer links */}
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-accent-purple hover:text-accent-purple-dark font-semibold transition-colors">
            Sign in
          </Link>
        </p>
        <div className="text-center mt-2">
          <Link href="/" className="text-xs text-gray-400 dark:text-gray-500 hover:text-accent-purple transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
