'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { SectionHeader } from '../ui/SectionHeader';
import { MaterialIcon } from '../ui/MaterialIcon';
import { FadeIn } from '@/components/ui/FadeIn';

// Fallback to empty string to prevent build issues if env is missing
const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY || '';

type FormState = 'idle' | 'loading' | 'success' | 'error';

export function ContactSection() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formState, setFormState] = useState<FormState>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const [lastSubmitTime, setLastSubmitTime] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Cooldown logic (30 seconds)
    const now = Date.now();
    if (now - lastSubmitTime < 30000) {
      setFormState('error');
      setErrorMsg('Please wait a moment before sending another message.');
      setTimeout(() => setFormState('idle'), 4000);
      return;
    }

    // Input validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.name || formData.name.length < 2) {
      setFormState('error');
      setErrorMsg('Name must be at least 2 characters long.');
      setTimeout(() => setFormState('idle'), 4000);
      return;
    }
    if (!emailRegex.test(formData.email)) {
      setFormState('error');
      setErrorMsg('Please provide a valid email address.');
      setTimeout(() => setFormState('idle'), 4000);
      return;
    }
    if (!formData.message || formData.message.length < 10) {
      setFormState('error');
      setErrorMsg('Message must be at least 10 characters long.');
      setTimeout(() => setFormState('idle'), 4000);
      return;
    }

    setFormState('loading');
    setErrorMsg('');

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          name: formData.name,
          email: formData.email,
          message: formData.message,
          subject: `New message from ${formData.name} — Vajravyuha`,
          from_name: 'Vajravyuha Contact',
        }),
      });

      const data = await res.json();

      if (data.success) {
        setFormState('success');
        setFormData({ name: '', email: '', message: '' });
        setLastSubmitTime(Date.now());
        setTimeout(() => setFormState('idle'), 5000);
      } else {
        throw new Error(data.message || 'Submission failed');
      }
    } catch (err) {
      setFormState('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setTimeout(() => setFormState('idle'), 4000);
    }
  };

  const inputClasses = cn(
    'w-full bg-surface-container border border-outline-variant/15 rounded-lg px-5 py-4',
    'font-body text-on-surface text-sm placeholder:text-neutral-600',
    'focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20',
    'transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
  );

  const isLoading = formState === 'loading';

  return (
    <section id="contact" className="py-20 md:py-32 px-6 md:px-12 bg-surface-container-low min-h-[80vh] flex items-center">
      <div className="max-w-[800px] mx-auto w-full">
        <FadeIn>
          <SectionHeader
            label="Transmission"
            title="Open a Channel"
            description="Reach out for collaborations, feedback, or just to talk systems."
            className="mb-12 md:mb-16"
          />
        </FadeIn>

        {/* Success State */}
        {formState === 'success' ? (
          <FadeIn delay={100}>
            <div className="glass-panel rounded-xl border border-primary/20 p-10 md:p-16 flex flex-col items-center text-center gap-6 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <span
                  className="material-symbols-outlined text-green-400 text-[32px]"
                  style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}
                >
                  check_circle
                </span>
              </div>
              <div>
                <h3 className="font-headline text-2xl font-bold text-on-surface mb-2">Transmission Received</h3>
                <p className="font-body text-neutral-400 text-sm leading-relaxed">
                  Your message has been securely submitted and delivered. I&apos;ll respond within 24 hours.
                </p>
              </div>
              <button
                onClick={() => setFormState('idle')}
                className="font-label text-[10px] uppercase tracking-widest text-primary/60 hover:text-primary transition-colors"
              >
                Send another →
              </button>
            </div>
          </FadeIn>
        ) : (
          <FadeIn delay={100}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 md:gap-6" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
                <div>
                  <label htmlFor="contact-name" className="font-label text-[10px] uppercase tracking-[0.2em] text-neutral-500 mb-2 block">
                    Designation
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={inputClasses}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="font-label text-[10px] uppercase tracking-[0.2em] text-neutral-500 mb-2 block">
                    Signal Frequency
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={inputClasses}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-message" className="font-label text-[10px] uppercase tracking-[0.2em] text-neutral-500 mb-2 block">
                  Transmission Content
                </label>
                <textarea
                  id="contact-message"
                  rows={6}
                  placeholder="What's on your mind?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className={cn(inputClasses, 'resize-none')}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Error */}
              {formState === 'error' && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 animate-fade-in">
                  <MaterialIcon name="error" size="sm" className="text-red-400 shrink-0" />
                  <p className="font-label text-xs text-red-400">{errorMsg}</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
                <p className="font-label text-[10px] uppercase tracking-[0.15em] text-neutral-600 flex items-center gap-2">
                  <MaterialIcon name="lock" size="sm" className="opacity-60" />
                  Secure submission via HTTPS
                </p>
                <button
                  id="contact-submit"
                  type="submit"
                  disabled={isLoading}
                  className={cn(
                    'gold-gradient-bg text-on-primary rounded-lg font-label font-bold uppercase tracking-widest',
                    'hover:translate-y-[-2px] hover:shadow-[0_10px_30px_-10px_rgba(233,195,73,0.3)]',
                    'active:scale-95 px-8 md:px-10 py-4 text-sm w-full sm:w-auto',
                    'flex items-center justify-center gap-2 transition-all duration-300',
                    'disabled:opacity-60 disabled:pointer-events-none'
                  )}
                >
                  {isLoading ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
                      Transmitting…
                    </>
                  ) : (
                    <>
                      <MaterialIcon name="send" size="sm" />
                      Transmit
                    </>
                  )}
                </button>
              </div>
            </form>
          </FadeIn>
        )}
      </div>
    </section>
  );
}
