'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { MaterialIcon } from '@/components/ui/MaterialIcon';
import { Artwork } from '@/data/artworks';

interface BidModalProps {
  artwork: Artwork;
  isOpen: boolean;
  onClose: () => void;
}

// ─── Main Modal ────────────────────────────────────────────────────────────────

export function BidModal({ artwork, isOpen, onClose }: BidModalProps) {
  const [step, setStep] = useState<'compose' | 'details' | 'sent'>('compose');
  const [loading, setLoading] = useState(false);

  const [rawAmount, setRawAmount] = useState('');
  const [message, setMessage] = useState('');
  const [amountError, setAmountError] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const amountInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setStep('compose');
      setRawAmount(''); setMessage(''); setAmountError('');
      setName(''); setEmail(''); setPhone(''); setWhatsapp('');
      setErrors({}); setLoading(false);
      setTimeout(() => amountInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const amountNumber = parseFloat(rawAmount.replace(/[^\d.]/g, '')) || 0;
  const listedPrice = artwork.price_number;
  const priceDiff = listedPrice > 0 ? Math.round(((amountNumber - listedPrice) / listedPrice) * 100) : 0;
  const displayAmount = amountNumber > 0 ? `₹${amountNumber.toLocaleString('en-IN')}` : '';

  const handleComposeSubmit = () => {
    if (amountNumber < 1) { setAmountError('Enter a valid offer amount.'); return; }
    setAmountError('');
    setStep('details');
  };

  const validate = useCallback(() => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Name is required';
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Valid email required';
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) e.phone = 'Valid 10-digit phone required';
    return e;
  }, [name, email, phone]);

  const handleSend = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      const res = await fetch('/api/bids', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artwork_id: artwork.id,
          artwork_title: artwork.title,
          bid_amount: displayAmount,
          bid_amount_number: amountNumber,
          buyer_name: name,
          buyer_email: email,
          buyer_phone: phone,
          buyer_whatsapp: whatsapp || null,
          message: message || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to send');
      setStep('sent');
    } catch (err) {
      setErrors({ submit: err instanceof Error ? err.message : 'Something went wrong.' });
    } finally {
      setLoading(false);
    }
  }, [validate, artwork, displayAmount, amountNumber, name, email, phone, whatsapp, message]);

  if (!isOpen) return null;

  const inputBase = 'w-full bg-surface-container border-b border-outline-variant/30 focus:border-primary/60 py-3 px-0 font-body text-sm text-on-surface placeholder:text-neutral-700 focus:outline-none transition-colors';
  const labelBase = 'block font-label text-[9px] uppercase tracking-widest text-neutral-600 mb-2';
  const errorCls = 'mt-1 font-label text-[9px] text-red-500';

  return (
    <>
      <div className="fixed inset-0 z-[400] bg-surface/85 backdrop-blur-xl" onClick={onClose} aria-hidden="true" />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Make an offer for ${artwork.title}`}
        className="fixed inset-0 z-[401] flex items-end sm:items-center justify-center p-0 sm:p-4"
      >
        <div
          className="w-full sm:max-w-md bg-surface-container-lowest border-t sm:border border-outline-variant/15 shadow-[0_-20px_60px_rgba(0,0,0,0.5)] sm:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9)] flex flex-col max-h-[90vh] overflow-hidden rounded-t-2xl sm:rounded-none"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Chat header (always visible) ── */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-outline-variant/10 shrink-0 bg-surface-container-low">
            <div className="w-10 h-10 bg-primary/15 border border-primary/20 flex items-center justify-center shrink-0">
              <MaterialIcon name="palette" size="sm" className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-headline italic text-base text-on-surface truncate">{artwork.title}</p>
              <p className="font-label text-[9px] text-neutral-500 uppercase tracking-widest">
                VAJRAVYUHA · Listed at <span className="text-primary">{artwork.price}</span>
              </p>
            </div>
            {step !== 'sent' && (
              <button onClick={onClose} className="text-neutral-600 hover:text-primary transition-colors shrink-0" aria-label="Close">
                <MaterialIcon name="close" size="sm" />
              </button>
            )}
          </div>

          {/* ── Step 1: Compose ── */}
          {step === 'compose' && (
            <div className="flex flex-col flex-1 overflow-hidden">
              {/* Chat preview area */}
              <div className="flex-1 overflow-y-auto px-5 py-6 space-y-4 bg-[repeating-linear-gradient(180deg,transparent,transparent_39px,rgba(255,255,255,0.015)_40px)]">
                {/* Artist bubble — static prompt */}
                <div className="flex gap-3 items-end">
                  <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <MaterialIcon name="brush" size="sm" className="text-primary/60" />
                  </div>
                  <div className="bg-surface-container border border-outline-variant/10 rounded-2xl rounded-bl-sm px-4 py-3 max-w-[80%]">
                    <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                      Hi! I&apos;m interested in selling <strong className="text-on-surface">&ldquo;{artwork.title}&rdquo;</strong> for <strong className="text-primary">{artwork.price}</strong>. What&apos;s your offer?
                    </p>
                    <p className="font-label text-[8px] text-neutral-700 mt-1.5">VAJRAVYUHA · Artist</p>
                  </div>
                </div>

                {/* Live buyer preview bubble */}
                {amountNumber > 0 && (
                  <div className="flex flex-col items-end gap-1">
                    <div className="bg-primary/20 border border-primary/30 rounded-2xl rounded-br-sm px-4 py-3 max-w-[80%]">
                      <p className="font-headline italic text-xl text-primary">{displayAmount}</p>
                      {message.trim() && (
                        <p className="font-body text-sm text-on-surface-variant leading-relaxed mt-1">{message}</p>
                      )}
                      <div className="flex items-center gap-1.5 mt-1.5 justify-end">
                        <p className="font-label text-[8px] text-neutral-600">Your offer</p>
                        {listedPrice > 0 && (
                          <span className={cn(
                            'font-label text-[8px] px-1.5 py-0.5',
                            priceDiff >= 0 ? 'text-green-400 bg-green-950/30' :
                            priceDiff >= -20 ? 'text-amber-400 bg-amber-950/30' :
                            'text-red-400 bg-red-950/20'
                          )}>
                            {priceDiff >= 0 ? `+${priceDiff}%` : `${priceDiff}%`}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Placeholder when no amount yet */}
                {amountNumber === 0 && (
                  <p className="text-center font-label text-[9px] uppercase tracking-widest text-neutral-700 py-4">
                    Type your offer below — it&apos;s non-binding, no payment required
                  </p>
                )}
              </div>

              {/* Compose box */}
              <div className="border-t border-outline-variant/10 bg-surface-container-lowest p-4 space-y-3 shrink-0">
                {amountError && (
                  <p className="font-label text-[9px] text-red-500">{amountError}</p>
                )}
                <div className="flex items-center gap-2 bg-surface-container border border-outline-variant/20 px-4 py-2">
                  <span className="font-headline italic text-xl text-primary shrink-0">₹</span>
                  <input
                    ref={amountInputRef}
                    id="bid-amount-input"
                    type="number"
                    min="1"
                    value={rawAmount}
                    onChange={(e) => { setRawAmount(e.target.value); setAmountError(''); }}
                    placeholder="Your offer amount"
                    className="flex-1 bg-transparent font-headline italic text-xl text-on-surface placeholder:text-neutral-700 focus:outline-none"
                  />
                </div>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Add a message... (optional)"
                  rows={2}
                  className="w-full bg-surface-container border border-outline-variant/20 resize-none font-body text-sm text-on-surface placeholder:text-neutral-700 px-4 py-2 focus:outline-none focus:border-primary/40 transition-colors"
                />
                <button
                  id="bid-compose-next"
                  onClick={handleComposeSubmit}
                  disabled={!rawAmount}
                  className="w-full gold-gradient-bg text-on-primary font-label text-[10px] font-bold uppercase tracking-widest py-3.5 flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(233,195,73,0.15)]"
                >
                  <MaterialIcon name="send" size="sm" />
                  Next — Add Your Contact
                </button>
              </div>
            </div>
          )}

          {/* ── Step 2: Contact details ── */}
          {step === 'details' && (
            <form onSubmit={handleSend} noValidate className="flex flex-col flex-1 overflow-hidden">
              {/* Offer summary in chat bubble */}
              <div className="px-5 py-4 flex gap-3 items-end border-b border-outline-variant/10 bg-surface-container-low/50">
                <div className="flex flex-col items-end flex-1">
                  <div className="bg-primary/20 border border-primary/30 rounded-2xl rounded-br-sm px-4 py-3 inline-block">
                    <p className="font-headline italic text-xl text-primary">{displayAmount}</p>
                    {message.trim() && (
                      <p className="font-body text-xs text-on-surface-variant mt-0.5 max-w-[200px] truncate">{message}</p>
                    )}
                  </div>
                </div>
                <button type="button" onClick={() => setStep('compose')}
                  className="font-label text-[8px] uppercase tracking-widest text-neutral-600 border border-outline-variant/20 px-2 py-1 hover:bg-surface-container transition-all shrink-0">
                  Edit
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
                <p className="font-label text-[9px] uppercase tracking-widest text-neutral-500 text-center">
                  Where should the artist reply?
                </p>

                {errors.submit && (
                  <div className="bg-red-950/30 border border-red-900/30 text-red-400 p-3 flex items-center gap-2">
                    <MaterialIcon name="error" size="sm" />
                    <span className="font-label text-[9px]">{errors.submit}</span>
                  </div>
                )}

                <div>
                  <label className={labelBase}>Full Name *</label>
                  <input id="bid-name" type="text" value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="Your name" className={cn(inputBase, errors.name && 'border-red-800')} autoFocus />
                  {errors.name && <p className={errorCls}>{errors.name}</p>}
                </div>
                <div>
                  <label className={labelBase}>Email *</label>
                  <input id="bid-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com" className={cn(inputBase, errors.email && 'border-red-800')} />
                  {errors.email && <p className={errorCls}>{errors.email}</p>}
                </div>
                <div>
                  <label className={labelBase}>Phone *</label>
                  <input id="bid-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210" className={cn(inputBase, errors.phone && 'border-red-800')} />
                  {errors.phone && <p className={errorCls}>{errors.phone}</p>}
                </div>
                <div>
                  <label className={labelBase}>WhatsApp <span className="normal-case text-neutral-700 tracking-normal">(optional — fastest reply)</span></label>
                  <input id="bid-whatsapp" type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="Same or different number" className={inputBase} />
                </div>
              </div>

              <div className="border-t border-outline-variant/10 p-4 shrink-0">
                <button id="bid-send-btn" type="submit" disabled={loading}
                  className="w-full gold-gradient-bg text-on-primary font-label text-[10px] font-bold uppercase tracking-widest py-4 flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all disabled:opacity-50 shadow-[0_4px_20px_rgba(233,195,73,0.15)]">
                  {loading
                    ? <span className="w-3 h-3 border border-on-primary/40 border-t-on-primary rounded-full animate-spin" />
                    : <><MaterialIcon name="send" size="sm" />Send Offer to Artist</>}
                </button>
                <p className="text-center font-label text-[8px] text-neutral-700 mt-2 uppercase tracking-widest">
                  Non-binding · No payment required
                </p>
              </div>
            </form>
          )}

          {/* ── Step 3: Sent confirmation ── */}
          {step === 'sent' && (
            <div className="flex flex-col flex-1 overflow-y-auto">
              {/* Chat — sent bubble */}
              <div className="flex-1 px-5 py-6 space-y-4">
                <div className="flex flex-col items-end gap-1">
                  <div className="bg-primary/20 border border-primary/30 rounded-2xl rounded-br-sm px-4 py-3 max-w-[80%]">
                    <p className="font-headline italic text-xl text-primary">{displayAmount}</p>
                    {message.trim() && <p className="font-body text-sm text-on-surface-variant mt-1">{message}</p>}
                  </div>
                  <div className="flex items-center gap-1 text-primary/60">
                    <MaterialIcon name="done_all" size="sm" />
                    <span className="font-label text-[8px] uppercase tracking-widest">Delivered to artist</span>
                  </div>
                </div>

                {/* Artist auto-reply bubble */}
                <div className="flex gap-3 items-end">
                  <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <MaterialIcon name="brush" size="sm" className="text-primary/60" />
                  </div>
                  <div className="bg-surface-container border border-outline-variant/10 rounded-2xl rounded-bl-sm px-4 py-3 max-w-[80%]">
                    <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                      Thanks for your offer! I&apos;ll review it and reply to <strong className="text-primary">{email}</strong> within 24 hours.
                    </p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      <p className="font-label text-[8px] text-neutral-600">VAJRAVYUHA · Now</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-outline-variant/10 p-5 shrink-0 space-y-3">
                <p className="font-label text-[9px] text-neutral-600 text-center uppercase tracking-widest">
                  The artist will confirm via email once they respond
                </p>
                <button onClick={onClose}
                  className="w-full border border-primary/30 py-3 font-label text-[10px] uppercase tracking-widest text-primary hover:bg-primary/5 transition-all">
                  Done — Back to Collection
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
