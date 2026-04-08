'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface AccordionItem {
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
}

export function Accordion({ items, className }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className={cn('divide-y divide-outline-variant/10', className)}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={index} className="group">
            <button
              onClick={() => toggle(index)}
              aria-expanded={isOpen}
              className="w-full flex items-start justify-between gap-6 py-7 text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-primary/50 rounded"
            >
              <span className={cn(
                'font-headline text-xl md:text-2xl leading-snug transition-colors duration-300',
                isOpen ? 'text-primary' : 'text-on-surface group-hover:text-on-surface/80'
              )}>
                {item.question}
              </span>
              <span className={cn(
                'material-symbols-outlined text-primary mt-1 shrink-0 transition-transform duration-400 ease-out',
                isOpen ? 'rotate-45' : 'rotate-0'
              )}>
                add
              </span>
            </button>
            <div
              style={{
                maxHeight: isOpen ? '600px' : '0px',
                opacity: isOpen ? 1 : 0,
                overflow: 'hidden',
                transition: 'max-height 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease',
              }}
            >
              <p className="font-body text-on-surface-variant leading-relaxed text-lg pb-7 pr-10">
                {item.answer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
