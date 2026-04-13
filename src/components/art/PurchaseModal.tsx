'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { MaterialIcon } from '@/components/ui/MaterialIcon';
import {
  Artwork,
  calculateReservationFee,
  estimateDelivery,
} from '@/data/artworks';

interface PurchaseModalProps {
  artwork: Artwork;
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'choose' | 'qr' | 'utr' | 'details' | 'confirmation';
type PurchaseType = 'reservation' | 'purchase';

// ─── Step Indicator ────────────────────────────────────────────────────────────

const STEPS = ['Choose', 'Pay', 'Verify', 'Details', 'Done'];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-1 mb-8">
      {STEPS.map((label, i) => (
        <React.Fragment key={label}>
          <div className="flex flex-col items-center gap-1">
            <div
              className={cn(
                'w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold font-label transition-all duration-300',
                i < current && 'bg-primary text-on-primary',
                i === current && 'bg-primary/20 text-primary border border-primary/40',
                i > current && 'bg-surface-container text-neutral-700 border border-outline-variant/20'
              )}
            >
              {i < current ? <MaterialIcon name="check" size="sm" /> : i + 1}
            </div>
            <span className={cn(
              'font-label text-[7px] uppercase tracking-widest hidden sm:block',
              i === current ? 'text-primary' : 'text-neutral-700'
            )}>{label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={cn(
              'h-0.5 w-5 mb-4 transition-all duration-500',
              i < current ? 'bg-primary' : 'bg-outline-variant/20'
            )} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ─── Order Timeline (on confirmation) ─────────────────────────────────────────

function OrderTimeline() {
  const steps = [
    { icon: 'check_circle', label: 'Order Placed', done: true },
    { icon: 'inventory_2', label: 'Packing', done: false },
    { icon: 'local_shipping', label: 'Shipped', done: false },
    { icon: 'home', label: 'Delivered', done: false },
  ];
  return (
    <div className="flex items-start justify-between gap-1 py-2">
      {steps.map((s, i) => (
        <React.Fragment key={s.label}>
          <div className="flex flex-col items-center gap-1.5 min-w-0">
            <div className={cn(
              'w-9 h-9 rounded-full flex items-center justify-center border transition-all',
              s.done
                ? 'bg-primary/20 border-primary/40 text-primary'
                : 'bg-surface-container border-outline-variant/20 text-neutral-700'
            )}>
              <MaterialIcon name={s.icon} size="sm" />
            </div>
            <span className="font-label text-[7px] uppercase tracking-widest text-center leading-tight text-neutral-500 w-12">{s.label}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={cn(
              'h-0.5 flex-1 mt-4 transition-all',
              s.done ? 'bg-primary/40' : 'bg-outline-variant/15'
            )} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ─── Main Modal ────────────────────────────────────────────────────────────────

export function PurchaseModal({ artwork, isOpen, onClose }: PurchaseModalProps) {
  const [step, setStep] = useState<Step>('choose');
  const [purchaseType, setPurchaseType] = useState<PurchaseType>('purchase');
  const [loading, setLoading] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<{
    order_id: string | null;
    amount: string;
  } | null>(null);

  // UTR step
  const [utr, setUtr] = useState('');
  const [utrError, setUtrError] = useState('');

  // Buyer details
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const reservationFee = calculateReservationFee(artwork);
  const deliveryEst = estimateDelivery(pincode);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setStep('choose');
      setUtr(''); setUtrError('');
      setName(''); setEmail(''); setPhone(''); setWhatsapp('');
      setAddress(''); setPincode('');
      setErrors({}); setLoading(false);
      setPlacedOrder(null);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const stepIndex: Record<Step, number> = {
    choose: 0, qr: 1, utr: 2, details: 3, confirmation: 4
  };

  const payAmount = purchaseType === 'reservation' ? reservationFee.display : artwork.price;
  const payNumber = purchaseType === 'reservation' ? reservationFee.number : artwork.price_number;

  // ── Validate UTR ─────────────────────────────────────────────────────────────
  const handleUtrSubmit = () => {
    const clean = utr.trim().replace(/\s/g, '');
    // UPI UTR is typically 12 alphanumeric characters
    if (clean.length < 10 || clean.length > 24) {
      setUtrError('Please enter a valid UPI Transaction Reference (10–24 characters). Check your UPI app → payment receipt.');
      return;
    }
    setUtrError('');
    setStep('details');
  };

  // ── Validate details + submit order ─────────────────────────────────────────
  const validate = useCallback(() => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Name is required';
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Valid email required';
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) e.phone = 'Valid 10-digit phone required';
    if (purchaseType === 'purchase' && !address.trim()) e.address = 'Shipping address is required';
    if (purchaseType === 'purchase' && pincode.replace(/\D/g, '').length !== 6) e.pincode = 'Valid 6-digit PIN code required';
    return e;
  }, [name, email, phone, address, pincode, purchaseType]);

  const handleDetailsSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artwork_id: artwork.id,
          artwork_title: artwork.title,
          buyer_name: name,
          buyer_email: email,
          buyer_phone: phone,
          buyer_whatsapp: whatsapp || null,
          buyer_address: purchaseType === 'purchase' ? address : null,
          buyer_pincode: purchaseType === 'purchase' ? pincode : null,
          order_type: purchaseType,
          amount: payAmount,
          upi_transaction_id: utr.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to place order');

      setPlacedOrder({ order_id: data.order_id ?? null, amount: payAmount });
      // No auto-email here — confirmation is sent by the artist after verifying the UTR
      setStep('confirmation');
    } catch (err) {
      setErrors({ submit: err instanceof Error ? err.message : 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  }, [validate, artwork, name, email, phone, whatsapp, address, pincode, purchaseType, payAmount, utr]);

  if (!isOpen) return null;

  const inputClass = 'w-full bg-surface-container border-b border-outline-variant/30 focus:border-primary/60 py-3 px-0 font-body text-sm text-on-surface placeholder:text-neutral-700 focus:outline-none transition-colors';
  const labelClass = 'block font-label text-[9px] uppercase tracking-widest text-neutral-600 mb-2';
  const errorClass = 'mt-1 font-label text-[9px] text-red-500';

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
          className="w-full max-w-md bg-surface-container-lowest border border-outline-variant/15 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9)] flex flex-col max-h-[92vh] overflow-y-auto"
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
            {step !== 'confirmation' && (
              <button
                onClick={onClose}
                className="text-neutral-700 hover:text-primary transition-colors ml-4 mt-1 shrink-0"
                aria-label="Close modal"
              >
                <MaterialIcon name="close" size="sm" />
              </button>
            )}
          </div>

          <div className="p-6">
            <StepIndicator current={stepIndex[step]} />

            {/* ── Step 1: Choose ────────────────────────────────────────── */}
            {step === 'choose' && (
              <div className="space-y-4">
                <p className="font-label text-[10px] uppercase tracking-widest text-neutral-500 text-center mb-6">
                  How would you like to proceed?
                </p>

                {/* Reserve */}
                <button
                  id="modal-choose-reserve"
                  onClick={() => { setPurchaseType('reservation'); setStep('qr'); }}
                  className="w-full border border-outline-variant/20 p-5 text-left hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 group"
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
                        <span className="text-primary font-semibold">10% reservation fee ({reservationFee.display})</span>{' '}
                        to hold this artwork for 7 days while you arrange the full payment.
                      </p>
                    </div>
                  </div>
                </button>

                {/* Buy Now */}
                <button
                  id="modal-choose-buy"
                  onClick={() => { setPurchaseType('purchase'); setStep('qr'); }}
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
                        via Paytm / UPI. Artwork ships after payment verification.
                      </p>
                    </div>
                  </div>
                </button>

                <p className="text-center font-label text-[9px] uppercase tracking-widest text-neutral-700 pt-2">
                  Secure · 1 of 1 · No reproductions
                </p>
              </div>
            )}

            {/* ── Step 2: QR Code ───────────────────────────────────────── */}
            {step === 'qr' && (
              <div className="space-y-5 text-center">
                <div>
                  <span className={cn(
                    'inline-block font-label text-[9px] uppercase tracking-widest px-3 py-1.5 mb-3',
                    purchaseType === 'reservation' ? 'bg-primary/10 text-primary' : 'gold-gradient-bg text-on-primary'
                  )}>
                    {purchaseType === 'reservation' ? `Reserve · ${reservationFee.display}` : `Buy · ${artwork.price}`}
                  </span>

                  {/* ⚠️ UTR Warning — must be seen before paying */}
                  <div className="bg-red-950/30 border-2 border-red-600/50 p-4 text-left mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MaterialIcon name="warning" size="sm" className="text-red-400 shrink-0" />
                      <p className="font-label text-[10px] uppercase tracking-widest text-red-300 font-bold">
                        Important — Read Before Paying
                      </p>
                    </div>
                    <p className="font-body text-sm text-red-200 leading-relaxed">
                      After making the payment, your UPI app will show a{' '}
                      <strong className="text-white">Transaction ID / UTR number</strong>.
                      {' '}<strong className="text-red-100 underline">Write it down or take a screenshot</strong>{' '}
                      — you must enter it in the next step to prove your payment.
                      Without it, your order cannot be confirmed.
                    </p>
                  </div>

                  {/* Step-by-step payment guide */}
                  <div className="bg-surface-container border border-outline-variant/10 p-4 text-left space-y-2.5 mb-4">
                    <p className="font-label text-[9px] uppercase tracking-widest text-neutral-500 mb-3">How to Pay</p>
                    {[
                      { n: '1', text: `Open Paytm, PhonePe, GPay or any UPI app` },
                      { n: '2', text: `Scan the QR code below` },
                      { n: '3', text: `Pay exactly ${purchaseType === 'reservation' ? reservationFee.display : artwork.price}` },
                      { n: '4', text: `IMPORTANT: Note down or screenshot your Transaction ID / UTR number shown in the app after payment` },
                      { n: '5', text: `Click the button below and enter that Transaction ID in the next step` },
                    ].map((item) => (
                      <div key={item.n} className="flex items-start gap-3">
                        <span className={cn(
                          'w-5 h-5 rounded-full font-bold font-label text-[9px] flex items-center justify-center shrink-0 mt-0.5',
                          item.n === '4' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-primary/15 text-primary'
                        )}>{item.n}</span>
                        <p className={cn(
                          'font-body text-sm leading-snug',
                          item.n === '4' ? 'text-red-200 font-medium' : 'text-on-surface-variant'
                        )}>{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* QR Code */}
                <div className="flex justify-center">
                  <div className="relative w-52 h-52 bg-white border-4 border-primary/30 flex items-center justify-center overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/paytm-qr.jpeg"
                      alt="Paytm QR Code"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 pointer-events-none">
                      <MaterialIcon name="qr_code_2" size="4xl" className="text-neutral-300" />
                      <span className="font-label text-[8px] uppercase tracking-widest text-neutral-400 text-center px-2">
                        Add paytm-qr.jpeg to public/images/
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-950/20 border border-amber-900/30 p-3 text-left flex items-start gap-3">
                  <MaterialIcon name="info" size="sm" className="text-amber-400 shrink-0 mt-0.5" />
                  <p className="font-body text-sm text-amber-200/80 leading-relaxed">
                    <strong className="text-amber-300">Important:</strong> After paying, go to your UPI app → Payment history → Open this payment → Copy the <strong className="text-amber-200">Transaction ID / UTR number</strong>. You need it in the next step.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep('choose')}
                    className="flex-1 border border-outline-variant/20 py-3 font-label text-[10px] uppercase tracking-widest text-neutral-500 hover:border-outline-variant/40 hover:text-on-surface transition-all"
                  >
                    Back
                  </button>
                  <button
                    id="modal-paid-btn"
                    onClick={() => setStep('utr')}
                    className="flex-grow-[2] gold-gradient-bg text-on-primary py-3 font-label text-[10px] font-bold uppercase tracking-widest hover:-translate-y-0.5 transition-all shadow-[0_4px_20px_rgba(233,195,73,0.15)] flex items-center justify-center gap-2"
                  >
                    <MaterialIcon name="check" size="sm" />
                    I&apos;ve Paid — Enter Transaction ID
                  </button>
                </div>
              </div>
            )}

            {/* ── Step 3: UTR Verification ──────────────────────────────── */}
            {step === 'utr' && (
              <div className="space-y-5">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/15 border border-primary/30 flex items-center justify-center mx-auto mb-3">
                    <MaterialIcon name="receipt_long" size="md" className="text-primary" />
                  </div>
                  <p className="font-label text-[10px] uppercase tracking-widest text-neutral-500">
                    Enter Your Payment Reference
                  </p>
                </div>

                {/* Explanation box */}
                <div className="bg-surface-container border border-outline-variant/10 p-4 space-y-3">
                  <p className="font-label text-[9px] uppercase tracking-widest text-neutral-500">Where to find your Transaction ID?</p>
                  <div className="space-y-2">
                    {[
                      { app: 'Google Pay', path: 'Open GPay → Tap payment → "Transaction ID"' },
                      { app: 'PhonePe', path: 'Open PhonePe → History → Tap payment → "UTR Number"' },
                      { app: 'Paytm', path: 'Open Paytm → Passbook → Tap payment → "Order ID / UTR"' },
                      { app: 'Any UPI', path: 'Payment receipt SMS → UPI Ref / Transaction Ref number' },
                    ].map((item) => (
                      <div key={item.app} className="flex items-start gap-2">
                        <span className="font-label text-[9px] text-primary shrink-0 w-16">{item.app}</span>
                        <span className="font-body text-xs text-on-surface-variant leading-snug">{item.path}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* UTR Input */}
                <div>
                  <label className={labelClass}>
                    UPI Transaction Reference (UTR) *
                  </label>
                  <input
                    id="utr-input"
                    type="text"
                    value={utr}
                    onChange={(e) => { setUtr(e.target.value); setUtrError(''); }}
                    placeholder="e.g. 512345678901 or T2026041300001"
                    className={cn(
                      inputClass,
                      utrError ? 'border-red-800 focus:border-red-600' : ''
                    )}
                    autoFocus
                  />
                  {utrError && <p className={errorClass}>{utrError}</p>}
                  <p className="mt-2 font-body text-xs text-neutral-600 leading-relaxed">
                    This unique reference number proves your payment. Without a valid UTR, your order cannot be confirmed.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep('qr')}
                    className="flex-1 border border-outline-variant/20 py-3 font-label text-[10px] uppercase tracking-widest text-neutral-500 hover:border-outline-variant/40 transition-all"
                  >
                    Back
                  </button>
                  <button
                    id="utr-submit-btn"
                    onClick={handleUtrSubmit}
                    disabled={!utr.trim()}
                    className="flex-grow-[2] gold-gradient-bg text-on-primary py-3 font-label text-[10px] font-bold uppercase tracking-widest hover:-translate-y-0.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <MaterialIcon name="arrow_forward" size="sm" />
                    Verify & Continue
                  </button>
                </div>
              </div>
            )}

            {/* ── Step 4: Buyer Details ─────────────────────────────────── */}
            {step === 'details' && (
              <form onSubmit={handleDetailsSubmit} noValidate className="space-y-5">
                <p className="font-label text-[10px] uppercase tracking-widest text-neutral-500 text-center mb-2">
                  Your Details — for order confirmation
                </p>

                {errors.submit && (
                  <div className="bg-red-950/30 border border-red-900/30 text-red-400 p-3 flex items-center gap-2">
                    <MaterialIcon name="error" size="sm" />
                    <span className="font-label text-[9px]">{errors.submit}</span>
                  </div>
                )}

                {/* Name */}
                <div>
                  <label className={labelClass}>Full Name *</label>
                  <input id="buyer-name" type="text" value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    className={cn(inputClass, errors.name && 'border-red-800 focus:border-red-600')} />
                  {errors.name && <p className={errorClass}>{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className={labelClass}>Email Address *</label>
                  <input id="buyer-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className={cn(inputClass, errors.email && 'border-red-800 focus:border-red-600')} />
                  {errors.email && <p className={errorClass}>{errors.email}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className={labelClass}>Phone Number *</label>
                  <input id="buyer-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className={cn(inputClass, errors.phone && 'border-red-800 focus:border-red-600')} />
                  {errors.phone && <p className={errorClass}>{errors.phone}</p>}
                </div>

                {/* WhatsApp */}
                <div>
                  <label className={labelClass}>
                    WhatsApp Number{' '}
                    <span className="text-neutral-700 normal-case tracking-normal">(optional — for shipping updates)</span>
                  </label>
                  <input id="buyer-whatsapp" type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="Same as phone or different"
                    className={inputClass} />
                </div>

                {/* Address + PIN — only for direct purchase */}
                {purchaseType === 'purchase' && (
                  <>
                    <div>
                      <label className={labelClass}>Shipping Address *</label>
                      <textarea id="buyer-address" value={address} onChange={(e) => setAddress(e.target.value)}
                        placeholder="House/Flat No, Street, City, State"
                        rows={3}
                        className={cn(inputClass, 'resize-none', errors.address && 'border-red-800 focus:border-red-600')} />
                      {errors.address && <p className={errorClass}>{errors.address}</p>}
                    </div>

                    <div>
                      <label className={labelClass}>PIN Code *</label>
                      <input id="buyer-pincode" type="text" maxLength={6} value={pincode}
                        onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="6-digit PIN code"
                        className={cn(inputClass, errors.pincode && 'border-red-800 focus:border-red-600')} />
                      {errors.pincode && <p className={errorClass}>{errors.pincode}</p>}

                      {/* Live delivery estimate */}
                      {deliveryEst.isValid && (
                        <div className="mt-3 bg-primary/5 border border-primary/15 p-3 flex items-start gap-3">
                          <MaterialIcon name="local_shipping" size="sm" className="text-primary shrink-0 mt-0.5" />
                          <div>
                            <p className="font-label text-[10px] uppercase tracking-widest text-primary mb-0.5">
                              📍 Estimated Delivery for PIN {pincode}
                            </p>
                            <p className="font-body text-sm text-on-surface-variant">
                              <strong className="text-on-surface">{deliveryEst.minDays}–{deliveryEst.maxDays} business days</strong>
                              {' '}via India Post
                            </p>
                            <p className="font-label text-[8px] text-neutral-600 mt-0.5 uppercase tracking-widest">
                              {deliveryEst.zone} · Includes ~3 days for packing &amp; posting
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* UTR summary */}
                <div className="bg-surface-container border border-outline-variant/10 p-3 flex items-center gap-3">
                  <MaterialIcon name="verified" size="sm" className="text-primary shrink-0" />
                  <div>
                    <p className="font-label text-[9px] uppercase tracking-widest text-neutral-600">Payment Reference Submitted</p>
                    <p className="font-label text-xs text-primary font-mono mt-0.5">{utr}</p>
                  </div>
                </div>

                <p className="font-label text-[9px] text-neutral-700 leading-relaxed pt-1">
                  Clicking <strong className="text-neutral-500">"Place Order"</strong> will submit your order for artist verification and open a confirmation email to{' '}
                  <span className="text-primary">vajra.vyuha.official@gmail.com</span>.
                  Your order is confirmed only after the artist verifies your payment reference.
                </p>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setStep('utr')}
                    className="flex-1 border border-outline-variant/20 py-3 font-label text-[10px] uppercase tracking-widest text-neutral-500 hover:border-outline-variant/40 transition-all">
                    Back
                  </button>
                  <button id="modal-confirm-btn" type="submit" disabled={loading}
                    className="flex-grow-[2] gold-gradient-bg text-on-primary py-3 font-label text-[10px] font-bold uppercase tracking-widest hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(233,195,73,0.15)]">
                    {loading
                      ? <span className="w-3 h-3 border border-on-primary/40 border-t-on-primary rounded-full animate-spin" />
                      : <><MaterialIcon name="shopping_bag" size="sm" />Place Order</>}
                  </button>
                </div>
              </form>
            )}

            {/* ── Step 5: Confirmation ──────────────────────────────────── */}
            {step === 'confirmation' && (
              <div className="space-y-5 py-2">
                {/* Celebration header */}
                <div className="text-center">
                  <div className="w-16 h-16 border border-primary/30 bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <MaterialIcon name="celebration" size="2xl" className="text-primary" />
                  </div>
                  <h3 className="font-headline italic text-2xl text-on-surface mb-1">
                    {purchaseType === 'reservation' ? 'Reservation Submitted!' : 'Congratulations! 🎉'}
                  </h3>
                  <p className="font-body text-sm text-on-surface-variant leading-relaxed max-w-xs mx-auto">
                    {purchaseType === 'reservation'
                      ? `Your reservation request for "${artwork.title}" is under review. The artist will verify your payment and confirm within a few hours.`
                      : `Your order for "${artwork.title}" is placed! It is coming to your home via India Post.`}
                  </p>
                </div>

                {/* India Post shipping notice — purchase only */}
                {purchaseType === 'purchase' && (
                  <div className="bg-primary/8 border border-primary/20 p-4 space-y-2">
                    <div className="flex items-center gap-2 mb-2">
                      <MaterialIcon name="local_shipping" size="sm" className="text-primary" />
                      <p className="font-label text-[9px] uppercase tracking-widest text-primary">Shipping via India Post</p>
                    </div>
                    <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                      Your artwork will be carefully packed and shipped via <strong className="text-on-surface">India Post</strong>.
                      Your <strong className="text-on-surface">Tracker ID</strong> will be sent to{' '}
                      <strong className="text-primary">{email || 'your email'}</strong> as soon as we pack and dispatch it.
                    </p>
                    {deliveryEst.isValid && (
                      <p className="font-label text-[9px] uppercase tracking-widest text-neutral-500 mt-1">
                        Estimated delivery: {deliveryEst.minDays}–{deliveryEst.maxDays} business days
                      </p>
                    )}
                  </div>
                )}

                {/* What happens next — reservation */}
                {purchaseType === 'reservation' && (
                  <div className="bg-amber-950/20 border border-amber-900/30 p-4 space-y-2">
                    <div className="flex items-center gap-2 mb-1">
                      <MaterialIcon name="info" size="sm" className="text-amber-400" />
                      <p className="font-label text-[9px] uppercase tracking-widest text-amber-400">What happens next?</p>
                    </div>
                    <p className="font-body text-sm text-amber-200/80 leading-relaxed">
                      The artist will verify your payment reference. Once confirmed, your artwork is held for <strong className="text-amber-200">7 days</strong>. Complete the remaining balance within that time — then it ships via India Post!
                    </p>
                  </div>
                )}

                {/* Order summary */}
                <div className="bg-surface-container border border-outline-variant/10 p-4 space-y-2.5">
                  <p className="font-label text-[9px] uppercase tracking-widest text-neutral-600 mb-3">Order Summary</p>
                  {[
                    { label: 'Order ID', value: placedOrder?.order_id ?? '—', highlight: true },
                    { label: 'Artwork', value: artwork.title },
                    { label: 'Type', value: purchaseType === 'reservation' ? '7-Day Hold' : 'Direct Purchase' },
                    { label: purchaseType === 'reservation' ? 'Reservation Fee' : 'Amount', value: placedOrder?.amount ?? payAmount, highlight: true },
                    { label: 'Payment Ref (UTR)', value: utr },
                    { label: 'Status', value: '⏳ Awaiting Payment Verification' },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between items-start gap-4">
                      <span className="font-label text-[9px] text-neutral-600 shrink-0">{row.label}</span>
                      <span className={cn(
                        'font-label text-[10px] text-right',
                        row.highlight ? 'text-primary font-bold' : 'text-on-surface'
                      )}>{row.value}</span>
                    </div>
                  ))}
                </div>

                {/* Order Timeline */}
                <div className="bg-surface-container border border-outline-variant/10 p-4">
                  <p className="font-label text-[9px] uppercase tracking-widest text-neutral-600 mb-4">Your Order Journey</p>
                  <OrderTimeline />
                </div>

                {/* Certificate of Authenticity */}
                <div className="flex items-center gap-3 border border-outline-variant/15 p-3">
                  <MaterialIcon name="workspace_premium" size="md" className="text-primary/60 shrink-0" />
                  <p className="font-body text-sm text-on-surface-variant leading-snug">
                    A <strong className="text-on-surface">signed Certificate of Authenticity</strong> will be included with your artwork.
                  </p>
                </div>

                {/* Payment verification notice */}
                <div className="bg-surface-container-high border border-outline-variant/10 p-3 flex items-start gap-2">
                  <MaterialIcon name="pending" size="sm" className="text-amber-400 shrink-0 mt-0.5" />
                  <p className="font-body text-xs text-on-surface-variant leading-relaxed">
                    <strong className="text-on-surface">Payment Verification Pending:</strong> The artist will match your UTR <span className="text-primary font-mono text-[11px]">{utr}</span> with their bank records. You will receive a confirmation email within a few hours.
                  </p>
                </div>

                <button
                  onClick={onClose}
                  className="w-full border border-primary/30 py-3 font-label text-[10px] uppercase tracking-widest text-primary hover:bg-primary/5 transition-all"
                >
                  Done — View the Collection
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
