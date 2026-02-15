'use client';

import { LucideIcon } from 'lucide-react';

interface DashboardStatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
    isPositive: boolean;
  };
  highlighted?: boolean;
}

export function DashboardStatsCard({
  title,
  value,
  icon: Icon,
  trend,
  highlighted = false,
}: DashboardStatsCardProps) {
  return (
    <div className={`bg-white dark:bg-white/5 dark:backdrop-blur-xl rounded-2xl p-4 md:p-6 border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-accent-purple/10 ${highlighted ? 'border-accent-purple/30 dark:border-accent-purple/50' : 'border-gray-100 dark:border-white/10'
      }`}>
      <div className="flex items-start justify-between mb-3 md:mb-4">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-accent-purple to-accent-purple-dark flex items-center justify-center">
          <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </div>
        {trend && (
          <span className={`px-2 md:px-2.5 py-0.5 md:py-1 text-[10px] md:text-xs font-semibold rounded-full ${trend.isPositive
            ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400'
            : 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400'
            }`}>
            {trend.isPositive ? '+' : ''}{trend.value}%
          </span>
        )}
      </div>
      <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-1">{value}</p>
      <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 truncate">{title}</p>
    </div>
  );
}
