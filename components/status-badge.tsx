interface StatusBadgeProps {
  status: 'pending' | 'approved' | 'rejected' | 'archived' | string;
}

const statusStyles: Record<string, string> = {
  pending: 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30',
  approved: 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/30',
  rejected: 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/30',
  archived: 'bg-gray-100 dark:bg-gray-500/20 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-500/30',
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const style = statusStyles[status] || statusStyles.archived;

  return (
    <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold capitalize rounded-full border ${style}`}>
      {status}
    </span>
  );
}
