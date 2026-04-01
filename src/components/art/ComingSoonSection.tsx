'use client';

import React, { useState } from 'react';
import { MaterialIcon } from '@/components/ui/MaterialIcon';
import { cn } from '@/lib/utils';

export function ComingSoonSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    // Placeholder: open mailto with the email pre-filled
    window.location.href = `mailto:chakravyuha.studio@gmail.com?subject=Whitelist%20Request&body=Please%20add%20me%20to%20the%20whitelist%3A%20${encodeURIComponent(email)}`;
    setSubmitted(true);
    setEmail('');
  }

  return (
    <section
      className="px-6 md:px-12 py-24 bg-surface-container-lowest border-y border-outline-variant/10"
      aria-label="Coming soon — join the whitelist"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-12">
        {/* Left: copy */}
        <div className="md:w-1/2 space-y-4">
          <span className="font-label text-primary/60 uppercase tracking-[0.3em] text-[10px] block">
            Next Drop
          </span>
          <h2 className="font-headline italic text-4xl md:text-5xl text-on-surface leading-tight">
            More works
            <br />
            <span className="text-primary">coming soon</span>
          </h2>
          <p className="font-body text-on-surface-variant text-base leading-relaxed max-w-sm">
            New originals are being created in the studio. Join the whitelist to
            be the first notified when the next piece drops.
          </p>
        </div>

        {/* Right: email form */}
        <div className="md:w-1/3 w-full">
          {submitted ? (
            <div className="flex items-center gap-3 border border-primary/20 bg-primary/5 px-6 py-5 text-primary">
              <MaterialIcon name="check_circle" size="md" />
              <span className="font-label text-xs uppercase tracking-widest">
                You&apos;re on the list
              </span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="relative group" noValidate>
              <input
                id="art-whitelist-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="YOUR EMAIL ADDRESS"
                required
                className={cn(
                  'w-full bg-transparent border-b-2 border-outline-variant/40',
                  'focus:border-primary focus:outline-none',
                  'py-4 pr-12 font-label text-xs uppercase tracking-widest',
                  'text-on-surface placeholder:text-neutral-700',
                  'transition-colors duration-300'
                )}
                aria-label="Email address for whitelist"
              />
              <button
                type="submit"
                className="absolute right-0 bottom-4 text-primary hover:text-primary-fixed-dim transition-colors hover:translate-x-0.5 transition-transform duration-200"
                aria-label="Join whitelist"
              >
                <MaterialIcon name="arrow_forward" size="md" />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
