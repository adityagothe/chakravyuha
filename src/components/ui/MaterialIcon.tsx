import React from 'react';
import { cn } from '@/lib/utils';

interface MaterialIconProps {
  name: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
}

const sizeMap = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
};

export function MaterialIcon({ name, className, size = 'md' }: MaterialIconProps) {
  return (
    <span className={cn('material-symbols-outlined', sizeMap[size], className)} data-icon={name}>
      {name}
    </span>
  );
}
