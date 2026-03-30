import React from 'react';
import { cn } from '@/lib/utils';
import { MaterialIcon } from './MaterialIcon';

interface ImagePlaceholderProps {
  label?: string;
  icon?: string;
  accentColor?: string;
  className?: string;
}

export function ImagePlaceholder({
  label = 'Asset Missing',
  icon = 'image',
  accentColor = '#353535',
  className,
}: ImagePlaceholderProps) {
  return (
    <div
      className={cn(
        'w-full h-full flex flex-col items-center justify-center bg-surface-container-low border border-outline-variant/20 group-hover:border-primary/50 transition-colors',
        className
      )}
      style={{
        background: `radial-gradient(circle at center, ${accentColor}10 0%, transparent 70%)`
      }}
    >
      <MaterialIcon name={icon} size="4xl" className="text-neutral-500 group-hover:text-primary transition-colors opacity-50 mb-4" />
      <span className="font-label text-xs uppercase tracking-widest text-neutral-600 group-hover:text-primary/70 transition-colors">
        {label}
      </span>
    </div>
  );
}
