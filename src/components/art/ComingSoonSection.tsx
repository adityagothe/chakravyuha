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
    window.location.href = `mailto:chakravyuha.studio@gmail.com?subject=Whitelist%20Request%20%E2%80%94%20New%20Auction%20Notifications&body=Please%20add%20me%20to%20the%20whitelist%20for%20new%20auctions%20and%20drops%3A%20${encodeURIComponent(email)}`;
    setSubmitted(true);
    setEmail('');
  }

  return (
    <section
      className="px-6 md:px-12 py-20 md:py-28 bg-surface-container-lowest border-y border-outline-variant/10 relative overflow-hidden"
      aria-label="Join auction whitelist"
    >
      {/* Subtle glow */}
      <div className="absolute right-0 top-0 w-[300px] h-[300px] bg-primary/4 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-12 relative z-10">
        {/* Left: copy */}
        <div className="md:w-1/2 space-y-5">
          <span className="font-label text-primary/50 uppercase tracking-[0.3em] text-[10px] block">
            Private Access
          </span>
          <h2 className="font-headline italic text-4xl md:text-5xl text-on-surface leading-tight">
            First access
            <br />
            <span className="text-primary">to every drop</span>
          </h2>
          <p className="font-body text-on-surface-variant text-base leading-relaxed max-w-sm">
            New auctions open without public announcement. Whitelist members
            receive private notice 24 hours before any lot goes live — before
            anyone else can bid.
          </p>
          <ul className="space-y-3 pt-2">
            {[
              'Early access to live auctions',
              'Private sale notifications',
              'Upcoming drop countdowns',
            ].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span className="w-1 h-1 rounded-full bg-primary shrink-0" />
                <span className="font-label text-[10px] uppercase tracking-widest text-neutral-500">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: email form */}
        <div className="md:w-5/12 w-full">
          {submitted ? (
            <div className="flex flex-col items-start gap-4 border border-primary/20 bg-primary/5 px-8 py-8">
              <div className="flex items-center gap-3 text-primary">
                <MaterialIcon name="check_circle" size="lg" />
                <span className="font-label text-xs uppercase tracking-widest font-bold">
                  You&apos;re on the list
                </span>
              </div>
              <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                You&apos;ll receive advance notice for upcoming auctions and
                private drops. Watch your inbox.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div className="relative group">
                <label
                  htmlFor="art-whitelist-email"
                  className="block font-label text-[10px] uppercase tracking-widest text-neutral-600 mb-3"
                >
                  Your Email Address
                </label>
                <div className="relative">
                  <input
                    id="art-whitelist-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="collector@example.com"
                    required
                    className={cn(
                      'w-full bg-transparent border-b-2 border-outline-variant/30',
                      'focus:border-primary focus:outline-none',
                      'py-4 pr-12 font-label text-sm tracking-wide',
                      'text-on-surface placeholder:text-neutral-700',
                      'transition-colors duration-300'
                    )}
                    aria-label="Email address for whitelist"
                  />
                  <button
                    type="submit"
                    id="art-whitelist-submit"
                    className="absolute right-0 bottom-4 text-primary hover:text-primary-fixed-dim transition-colors hover:translate-x-0.5 duration-200"
                    aria-label="Join whitelist"
                  >
                    <MaterialIcon name="arrow_forward" size="md" />
                  </button>
                </div>
              </div>
              <p className="font-label text-[9px] uppercase tracking-widest text-neutral-700">
                No spam. Unsubscribe at any time. Reserved for verified
                collectors only.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
