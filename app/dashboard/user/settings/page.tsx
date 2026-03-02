'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/lib/auth-context';
import { MOCK_USERS } from '@/lib/data';
import { User, Lock, Camera } from 'lucide-react';

interface SettingsFormData {
  name: string;
  email: string;
  phone: string;
  bio: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function SettingsPage() {
  const { currentUser } = useAuth();

  // Use fallback user if currentUser is null
  const user = currentUser || MOCK_USERS[0];

  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const { register, handleSubmit, formState: { errors }, watch } = useForm<SettingsFormData>({
    defaultValues: {
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      bio: user.bio || '',
    },
  });

  const newPassword = watch('newPassword');

  const onProfileSubmit = async (data: SettingsFormData) => {
    // Mock submission
    console.log('Profile updated:', data);
    setSuccessMessage('Profile updated successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const onPasswordSubmit = async (data: SettingsFormData) => {
    // Mock submission
    console.log('Password updated:', data);
    setSuccessMessage('Password updated successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Account Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your profile and security settings</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200 dark:border-white/10 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'profile'
            ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400'
            : 'border-transparent text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
        >
          <User className="w-4 h-4 inline-block mr-2" />
          Profile
        </button>
        <button
          onClick={() => setActiveTab('password')}
          className={`px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'password'
            ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400'
            : 'border-transparent text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
        >
          <Lock className="w-4 h-4 inline-block mr-2" />
          Password
        </button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="p-4 bg-green-50 dark:bg-green-500/10 border border-green-300 dark:border-green-500/20 rounded-lg text-green-800 dark:text-green-400">
          {successMessage}
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSubmit(onProfileSubmit)} className="bg-white dark:bg-white/5 dark:backdrop-blur-xl p-8 rounded-lg shadow-sm border border-gray-200 dark:border-white/10 space-y-6">
          {/* Avatar */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Profile Picture</label>
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <button type="button" className="px-4 py-2 border border-gray-300 dark:border-white/20 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 font-medium transition-colors flex items-center gap-2">
                <Camera className="w-4 h-4" />
                Upload Photo
              </button>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
            <input
              type="text"
              {...register('name', { required: 'Name is required' })}
              className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-navy-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-white/20'
                }`}
            />
            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
          </div>

          {/* Email (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
            <input
              type="email"
              {...register('email')}
              disabled
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-white/10 rounded-lg bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-gray-400 cursor-not-allowed"
            />
            <p className="text-xs text-gray-600 dark:text-gray-500 mt-1">Email cannot be changed</p>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
            <input
              type="tel"
              {...register('phone')}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-navy-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</label>
            <textarea
              {...register('bio')}
              rows={4}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-navy-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Tell buyers about yourself..."
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Save Changes
          </button>
        </form>
      )}

      {/* Password Tab */}
      {activeTab === 'password' && (
        <form onSubmit={handleSubmit(onPasswordSubmit)} className="bg-white dark:bg-white/5 dark:backdrop-blur-xl p-8 rounded-lg shadow-sm border border-gray-200 dark:border-white/10 space-y-6 max-w-md">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Password</label>
            <input
              type="password"
              {...register('currentPassword', { required: 'Current password is required' })}
              className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-navy-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.currentPassword ? 'border-red-500' : 'border-gray-300 dark:border-white/20'
                }`}
            />
            {errors.currentPassword && <p className="text-red-600 text-sm mt-1">{errors.currentPassword.message}</p>}
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Password</label>
            <input
              type="password"
              {...register('newPassword', {
                required: 'New password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
              })}
              className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-navy-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.newPassword ? 'border-red-500' : 'border-gray-300 dark:border-white/20'
                }`}
            />
            {errors.newPassword && <p className="text-red-600 text-sm mt-1">{errors.newPassword.message}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirm Password</label>
            <input
              type="password"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) => value === newPassword || 'Passwords do not match',
              })}
              className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-navy-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-white/20'
                }`}
            />
            {errors.confirmPassword && <p className="text-red-600 text-sm mt-1">{errors.confirmPassword.message}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Update Password
          </button>
        </form>
      )}
    </div>
  );
}
