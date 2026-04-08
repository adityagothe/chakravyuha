import React from 'react';
import { cn } from '@/lib/utils';
import { FadeIn } from './FadeIn';

interface FeatureBlockProps {
  title: string;
  description: string;
  className?: string;
  delay?: number;
}

export function FeatureBlock({ title, description, className, delay = 0 }: FeatureBlockProps) {
  return (
    <FadeIn delay={delay} direction="up" className={cn('space-y-4 hover:translate-x-2 transition-transform duration-300', className)}>
      <div className="w-12 h-px bg-secondary mb-6"></div>
      <h4 className="font-headline text-2xl italic leading-tight text-on-surface">{title}</h4>
      <p className="text-on-surface-variant leading-relaxed font-body">{description}</p>
    </FadeIn>
  );
}
