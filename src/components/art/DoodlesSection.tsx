'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Doodle } from '@/data/artworks';
import { DoodleCard } from './DoodleCard';
import { MaterialIcon } from '@/components/ui/MaterialIcon';

export function DoodlesSection() {
  const [doodles, setDoodles] = useState<Doodle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDoodles = useCallback(() => {
    setLoading(true);
    fetch('/api/doodles')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setDoodles(data);
        else setError('Failed to load doodles.');
      })
      .catch(() => setError('Failed to load doodles.'))
      .finally(() => setLoading(false));
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchDoodles(); }, [fetchDoodles]);

  // "Surprise Me!" — scroll to a random available doodle card
  const handleSurpriseMe = () => {
    const available = doodles.filter((d) => d.status === 'available');
    if (!available.length) return;
    const pick = available[Math.floor(Math.random() * available.length)];
    const el = document.getElementById(`doodle-card-buy-${pick.id}`);
    if (el) {
      el.closest('article')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('ring-2', 'ring-primary', 'ring-offset-1');
      setTimeout(() => el.classList.remove('ring-2', 'ring-primary', 'ring-offset-1'), 2000);
    }
  };

  const availableCount = doodles.filter((d) => d.status === 'available').length;
  const soldCount = doodles.filter((d) => d.status === 'sold').length;

  return (
    <section
      id="doodles"
      className="relative px-6 md:px-12 py-16 md:py-24 bg-surface"
      aria-label="My Doodles section"
    >
      {/* Sketch-notebook style hand-drawn divider at top */}
      <div className="absolute top-0 left-0 right-0 pointer-events-none overflow-hidden h-6">
        <svg
          viewBox="0 0 1200 24"
          preserveAspectRatio="none"
          className="w-full h-full opacity-20"
          aria-hidden="true"
        >
          <path
            d="M0,12 C100,4 200,20 300,12 C400,4 500,20 600,12 C700,4 800,20 900,12 C1000,4 1100,20 1200,12"
            stroke="#e9c349"
            strokeWidth="1.5"
            fill="none"
            strokeDasharray="6 4"
          />
        </svg>
      </div>

      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-surface-container/40 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl leading-none" aria-hidden="true">✏️</span>
              <span className="font-label text-on-surface-variant uppercase tracking-[0.3em] text-[10px]">
                The Casual Side
              </span>
            </div>
            <h2 className="font-headline italic text-4xl md:text-5xl text-on-surface">
              My <span className="text-on-surface-variant">Doodles</span>
            </h2>
            <p className="font-body text-on-surface-variant mt-3 max-w-lg leading-relaxed text-sm">
              Quick sketches, small prices. No frills, just art. ✨
            </p>
          </div>

          {/* Stats + Surprise Me */}
          <div className="flex flex-col items-start md:items-end gap-3">
            {!loading && doodles.length > 0 && (
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
                {availableCount > 0 && (
                  <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
                    {availableCount} Available
                  </span>
                )}
                {soldCount > 0 && (
                  <span className="font-label text-[10px] uppercase tracking-widest text-neutral-700">
                    {soldCount} Sold
                  </span>
                )}
              </div>
            )}
            {!loading && availableCount > 0 && (
              <button
                id="doodles-surprise-me"
                onClick={handleSurpriseMe}
                className="inline-flex items-center gap-2 border border-outline-variant/30 text-on-surface-variant hover:border-outline-variant/60 hover:text-on-surface font-label text-[9px] uppercase tracking-widest px-4 py-2 transition-all duration-200 hover:-translate-y-0.5"
                aria-label="Scroll to a random available doodle"
              >
                <MaterialIcon name="shuffle" size="sm" />
                Surprise Me!
              </button>
            )}
          </div>
        </div>

        {/* Sketchy divider */}
        <div className="flex items-center gap-4 mb-12">
          <div className="flex-1 h-px border-b border-dashed border-outline-variant/30" />
          <span className="font-label text-[9px] uppercase tracking-[0.4em] text-neutral-700 shrink-0 flex items-center gap-2">
            <span>✏️</span> Budget Art
          </span>
          <div className="flex-1 h-px border-b border-dashed border-outline-variant/30" />
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <span className="w-2 h-2 rounded-full bg-on-surface-variant animate-pulse" />
            <p className="font-label text-[10px] uppercase tracking-widest text-neutral-600">
              Loading doodles…
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
            <MaterialIcon name="error_outline" size="2xl" className="text-neutral-700" />
            <p className="font-label text-[10px] uppercase tracking-widest text-neutral-600">{error}</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && doodles.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
            <div className="text-6xl" aria-hidden="true">✏️</div>
            <div>
              <h3 className="font-headline italic text-2xl text-on-surface mb-2">
                No Doodles Yet
              </h3>
              <p className="font-body text-sm text-on-surface-variant max-w-xs mx-auto leading-relaxed">
                Doodles are on their way! Check back soon for quick sketches at small prices.
              </p>
            </div>
          </div>
        )}

        {/* Masonry-style grid using CSS columns */}
        {!loading && !error && doodles.length > 0 && (
          <div
            className="columns-2 md:columns-3 xl:columns-4 gap-5"
            style={{ columnGap: '1.25rem' }}
          >
            {doodles.map((doodle) => (
              <div key={doodle.id} className="mb-5 break-inside-avoid">
                <DoodleCard doodle={doodle} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
