'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MOCK_USERS, getPropertiesBySeller } from '@/lib/data';
import { CheckCircle, Shield, Trash2 } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState(MOCK_USERS);

  const handleDelete = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter((u) => u.id !== userId));
    }
  };

  const handleToggleAdmin = (userId: string) => {
    setUsers(
      users.map((u) =>
        u.id === userId
          ? { ...u, role: u.role === 'admin' ? 'user' : 'admin' }
          : u
      )
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Management</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">{users.length} total users</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-white/5 dark:backdrop-blur-xl p-6 rounded-lg shadow-sm border border-gray-200 dark:border-white/10">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Users</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{users.length}</p>
        </div>
        <div className="bg-white dark:bg-white/5 dark:backdrop-blur-xl p-6 rounded-lg shadow-sm border border-gray-200 dark:border-white/10">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Active Sellers</p>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {users.filter((u) => getPropertiesBySeller(u.id).length > 0).length}
          </p>
        </div>
        <div className="bg-white dark:bg-white/5 dark:backdrop-blur-xl p-6 rounded-lg shadow-sm border border-gray-200 dark:border-white/10">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Admin Users</p>
          <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
            {users.filter((u) => u.role === 'admin').length}
          </p>
        </div>
      </div>

      {/* Users Table */}
      {users.length > 0 ? (
        <div className="bg-white dark:bg-white/5 dark:backdrop-blur-xl rounded-lg shadow-sm border border-gray-200 dark:border-white/10 overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">Properties</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">Joined</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-white/5">
                {users.map((user) => {
                  const userProperties = getPropertiesBySeller(user.id);
                  return (
                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{user.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{user.phone}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${user.role === 'admin'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-500/10 dark:text-amber-400'
                          : 'bg-gray-100 text-gray-800 dark:bg-white/10 dark:text-gray-300'
                          }`}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                        {userProperties.length}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-xs font-medium">Verified</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                        {new Date(user.registrationDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleAdmin(user.id)}
                            className={`p-2 rounded-lg transition-colors ${user.role === 'admin'
                              ? 'text-amber-600 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-500/10'
                              : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-white/5'
                              }`}
                            title={user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                          >
                            <Shield className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-gray-100 dark:divide-white/5">
            {users.map((user) => {
              const userProperties = getPropertiesBySeller(user.id);
              return (
                <div key={user.id} className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{user.name}</h3>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-medium ${user.role === 'admin'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-500/10 dark:text-amber-400'
                      : 'bg-gray-100 text-gray-800 dark:bg-white/10 dark:text-gray-300'
                      }`}>
                      {user.role.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                      Verified
                    </div>
                    <div className="text-right">
                      {userProperties.length} Properties
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-50 dark:border-white/5">
                    <button
                      onClick={() => handleToggleAdmin(user.id)}
                      className="p-2 text-amber-600 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-sm flex items-center gap-1"
                    >
                      <Shield className="w-4 h-4" />
                      {user.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="p-2 text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg"
                      title="Delete User"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-12 text-center">
          <p className="text-gray-600">No users found.</p>
        </div>
      )}
    </div>
  );
}
