import React from 'react';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  label: string;
  title: string;
  description?: string;
  className?: string;
  divider?: 'left' | 'right' | 'none';
}

export function SectionHeader({ label, title, description, className, divider = 'none' }: SectionHeaderProps) {
  return (
    <div className={cn('flex flex-col md:flex-row justify-between items-start md:items-end gap-8', className)}>
      <div>
        <span className="font-label text-primary uppercase tracking-[0.3em] text-xs mb-4 block">{label}</span>
        <div className="flex items-center gap-4">
          <h2 className="font-headline text-5xl font-bold tracking-tight">{title}</h2>
          {divider === 'right' && (
            <div className="h-[1px] flex-grow bg-gradient-to-r from-secondary-container/50 to-transparent w-32 md:w-64"></div>
          )}
        </div>
      </div>
      {description && (
        <p className="font-body text-neutral-400 max-w-md md:text-right">
          {description}
        </p>
      )}
    </div>
  );
}
