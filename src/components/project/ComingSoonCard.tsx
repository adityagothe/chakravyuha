'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { MaterialIcon } from '../ui/MaterialIcon';

interface ComingSoonCardProps {
  title: string;
  subtitle: string;
  className?: string;
}

export function ComingSoonCard({ title, subtitle, className }: ComingSoonCardProps) {
  return (
    <div
      className={cn(
        'group relative rounded-xl overflow-hidden transition-all duration-700',
        'bg-surface-container border border-dashed border-outline-variant/20',
        'hover:border-primary/30 min-h-[200px]',
        'flex items-center justify-center',
        className
      )}
    >
      {/* Animated scan line */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <div
          className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent"
          style={{
            animation: 'scanline 3s linear infinite',
          }}
        />
      </div>

      {/* Background noise texture */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 text-center px-8 py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-container-high border border-outline-variant/20 mb-6 group-hover:border-primary/20 transition-colors duration-500">
          <MaterialIcon name="lock" size="2xl" className="text-neutral-600 group-hover:text-primary/60 transition-colors duration-500" />
        </div>

        <h3 className="font-headline text-2xl font-bold tracking-tight text-neutral-500 group-hover:text-neutral-300 transition-colors duration-500 mb-2">
          {title}
        </h3>
        <p className="font-label text-xs uppercase tracking-[0.3em] text-neutral-600 group-hover:text-primary/50 transition-colors duration-500">
          {subtitle}
        </p>

        {/* Glitch decorators */}
        <div className="flex items-center justify-center gap-1 mt-6 opacity-30 group-hover:opacity-60 transition-opacity">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="w-1 h-1 rounded-full bg-neutral-600 group-hover:bg-primary/50 transition-colors"
              style={{ animationDelay: `${i * 200}ms` }}
            />
          ))}
        </div>
      </div>

    </div>
  );
}
