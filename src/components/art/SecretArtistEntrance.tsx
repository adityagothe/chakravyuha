'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { MaterialIcon } from '@/components/ui/MaterialIcon';

// The secret passphrase — change this to whatever the artist wants
// The secret passphrase
const SECRET_CODE = '1567';

export function SecretArtistEntrance() {
  const router = useRouter();

  // Click counter for the invisible hotspot
  const [, setClickCount] = useState(0);
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auth modal state
  const [isOpen, setIsOpen] = useState(false);
  const [code, setCode] = useState('');
  const [shake, setShake] = useState(false);
  const [hint, setHint] = useState('');
  const [attempts, setAttempts] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const openModal = useCallback(() => {
    setIsOpen(true);
    setCode('');
    setHint('');
    setAttempts(0);
    setTimeout(() => inputRef.current?.focus(), 150);
  }, []);

  // Also listen for keyboard shortcut: Ctrl+Shift+A (as fallback for artist)
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        openModal();
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [openModal]);

  // Triple-click handler on the invisible hotspot
  const handleHotspotClick = useCallback(() => {
    setClickCount((prev) => {
      const next = prev + 1;
      // Reset timer on each click
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
      clickTimerRef.current = setTimeout(() => setClickCount(0), 1500);

      if (next >= 3) {
        setClickCount(0);
        if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
        openModal();
      }
      return next;
    });
  }, [openModal]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setCode('');
    setHint('');
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (code.toUpperCase() === SECRET_CODE.toUpperCase()) {
        setHint('');
        setIsOpen(false);
        router.push('/artist');
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        setShake(true);
        setCode('');
        setTimeout(() => setShake(false), 600);
        if (newAttempts >= 3) {
          setHint('Access denied. Close and try again.');
        } else {
          setHint(`Incorrect. ${3 - newAttempts} attempt${3 - newAttempts === 1 ? '' : 's'} remaining.`);
        }
      }
    },
    [code, attempts, router]
  );

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') handleClose();
    }
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, handleClose]);

  return (
    <>
      {/* === INVISIBLE HOTSPOT (bottom-right corner) === */}
      {/* Completely invisible — no visible style, no cursor change */}
      <div
        id="artist-secret-entrance"
        onClick={handleHotspotClick}
        className="fixed bottom-0 right-0 w-8 h-8 z-[200] cursor-default select-none"
        aria-hidden="true"
        tabIndex={-1}
      />

      {/* === AUTH OVERLAY === */}
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-[300] transition-all duration-400',
          isOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        )}
        onClick={handleClose}
        aria-hidden="true"
        style={{ background: 'rgba(5, 5, 5, 0.92)', backdropFilter: 'blur(16px)' }}
      />

      {/* Modal panel — slides up from bottom */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Artist access"
        className={cn(
          'fixed bottom-0 left-0 right-0 z-[301] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]',
          isOpen ? 'translate-y-0' : 'translate-y-full'
        )}
      >
        <div className="max-w-md mx-auto bg-surface-container-lowest border-t border-outline-variant/20 px-8 pt-10 pb-12 shadow-[0_-40px_80px_-20px_rgba(0,0,0,0.8)]">

          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-5 right-5 text-neutral-700 hover:text-neutral-400 transition-colors"
            aria-label="Close"
          >
            <MaterialIcon name="close" size="sm" />
          </button>

          {/* Header */}
          <div className="mb-8 text-center">
            <div className="w-10 h-10 border border-primary/20 flex items-center justify-center mx-auto mb-5">
              <MaterialIcon name="lock" size="md" className="text-primary/50" />
            </div>
            <h2 className="font-headline italic text-2xl text-on-surface mb-1">
              Sovereign Access
            </h2>
            <p className="font-label text-[9px] uppercase tracking-[0.3em] text-neutral-600">
              Artist Control Panel
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>
            <div className={cn('transition-transform', shake && 'animate-[shake_0.5s_ease-in-out]')}>
              <label
                htmlFor="artist-access-code"
                className="block font-label text-[9px] uppercase tracking-widest text-neutral-600 mb-3"
              >
                Access Code
              </label>
              <input
                id="artist-access-code"
                ref={inputRef}
                type="password"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="••••••"
                autoComplete="off"
                spellCheck={false}
                disabled={attempts >= 3}
                className={cn(
                  'w-full bg-transparent border-b-2 py-4 text-center',
                  'font-headline italic text-2xl tracking-[0.5em]',
                  'text-on-surface placeholder:text-neutral-800',
                  'focus:outline-none transition-colors duration-300',
                  attempts >= 3
                    ? 'border-neutral-800 cursor-not-allowed opacity-40'
                    : shake
                    ? 'border-red-800'
                    : 'border-outline-variant/30 focus:border-primary/60'
                )}
              />
            </div>

            {/* Hint / error */}
            {hint && (
              <p className="mt-3 font-label text-[9px] uppercase tracking-widest text-red-700 text-center">
                {hint}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={!code.trim() || attempts >= 3}
              id="artist-access-submit"
              className={cn(
                'mt-8 w-full py-4 font-label text-[10px] uppercase tracking-[0.25em] transition-all duration-300',
                !code.trim() || attempts >= 3
                  ? 'bg-surface-container text-neutral-700 cursor-not-allowed'
                  : 'gold-gradient-bg text-on-primary hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-8px_rgba(233,195,73,0.3)] active:scale-95'
              )}
            >
              Enter Archive
            </button>
          </form>

          {/* Bottom hint — deliberately cryptic */}
          <p className="mt-6 text-center font-label text-[8px] uppercase tracking-widest text-neutral-800">
            Authorized access only · CHAKRAVYUHA
          </p>
        </div>
      </div>

      {/* Shake keyframe via inline style (Tailwind can't do arbitrary keyframe names inline) */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          15% { transform: translateX(-8px); }
          30% { transform: translateX(8px); }
          45% { transform: translateX(-6px); }
          60% { transform: translateX(6px); }
          75% { transform: translateX(-3px); }
          90% { transform: translateX(3px); }
        }
      `}</style>
    </>
  );
}
