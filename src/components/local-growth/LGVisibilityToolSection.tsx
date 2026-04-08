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
import { CityAutocomplete } from './CityAutocomplete';
import { SearchTerminal } from './SearchTerminal';

interface Props { content: LGContent['visibilityTool']; pricingContent: LGContent['pricing']; }

export function LGVisibilityToolSection({ content, pricingContent }: Props) {
  const {
    phase,
    city,
    selectCity,
    businessName,
    setBusinessName,
    startSearch,
    finishSearch,
    searchSteps,
    report,
    reset
  } = useVisibilityCheck();

  const handleKeyBusiness = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && businessName.trim()) startSearch(content);
  };

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToPricing = () => {
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
  };

  const recommendedPlanData = report ? pricingContent.plans.find(p => p.tier === report.recommendedPlan) : null;

  const nodeVisuals = React.useMemo(() => {
    if (phase !== 'searching') return [];
    return Array.from({ length: 6 }).map((_, i) => {
      const top = 15 + ((i * 17) % 70);
      const left = 10 + ((i * 31) % 70);
      const rotate = ((i * 23) % 45) - 20;
      const idStr = `NODE-${i}X${Math.floor(top)}`;
      return { top, left, rotate, idStr };
    });
  }, [phase]);

  return (
    <SectionWrapper id="visibility-tool" bg="surface-container-low" className="relative overflow-hidden">
      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Left: heading */}
          <div className="lg:col-span-5 pt-8 lg:sticky lg:top-32">
            <FadeIn delay={0}>
              <span className="font-label text-primary text-xs font-bold uppercase tracking-[0.3em] mb-4 block">{content.label}</span>
            </FadeIn>
            <FadeIn delay={150}>
              <h2 className="font-headline text-4xl sm:text-5xl mb-6 leading-tight">{content.title}</h2>
            </FadeIn>
            <FadeIn delay={300}>
              <p className="font-body text-on-surface-variant text-lg leading-relaxed mb-8">{content.subtitle}</p>
            </FadeIn>
            
            {(phase === 'searching' || phase === 'results') && city && (
              <FadeIn delay={0}>
                <div className="bg-surface-container rounded-lg p-6 border border-outline-variant/10">
                  <div className="font-label text-xs uppercase text-on-surface-variant tracking-widest mb-2 font-bold select-none">Target Set</div>
                  <div className="flex items-center gap-2 font-body text-lg text-primary">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                    {city.name}, {city.state}
                  </div>
                  <div className="mt-4 font-label text-xs uppercase text-on-surface-variant tracking-widest mb-1 font-bold select-none">Business</div>
                  <div className="font-headline text-2xl text-on-surface">{businessName}</div>
                </div>
              </FadeIn>
            )}
          </div>

          {/* Right: tool card / terminal / results */}
          <div className="lg:col-span-7 w-full">
            
            {/* PHASE 1 & 2: INPUTS */}
            {(phase === 'city-select' || phase === 'business-input') && (
              <FadeIn delay={200} direction="left" className="w-full">
                <GlassCard className="p-8 md:p-10">
                  <div className="space-y-8">
                    
                    {/* Step 1 */}
                    <div className={cn('transition-all duration-300', phase === 'business-input' ? 'opacity-50 grayscale' : 'opacity-100')}>
                      <label className="font-label text-xs uppercase tracking-widest text-on-surface-variant font-bold mb-3 block">
                        {content.cityLabel}
                      </label>
                      {phase === 'city-select' ? (
                        <CityAutocomplete onSelect={selectCity} placeholder={content.cityPlaceholder} />
                      ) : (
                        <div className="flex items-center justify-between bg-surface-container-low border border-outline-variant/20 rounded px-4 py-4">
                          <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary text-xl">location_on</span>
                            <span className="font-body text-on-surface">{city?.name}, {city?.state}</span>
                          </div>
                          <button onClick={reset} className="text-secondary text-sm hover:underline font-label uppercase tracking-wider">Edit</button>
                        </div>
                      )}
                    </div>

                    {/* Step 2 */}
                    {phase === 'business-input' && (
                      <div className="animate-fade-in">
                        <label className="font-label text-xs uppercase tracking-widest text-on-surface-variant font-bold mb-3 block">
                          {content.businessLabel}
                        </label>
                        <div className={cn(
                          'flex items-center gap-3 bg-surface-container-lowest border rounded px-4 py-4 transition-all duration-200 mb-6',
                          'focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 bg-surface-container-lowest border-outline-variant/20'
                        )}>
                          <span className="material-symbols-outlined text-primary text-xl shrink-0">storefront</span>
                          <input
                            type="text"
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            onKeyDown={handleKeyBusiness}
                            placeholder={content.businessPlaceholder}
                            className="flex-1 bg-transparent font-body text-on-surface placeholder:text-on-surface-variant/40 outline-none text-base"
                            aria-label="Business name"
                            autoFocus
                          />
                        </div>
                        
                        <GradientButton
                          label={content.buttonText}
                          onClick={() => startSearch(content)}
                          disabled={!businessName.trim()}
                          className="w-full justify-center flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </div>
                    )}
                  </div>
                </GlassCard>
                
                {/* Visual Map Background for Step 1 - fades in */}
                {city && (
                  <div className="mt-8 rounded-xl overflow-hidden border border-outline-variant/20 h-[300px] w-full relative animate-fade-in opacity-50 grayscale transition-all duration-1000">
                    <iframe 
                      title="Area Map"
                      width="100%" 
                      height="100%" 
                      style={{ border: 0 }} 
                      loading="lazy" 
                      allowFullScreen 
                      referrerPolicy="no-referrer-when-downgrade" 
                      src={`https://maps.google.com/maps?q=${city.lat},${city.lng}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                    ></iframe>
                    <div className="absolute inset-0 bg-surface/50 pointer-events-none mix-blend-overlay"></div>
                  </div>
                )}
              </FadeIn>
            )}

            {/* PHASE 3: SEARCHING */}
            {phase === 'searching' && (
              <div className="w-full animate-fade-in relative z-10">
                <SearchTerminal steps={searchSteps} onComplete={finishSearch} />
                
                {/* Theatrical Maps beneath terminal */}
                {city && (
                  <div className="mt-8 rounded-xl overflow-hidden border border-primary/20 h-[300px] w-full relative opacity-80">
                    <iframe 
                      title="Scanning Map"
                      width="100%" 
                      height="100%" 
                      style={{ border: 0, filter: 'hue-rotate(180deg) invert(90%) contrast(150%) brightness(50%)' }} 
                      loading="lazy" 
                      src={`https://maps.google.com/maps?q=${city.lat},${city.lng}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                    ></iframe>
                    
                    {/* Visual Overlay Effects */}
                    <div className="absolute inset-0 pointer-events-none mix-blend-screen relative">
                      {/* Scanning Laser */}
                      <div className="absolute left-0 right-0 h-1 bg-primary shadow-[0_0_20px_4px_rgba(233,195,73,0.8)] z-10" style={{ animation: 'scanline 2.5s cubic-bezier(0.5, 0, 0.5, 1) infinite' }}></div>
                      
                      {/* Random Data Nodes connected by lines */}
                      {nodeVisuals.map((node, i) => (
                        <div key={i} className="absolute flex flex-col gap-1 z-0 animate-fade-in" style={{ 
                          top: `${node.top}%`, 
                          left: `${node.left}%`,
                          animationDelay: `${i * 0.3}s`,
                        }}>
                          <div className="flex gap-2 items-center">
                            <div className="w-2 h-2 bg-secondary rounded-full animate-pulse shadow-[0_0_8px_rgba(255,180,168,0.9)]"></div>
                            <div className="h-[1px] bg-secondary/50 w-12" style={{ transform: `rotate(${node.rotate}deg)` }}></div>
                          </div>
                          <div className="text-[8px] font-mono text-secondary/70 ml-4 font-bold">{node.idStr}</div>
                        </div>
                      ))}

                      {/* Cool hacker HUD text */}
                      <div className="absolute top-4 left-4 bg-surface-container-lowest/80 border border-primary/30 text-primary font-mono text-[10px] px-3 py-2 rounded backdrop-blur">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span>
                          SATELLITE UPLINK: OK
                        </div>
                        <div>LAT: {city.lat.toFixed(5)}</div>
                        <div>LNG: {city.lng.toFixed(5)}</div>
                        <div className="mt-1 opacity-70">TARGET: {businessName.substring(0, 15)}...</div>
                      </div>

                      <div className="absolute bottom-4 right-4 bg-surface-container-lowest/80 border border-secondary/30 text-secondary font-mono text-[10px] px-3 py-2 rounded backdrop-blur flex items-center gap-2">
                        <span className="inline-block w-2 h-2 bg-secondary rounded-full animate-ping"></span>
                        INTERCEPTING DIRECTORIES...
                      </div>
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                      <div className="absolute w-16 h-16 bg-primary/20 rounded-full animate-ping" style={{ animationDuration: '2s' }}></div>
                      <div className="absolute w-32 h-32 border border-primary/40 rounded-full animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}></div>
                      <div className="absolute w-64 h-64 border border-primary/20 rounded-full animate-ping" style={{ animationDuration: '3s', animationDelay: '1s' }}></div>
                      <span className="material-symbols-outlined text-primary text-4xl drop-shadow-[0_0_15px_rgba(233,195,73,1)]" style={{ fontVariationSettings: "'FILL' 1" }}>my_location</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* PHASE 4: RESULTS */}
            {phase === 'results' && report && (
              <FadeIn delay={0} className="w-full space-y-6">
                
                {/* Score Card */}
                <GlassCard className="p-8">
                  <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                    
                    {/* Gauge */}
                    <div className="relative w-40 h-40 shrink-0">
                      <div className="absolute inset-0 rounded-full border-8 border-surface-container-highest"></div>
                      <div className="absolute inset-0 rounded-full border-8 border-transparent" style={{
                        background: `conic-gradient(${report.scoreLabel === 'high' ? '#4ade80' : report.scoreLabel === 'medium' ? '#e9c349' : '#ffb4a8'} ${report.score}%, transparent 0) border-box`,
                        WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
                        WebkitMaskComposite: 'xor',
                        maskComposite: 'exclude'
                      }}></div>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="font-headline text-5xl font-medium">{report.score}</span>
                        <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">/ 100</span>
                      </div>
                    </div>
                    
                    <div className="text-center md:text-left flex-1">
                      <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant mb-1 font-bold">Overall Rating</p>
                      <p className={cn(
                        'font-headline text-3xl mb-4',
                        report.scoreLabel === 'high' ? 'text-green-400' : report.scoreLabel === 'medium' ? 'text-primary' : 'text-secondary'
                      )}>
                        {content.resultLabels[report.scoreLabel === 'high' ? 'scoreHigh' : report.scoreLabel === 'medium' ? 'scoreMedium' : 'scoreLow']}
                      </p>
                      <button
                        onClick={reset}
                        className="font-label text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center md:justify-start gap-1 w-full"
                      >
                        <span className="material-symbols-outlined text-sm">refresh</span>
                        {content.resultLabels.checkAgain}
                      </button>
                    </div>
                  </div>
                </GlassCard>

                {/* Details Card */}
                <GlassCard className="p-8 space-y-8">
                  
                  {/* Checks Breakdown */}
                  <div>
                    <h4 className="font-label text-xs uppercase tracking-widest text-on-surface-variant mb-4 font-bold border-b border-outline-variant/10 pb-2">Analysis Breakdown</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {report.checks.map((chk, i) => (
                        <div key={i} className="bg-surface-container-lowest p-4 rounded-lg flex gap-3 border border-outline-variant/10">
                          <span className={cn(
                            'material-symbols-outlined mt-0.5 shrink-0',
                            chk.status === 'pass' ? 'text-green-400' : chk.status === 'warning' ? 'text-primary' : 'text-secondary'
                          )} style={{ fontVariationSettings: "'FILL' 1" }}>
                            {chk.status === 'pass' ? 'check_circle' : chk.status === 'warning' ? 'warning' : 'cancel'}
                          </span>
                          <div>
                            <div className="font-bold font-body text-sm text-on-surface mb-0.5">{chk.category}</div>
                            <div className="font-body text-xs text-on-surface-variant/70 leading-relaxed">{chk.detail}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Issues */}
                  {report.issues.length > 0 && (
                    <div>
                      <h4 className="font-label text-xs uppercase tracking-widest text-on-surface-variant mb-4 font-bold border-b border-outline-variant/10 pb-2">{content.resultLabels.issuesTitle}</h4>
                      <ul className="space-y-3">
                        {report.issues.map((issue, i) => (
                          <li key={i} className="flex items-start gap-3 font-body text-sm text-on-surface">
                            <span className="material-symbols-outlined text-secondary text-base mt-0.5 shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>radio_button_checked</span>
                            {issue}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                </GlassCard>

                {/* Plan Recommendation Card !! BIASED FUNNEL !! */}
                {recommendedPlanData && (
                  <div className="relative rounded-xl border border-primary/30 bg-surface-container shadow-[0_0_40px_-15px_rgba(233,195,73,0.15)] overflow-hidden mt-8 group animate-fade-in" style={{ animationDelay: '300ms' }}>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none"></div>
                    
                    <div className="p-8 md:p-10 relative z-10 flex flex-col md:flex-row gap-8 items-center">
                      <div className="flex-1 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-[10px] font-label font-bold uppercase tracking-widest mb-4">
                          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                          Recommended Plan
                        </div>
                        <h3 className="font-headline text-3xl mb-2 text-on-surface">
                          {recommendedPlanData.title} <span className="text-on-surface-variant text-xl">/ {recommendedPlanData.price}</span>
                        </h3>
                        <p className="font-body text-on-surface-variant text-sm mb-6 leading-relaxed">
                          Based on your score of {report.score}, this is the fastest way to improve your local market share.
                        </p>
                        <ul className="space-y-2 mb-8 text-left">
                          {report.planReasons.map((reason, i) => (
                            <li key={i} className="flex items-start gap-2 font-body text-sm text-on-surface-variant">
                              <span className="material-symbols-outlined text-primary text-base mt-0.5 shrink-0">done</span>
                              {reason}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="w-full md:w-auto flex flex-col gap-3 shrink-0">
                        <GradientButton
                          label={content.resultLabels.planCta}
                          onClick={scrollToContact}
                          className="w-full justify-center shadow-[0_10px_30px_-10px_rgba(233,195,73,0.3)] pulse-shadow transition-all"
                        />
                        <button onClick={scrollToPricing} className="text-sm font-label uppercase tracking-widest text-on-surface-variant/60 hover:text-on-surface transition-colors mt-2">
                          {content.resultLabels.planCtaSecondary}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
              </FadeIn>
            )}

          </div>
        </div>
      </Container>
    </SectionWrapper>
  );
}
