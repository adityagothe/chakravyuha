import React from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface OutlineButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  href?: string;
  size?: 'md' | 'lg';
}

export function OutlineButton({ label, href, size = 'md', className, ...props }: OutlineButtonProps) {
  const baseClasses = cn(
    'border border-primary/20 text-primary rounded font-label font-bold uppercase tracking-widest transition-all',
    'hover:bg-primary/5 hover:border-primary/100',
    'active:scale-95',
    size === 'md' ? 'px-6 py-2 text-sm' : 'px-10 py-4 text-base',
    className
  );

  if (href) {
    return (
      <Link href={href} className={baseClasses}>
        {label}
      </Link>
    );
  }

  return (
    <button className={baseClasses} {...props}>
      {label}
    </button>
  );
}
