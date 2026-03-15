'use client';

import { useState, useEffect } from 'react';
import { X, UserPlus, Mail, Lock, Phone, User as UserIcon } from 'lucide-react';
import { toast } from 'sonner';

interface AdminAddUserModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: (newUser: any) => void;
    isSubadmin?: boolean;
}

export function AdminAddUserModal({ open, onClose, onSuccess, isSubadmin }: AdminAddUserModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        role: 'subadmin' as 'admin' | 'subadmin' | 'user',
    });

    useEffect(() => {
        if (open) {
            setFormData(prev => ({ ...prev, role: isSubadmin ? 'user' : 'subadmin' }));
        }
    }, [open, isSubadmin]);

    if (!open) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to create user');

            toast.success('User created successfully');
            onSuccess(data.user);
            onClose();
            // Reset form
            setFormData({ name: '', email: '', password: '', phone: '', role: isSubadmin ? 'user' : 'subadmin' });
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative z-10 w-full max-w-md mx-4 bg-white dark:bg-navy-800 rounded-2xl shadow-2xl dark:shadow-none border border-gray-100 dark:border-white/10 overflow-hidden transform transition-all">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-accent-purple/10 dark:bg-accent-purple/20 rounded-xl flex items-center justify-center">
                            <UserPlus className="w-5 h-5 text-accent-purple dark:text-accent-purple" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Add New User</h2>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Create an admin or regular user</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X className="w-4 h-4 text-gray-500" />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        {/* Name */}
                        <div>
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Full Name</label>
                            <div className="relative">
                                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/50 dark:text-white"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/50 dark:text-white"
                                    placeholder="john@example.com"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/50 dark:text-white"
                                    placeholder="••••••••"
                                />
                            </div>
                            <p className="text-[10px] text-gray-500 mt-1">Must be at least 6 characters.</p>
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Phone Number (Optional)</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/50 dark:text-white"
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>
                        </div>

                        {/* Role selection */}
                        <div>
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Account Role</label>
                            <div className={`grid gap-3 ${isSubadmin ? 'grid-cols-1' : 'grid-cols-3'}`}>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'user' })}
                                    className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${formData.role === 'user'
                                            ? 'bg-accent-purple/10 border-accent-purple text-accent-purple dark:text-accent-purple-light'
                                            : 'bg-gray-50 border-gray-200 text-gray-600 dark:bg-white/5 dark:border-white/10 dark:text-gray-400 hover:border-accent-purple/50'
                                        }`}
                                >
                                    Regular User
                                </button>
                                {!isSubadmin && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, role: 'subadmin' })}
                                            className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${formData.role === 'subadmin'
                                                    ? 'bg-blue-100 border-blue-400 text-blue-800 dark:bg-blue-500/20 dark:border-blue-500/50 dark:text-blue-400'
                                                    : 'bg-gray-50 border-gray-200 text-gray-600 dark:bg-white/5 dark:border-white/10 dark:text-gray-400 hover:border-blue-500/50'
                                                }`}
                                        >
                                            Sub-Admin
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, role: 'admin' })}
                                            className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${formData.role === 'admin'
                                                    ? 'bg-amber-100 border-amber-400 text-amber-800 dark:bg-amber-500/20 dark:border-amber-500/50 dark:text-amber-400'
                                                    : 'bg-gray-50 border-gray-200 text-gray-600 dark:bg-white/5 dark:border-white/10 dark:text-gray-400 hover:border-amber-500/50'
                                                }`}
                                        >
                                            Administrator
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 pt-0 flex gap-3 mt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 px-4 py-2.5 bg-accent-purple hover:bg-accent-purple/90 disabled:opacity-70 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <UserPlus className="w-4 h-4" />
                                    Create User
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
