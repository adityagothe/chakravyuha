import React from 'react';
import { cn } from '@/lib/utils';
import { ProjectStatus } from '@/types/project';

interface StatusBadgeProps {
  status: ProjectStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'live':
        return { label: 'Live', dot: 'bg-green-500', bg: 'bg-green-500/10', text: 'text-green-400' };
      case 'beta':
        return { label: 'Beta', dot: 'bg-primary', bg: 'bg-primary/10', text: 'text-primary' };
      case 'coming_soon':
        return { label: 'Coming Soon', dot: 'bg-neutral-500', bg: 'bg-neutral-500/10', text: 'text-neutral-400' };
      case 'archived':
        return { label: 'Archived', dot: 'bg-red-500', bg: 'bg-red-500/10', text: 'text-red-400' };
      default:
        return { label: 'Unknown', dot: 'bg-neutral-500', bg: 'bg-neutral-500/10', text: 'text-neutral-400' };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={cn('inline-flex items-center gap-2 px-3 py-1 rounded-full', config.bg, className)}>
      <span className={cn('w-2 h-2 rounded-full', config.dot)} />
      <span className={cn('font-label text-[10px] uppercase tracking-widest font-bold', config.text)}>
        {config.label}
      </span>
    </div>
  );
}
