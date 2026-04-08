'use client';

import React, { useEffect, useState } from 'react';
import { SearchStep } from '@/types/local-growth';
import { cn } from '@/lib/utils';

interface SearchTerminalProps {
  steps: SearchStep[];
  onComplete: () => void;
}

export function SearchTerminal({ steps: initialSteps, onComplete }: SearchTerminalProps) {
  const [steps, setSteps] = useState<SearchStep[]>(() => 
    initialSteps.map(s => ({ ...s, status: 'pending', lines: s.lines.map(l => ({ ...l, revealed: false })) }))
  );
  
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [activeLineIdx, setActiveLineIdx] = useState(-1);

  // Animation sequence
  useEffect(() => {
    if (activeStepIdx >= steps.length) {
      onComplete();
      return;
    }

    const currentStep = steps[activeStepIdx];
    
    // Start step
    if (activeLineIdx === -1) {
      const timer = setTimeout(() => {
        setSteps(prev => {
          const next = [...prev];
          next[activeStepIdx] = { ...next[activeStepIdx], status: 'running' };
          return next;
        });
        setActiveLineIdx(0);
      }, 500); // Wait before first line
      return () => clearTimeout(timer);
    }

    // Reveal lines
    if (activeLineIdx < currentStep.lines.length) {
      const timer = setTimeout(() => {
        setSteps(prev => {
          const next = [...prev];
          const lines = [...next[activeStepIdx].lines];
          lines[activeLineIdx] = { ...lines[activeLineIdx], revealed: true };
          next[activeStepIdx] = { ...next[activeStepIdx], lines };
          return next;
        });
        setActiveLineIdx(prev => prev + 1);
      }, 600); // 600ms per line
      return () => clearTimeout(timer);
    }

    // Step done
    if (activeLineIdx >= currentStep.lines.length) {
      const timer = setTimeout(() => {
        setSteps(prev => {
          const next = [...prev];
          next[activeStepIdx] = { ...next[activeStepIdx], status: 'done' };
          return next;
        });
        setActiveStepIdx(prev => prev + 1);
        setActiveLineIdx(-1);
      }, 800); // pause before next step
      return () => clearTimeout(timer);
    }

  }, [activeStepIdx, activeLineIdx, steps, onComplete]);

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl overflow-hidden font-mono text-sm">
      <div className="bg-surface-container-low px-4 py-2 border-b border-outline-variant/10 flex items-center justify-between">
        <div className="flex gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-surface-container-highest"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-surface-container-highest"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-surface-container-highest"></div>
        </div>
        <div className="text-on-surface-variant/40 text-xs">system_scan.exe</div>
      </div>
      
      <div className="p-4 md:p-6 space-y-6 h-[400px] overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
        {steps.map((step, sIdx) => {
          if (sIdx > activeStepIdx) return null; // Future steps hidden
          
          return (
            <div key={step.id} className="space-y-2 animate-fade-in">
              <div className="flex items-center gap-2 font-bold select-none">
                {step.status === 'done' && <span className="text-primary material-symbols-outlined text-sm">check_circle</span>}
                {step.status === 'running' && <span className="text-secondary material-symbols-outlined text-sm animate-spin">refresh</span>}
                {step.status === 'pending' && <span className="text-on-surface-variant/40 material-symbols-outlined text-sm">circle</span>}
                
                <span className={step.status === 'pending' ? 'text-on-surface-variant/40' : 'text-on-surface'}>
                  [{sIdx + 1}/{steps.length}] {step.title}...
                </span>
              </div>
              
              <div className="pl-6 space-y-1 text-on-surface-variant/70 border-l border-outline-variant/10 ml-1.5 flex flex-col">
                {step.lines.map((line, lIdx) => {
                  if (!line.revealed) return null;
                  
                  const isLastLine = lIdx === step.lines.length - 1;
                  
                  return (
                    <div key={lIdx} className="flex gap-2 items-start opacity-0 animate-page-in" style={{ animationDelay: '0ms' }}>
                      <span className="text-outline-variant/40 select-none shrink-0">{isLastLine ? '└──' : '├──'}</span>
                      {line.type === 'error' && <span className="text-error shrink-0 mt-0.5">❌</span>}
                      {line.type === 'warning' && <span className="text-secondary shrink-0 mt-0.5">⚠️</span>}
                      {line.type === 'success' && <span className="text-green-500 shrink-0 mt-0.5">✅</span>}
                      <span className={cn(
                        line.type === 'error' ? 'text-error' : '',
                        line.type === 'warning' ? 'text-secondary' : '',
                        line.type === 'success' ? 'text-green-500' : ''
                      )}>{line.text}</span>
                    </div>
                  );
                })}
                {step.status === 'running' && (
                  <div className="flex gap-2 items-start mt-1">
                    <span className="text-outline-variant/40 select-none shrink-0">├──</span>
                    <span className="w-1.5 h-3 bg-primary/60 animate-pulse mt-1"></span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
