import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  border?: boolean;
  hover?: boolean;
}

export function GlassCard({ children, className, border = true, hover = false, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        'glass-panel rounded-xl',
        border && 'border border-outline-variant/10',
        hover && 'hover:bg-surface-container-high transition-colors duration-300',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
