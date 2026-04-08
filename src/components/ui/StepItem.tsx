import React from 'react';
import { cn } from '@/lib/utils';
import { FadeIn } from './FadeIn';

interface StepItemProps {
  number: string;
  title: string;
  description: string;
  className?: string;
  delay?: number;
}

export function StepItem({ number, title, description, className, delay = 0 }: StepItemProps) {
  return (
    <FadeIn delay={delay} className={cn('flex-1 z-10 block group', className)}>
      <div className="w-20 h-20 bg-surface-container-high flex items-center justify-center rounded-sm border border-primary/20 mb-8 transition-all duration-300 group-hover:bg-primary/10 group-hover:border-primary/50 group-hover:scale-105">
        <span className="font-label text-primary text-2xl font-bold">{number}</span>
      </div>
      <h4 className="font-headline text-2xl mb-4 italic text-on-surface group-hover:text-primary transition-colors">{title}</h4>
      <p className="text-on-surface-variant font-body">{description}</p>
    </FadeIn>
  );
}
