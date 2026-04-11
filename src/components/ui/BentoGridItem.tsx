import React from 'react';
import { cn } from '@/lib/utils';
import { FadeIn } from './FadeIn';

interface BentoGridItemProps {
  title: string;
  subtitle: string;
  imageSrc: string;
  imageAlt: string;
  span?: 1 | 2;
  aspectRatio?: 'video' | 'square';
  className?: string;
  delay?: number;
}

export function BentoGridItem({ 
  title, 
  subtitle, 
  imageSrc, 
  imageAlt, 
  span = 1, 
  aspectRatio = 'square', 
  className,
  delay = 0
}: BentoGridItemProps) {
  return (
    <FadeIn delay={delay} className={cn(
      'bg-surface-container-high rounded-sm p-8 flex flex-col justify-end group overflow-hidden relative cursor-pointer',
      span === 2 && 'md:col-span-2',
      aspectRatio === 'video' ? 'aspect-video w-full' : 'aspect-square w-full',
      className
    )}>
      {/* Background with placeholder overlay if image fails or before loading */}
      <div className="absolute inset-0 bg-surface-container-low z-0" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img 
        src={imageSrc} 
        alt={imageAlt}
        className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale group-hover:grayscale-0 group-hover:opacity-50 group-hover:scale-105 transition-all duration-1000 z-0"
        loading="lazy"
        onError={(e) => {
          // Hide broken image links gracefully
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
      {/* Gradient overlay to ensure text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-surface-container-highest via-surface-container-highest/50 to-transparent opacity-80 z-[1] pointer-events-none group-hover:opacity-90 transition-opacity duration-500" />
      <div className="relative z-10 transform transition-transform duration-500 group-hover:-translate-y-2">
        <h4 className="font-headline text-3xl text-primary mb-2 drop-shadow-md">{title}</h4>
        <p className="text-on-surface-variant font-body drop-shadow-sm">{subtitle}</p>
      </div>
    </FadeIn>
  );
}
