'use client';

import React from 'react';
import { LGContent, VisibilityResult } from '@/types/local-growth';
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

// ─── Real Results Sub-Components ──────────────────────────────────────────

function FameLevelBadge({ level }: { level: string }) {
  const config = {
    legendary: { color: 'text-amber-300 bg-amber-300/10 border-amber-300/30', icon: 'hotel_class', label: 'Legendary' },
    famous:    { color: 'text-green-400 bg-green-400/10 border-green-400/30', icon: 'star', label: 'Famous' },
    known:     { color: 'text-primary bg-primary/10 border-primary/30', icon: 'thumb_up', label: 'Known' },
    emerging:  { color: 'text-blue-400 bg-blue-400/10 border-blue-400/30', icon: 'trending_up', label: 'Emerging' },
    unknown:   { color: 'text-secondary bg-secondary/10 border-secondary/30', icon: 'help_outline', label: 'Unknown' },
  }[level] ?? { color: 'text-on-surface-variant', icon: 'circle', label: level };

  return (
    <span className={cn('inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-label font-bold uppercase tracking-wider border', config.color)}>
      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>{config.icon}</span>
      {config.label}
    </span>
  );
}

function StatusDot({ status }: { status: 'pass' | 'warning' | 'fail' | boolean }) {
  const isPass = status === 'pass' || status === true;
  const isWarn = status === 'warning';
  return (
    <span className={cn(
      'inline-flex items-center justify-center w-5 h-5 rounded-full shrink-0 text-xs',
      isPass ? 'bg-green-400/20 text-green-400' :
      isWarn ? 'bg-primary/20 text-primary' :
               'bg-secondary/20 text-secondary'
    )}>
      <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
        {isPass ? 'check' : isWarn ? 'warning' : 'close'}
      </span>
    </span>
  );
}

function RealResultsPanel({ report }: { report: VisibilityResult }) {
  const real = report.realData!;

  return (
    <div className="space-y-4">
      {/* Data Source Badge */}
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-400/10 text-green-400 border border-green-400/20 text-[10px] font-label font-bold uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
          Live Search Data
        </span>
        <span className="text-[10px] text-on-surface-variant/40 font-label">
          Results from actual internet search
        </span>
      </div>

      {/* Google Maps Card */}
      <GlassCard className="p-5">
        <div className="flex items-start gap-4">
          <div className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
            real.googleMaps.found ? 'bg-green-400/10' : 'bg-secondary/10'
          )}>
            <span className={cn(
              'material-symbols-outlined text-2xl',
              real.googleMaps.found ? 'text-green-400' : 'text-secondary'
            )} style={{ fontVariationSettings: "'FILL' 1" }}>
              {real.googleMaps.found ? 'location_on' : 'location_off'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-body font-bold text-sm text-on-surface">Google Maps & Business Profile</span>
              <StatusDot status={real.googleMaps.found ? 'pass' : 'fail'} />
            </div>
            {real.googleMaps.found ? (
              <div className="space-y-1">
                <p className="font-body text-xs text-on-surface-variant">✓ Found on Google Maps</p>
                {real.googleMaps.rating && (
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1">
                      {[1,2,3,4,5].map(s => (
                        <span key={s} className={cn(
                          'material-symbols-outlined text-sm',
                          s <= Math.round(real.googleMaps.rating!) ? 'text-amber-400' : 'text-on-surface-variant/20'
                        )} style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      ))}
                      <span className="font-mono text-sm text-on-surface font-bold ml-1">{real.googleMaps.rating}</span>
                    </div>
                    {real.googleMaps.reviewCount !== undefined && (
                      <span className="text-xs text-on-surface-variant">({real.googleMaps.reviewCount} reviews)</span>
                    )}
                  </div>
                )}
                {real.googleMaps.mapsUrl && (
                  <a href={real.googleMaps.mapsUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1">
                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                    View on Google Maps
                  </a>
                )}
              </div>
            ) : (
              <p className="font-body text-xs text-secondary">✗ Not found on Google Maps</p>
            )}
          </div>
        </div>
      </GlassCard>

      {/* District Fame */}
      <GlassCard className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-primary text-xl">trending_up</span>
              <span className="font-body font-bold text-sm text-on-surface">How Famous in {report.city}?</span>
            </div>
            <p className="font-body text-xs text-on-surface-variant leading-relaxed mb-3">
              {real.districtFame.fameSummary}
            </p>
            <div className="flex items-center gap-3 text-xs text-on-surface-variant">
              <span className="material-symbols-outlined text-sm">search</span>
              <span>~{real.districtFame.searchResultCount.toLocaleString('en-IN')} results found</span>
            </div>
          </div>
          <FameLevelBadge level={real.districtFame.fameLevel} />
        </div>
      </GlassCard>

      {/* Directories & Social in a grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Directories */}
        <GlassCard className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary text-xl">list_alt</span>
            <span className="font-body font-bold text-sm text-on-surface">Business Directories</span>
          </div>
          <ul className="space-y-2.5">
            {[
              { label: 'JustDial', val: real.directories.justdial },
              { label: 'IndiaMart', val: real.directories.indiamart },
              { label: 'Sulekha', val: real.directories.sulekha },
              { label: 'YellowPages', val: real.directories.yellowpages },
            ].map(({ label, val }) => (
              <li key={label} className="flex items-center justify-between text-xs font-body">
                <span className={val ? 'text-on-surface' : 'text-on-surface-variant/50'}>{label}</span>
                <StatusDot status={val} />
              </li>
            ))}
            {real.directories.other.length > 0 && (
              <li className="text-[10px] text-green-400 font-label pt-1 border-t border-outline-variant/10">
                + Also on: {real.directories.other.join(', ')}
              </li>
            )}
          </ul>
        </GlassCard>

        {/* Social Media */}
        <GlassCard className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary text-xl">people</span>
            <span className="font-body font-bold text-sm text-on-surface">Social Media</span>
          </div>
          <ul className="space-y-2.5">
            {[
              { label: 'Facebook', val: real.socialMedia.facebook, icon: '𝗙' },
              { label: 'Instagram', val: real.socialMedia.instagram, icon: '📷' },
              { label: 'X (Twitter)', val: real.socialMedia.twitter, icon: '𝕏' },
              { label: 'YouTube', val: real.socialMedia.youtube, icon: '▶' },
            ].map(({ label, val }) => (
              <li key={label} className="flex items-center justify-between text-xs font-body">
                <span className={val ? 'text-on-surface' : 'text-on-surface-variant/50'}>{label}</span>
                <StatusDot status={val} />
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>

      {/* Top Web Results */}
      {real.webPresence.topResults.length > 0 && (
        <GlassCard className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary text-xl">language</span>
            <span className="font-body font-bold text-sm text-on-surface">Top Search Results Found</span>
          </div>
          <ul className="space-y-3">
            {real.webPresence.topResults.slice(0, 4).map((r, i) => (
              <li key={i} className="text-xs">
                <a
                  href={r.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                >
                  <div className="text-primary group-hover:underline font-body leading-snug truncate">{r.title}</div>
                  <div className="text-green-500/70 truncate text-[10px] mb-0.5">{r.link.substring(0, 60)}{r.link.length > 60 ? '…' : ''}</div>
                  <div className="text-on-surface-variant/60 leading-relaxed line-clamp-2">{r.snippet}</div>
                </a>
              </li>
            ))}
          </ul>
        </GlassCard>
      )}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────

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
    searchMode,
    rateLimitError,
    reset,
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

                  {/* Rate limit warning */}
                  {rateLimitError && (
                    <div className="mt-4 flex items-start gap-2 bg-secondary/10 border border-secondary/20 rounded px-3 py-2">
                      <span className="material-symbols-outlined text-secondary text-sm mt-0.5 shrink-0">schedule</span>
                      <p className="text-[11px] text-secondary leading-relaxed">
                        Search limit reached (10/hour). Showing estimated results — real data resumes after cooldown.
                      </p>
                    </div>
                  )}
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
                          'focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 border-outline-variant/20'
                        )}>
                          <span className="material-symbols-outlined text-primary text-xl shrink-0">storefront</span>
                          <input
                            type="text"
                            value={businessName}
                            onChange={e => setBusinessName(e.target.value)}
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

                {/* Map background after city selected */}
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
                      src={`https://maps.google.com/maps?q=${city.lat},${city.lng}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                    />
                    <div className="absolute inset-0 bg-surface/50 pointer-events-none mix-blend-overlay" />
                  </div>
                )}
              </FadeIn>
            )}

            {/* PHASE 3: SEARCHING */}
            {phase === 'searching' && (
              <div className="w-full animate-fade-in relative z-10">
                <SearchTerminal steps={searchSteps} onComplete={finishSearch} />

                {city && (
                  <div className="mt-8 rounded-xl overflow-hidden border border-primary/20 h-[280px] w-full relative opacity-80">
                    <iframe
                      title="Scanning Map"
                      width="100%"
                      height="100%"
                      style={{ border: 0, filter: 'hue-rotate(180deg) invert(90%) contrast(150%) brightness(50%)' }}
                      loading="lazy"
                      src={`https://maps.google.com/maps?q=${city.lat},${city.lng}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                    />

                    <div className="absolute inset-0 pointer-events-none mix-blend-screen">
                      {/* Scanning laser line */}
                      <div className="absolute left-0 right-0 h-0.5 bg-primary shadow-[0_0_20px_4px_rgba(233,195,73,0.8)] z-10" style={{ animation: 'scanline 2.5s cubic-bezier(0.5, 0, 0.5, 1) infinite' }} />

                      {/* Animate nodes */}
                      {nodeVisuals.map((node, i) => (
                        <div key={i} className="absolute flex flex-col gap-1 z-0 animate-fade-in" style={{ top: `${node.top}%`, left: `${node.left}%`, animationDelay: `${i * 0.3}s` }}>
                          <div className="flex gap-2 items-center">
                            <div className="w-2 h-2 bg-secondary rounded-full animate-pulse shadow-[0_0_8px_rgba(255,180,168,0.9)]" />
                            <div className="h-[1px] bg-secondary/50 w-12" style={{ transform: `rotate(${node.rotate}deg)` }} />
                          </div>
                          <div className="text-[8px] font-mono text-secondary/70 ml-4 font-bold">{node.idStr}</div>
                        </div>
                      ))}
                    </div>

                    {/* Center magnifying glass */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                      <div className="absolute w-16 h-16 bg-primary/20 rounded-full animate-ping" style={{ animationDuration: '2s' }} />
                      <div className="absolute w-32 h-32 border border-primary/40 rounded-full animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }} />
                      <div className="absolute w-64 h-64 border border-primary/20 rounded-full animate-ping" style={{ animationDuration: '3s', animationDelay: '1s' }} />
                      <div className="absolute animate-magnify select-none">
                        <span className="material-symbols-outlined text-primary text-6xl drop-shadow-[0_0_20px_rgba(233,195,73,0.8)]" style={{ fontVariationSettings: "'FILL' 0, 'wght' 200" }}>
                          search
                        </span>
                      </div>
                      <span className="material-symbols-outlined text-primary text-4xl drop-shadow-[0_0_15px_rgba(233,195,73,1)] mt-12" style={{ fontVariationSettings: "'FILL' 1" }}>my_location</span>
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
                      <div className="absolute inset-0 rounded-full border-8 border-surface-container-highest" />
                      <div className="absolute inset-0 rounded-full border-8 border-transparent" style={{
                        background: `conic-gradient(${report.scoreLabel === 'high' ? '#4ade80' : report.scoreLabel === 'medium' ? '#e9c349' : '#ffb4a8'} ${report.score}%, transparent 0) border-box`,
                        WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
                        WebkitMaskComposite: 'xor',
                        maskComposite: 'exclude',
                      }} />
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="font-headline text-5xl font-medium">{report.score}</span>
                        <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">/ 100</span>
                      </div>
                    </div>

                    <div className="text-center md:text-left flex-1">
                      <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant mb-1 font-bold">
                        {searchMode === 'real' ? 'Real Visibility Score' : 'Estimated Visibility Score'}
                      </p>
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

                {/* Real Data Results */}
                {report.realData && searchMode === 'real' ? (
                  <RealResultsPanel report={report} />
                ) : (
                  /* Fallback: traditional checks display */
                  <GlassCard className="p-8 space-y-8">
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

                    {report.suggestions.length > 0 && (
                      <div>
                        <h4 className="font-label text-xs uppercase tracking-widest text-on-surface-variant mb-4 font-bold border-b border-outline-variant/10 pb-2">{content.resultLabels.suggestionsTitle}</h4>
                        <ul className="space-y-3">
                          {report.suggestions.map((s, i) => (
                            <li key={i} className="flex items-start gap-3 font-body text-sm text-on-surface">
                              <span className="material-symbols-outlined text-green-400 text-base mt-0.5 shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>tips_and_updates</span>
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </GlassCard>
                )}

                {/* Issues & Suggestions (for real data results) */}
                {report.realData && searchMode === 'real' && (report.issues.length > 0 || report.suggestions.length > 0) && (
                  <GlassCard className="p-8 space-y-6">
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
                    {report.suggestions.length > 0 && (
                      <div>
                        <h4 className="font-label text-xs uppercase tracking-widest text-on-surface-variant mb-4 font-bold border-b border-outline-variant/10 pb-2">{content.resultLabels.suggestionsTitle}</h4>
                        <ul className="space-y-3">
                          {report.suggestions.map((s, i) => (
                            <li key={i} className="flex items-start gap-3 font-body text-sm text-on-surface">
                              <span className="material-symbols-outlined text-green-400 text-base mt-0.5 shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>tips_and_updates</span>
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </GlassCard>
                )}

                {/* Plan Recommendation */}
                {recommendedPlanData && (
                  <div className="relative rounded-xl border border-primary/30 bg-surface-container shadow-[0_0_40px_-15px_rgba(233,195,73,0.15)] overflow-hidden mt-8 group animate-fade-in" style={{ animationDelay: '300ms' }}>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />

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
                          Based on your score of {report.score}{searchMode === 'real' ? ' from live data' : ''}, this is the fastest way to improve your local market share.
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
