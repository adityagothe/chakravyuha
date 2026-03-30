import React from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  href?: string;
  size?: 'md' | 'lg';
}

export function GradientButton({ label, href, size = 'md', className, ...props }: GradientButtonProps) {
  const baseClasses = cn(
    'gold-gradient-bg text-on-primary rounded font-label font-bold uppercase tracking-widest transition-all',
    'hover:translate-y-[-2px] hover:shadow-[0_10px_30px_-10px_rgba(233,195,73,0.3)]',
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
