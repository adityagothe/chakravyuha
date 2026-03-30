'use client';

import { useState, useEffect } from 'react';

interface UseScrollSpyProps {
  targets: string[];
  rootMargin?: string;
}

export function useScrollSpy({ targets, rootMargin = '-50% 0px' }: UseScrollSpyProps) {
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin }
    );

    targets.forEach((target) => {
      const element = document.getElementById(target);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      targets.forEach((target) => {
        const element = document.getElementById(target);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [targets, rootMargin]);

  return activeSection;
}
