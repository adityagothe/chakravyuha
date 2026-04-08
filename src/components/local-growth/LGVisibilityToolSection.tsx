'use client';

import React from 'react';
import { LGContent } from '@/types/local-growth';
import { SectionWrapper } from '../ui/SectionWrapper';
import { Container } from '../ui/Container';
import { FadeIn } from '../ui/FadeIn';
import { GlassCard } from '../ui/GlassCard';
import { GradientButton } from '../ui/GradientButton';
import { useVisibilityCheck } from '@/hooks/useVisibilityCheck';
import { cn } from '@/lib/utils';

interface Props { content: LGContent['visibilityTool']; }

const scoreConfig = {
  high:   { color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/20', icon: 'check_circle', bar: 'bg-green-400', width: 'w-[90%]' },
  medium: { color: 'text-primary',   bg: 'bg-primary/10 border-primary/20',     icon: 'info',         bar: 'bg-primary',   width: 'w-[55%]' },
  low:    { color: 'text-secondary', bg: 'bg-secondary/10 border-secondary/20', icon: 'warning',      bar: 'bg-secondary', width: 'w-[20%]' },
};

export function LGVisibilityToolSection({ content }: Props) {
  const { input, setInput, status, result, checkVisibility, reset } = useVisibilityCheck();

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && input.trim()) checkVisibility();
  };

  const cfg = result ? scoreConfig[result.score] : null;
  const scoreLabel = result
    ? { high: content.resultLabels.scoreHigh, medium: content.resultLabels.scoreMedium, low: content.resultLabels.scoreLow }[result.score]
    : '';

  return (
    <SectionWrapper id="visibility-tool" bg="surface-container-low">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Left: heading */}
          <div className="lg:col-span-5">
            <FadeIn delay={0}>
              <span className="font-label text-primary text-xs font-bold uppercase tracking-[0.3em] mb-4 block">{content.label}</span>
            </FadeIn>
            <FadeIn delay={150}>
              <h2 className="font-headline text-4xl sm:text-5xl mb-6 leading-tight">{content.title}</h2>
            </FadeIn>
            <FadeIn delay={300}>
              <p className="font-body text-on-surface-variant text-lg leading-relaxed">{content.subtitle}</p>
            </FadeIn>
          </div>

          {/* Right: tool card */}
          <FadeIn delay={200} direction="left" className="lg:col-span-7">
            <GlassCard className="p-8 md:p-10">
              {/* IDLE / LOADING: input */}
              {status !== 'success' && (
                <div className="space-y-4">
                  <div className={cn(
                    'flex items-center gap-3 bg-surface-container-lowest border rounded px-4 py-4 transition-all duration-200',
                    'focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20',
                    'border-outline-variant/20'
                  )}>
                    <span className="material-symbols-outlined text-primary text-xl shrink-0">search</span>
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKey}
                      placeholder={content.inputPlaceholder}
                      disabled={status === 'loading'}
                      className="flex-1 bg-transparent font-body text-on-surface placeholder:text-on-surface-variant/40 outline-none text-base"
                      aria-label="Business name"
                    />
                    {input && status !== 'loading' && (
                      <button onClick={() => setInput('')} className="text-on-surface-variant/40 hover:text-on-surface-variant transition-colors">
                        <span className="material-symbols-outlined text-lg">close</span>
                      </button>
                    )}
                  </div>
                  <GradientButton
                    label={status === 'loading' ? content.loadingText : content.buttonText}
                    onClick={checkVisibility}
                    disabled={status === 'loading' || !input.trim()}
                    className="w-full justify-center flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  {/* Loading skeleton */}
                  {status === 'loading' && (
                    <div className="space-y-3 pt-4 animate-pulse">
                      {[80, 60, 95].map((w, i) => (
                        <div key={i} className="h-3 bg-surface-container rounded-full" style={{ width: `${w}%` }} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* SUCCESS: result */}
              {status === 'success' && result && cfg && (
                <div className="space-y-6">
                  {/* Score badge */}
                  <div className={cn('flex items-center gap-3 p-4 rounded-lg border', cfg.bg)}>
                    <span className={cn('material-symbols-outlined text-2xl', cfg.color)} style={{ fontVariationSettings: "'FILL' 1" }}>{cfg.icon}</span>
                    <div>
                      <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant mb-1">Visibility Score</p>
                      <p className={cn('font-headline text-xl', cfg.color)}>{scoreLabel}</p>
                    </div>
                    <div className="ml-auto">
                      <div className="w-24 h-2 bg-surface-container rounded-full overflow-hidden">
                        <div className={cn('h-full rounded-full transition-all duration-700', cfg.bar, cfg.width)} />
                      </div>
                    </div>
                  </div>

                  {/* Issues */}
                  {result.issues.length > 0 && (
                    <div>
                      <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant mb-3">{content.resultLabels.issuesTitle}</p>
                      <ul className="space-y-2">
                        {result.issues.map((issue, i) => (
                          <li key={i} className="flex items-start gap-2 font-body text-sm text-on-surface-variant">
                            <span className="material-symbols-outlined text-secondary text-base mt-0.5 shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>radio_button_checked</span>
                            {issue}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {result.issues.length === 0 && (
                    <p className="font-body text-sm text-on-surface-variant italic">{content.resultLabels.noIssues}</p>
                  )}

                  {/* Suggestions */}
                  <div>
                    <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant mb-3">{content.resultLabels.suggestionsTitle}</p>
                    <ul className="space-y-2">
                      {result.suggestions.map((sug, i) => (
                        <li key={i} className="flex items-start gap-2 font-body text-sm text-on-surface-variant">
                          <span className="material-symbols-outlined text-primary text-base mt-0.5 shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>arrow_forward</span>
                          {sug}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={reset}
                    className="font-label text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">refresh</span>
                    {content.resultLabels.checkAgain}
                  </button>
                </div>
              )}
            </GlassCard>
          </FadeIn>
        </div>
      </Container>
    </SectionWrapper>
  );
}
