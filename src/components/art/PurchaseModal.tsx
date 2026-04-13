'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { MaterialIcon } from '@/components/ui/MaterialIcon';
import { Artwork, buildReservationEmailHref, buildPurchaseEmailHref } from '@/data/artworks';

interface PurchaseModalProps {
  artwork: Artwork;
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'choose' | 'qr' | 'details' | 'confirmation';
type PurchaseType = 'reservation' | 'purchase';

const RESERVATION_FEE = '₹500';

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2 justify-center mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'h-0.5 transition-all duration-500',
            i < current ? 'bg-primary w-8' : i === current ? 'bg-primary/60 w-5' : 'bg-outline-variant/20 w-3'
          )}
        />
      ))}
    </div>
  );
}

export function PurchaseModal({ artwork, isOpen, onClose }: PurchaseModalProps) {
  const [step, setStep] = useState<Step>('choose');
  const [purchaseType, setPurchaseType] = useState<PurchaseType>('purchase');
  const [loading, setLoading] = useState(false);

  // Buyer details
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset on open/close
  useEffect(() => {
    if (isOpen) {
      setStep('choose');
      setName(''); setEmail(''); setPhone(''); setAddress('');
      setErrors({}); setLoading(false);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const stepIndex = { choose: 0, qr: 1, details: 2, confirmation: 3 }[step];

  const validate = useCallback(() => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Name is required';
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Valid email required';
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) e.phone = 'Valid 10-digit phone required';
    if (purchaseType === 'purchase' && !address.trim()) e.address = 'Shipping address is required';
    return e;
  }, [name, email, phone, address, purchaseType]);

  const handleChoose = (type: PurchaseType) => {
    setPurchaseType(type);
    setStep('qr');
  };

  const handleDetailsSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);

    try {
      // Record the order in Supabase
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artwork_id: artwork.id,
          artwork_title: artwork.title,
          buyer_name: name,
          buyer_email: email,
          buyer_phone: phone,
          buyer_address: purchaseType === 'purchase' ? address : null,
          order_type: purchaseType,
          amount: purchaseType === 'reservation' ? RESERVATION_FEE : artwork.price,
        }),
      });
    } catch {
      // Non-blocking — email is the fallback
    }

    // Open the pre-filled email
    const href = purchaseType === 'reservation'
      ? buildReservationEmailHref(artwork, { buyer_name: name, buyer_email: email, buyer_phone: phone, amount: RESERVATION_FEE })
      : buildPurchaseEmailHref(artwork, { buyer_name: name, buyer_email: email, buyer_phone: phone, buyer_address: address, amount: artwork.price });

    window.location.href = href;
    setLoading(false);
    setStep('confirmation');
  }, [validate, artwork, name, email, phone, address, purchaseType]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[400] bg-surface/90 backdrop-blur-xl"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Purchase ${artwork.title}`}
        className="fixed inset-0 z-[401] flex items-center justify-center p-4"
      >
        <div
          className="w-full max-w-md bg-surface-container-lowest border border-outline-variant/15 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9)] flex flex-col max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 pb-0 shrink-0">
            <div>
              <p className="font-label text-[9px] uppercase tracking-[0.3em] text-primary/50 mb-1">
                CHAKRAVYUHA · Original Art
              </p>
              <h2 className="font-headline italic text-xl text-on-surface leading-tight">
                {artwork.title}
              </h2>
              <p className="font-label text-[10px] text-neutral-600 mt-0.5">
                {artwork.medium} · {artwork.dimensions}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-neutral-700 hover:text-primary transition-colors ml-4 mt-1 shrink-0"
              aria-label="Close modal"
            >
              <MaterialIcon name="close" size="sm" />
            </button>
          </div>

          <div className="p-6">
            <StepIndicator current={stepIndex} total={4} />

            {/* ── Step 1: Choose ── */}
            {step === 'choose' && (
              <div className="space-y-4">
                <p className="font-label text-[10px] uppercase tracking-widest text-neutral-500 text-center mb-6">
                  How would you like to proceed?
                </p>

                {/* Reserve */}
                <button
                  id="modal-choose-reserve"
                  onClick={() => handleChoose('reservation')}
                  className="w-full border border-outline-variant/20 p-5 text-left hover:border-primary/40 hover:bg-primary/3 transition-all duration-300 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:border-primary/50 transition-colors">
                      <MaterialIcon name="bookmark" size="sm" className="text-primary/60" />
                    </div>
                    <div>
                      <p className="font-label text-xs uppercase tracking-wider text-on-surface font-bold mb-1">
                        Reserve — 7-Day Hold
                      </p>
                      <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                        Pay a{' '}
                        <span className="text-primary font-semibold">{RESERVATION_FEE} reservation fee</span>{' '}
                        via Paytm to hold this artwork for 7 days while you arrange the full payment.
                      </p>
                    </div>
                  </div>
                </button>

                {/* Buy Now */}
                <button
                  id="modal-choose-buy"
                  onClick={() => handleChoose('purchase')}
                  className="w-full gold-gradient-bg p-5 text-left hover:-translate-y-0.5 transition-all duration-300 shadow-[0_4px_20px_rgba(233,195,73,0.12)] hover:shadow-[0_8px_30px_rgba(233,195,73,0.22)] group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 border border-on-primary/20 flex items-center justify-center shrink-0">
                      <MaterialIcon name="shopping_bag" size="sm" className="text-on-primary" />
                    </div>
                    <div>
                      <p className="font-label text-xs uppercase tracking-wider text-on-primary font-bold mb-1">
                        Buy Now — Full Price
                      </p>
                      <p className="font-body text-sm text-on-primary/80 leading-relaxed">
                        Pay the full amount of{' '}
                        <span className="text-on-primary font-semibold">{artwork.price}</span>{' '}
                        via Paytm QR. Artwork ships after payment confirmation.
                      </p>
                    </div>
                  </div>
                </button>

                <p className="text-center font-label text-[9px] uppercase tracking-widest text-neutral-700 pt-2">
                  Secure · 1 of 1 · No reproductions
                </p>
              </div>
            )}

            {/* ── Step 2: QR Code ── */}
            {step === 'qr' && (
              <div className="space-y-6 text-center">
                <div>
                  <span className={cn(
                    'inline-block font-label text-[9px] uppercase tracking-widest px-3 py-1.5 mb-4',
                    purchaseType === 'reservation' ? 'bg-primary/10 text-primary' : 'gold-gradient-bg text-on-primary'
                  )}>
                    {purchaseType === 'reservation' ? `Reserve · ${RESERVATION_FEE}` : `Buy · ${artwork.price}`}
                  </span>
                  <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                    Scan the Paytm QR code below and pay{' '}
                    <span className="text-primary font-semibold">
                      {purchaseType === 'reservation' ? RESERVATION_FEE : artwork.price}
                    </span>.
                    <br />After payment, click <strong className="text-on-surface">"I've Paid"</strong> to proceed.
                  </p>
                </div>

                {/* QR Code Image */}
                <div className="flex justify-center">
                  <div className="relative w-56 h-56 bg-white border-4 border-primary/30 flex items-center justify-center overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/paytm-qr.jpeg"
                      alt="Paytm QR Code for payment"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        // Fallback if no QR uploaded yet
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    {/* Placeholder overlay if image fails */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 pointer-events-none">
                      <MaterialIcon name="qr_code_2" size="4xl" className="text-neutral-300" />
                      <span className="font-label text-[9px] uppercase tracking-widest text-neutral-400">
                        Add paytm-qr.jpeg to public/images/
                      </span>
                    </div>
                  </div>
                </div>

                <p className="font-label text-[9px] uppercase tracking-widest text-neutral-600">
                  UPI · Paytm · CHAKRAVYUHA Studio
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep('choose')}
                    className="flex-1 border border-outline-variant/20 py-3 font-label text-[10px] uppercase tracking-widest text-neutral-500 hover:border-outline-variant/40 hover:text-on-surface transition-all"
                  >
                    Back
                  </button>
                  <button
                    id="modal-paid-btn"
                    onClick={() => setStep('details')}
                    className="flex-2 flex-grow gold-gradient-bg text-on-primary py-3 font-label text-[10px] font-bold uppercase tracking-widest hover:-translate-y-0.5 transition-all shadow-[0_4px_20px_rgba(233,195,73,0.15)]"
                  >
                    I've Paid — Continue
                  </button>
                </div>
              </div>
            )}

            {/* ── Step 3: Buyer Details ── */}
            {step === 'details' && (
              <form onSubmit={handleDetailsSubmit} noValidate className="space-y-5">
                <p className="font-label text-[10px] uppercase tracking-widest text-neutral-500 text-center mb-2">
                  Fill in your details — we'll confirm via email
                </p>

                {/* Name */}
                <div>
                  <label className="block font-label text-[9px] uppercase tracking-widest text-neutral-600 mb-2">
                    Full Name *
                  </label>
                  <input
                    id="buyer-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    className={cn(
                      'w-full bg-surface-container border-b py-3 px-0 font-body text-sm text-on-surface placeholder:text-neutral-700 focus:outline-none transition-colors',
                      errors.name ? 'border-red-800 focus:border-red-600' : 'border-outline-variant/30 focus:border-primary/60'
                    )}
                  />
                  {errors.name && <p className="mt-1 font-label text-[9px] text-red-700">{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block font-label text-[9px] uppercase tracking-widest text-neutral-600 mb-2">
                    Email Address *
                  </label>
                  <input
                    id="buyer-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className={cn(
                      'w-full bg-surface-container border-b py-3 px-0 font-body text-sm text-on-surface placeholder:text-neutral-700 focus:outline-none transition-colors',
                      errors.email ? 'border-red-800 focus:border-red-600' : 'border-outline-variant/30 focus:border-primary/60'
                    )}
                  />
                  {errors.email && <p className="mt-1 font-label text-[9px] text-red-700">{errors.email}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block font-label text-[9px] uppercase tracking-widest text-neutral-600 mb-2">
                    Phone Number *
                  </label>
                  <input
                    id="buyer-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className={cn(
                      'w-full bg-surface-container border-b py-3 px-0 font-body text-sm text-on-surface placeholder:text-neutral-700 focus:outline-none transition-colors',
                      errors.phone ? 'border-red-800 focus:border-red-600' : 'border-outline-variant/30 focus:border-primary/60'
                    )}
                  />
                  {errors.phone && <p className="mt-1 font-label text-[9px] text-red-700">{errors.phone}</p>}
                </div>

                {/* Address — only for direct purchase */}
                {purchaseType === 'purchase' && (
                  <div>
                    <label className="block font-label text-[9px] uppercase tracking-widest text-neutral-600 mb-2">
                      Shipping Address *
                    </label>
                    <textarea
                      id="buyer-address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Full shipping address with PIN code"
                      rows={3}
                      className={cn(
                        'w-full bg-surface-container border-b py-3 px-0 font-body text-sm text-on-surface placeholder:text-neutral-700 focus:outline-none transition-colors resize-none',
                        errors.address ? 'border-red-800 focus:border-red-600' : 'border-outline-variant/30 focus:border-primary/60'
                      )}
                    />
                    {errors.address && <p className="mt-1 font-label text-[9px] text-red-700">{errors.address}</p>}
                  </div>
                )}

                <p className="font-label text-[9px] text-neutral-700 leading-relaxed pt-1">
                  Clicking <strong className="text-neutral-500">"Confirm & Send Email"</strong> will open your email app with a pre-filled message to{' '}
                  <span className="text-primary">chakravyuha.studio@gmail.com</span>.
                </p>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep('qr')}
                    className="flex-1 border border-outline-variant/20 py-3 font-label text-[10px] uppercase tracking-widest text-neutral-500 hover:border-outline-variant/40 transition-all"
                  >
                    Back
                  </button>
                  <button
                    id="modal-confirm-btn"
                    type="submit"
                    disabled={loading}
                    className="flex-grow gold-gradient-bg text-on-primary py-3 font-label text-[10px] font-bold uppercase tracking-widest hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(233,195,73,0.15)] flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span className="w-3 h-3 border border-on-primary/40 border-t-on-primary rounded-full animate-spin" />
                    ) : (
                      <>
                        <MaterialIcon name="mail" size="sm" />
                        Confirm &amp; Send Email
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* ── Step 4: Confirmation ── */}
            {step === 'confirmation' && (
              <div className="text-center space-y-6 py-4">
                <div className="w-16 h-16 border border-primary/30 flex items-center justify-center mx-auto">
                  <MaterialIcon name="check_circle" size="2xl" className="text-primary" />
                </div>
                <div>
                  <h3 className="font-headline italic text-2xl text-on-surface mb-2">
                    {purchaseType === 'reservation' ? 'Reservation Submitted!' : 'Purchase Submitted!'}
                  </h3>
                  <p className="font-body text-sm text-on-surface-variant leading-relaxed max-w-xs mx-auto">
                    {purchaseType === 'reservation'
                      ? `Your 7-day reservation request for "${artwork.title}" has been sent. We'll confirm within 24 hours.`
                      : `Your purchase request for "${artwork.title}" has been sent. We'll confirm and arrange shipping within 24 hours.`}
                  </p>
                </div>
                <div className="bg-surface-container p-4 text-left space-y-2 border border-outline-variant/10">
                  <p className="font-label text-[9px] uppercase tracking-widest text-neutral-600 mb-3">Order Summary</p>
                  <div className="flex justify-between">
                    <span className="font-label text-[10px] text-neutral-500">Artwork</span>
                    <span className="font-label text-[10px] text-on-surface">{artwork.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-label text-[10px] text-neutral-500">Type</span>
                    <span className="font-label text-[10px] text-on-surface capitalize">{purchaseType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-label text-[10px] text-neutral-500">Amount Paid</span>
                    <span className="font-label text-[10px] text-primary font-bold">
                      {purchaseType === 'reservation' ? RESERVATION_FEE : artwork.price}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-label text-[10px] text-neutral-500">Contact</span>
                    <span className="font-label text-[10px] text-on-surface">{email}</span>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-full border border-outline-variant/20 py-3 font-label text-[10px] uppercase tracking-widest text-neutral-500 hover:border-outline-variant/40 hover:text-on-surface transition-all"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
