import React from 'react';
import { cn } from '@/lib/utils';
import { FadeIn } from './FadeIn';

interface StatCardProps {
  value: string;
  label: string;
  description: string;
  className?: string;
  span?: 1 | 2;
  delay?: number;
}

export function StatCard({ value, label, description, className, span = 1, delay = 0 }: StatCardProps) {
  return (
    <FadeIn delay={delay} className={cn(
      'p-10 bg-surface-container-low border border-outline-variant/10 hover-lift flex flex-col justify-start h-full',
      span === 2 && 'sm:col-span-2',
      className
    )}>
      <div className="text-primary text-5xl font-headline italic mb-4">{value}</div>
      <h5 className="font-label font-bold uppercase tracking-widest text-xs mb-4">{label}</h5>
      <p className="text-on-surface-variant max-w-md">{description}</p>
    </FadeIn>
  );
}
