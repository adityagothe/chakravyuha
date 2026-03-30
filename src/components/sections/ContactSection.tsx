'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { SectionHeader } from '../ui/SectionHeader';
import { MaterialIcon } from '../ui/MaterialIcon';
import { GradientButton } from '../ui/GradientButton';

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now just show visual feedback
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: '', email: '', message: '' });
  };

  const inputClasses = cn(
    'w-full bg-surface-container border border-outline-variant/15 rounded-lg px-5 py-4',
    'font-body text-on-surface text-sm placeholder:text-neutral-600',
    'focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20',
    'transition-all duration-300'
  );

  return (
    <section id="contact" className="py-32 px-6 md:px-12 bg-surface-container-low min-h-[80vh] flex items-center">
      <div className="max-w-[800px] mx-auto w-full">
        <SectionHeader
          label="Transmission"
          title="Open a Channel"
          description="Reach out for collaborations, feedback, or just to talk systems."
          className="mb-16"
        />

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            />
          </div>

          <div className="flex items-center justify-between pt-4">
            <p className="font-label text-[10px] uppercase tracking-[0.15em] text-neutral-600">
              {submitted ? (
                <span className="text-green-400 flex items-center gap-2">
                  <MaterialIcon name="check_circle" size="sm" />
                  Transmission received
                </span>
              ) : (
                'All channels are encrypted'
              )}
            </p>
            <button
              type="submit"
              className={cn(
                'gold-gradient-bg text-on-primary rounded-lg font-label font-bold uppercase tracking-widest transition-all',
                'hover:translate-y-[-2px] hover:shadow-[0_10px_30px_-10px_rgba(233,195,73,0.3)]',
                'active:scale-95 px-10 py-4 text-sm'
              )}
            >
              Transmit
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
