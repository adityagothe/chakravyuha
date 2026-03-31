'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { useInView } from '@/hooks/useInView';

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // ms
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  duration?: number; // ms
  threshold?: number;
}

export function FadeIn({
  children,
  className,
  delay = 0,
  direction = 'up',
  duration = 600,
  threshold = 0.12,
}: FadeInProps) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold });

  const translateMap = {
    up: 'translateY(28px)',
    down: 'translateY(-28px)',
    left: 'translateX(28px)',
    right: 'translateX(-28px)',
    none: 'none',
  };

  return (
    <div
      ref={ref}
      className={cn(className)}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'none' : translateMap[direction],
        transition: `opacity ${duration}ms cubic-bezier(0.25,0.46,0.45,0.94) ${delay}ms, transform ${duration}ms cubic-bezier(0.25,0.46,0.45,0.94) ${delay}ms`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
}
