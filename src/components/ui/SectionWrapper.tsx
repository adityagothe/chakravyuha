import React from 'react';
import { cn } from '@/lib/utils';

interface SectionWrapperProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  bg?: 'transparent' | 'surface' | 'surface-container' | 'surface-container-low' | 'surface-container-lowest';
  padding?: 'default' | 'dense' | 'hero' | 'none';
}

const paddingMap = {
  default: 'py-32 px-6 md:px-12',
  dense: 'py-16 px-6 md:px-12',
  hero: 'pt-48 pb-32 px-6 md:px-12',
  none: '',
};

const bgMap = {
  transparent: 'bg-transparent',
  surface: 'bg-surface',
  'surface-container': 'bg-surface-container',
  'surface-container-low': 'bg-surface-container-low',
  'surface-container-lowest': 'bg-surface-container-lowest',
};

export function SectionWrapper({
  children,
  id,
  className,
  bg = 'transparent',
  padding = 'default',
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={cn(
        'relative',
        bgMap[bg],
        paddingMap[padding],
        className
      )}
    >
      {children}
    </section>
  );
}
