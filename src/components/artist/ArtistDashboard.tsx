'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { MaterialIcon } from '@/components/ui/MaterialIcon';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { supabase } from '@/lib/supabase';
import {
  Artwork,
  Bid,
  Doodle,
  Order,
  OrderStatus,
  buildBidAcceptedEmailHref,
  buildBidCounterEmailHref,
  buildBidDeclinedEmailHref,
  buildDailyReminderHref,
  buildOrderConfirmationEmailHref,
  buildShippingNotificationHref,
  buildWhatsAppShippingHref,
  getReservationDay,
  isReservationExpired,
  reservationCountdown,
  estimateDelivery,
} from '@/data/artworks';

// ─── Nav tabs ─────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: 'dashboard',       label: 'Dashboard',       icon: 'dashboard' },
  { id: 'add',             label: 'Add Artwork',      icon: 'add_circle' },
  { id: 'manage',          label: 'Manage Artworks',  icon: 'grid_view' },
  { id: 'add-doodle',      label: 'Add Doodle',       icon: 'draw' },
  { id: 'manage-doodles',  label: 'Manage Doodles',   icon: 'gesture' },
  { id: 'orders',          label: 'Orders',           icon: 'receipt_long' },
  { id: 'bids',            label: 'Bids',             icon: 'gavel' },
  { id: 'settings',        label: 'Settings',         icon: 'settings' },
] as const;

type NavId = (typeof NAV_ITEMS)[number]['id'];

// ─── Badges ──────────────────────────────────────────────────────────────────

function ArtworkBadge({ status }: { status: Artwork['status'] }) {
  return (
    <span className={cn(
      'inline-block font-label text-[8px] uppercase tracking-widest px-2 py-0.5',
      status === 'available'   && 'text-primary bg-primary/10',
      status === 'sold'        && 'text-neutral-600 bg-surface-container',
      status === 'reserved'    && 'text-amber-400 bg-amber-950/50',
      status === 'coming_soon' && 'text-neutral-500 bg-surface-container-high',
    )}>
      {status === 'available' ? 'For Sale' : status === 'coming_soon' ? 'Coming Soon' : status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

const ORDER_STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  pending_verification: { label: 'Verify Payment', color: 'text-yellow-400', bg: 'bg-yellow-950/40' },
  pending:              { label: 'Pending',         color: 'text-amber-400',  bg: 'bg-amber-950/40' },
  confirmed:            { label: 'Confirmed',       color: 'text-primary',    bg: 'bg-primary/10'   },
  packing:              { label: 'Packing',         color: 'text-sky-400',    bg: 'bg-sky-950/40'   },
  shipped:              { label: 'Shipped',         color: 'text-green-400',  bg: 'bg-green-950/40' },
  completed:            { label: 'Delivered',       color: 'text-green-500',  bg: 'bg-green-950/50' },
  expired:              { label: 'Expired',         color: 'text-neutral-600',bg: 'bg-surface-container'},
  cancelled:            { label: 'Cancelled',       color: 'text-red-500',    bg: 'bg-red-950/30'   },
};

function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const cfg = ORDER_STATUS_CONFIG[status] ?? ORDER_STATUS_CONFIG.pending;
  return (
    <span className={cn('inline-block font-label text-[8px] uppercase tracking-widest px-2 py-0.5', cfg.color, cfg.bg)}>
      {cfg.label}
    </span>
  );
}

// ─── Dashboard Overview ───────────────────────────────────────────────────────

function DashboardOverview({ artworks, orders, doodles, bids }: { artworks: Artwork[]; orders: Order[]; doodles: Doodle[]; bids: Bid[] }) {
  const needsVerification = orders.filter(o => o.status === 'pending_verification').length;
  const pendingBids = bids.filter(b => b.status === 'pending').length;

  const stats = [
    { label: 'Total Artworks', value: artworks.length,                                                          icon: 'palette',      sub: 'In collection' },
    { label: 'Available',      value: artworks.filter(a => a.status === 'available').length,                    icon: 'sell',         sub: 'For sale',        color: 'text-primary' },
    { label: 'Reserved',       value: artworks.filter(a => a.status === 'reserved').length,                     icon: 'bookmark',     sub: '7-day holds',     color: 'text-amber-400', pulse: true },
    { label: 'Sold',           value: artworks.filter(a => a.status === 'sold').length,                         icon: 'check_circle', sub: 'Completed',       color: 'text-green-500' },
  ];

  const doodleStats = [
    { label: 'Total Doodles',  value: doodles.length,                                                           icon: 'draw',         sub: 'In collection' },
    { label: 'Available',      value: doodles.filter(d => d.status === 'available').length,                     icon: 'sell',         sub: 'For sale',        color: 'text-on-surface-variant' },
    { label: 'Sold',           value: doodles.filter(d => d.status === 'sold').length,                          icon: 'check_circle', sub: 'Sold doodles',    color: 'text-green-500' },
  ];

  const activeReservations = orders.filter(
    o => o.order_type === 'reservation' && o.status === 'pending' && !isReservationExpired(o.reserved_until)
  );

  return (
    <div className="space-y-10">
      {/* Verification alert */}
      {needsVerification > 0 && (
        <div className="bg-yellow-950/30 border border-yellow-900/40 p-5 flex items-start gap-4">
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-pulse shrink-0 mt-1" />
          <div>
            <p className="font-headline italic text-lg text-yellow-300">
              {needsVerification} Payment{needsVerification > 1 ? 's' : ''} Awaiting Verification
            </p>
            <p className="font-body text-sm text-yellow-200/70 mt-1">
              A buyer has submitted their UTR number. Go to <strong>Orders</strong> to verify the payment against your bank / Paytm records and confirm the order.
            </p>
          </div>
        </div>
      )}

      {/* Exclusive Collection Stats */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <span className="font-label text-[9px] uppercase tracking-widest text-primary/70">✦ Exclusive Collection</span>
          <div className="flex-1 h-px bg-primary/10" />
        </div>
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
          {stats.map((s) => (
            <div key={s.label} className="bg-surface-container-low border border-outline-variant/5 p-6 group hover:bg-surface-container-high transition-colors">
              <div className="flex justify-between items-start mb-8">
                <span className="font-label text-[10px] uppercase tracking-widest text-neutral-500">{s.label}</span>
                <MaterialIcon name={s.icon} size="md" className="text-primary/20 group-hover:text-primary/50 transition-colors" />
              </div>
              <p className="font-headline italic text-4xl text-on-surface">{s.value}</p>
              <div className="mt-4 flex items-center gap-2">
                {s.pulse && s.value > 0 && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />}
                <span className={cn('font-label text-[9px] uppercase tracking-widest', s.color ?? 'text-neutral-600')}>{s.sub}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active reservation reminders */}
      {activeReservations.length > 0 && (
        <div className="bg-amber-950/20 border border-amber-900/30 p-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <h3 className="font-headline italic text-xl text-amber-300">Active Reservations</h3>
            <span className="font-label text-[9px] uppercase tracking-widest text-amber-600 ml-auto">{activeReservations.length} active</span>
          </div>
          <div className="space-y-4">
            {activeReservations.map((order) => {
              const day = getReservationDay(order) ?? 1;
              const daysLeft = 7 - day + 1;
              return <ReservationReminderRow key={order.id} order={order} day={day} daysLeft={daysLeft} />;
            })}
          </div>
        </div>
      )}

      {/* Recent orders */}
      <div className="bg-surface-container-low border border-outline-variant/5 p-6">
        <h3 className="font-headline italic text-xl text-on-surface mb-6">Recent Orders</h3>
        {orders.length === 0 ? (
          <p className="font-label text-[10px] uppercase tracking-widest text-neutral-700 py-8 text-center">No orders yet</p>
        ) : (
          <div className="space-y-3">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between py-3 border-b border-outline-variant/5 last:border-0">
                <div>
                  <p className="font-label text-xs text-on-surface">{order.buyer_name}</p>
                  <p className="font-label text-[9px] text-neutral-600">{order.artwork_title} · {order.order_id ?? order.id.slice(0,8)}</p>
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  <OrderStatusBadge status={order.status} />
                  <span className="font-label text-[9px] text-primary">{order.amount}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Reservation Reminder Row ─────────────────────────────────────────────────

function ReservationReminderRow({ order, day, daysLeft }: { order: Order; day: number; daysLeft: number }) {
  const [sent, setSent] = useState(false);

  const handleSendEmail = useCallback(async () => {
    const href = buildDailyReminderHref(order, day);
    window.location.href = href;
    try {
      await fetch(`/api/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ day_reminder_sent: day }),
      });
    } catch { /* non-blocking */ }
    setSent(true);
  }, [order, day]);

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-4 p-4 bg-amber-950/10 border border-amber-900/20">
      <div className="flex-1">
        <p className="font-label text-xs text-on-surface font-bold">{order.buyer_name}</p>
        <p className="font-label text-[9px] text-amber-400/70">{order.artwork_title}</p>
        <p className="font-label text-[9px] text-neutral-600 mt-0.5">{order.buyer_email}</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex gap-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className={cn('w-4 h-1.5 transition-all', i < day ? 'bg-amber-500' : 'bg-amber-950/40')} />
          ))}
        </div>
        <span className="font-label text-[9px] uppercase tracking-widest text-amber-400/70 whitespace-nowrap">Day {day} of 7</span>
      </div>
      {order.reserved_until && (
        <span className="font-label text-[9px] text-amber-300 tabular-nums whitespace-nowrap">{daysLeft}d left</span>
      )}
      <button
        onClick={handleSendEmail}
        disabled={sent || order.day_reminder_sent >= day}
        className={cn(
          'font-label text-[9px] uppercase tracking-widest px-4 py-2 border transition-all whitespace-nowrap flex items-center gap-2',
          sent || order.day_reminder_sent >= day
            ? 'border-neutral-800 text-neutral-700 cursor-not-allowed'
            : 'border-amber-800/40 text-amber-400 hover:bg-amber-950/30'
        )}
      >
        <MaterialIcon name="mail" size="sm" />
        {sent || order.day_reminder_sent >= day ? 'Sent' : `Send Day ${day} Email`}
      </button>
    </div>
  );
}

// ─── Add Artwork ──────────────────────────────────────────────────────────────

function AddArtwork({ onAdded }: { onAdded: () => void }) {
  const [form, setForm] = useState({
    title: '', description: '', price: '', medium: '', dimensions: '',
    status: 'available' as Artwork['status'], image_url: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field: string, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.price || !form.medium || !form.dimensions) {
      setError('Title, price, medium, and dimensions are required.');
      return;
    }
    setError(''); setLoading(true);
    try {
      const priceNumber = parseFloat(form.price.replace(/[^\d.]/g, '')) || 0;
      const res = await fetch('/api/artworks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, price_number: priceNumber, image_url: form.image_url || null }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error ?? 'Failed to create artwork');
      }
      setSuccess(true);
      setForm({ title: '', description: '', price: '', medium: '', dimensions: '', status: 'available', image_url: '' });
      onAdded();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full bg-surface-container border-b border-outline-variant/30 focus:border-primary/60 py-3 px-0 font-body text-sm text-on-surface placeholder:text-neutral-700 focus:outline-none transition-colors';
  const labelClass = 'block font-label text-[9px] uppercase tracking-widest text-neutral-600 mb-2';

  return (
    <div className="max-w-2xl">
      <p className="font-label text-[10px] uppercase tracking-widest text-neutral-600 mb-8">
        Fill in the details below. For the image URL, upload your image to Supabase Storage or any hosting, then paste the URL here.
      </p>

      {success && (
        <div className="flex items-center gap-3 bg-primary/10 border border-primary/20 text-primary p-4 mb-6">
          <MaterialIcon name="check_circle" size="sm" />
          <span className="font-label text-[10px] uppercase tracking-widest">Artwork published successfully!</span>
        </div>
      )}
      {error && (
        <div className="flex items-center gap-3 bg-red-950/30 border border-red-900/30 text-red-400 p-4 mb-6">
          <MaterialIcon name="error" size="sm" />
          <span className="font-label text-[10px] uppercase tracking-widest">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <div>
          <label className={labelClass}>Title *</label>
          <input type="text" value={form.title} onChange={e => handleChange('title', e.target.value)}
            placeholder="e.g. The Gilded Cage" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Description</label>
          <textarea value={form.description} onChange={e => handleChange('description', e.target.value)}
            placeholder="Describe the artwork, its inspiration, and materials..." rows={3}
            className={`${inputClass} resize-none`} />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>Price * (with ₹)</label>
            <input type="text" value={form.price} onChange={e => handleChange('price', e.target.value)}
              placeholder="₹4,500" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Status</label>
            <select value={form.status} onChange={e => handleChange('status', e.target.value)}
              className={`${inputClass} cursor-pointer bg-surface-container`}>
              <option value="available">Available (For Sale)</option>
              <option value="coming_soon">Coming Soon</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>Medium *</label>
            <input type="text" value={form.medium} onChange={e => handleChange('medium', e.target.value)}
              placeholder="e.g. Ink on paper" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Dimensions *</label>
            <input type="text" value={form.dimensions} onChange={e => handleChange('dimensions', e.target.value)}
              placeholder="e.g. 12 × 16 in" className={inputClass} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Artwork Image</label>
          <input
            type="file" accept="image/*" disabled={loading}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setLoading(true); setError('Uploading image...');
              try {
                const { v4: uuidv4 } = await import('uuid');
                const fileExt = file.name.split('.').pop() || 'jpg';
                const fileName = `${uuidv4()}.${fileExt}`;
                const { error: uploadError } = await supabase.storage.from('art').upload(fileName, file);
                if (uploadError) throw uploadError;
                const { data } = supabase.storage.from('art').getPublicUrl(fileName);
                handleChange('image_url', data.publicUrl);
                setError('');
              } catch (err: unknown) {
                setError(err instanceof Error ? err.message : 'Error uploading image. Is your bucket public?');
              } finally { setLoading(false); }
            }}
            className={inputClass}
          />
          <p className="mt-2 font-label text-[9px] text-neutral-700">Select an image to automatically upload it to your database.</p>
        </div>
        {form.image_url && (
          <div>
            <label className={labelClass}>Image Preview</label>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={form.image_url} alt="Preview" className="w-32 h-32 object-cover border border-outline-variant/20" />
          </div>
        )}
        <button type="submit" disabled={loading} id="add-artwork-submit"
          className="gold-gradient-bg text-on-primary font-label text-[10px] font-bold uppercase tracking-widest px-10 py-4 hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center gap-3">
          {loading ? <span className="w-3 h-3 border border-on-primary/40 border-t-on-primary rounded-full animate-spin" /> : <MaterialIcon name="add_circle" size="sm" />}
          Publish Artwork
        </button>
      </form>
    </div>
  );
}

// ─── Manage Artworks ──────────────────────────────────────────────────────────

function ManageArtworks({ artworks, onRefresh }: { artworks: Artwork[]; onRefresh: () => void }) {
  const [deleting, setDeleting] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<Partial<Artwork>>({});
  const [saving, setSaving] = useState(false);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this artwork permanently?')) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/artworks/${id}`, { method: 'DELETE' });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || 'Failed to delete'); }
    } catch (err: unknown) { alert(`Error: ${err instanceof Error ? err.message : 'Unknown'}`); }
    finally { setDeleting(null); onRefresh(); }
  };

  const handleSave = async (id: string) => {
    setSaving(true);
    let priceNumber = 0;
    if (editDraft.price) priceNumber = parseFloat(editDraft.price.replace(/[^\d.]/g, '')) || 0;
    await fetch(`/api/artworks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...editDraft, ...(editDraft.price ? { price_number: priceNumber } : {}) }),
    });
    setSaving(false); setEditingId(null); onRefresh();
  };

  if (artworks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <MaterialIcon name="palette" size="4xl" className="text-neutral-700" />
        <p className="font-label text-[10px] uppercase tracking-widest text-neutral-600">No artworks yet. Add your first one.</p>
      </div>
    );
  }

  const inputClass = 'w-full bg-surface-container border border-outline-variant/30 text-on-surface font-label text-[10px] py-2 px-2 focus:outline-none focus:border-primary/50';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {artworks.map((artwork) => (
        <div key={artwork.id} className="bg-surface-container-low border border-outline-variant/5 overflow-hidden group">
          <div className="aspect-video relative overflow-hidden">
            {artwork.image_url
              ? <img src={artwork.image_url} alt={artwork.title} className="w-full h-full object-cover" />
              : <ImagePlaceholder label={artwork.title} icon="palette" accentColor="#353535" className="w-full h-full rounded-none" />}
            <div className="absolute top-3 right-3"><ArtworkBadge status={artwork.status} /></div>
          </div>
          <div className="p-5 space-y-3">
            <div>
              <p className="font-headline italic text-lg text-on-surface leading-tight">{artwork.title}</p>
              <p className="font-label text-[9px] text-neutral-600">{artwork.medium} · {artwork.dimensions}</p>
            </div>
            <p className="font-label text-sm text-primary">{artwork.price}</p>

            {artwork.status === 'reserved' && artwork.reserved_until && (
              <p className="font-label text-[9px] text-amber-400/70">
                {isReservationExpired(artwork.reserved_until) ? 'Reservation expired' : `Reserved: ${reservationCountdown(artwork.reserved_until)}`}
              </p>
            )}

            {editingId === artwork.id ? (
              <div className="flex flex-col gap-3 border-t border-outline-variant/10 pt-3">
                <input type="text" value={editDraft.title ?? ''} onChange={e => setEditDraft(d => ({ ...d, title: e.target.value }))} placeholder="Title" className={inputClass} />
                <textarea value={editDraft.description ?? ''} onChange={e => setEditDraft(d => ({ ...d, description: e.target.value }))} placeholder="Description" rows={2} className={`${inputClass} resize-none`} />
                <input type="text" value={editDraft.price ?? ''} onChange={e => setEditDraft(d => ({ ...d, price: e.target.value }))} placeholder="Price (₹)" className={inputClass} />
                <div className="flex gap-2">
                  <input type="text" value={editDraft.medium ?? ''} onChange={e => setEditDraft(d => ({ ...d, medium: e.target.value }))} placeholder="Medium" className={inputClass} />
                  <input type="text" value={editDraft.dimensions ?? ''} onChange={e => setEditDraft(d => ({ ...d, dimensions: e.target.value }))} placeholder="Dimensions" className={inputClass} />
                </div>
                <select value={editDraft.status ?? 'available'} onChange={e => setEditDraft(d => ({ ...d, status: e.target.value as Artwork['status'] }))} className={`${inputClass} cursor-pointer bg-surface-container`}>
                  <option value="available">Available</option>
                  <option value="coming_soon">Coming Soon</option>
                  <option value="reserved">Reserved</option>
                  <option value="sold">Sold</option>
                </select>
                <div className="flex gap-2 pt-2">
                  <button onClick={() => setEditingId(null)} className="flex-1 font-label text-[9px] uppercase tracking-widest text-neutral-600 border border-outline-variant/20 py-1.5 hover:bg-surface-container">Cancel</button>
                  <button onClick={() => handleSave(artwork.id)} disabled={saving} className="flex-1 font-label text-[9px] uppercase tracking-widest text-primary border border-primary/30 py-1.5 hover:bg-primary/5 disabled:opacity-50">
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => { setEditingId(artwork.id); setEditDraft({ title: artwork.title, description: artwork.description, price: artwork.price, medium: artwork.medium, dimensions: artwork.dimensions, status: artwork.status }); }}
                  className="flex-1 font-label text-[9px] uppercase tracking-widest text-neutral-500 border border-outline-variant/20 py-2 hover:border-outline-variant/40 hover:text-on-surface transition-all"
                >
                  Edit
                </button>
                <button onClick={() => handleDelete(artwork.id)} disabled={deleting === artwork.id}
                  className="font-label text-[9px] uppercase tracking-widest text-red-700 border border-red-900/20 px-3 py-2 hover:bg-red-950/30 transition-all disabled:opacity-50" aria-label={`Delete ${artwork.title}`}>
                  {deleting === artwork.id ? '…' : <MaterialIcon name="delete" size="sm" />}
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Orders Panel ─────────────────────────────────────────────────────────────

function OrdersPanel({ orders, onRefresh, artworks }: { orders: Order[]; onRefresh: () => void; artworks: Artwork[] }) {
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [trackingInput, setTrackingInput] = useState<Record<string, string>>({});
  const [showTrackingInput, setShowTrackingInput] = useState<string | null>(null);
  const [verifyDetailId, setVerifyDetailId] = useState<string | null>(null);

  const getArtwork = (artworkId: string) => artworks.find(a => a.id === artworkId);

  const patchOrder = async (id: string, patch: Record<string, unknown>) => {
    setActionLoading(id);
    await fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    });
    setActionLoading(null);
    onRefresh();
  };

  const patchArtwork = async (artworkId: string, patch: Record<string, unknown>) => {
    await fetch(`/api/artworks/${artworkId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    });
  };

  // ── Verify payment: show details first, then confirm and send email ──
  const handleVerifyPayment = async (order: Order) => {
    // First time: show expanded details panel
    if (verifyDetailId !== order.id) {
      setVerifyDetailId(order.id);
      return;
    }
    // Second click (already expanded): do the actual verification
    if (!confirm(
      `✅ FINAL CONFIRMATION\n\nYou are about to confirm payment for:\n` +
      `Order: ${order.order_id ?? order.id}\n` +
      `Buyer: ${order.buyer_name}\n` +
      `Amount: ${order.amount}\n` +
      `UTR: ${order.upi_transaction_id}\n\n` +
      `Have you confirmed this UTR in your Paytm / bank statement?\n` +
      `Only proceed if money was actually received.`
    )) return;

    await patchOrder(order.id, { status: 'confirmed', payment_verified: true });
    setVerifyDetailId(null);

    // Open confirmation email to buyer FROM the artist's email client
    const artwork = getArtwork(order.artwork_id);
    const href = buildOrderConfirmationEmailHref(order, artwork
      ? { medium: artwork.medium, dimensions: artwork.dimensions }
      : undefined
    );
    setTimeout(() => { window.location.href = href; }, 400);
  };

  // ── Reject payment ──
  const handleRejectPayment = async (order: Order) => {
    if (!confirm(`Reject this order? The buyer's UTR "${order.upi_transaction_id}" was not found in your bank records.`)) return;
    await patchOrder(order.id, { status: 'cancelled' });
    await patchArtwork(order.artwork_id, {
      status: 'available', reserved_until: null, reserved_by_name: null, reserved_by_email: null
    });
  };

  // ── Start packing ──
  const handleStartPacking = async (order: Order) => {
    await patchOrder(order.id, { status: 'packing' });
  };

  // ── Mark shipped ──
  const handleMarkShipped = async (order: Order) => {
    const tid = (trackingInput[order.id] ?? '').trim();
    if (!tid) { alert('Please enter the India Post tracking ID first.'); return; }
    await patchOrder(order.id, { status: 'shipped', tracking_id: tid });
    setShowTrackingInput(null);
    // Auto-open email
    setTimeout(() => {
      window.location.href = buildShippingNotificationHref({ ...order, tracking_id: tid });
    }, 400);
  };

  // ── Mark delivered ──
  const handleMarkDelivered = async (order: Order) => {
    await patchOrder(order.id, { status: 'completed' });
    await patchArtwork(order.artwork_id, { status: 'sold' });
  };

  // ── Expire reservation ──
  const handleExpire = async (order: Order) => {
    await patchOrder(order.id, { status: 'expired' });
    await patchArtwork(order.artwork_id, {
      status: 'available', reserved_until: null, reserved_by_name: null, reserved_by_email: null
    });
  };

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <MaterialIcon name="receipt_long" size="4xl" className="text-neutral-700" />
        <p className="font-label text-[10px] uppercase tracking-widest text-neutral-600">No orders yet</p>
      </div>
    );
  }

  // Sort: pending_verification first, then rest
  const sorted = [...orders].sort((a, b) => {
    if (a.status === 'pending_verification' && b.status !== 'pending_verification') return -1;
    if (b.status === 'pending_verification' && a.status !== 'pending_verification') return 1;
    return 0;
  });

  return (
    <div className="space-y-4">
      {sorted.map((order) => {
        const day = getReservationDay(order);
        const expired = isReservationExpired(order.reserved_until);
        const delivery = order.buyer_pincode ? estimateDelivery(order.buyer_pincode) : null;
        const isLoading = actionLoading === order.id;

        return (
          <div key={order.id} className={cn(
            'border p-6 transition-colors',
            order.status === 'pending_verification' ? 'bg-yellow-950/20 border-yellow-900/30' : 'bg-surface-container-low border-outline-variant/5'
          )}>
            {/* Header row */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="space-y-1 flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <p className="font-headline italic text-lg text-on-surface">{order.artwork_title}</p>
                  <OrderStatusBadge status={order.status} />
                  <span className={cn(
                    'font-label text-[8px] uppercase tracking-widest px-2 py-0.5',
                    order.order_type === 'reservation' ? 'text-amber-400 bg-amber-950/30' : 'gold-gradient-bg text-on-primary'
                  )}>{order.order_type}</span>
                </div>

                {/* Order ID */}
                {order.order_id && (
                  <p className="font-label text-[9px] text-primary/70 font-mono">{order.order_id}</p>
                )}

                {/* Buyer info */}
                <p className="font-label text-[10px] text-neutral-500">
                  {order.buyer_name} · {order.buyer_email} · {order.buyer_phone}
                </p>
                {order.buyer_whatsapp && (
                  <p className="font-label text-[9px] text-green-500/70 flex items-center gap-1">
                    <MaterialIcon name="chat" size="sm" /> WhatsApp: {order.buyer_whatsapp}
                  </p>
                )}
                {order.buyer_address && (
                  <p className="font-label text-[9px] text-neutral-700">📦 Ship to: {order.buyer_address}{order.buyer_pincode ? ` — PIN ${order.buyer_pincode}` : ''}</p>
                )}

                {/* Delivery estimate */}
                {delivery?.isValid && (
                  <p className="font-label text-[9px] text-primary/60">
                    🚚 Est. delivery: {delivery.minDays}–{delivery.maxDays} days ({delivery.zone})
                  </p>
                )}

                {/* Amount + dates */}
                <div className="flex items-center gap-4 mt-2 flex-wrap">
                  <span className="font-label text-sm text-primary">{order.amount}</span>
                  {order.order_type === 'reservation' && order.reserved_until && (
                    <span className={cn('font-label text-[9px]', expired ? 'text-red-500' : 'text-amber-400/70')}>
                      {expired ? 'Expired' : reservationCountdown(order.reserved_until)}
                    </span>
                  )}
                  <span className="font-label text-[9px] text-neutral-700">
                    {new Date(order.created_at).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                  </span>
                </div>

                {/* UTR verify detail panel — shown when artist clicks first Verify */}
                {verifyDetailId === order.id && order.status === 'pending_verification' && (
                  <div className="mt-4 bg-yellow-950/30 border border-yellow-900/30 p-5 space-y-4">
                    <p className="font-label text-[9px] uppercase tracking-widest text-yellow-400 mb-3">
                      ⚠️ Verify this payment in your Paytm / Bank before confirming
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { label: 'Order ID',     value: order.order_id ?? '—' },
                        { label: 'Artwork',       value: order.artwork_title },
                        { label: 'Order Type',    value: order.order_type === 'reservation' ? '7-Day Reservation' : 'Direct Purchase' },
                        { label: 'Amount',        value: order.amount },
                        { label: 'Buyer Name',    value: order.buyer_name },
                        { label: 'Buyer Email',   value: order.buyer_email },
                        { label: 'Phone',         value: order.buyer_phone },
                        { label: 'WhatsApp',      value: order.buyer_whatsapp ?? '—' },
                        { label: 'Address',       value: order.buyer_address ?? '—' },
                        { label: 'PIN Code',      value: order.buyer_pincode ?? '—' },
                        { label: 'Placed On',     value: new Date(order.created_at).toLocaleString('en-IN') },
                      ].map(row => (
                        <div key={row.label} className="flex flex-col gap-0.5">
                          <span className="font-label text-[8px] uppercase tracking-widest text-neutral-600">{row.label}</span>
                          <span className="font-label text-xs text-on-surface break-all">{row.value}</span>
                        </div>
                      ))}
                    </div>
                    <div className="bg-yellow-950/40 border border-yellow-800/40 p-3">
                      <p className="font-label text-[9px] uppercase tracking-widest text-yellow-400 mb-1">UPI Transaction Reference (UTR)</p>
                      <p className="font-mono text-base text-white tracking-widest">{order.upi_transaction_id}</p>
                      <p className="font-body text-xs text-yellow-300/70 mt-1">Open Paytm or your bank app and search for this UTR to verify the payment.</p>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button onClick={() => setVerifyDetailId(null)}
                        className="flex-1 font-label text-[9px] uppercase tracking-widest text-neutral-600 border border-outline-variant/20 py-2 hover:bg-surface-container transition-all">
                        Cancel
                      </button>
                      <button onClick={() => handleVerifyPayment(order)} disabled={isLoading}
                        className="flex-[2] font-label text-[9px] uppercase tracking-widest text-green-400 border border-green-900/40 py-2 hover:bg-green-950/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                        <MaterialIcon name="check_circle" size="sm" />
                        {isLoading ? 'Confirming…' : 'Confirm Payment & Send Buyer Email'}
                      </button>
                    </div>
                    <p className="font-body text-xs text-neutral-600 leading-relaxed">
                      Clicking <strong className="text-neutral-400">"Confirm Payment"</strong> will mark the order as confirmed and open your email app to send a confirmation to <strong className="text-primary">{order.buyer_email}</strong> with all order details.
                    </p>
                  </div>
                )}

                {/* Tracking ID — if shipped */}
                {order.tracking_id && (
                  <div className="mt-2 flex items-center gap-2 p-2 bg-green-950/20 border border-green-900/20">
                    <MaterialIcon name="local_shipping" size="sm" className="text-green-400" />
                    <div>
                      <p className="font-label text-[8px] uppercase tracking-widest text-green-500">India Post Tracking ID</p>
                      <p className="font-mono text-xs text-on-surface mt-0.5">{order.tracking_id}</p>
                    </div>
                  </div>
                )}

                {/* Day progress for reservations */}
                {order.order_type === 'reservation' && day && (
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex gap-1">
                      {Array.from({ length: 7 }).map((_, i) => (
                        <div key={i} className={cn('w-4 h-1 transition-all', i < day ? 'bg-amber-500' : 'bg-amber-950/30')} />
                      ))}
                    </div>
                    <span className="font-label text-[9px] text-amber-400/60">Day {day} of 7</span>
                    <a href={buildDailyReminderHref(order, day)}
                      className="font-label text-[9px] uppercase tracking-widest text-amber-400 border border-amber-800/30 px-3 py-1 hover:bg-amber-950/20 transition-all flex items-center gap-1.5">
                      <MaterialIcon name="mail" size="sm" />Send Day {day} Reminder
                    </a>
                  </div>
                )}
              </div>

              {/* ── Action Buttons ── */}
              <div className="flex flex-wrap gap-2 shrink-0 items-start">

                {/* STEP 1: Pending verification — show Verify / Reject */}
                {order.status === 'pending_verification' && (
                  <>
                    {verifyDetailId !== order.id && (
                      <button onClick={() => handleVerifyPayment(order)} disabled={isLoading}
                        className="font-label text-[9px] uppercase tracking-widest text-yellow-400 border border-yellow-900/40 px-4 py-2 hover:bg-yellow-950/30 transition-all disabled:opacity-50 flex items-center gap-1.5">
                        <MaterialIcon name="manage_search" size="sm" />
                        {isLoading ? '…' : 'Review & Verify'}
                      </button>
                    )}
                    <button onClick={() => handleRejectPayment(order)} disabled={isLoading}
                      className="font-label text-[9px] uppercase tracking-widest text-red-500 border border-red-900/30 px-4 py-2 hover:bg-red-950/20 transition-all disabled:opacity-50">
                      {isLoading ? '…' : 'Reject'}
                    </button>
                  </>
                )}

                {/* STEP 2: Confirmed → Start Packing */}
                {order.status === 'confirmed' && (
                  <button onClick={() => handleStartPacking(order)} disabled={isLoading}
                    className="font-label text-[9px] uppercase tracking-widest text-sky-400 border border-sky-900/40 px-4 py-2 hover:bg-sky-950/30 transition-all disabled:opacity-50 flex items-center gap-1.5">
                    <MaterialIcon name="inventory_2" size="sm" />
                    {isLoading ? '…' : 'Start Packing'}
                  </button>
                )}

                {/* STEP 3: Packing → Mark Shipped */}
                {order.status === 'packing' && (
                  <div className="flex flex-col gap-2">
                    {showTrackingInput === order.id ? (
                      <>
                        <input
                          type="text"
                          placeholder="India Post Tracking ID"
                          value={trackingInput[order.id] ?? ''}
                          onChange={e => setTrackingInput(t => ({ ...t, [order.id]: e.target.value }))}
                          className="bg-surface-container border border-outline-variant/30 text-on-surface font-label text-[10px] py-2 px-3 focus:outline-none focus:border-primary/50 w-56"
                        />
                        <div className="flex gap-2">
                          <button onClick={() => setShowTrackingInput(null)}
                            className="font-label text-[9px] uppercase tracking-widest text-neutral-600 border border-outline-variant/20 px-3 py-1.5 hover:bg-surface-container transition-all">
                            Cancel
                          </button>
                          <button onClick={() => handleMarkShipped(order)} disabled={isLoading || !trackingInput[order.id]}
                            className="font-label text-[9px] uppercase tracking-widest text-green-400 border border-green-900/40 px-4 py-1.5 hover:bg-green-950/30 transition-all disabled:opacity-50 flex items-center gap-1.5">
                            <MaterialIcon name="local_shipping" size="sm" />
                            {isLoading ? '…' : 'Confirm & Notify Buyer'}
                          </button>
                        </div>
                      </>
                    ) : (
                      <button onClick={() => setShowTrackingInput(order.id)}
                        className="font-label text-[9px] uppercase tracking-widest text-green-400 border border-green-900/40 px-4 py-2 hover:bg-green-950/30 transition-all flex items-center gap-1.5">
                        <MaterialIcon name="local_shipping" size="sm" />
                        Enter Tracking ID &amp; Ship
                      </button>
                    )}
                  </div>
                )}

                {/* STEP 4: Shipped → WhatsApp + Mark Delivered */}
                {order.status === 'shipped' && (
                  <>
                    {(order.buyer_whatsapp || order.buyer_phone) && (
                      <a href={buildWhatsAppShippingHref(order)} target="_blank" rel="noopener noreferrer"
                        className="font-label text-[9px] uppercase tracking-widest text-green-400 border border-green-900/30 px-4 py-2 hover:bg-green-950/20 transition-all flex items-center gap-1.5">
                        <MaterialIcon name="chat" size="sm" />
                        WhatsApp Tracking
                      </a>
                    )}
                    <button onClick={() => handleMarkDelivered(order)} disabled={isLoading}
                      className="gold-gradient-bg text-on-primary font-label text-[9px] uppercase tracking-widest px-4 py-2 hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center gap-1.5">
                      <MaterialIcon name="home" size="sm" />
                      {isLoading ? '…' : 'Mark Delivered'}
                    </button>
                  </>
                )}

                {/* Expire reservation */}
                {order.order_type === 'reservation' && (order.status === 'confirmed' || order.status === 'pending') && expired && (
                  <button onClick={() => handleExpire(order)} disabled={isLoading}
                    className="font-label text-[9px] uppercase tracking-widest text-red-500 border border-red-900/30 px-4 py-2 hover:bg-red-950/20 transition-all">
                    Expire
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Bids Panel — Chat Messenger UI ──────────────────────────────────────────

function BidsPanel({ bids, artworks, onRefresh }: { bids: Bid[]; artworks: Artwork[]; onRefresh: () => void }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [composeMode, setComposeMode] = useState<'counter' | null>(null);
  const [counterAmount, setCounterAmount] = useState('');
  const [counterMsg, setCounterMsg] = useState('');
  const chatEndRef = React.useRef<HTMLDivElement>(null);

  // Group bids by artwork
  const grouped: Record<string, { title: string; bids: Bid[] }> = {};
  for (const bid of bids) {
    if (!grouped[bid.artwork_id]) grouped[bid.artwork_id] = { title: bid.artwork_title, bids: [] };
    grouped[bid.artwork_id].bids.push(bid);
  }
  const artworkPrices: Record<string, number> = {};
  for (const a of artworks) artworkPrices[a.id] = a.price_number;

  const conversationList = Object.entries(grouped).map(([id, g]) => ({
    artworkId: id,
    title: g.title,
    bids: g.bids,
    unread: g.bids.filter(b => !b.read && b.status === 'pending').length,
    latest: g.bids[0],
  }));

  // Auto-select first conversation
  React.useEffect(() => {
    if (!selectedId && conversationList.length > 0) {
      setSelectedId(conversationList[0].artworkId);
    }
  }, [conversationList.length, selectedId]);

  React.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedId]);

  const patchBid = async (id: string, patch: Record<string, unknown>) => {
    setActionLoading(id);
    await fetch(`/api/bids/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    });
    setActionLoading(null);
    onRefresh();
  };

  const handleAccept = (bid: Bid) => {
    if (!confirm(`Accept ${bid.buyer_name}'s offer of ${bid.bid_amount}?`)) return;
    patchBid(bid.id, { status: 'accepted', read: true });
    setTimeout(() => { window.location.href = buildBidAcceptedEmailHref(bid); }, 300);
  };

  const handleCounter = async (bid: Bid) => {
    const amount = counterAmount.trim();
    if (!amount) { alert('Enter a counter-offer amount first.'); return; }
    await patchBid(bid.id, { status: 'countered', artist_counter_amount: amount, artist_message: counterMsg || null, read: true });
    setComposeMode(null); setCounterAmount(''); setCounterMsg('');
    setTimeout(() => { window.location.href = buildBidCounterEmailHref(bid, amount, counterMsg); }, 300);
  };

  const handleDecline = (bid: Bid) => {
    if (!confirm(`Decline ${bid.buyer_name}'s offer of ${bid.bid_amount}?`)) return;
    patchBid(bid.id, { status: 'declined', read: true });
    setTimeout(() => { window.location.href = buildBidDeclinedEmailHref(bid); }, 300);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this bid?')) return;
    await fetch(`/api/bids/${id}`, { method: 'DELETE' });
    onRefresh();
  };

  if (bids.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <MaterialIcon name="chat_bubble_outline" size="4xl" className="text-neutral-700" />
        <p className="font-headline italic text-2xl text-neutral-600">No conversations yet</p>
        <p className="font-label text-[10px] uppercase tracking-widest text-neutral-700 max-w-xs mx-auto">
          When visitors click &ldquo;Make an Offer&rdquo; on your artworks, their messages appear here.
        </p>
      </div>
    );
  }

  const activeConv = conversationList.find(c => c.artworkId === selectedId);
  const listedPrice = selectedId ? (artworkPrices[selectedId] ?? 0) : 0;
  const activePendingBid = activeConv?.bids.find(b => b.status === 'pending') ?? null;

  return (
    <div className="flex h-[calc(100vh-14rem)] border border-outline-variant/10 overflow-hidden">

      {/* ── LEFT: Conversation list ─────────────────────────────────────── */}
      <div className="w-72 shrink-0 border-r border-outline-variant/10 flex flex-col bg-surface-container-lowest">
        <div className="px-5 py-4 border-b border-outline-variant/10 shrink-0">
          <p className="font-label text-[9px] uppercase tracking-widest text-neutral-600">
            {bids.filter(b => b.status === 'pending').length} pending · {bids.length} total
          </p>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-outline-variant/5">
          {conversationList.map((conv) => {
            const isSelected = conv.artworkId === selectedId;
            return (
              <button
                key={conv.artworkId}
                onClick={() => { setSelectedId(conv.artworkId); setComposeMode(null); setCounterAmount(''); setCounterMsg(''); }}
                className={cn(
                  'w-full text-left px-5 py-4 transition-all flex flex-col gap-1.5 border-l-2',
                  isSelected ? 'bg-primary/8 border-l-primary' : 'hover:bg-surface-container border-l-transparent'
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className={cn('font-label text-xs leading-snug', isSelected ? 'text-primary' : 'text-on-surface')}>
                    {conv.title}
                  </p>
                  {conv.unread > 0 && (
                    <span className="w-5 h-5 bg-primary text-on-primary rounded-full flex items-center justify-center font-label text-[8px] font-bold shrink-0 animate-pulse">
                      {conv.unread}
                    </span>
                  )}
                </div>
                <p className="font-label text-[9px] text-primary/70 font-bold">{conv.latest.bid_amount}</p>
                <p className="font-label text-[8px] text-neutral-600 truncate">
                  {conv.latest.buyer_name} · {new Date(conv.latest.created_at).toLocaleDateString('en-IN', { dateStyle: 'short' })}
                </p>
                <div className="flex flex-wrap gap-1 mt-0.5">
                  {conv.bids.some(b => b.status === 'pending') && (
                    <span className="font-label text-[7px] uppercase tracking-widest text-primary bg-primary/10 px-1.5 py-0.5">Pending</span>
                  )}
                  {conv.bids.some(b => b.status === 'accepted') && (
                    <span className="font-label text-[7px] uppercase tracking-widest text-green-400 bg-green-950/30 px-1.5 py-0.5">Accepted</span>
                  )}
                  {conv.bids.some(b => b.status === 'countered') && (
                    <span className="font-label text-[7px] uppercase tracking-widest text-amber-400 bg-amber-950/30 px-1.5 py-0.5">Countered</span>
                  )}
                  {conv.bids.some(b => b.status === 'declined') && (
                    <span className="font-label text-[7px] uppercase tracking-widest text-neutral-600 bg-surface-container px-1.5 py-0.5">Declined</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── RIGHT: Chat thread ──────────────────────────────────────────── */}
      {activeConv ? (
        <div className="flex-1 flex flex-col min-w-0 bg-surface">

          {/* Chat header */}
          <div className="px-6 py-4 border-b border-outline-variant/10 bg-surface-container-low shrink-0 flex items-center gap-4">
            <div className="w-10 h-10 bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <MaterialIcon name="palette" size="sm" className="text-primary/70" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-headline italic text-lg text-on-surface truncate">{activeConv.title}</p>
              <p className="font-label text-[9px] uppercase tracking-widest text-neutral-600">
                Listed at ₹{listedPrice.toLocaleString('en-IN')} · {activeConv.bids.length} offer{activeConv.bids.length !== 1 ? 's' : ''}
              </p>
            </div>
            {activePendingBid && (
              <span className="font-label text-[8px] uppercase tracking-widest text-primary bg-primary/10 px-2 py-1 shrink-0 animate-pulse">
                {activeConv.bids.filter(b => b.status === 'pending').length} pending
              </span>
            )}
          </div>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto px-6 py-6 space-y-6"
            style={{ background: 'repeating-linear-gradient(180deg, transparent, transparent 39px, rgba(255,255,255,0.012) 40px)' }}
          >
            {activeConv.bids.slice().reverse().map((bid) => {
              const priceDiff = listedPrice > 0 ? Math.round(((bid.bid_amount_number - listedPrice) / listedPrice) * 100) : 0;

              return (
                <div key={bid.id} className="space-y-2">

                  {/* Buyer bubble — LEFT */}
                  <div className="flex gap-3 items-end">
                    <div className="w-8 h-8 bg-surface-container border border-outline-variant/20 flex items-center justify-center shrink-0 font-label text-xs text-neutral-400 font-bold uppercase">
                      {bid.buyer_name.charAt(0)}
                    </div>
                    <div className="max-w-[68%] space-y-1">
                      <p className="font-label text-[8px] text-neutral-600 ml-1">
                        {bid.buyer_name} · {new Date(bid.created_at).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                      </p>
                      <div className="bg-surface-container border border-outline-variant/15 rounded-2xl rounded-bl-sm px-4 py-3">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="font-headline italic text-2xl text-primary">{bid.bid_amount}</span>
                          {listedPrice > 0 && (
                            <span className={cn(
                              'font-label text-[8px] px-1.5 py-0.5 rounded-sm',
                              priceDiff >= 0 ? 'text-green-400 bg-green-950/30' :
                              priceDiff >= -20 ? 'text-amber-400 bg-amber-950/30' :
                              'text-red-400 bg-red-950/20'
                            )}>
                              {priceDiff >= 0 ? `+${priceDiff}%` : `${priceDiff}%`}
                            </span>
                          )}
                        </div>
                        {bid.message && (
                          <p className="font-body text-sm text-on-surface-variant leading-relaxed mt-0.5">{bid.message}</p>
                        )}
                        <div className="mt-2 pt-2 border-t border-outline-variant/10 flex flex-wrap gap-x-3 gap-y-1">
                          <span className="font-label text-[8px] text-neutral-600">{bid.buyer_email}</span>
                          <span className="font-label text-[8px] text-neutral-600">{bid.buyer_phone}</span>
                          {bid.buyer_whatsapp && (
                            <span className="font-label text-[8px] text-green-500/70">WA: {bid.buyer_whatsapp}</span>
                          )}
                        </div>
                      </div>
                      {/* Status + delete */}
                      <div className="flex items-center gap-2 ml-1">
                        {!bid.read && bid.status === 'pending' && (
                          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        )}
                        <span className={cn(
                          'font-label text-[7px] uppercase tracking-widest px-1.5 py-0.5',
                          bid.status === 'pending' ? 'text-primary bg-primary/10' :
                          bid.status === 'accepted' ? 'text-green-400 bg-green-950/30' :
                          bid.status === 'countered' ? 'text-amber-400 bg-amber-950/30' :
                          'text-neutral-600 bg-surface-container'
                        )}>
                          {bid.status}
                        </span>
                        {bid.status !== 'pending' && (
                          <button onClick={() => handleDelete(bid.id)}
                            className="text-neutral-800 hover:text-red-500 transition-colors" aria-label="Delete bid">
                            <MaterialIcon name="delete" size="sm" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Artist reply bubble — RIGHT */}
                  {(bid.status === 'accepted' || bid.status === 'countered' || bid.status === 'declined') && (
                    <div className="flex gap-3 items-end flex-row-reverse">
                      <div className="w-8 h-8 bg-primary/15 border border-primary/25 flex items-center justify-center shrink-0">
                        <MaterialIcon name="brush" size="sm" className="text-primary/70" />
                      </div>
                      <div className={cn(
                        'max-w-[68%] rounded-2xl rounded-br-sm px-4 py-3',
                        bid.status === 'accepted' ? 'bg-green-950/30 border border-green-900/30' :
                        bid.status === 'countered' ? 'bg-amber-950/25 border border-amber-900/30' :
                        'bg-surface-container border border-outline-variant/15'
                      )}>
                        {bid.status === 'accepted' && (
                          <>
                            <div className="flex items-center gap-2 mb-1">
                              <MaterialIcon name="check_circle" size="sm" className="text-green-400" />
                              <span className="font-label text-[9px] uppercase tracking-widest text-green-400">Offer Accepted</span>
                            </div>
                            <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                              Accepted at <strong className="text-green-300">{bid.bid_amount}</strong> — confirmation email sent to buyer.
                            </p>
                          </>
                        )}
                        {bid.status === 'countered' && bid.artist_counter_amount && (
                          <>
                            <div className="flex items-center gap-2 mb-1">
                              <MaterialIcon name="swap_horiz" size="sm" className="text-amber-400" />
                              <span className="font-label text-[9px] uppercase tracking-widest text-amber-400">Counter-Offer Sent</span>
                            </div>
                            <p className="font-headline italic text-xl text-amber-300">{bid.artist_counter_amount}</p>
                            {bid.artist_message && (
                              <p className="font-body text-sm text-amber-200/70 mt-1 leading-relaxed">{bid.artist_message}</p>
                            )}
                            <p className="font-label text-[8px] text-neutral-600 mt-2">Counter email sent to buyer</p>
                          </>
                        )}
                        {bid.status === 'declined' && (
                          <>
                            <div className="flex items-center gap-2 mb-1">
                              <MaterialIcon name="cancel" size="sm" className="text-neutral-500" />
                              <span className="font-label text-[9px] uppercase tracking-widest text-neutral-500">Offer Declined</span>
                            </div>
                            <p className="font-body text-sm text-neutral-600 leading-relaxed">A polite decline email was sent to the buyer.</p>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          {/* ── Compose bar ─────────────────────────────────────────────── */}
          {activePendingBid && (
            <div className="border-t border-outline-variant/10 bg-surface-container-lowest shrink-0">

              {/* Counter expand area */}
              {composeMode === 'counter' && (
                <div className="px-5 py-4 border-b border-outline-variant/10 space-y-3 bg-surface-container-low">
                  <p className="font-label text-[9px] uppercase tracking-widest text-neutral-500">
                    Your Counter-Offer to {activePendingBid.buyer_name}
                  </p>
                  <div className="flex items-center gap-2 bg-surface-container border border-outline-variant/20 px-3 py-2">
                    <span className="font-headline italic text-xl text-amber-400 shrink-0">₹</span>
                    <input
                      type="text"
                      autoFocus
                      placeholder="Counter amount"
                      value={counterAmount}
                      onChange={(e) => setCounterAmount(e.target.value)}
                      className="flex-1 bg-transparent font-headline italic text-xl text-on-surface placeholder:text-neutral-700 focus:outline-none"
                    />
                  </div>
                  <textarea
                    placeholder="Add a message... (optional)"
                    value={counterMsg}
                    onChange={(e) => setCounterMsg(e.target.value)}
                    rows={2}
                    className="w-full bg-surface-container border border-outline-variant/20 resize-none font-body text-sm text-on-surface placeholder:text-neutral-700 px-3 py-2 focus:outline-none focus:border-amber-800/40 transition-colors"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setComposeMode(null); setCounterAmount(''); setCounterMsg(''); }}
                      className="flex-1 font-label text-[9px] uppercase tracking-widest text-neutral-600 border border-outline-variant/20 py-2 hover:bg-surface-container transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleCounter(activePendingBid)}
                      disabled={!!actionLoading || !counterAmount.trim()}
                      className="flex-[2] font-label text-[9px] uppercase tracking-widest text-amber-400 border border-amber-900/40 py-2 hover:bg-amber-950/20 transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                    >
                      <MaterialIcon name="send" size="sm" />
                      {actionLoading ? '…' : 'Send Counter & Email Buyer'}
                    </button>
                  </div>
                </div>
              )}

              {/* Quick-action bar */}
              <div className="px-5 py-3 flex items-center gap-3">
                <p className="font-label text-[8px] uppercase tracking-widest text-neutral-700 shrink-0 hidden sm:block">
                  Reply:
                </p>
                <div className="flex gap-2 flex-1">
                  <button
                    onClick={() => handleAccept(activePendingBid)}
                    disabled={!!actionLoading}
                    className="flex-1 font-label text-[9px] uppercase tracking-widest text-green-400 border border-green-900/40 py-2.5 hover:bg-green-950/20 transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                  >
                    <MaterialIcon name="check_circle" size="sm" />
                    Accept
                  </button>
                  {composeMode !== 'counter' && (
                    <button
                      onClick={() => setComposeMode('counter')}
                      disabled={!!actionLoading}
                      className="flex-1 font-label text-[9px] uppercase tracking-widest text-amber-400 border border-amber-900/40 py-2.5 hover:bg-amber-950/20 transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                    >
                      <MaterialIcon name="swap_horiz" size="sm" />
                      Counter
                    </button>
                  )}
                  <button
                    onClick={() => handleDecline(activePendingBid)}
                    disabled={!!actionLoading}
                    className="flex-1 font-label text-[9px] uppercase tracking-widest text-red-500 border border-red-900/30 py-2.5 hover:bg-red-950/20 transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                  >
                    <MaterialIcon name="cancel" size="sm" />
                    Decline
                  </button>
                </div>
              </div>
              <p className="text-center font-label text-[7px] uppercase tracking-widest text-neutral-800 pb-2">
                Each action emails the buyer automatically
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="font-label text-[10px] uppercase tracking-widest text-neutral-700">Select a conversation</p>
        </div>
      )}
    </div>
  );
}


function AddDoodle({ onAdded }: { onAdded: () => void }) {
  const [form, setForm] = useState({
    title: '', price: '',
    status: 'available' as Doodle['status'], image_url: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field: string, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.price) {
      setError('Title and price are required.');
      return;
    }
    setError(''); setLoading(true);
    try {
      const priceNumber = parseFloat(form.price.replace(/[^\d.]/g, '')) || 0;
      const res = await fetch('/api/doodles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, price_number: priceNumber, image_url: form.image_url || null }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error ?? 'Failed to create doodle');
      }
      setSuccess(true);
      setForm({ title: '', price: '', status: 'available', image_url: '' });
      onAdded();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full bg-surface-container border-b border-outline-variant/30 focus:border-primary/60 py-3 px-0 font-body text-sm text-on-surface placeholder:text-neutral-700 focus:outline-none transition-colors';
  const labelClass = 'block font-label text-[9px] uppercase tracking-widest text-neutral-600 mb-2';

  return (
    <div className="max-w-2xl">
      <p className="font-label text-[10px] uppercase tracking-widest text-neutral-600 mb-8">
        Doodles are simple — just a title, price, and optional image.
      </p>

      {success && (
        <div className="flex items-center gap-3 bg-primary/10 border border-primary/20 text-primary p-4 mb-6">
          <MaterialIcon name="check_circle" size="sm" />
          <span className="font-label text-[10px] uppercase tracking-widest">Doodle published successfully!</span>
        </div>
      )}
      {error && (
        <div className="flex items-center gap-3 bg-red-950/30 border border-red-900/30 text-red-400 p-4 mb-6">
          <MaterialIcon name="error" size="sm" />
          <span className="font-label text-[10px] uppercase tracking-widest">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <div>
          <label className={labelClass}>Title *</label>
          <input type="text" value={form.title} onChange={e => handleChange('title', e.target.value)}
            placeholder="e.g. The Little Fox" className={inputClass} />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>Price * (with ₹)</label>
            <input type="text" value={form.price} onChange={e => handleChange('price', e.target.value)}
              placeholder="₹150" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Status</label>
            <select value={form.status} onChange={e => handleChange('status', e.target.value)}
              className={`${inputClass} cursor-pointer bg-surface-container`}>
              <option value="available">Available (For Sale)</option>
              <option value="sold">Sold</option>
            </select>
          </div>
        </div>
        <div>
          <label className={labelClass}>Doodle Image</label>
          <input
            type="file" accept="image/*" disabled={loading}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setLoading(true); setError('Uploading image...');
              try {
                const { v4: uuidv4 } = await import('uuid');
                const fileExt = file.name.split('.').pop() || 'jpg';
                const fileName = `doodle-${uuidv4()}.${fileExt}`;
                const { error: uploadError } = await supabase.storage.from('art').upload(fileName, file);
                if (uploadError) throw uploadError;
                const { data } = supabase.storage.from('art').getPublicUrl(fileName);
                handleChange('image_url', data.publicUrl);
                setError('');
              } catch (err: unknown) {
                setError(err instanceof Error ? err.message : 'Error uploading image.');
              } finally { setLoading(false); }
            }}
            className={inputClass}
          />
          <p className="mt-2 font-label text-[9px] text-neutral-700">Select an image to automatically upload it to Supabase Storage.</p>
        </div>
        {form.image_url && (
          <div>
            <label className={labelClass}>Image Preview</label>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={form.image_url} alt="Preview" className="w-32 h-32 object-cover border border-outline-variant/20" />
          </div>
        )}
        <button type="submit" disabled={loading} id="add-doodle-submit"
          className="gold-gradient-bg text-on-primary font-label text-[10px] font-bold uppercase tracking-widest px-10 py-4 hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center gap-3">
          {loading ? <span className="w-3 h-3 border border-on-primary/40 border-t-on-primary rounded-full animate-spin" /> : <MaterialIcon name="draw" size="sm" />}
          Publish Doodle
        </button>
      </form>
    </div>
  );
}

// ─── Manage Doodles ───────────────────────────────────────────────────────────

function ManageDoodles({ doodles, onRefresh }: { doodles: Doodle[]; onRefresh: () => void }) {
  const [deleting, setDeleting] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<Partial<Doodle>>({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this doodle permanently?')) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/doodles/${id}`, { method: 'DELETE' });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || 'Failed to delete'); }
    } catch (err: unknown) { alert(`Error: ${err instanceof Error ? err.message : 'Unknown'}`); }
    finally { setDeleting(null); onRefresh(); }
  };

  const handleSave = async (id: string) => {
    setSaving(true);
    let priceNumber = 0;
    if (editDraft.price) priceNumber = parseFloat(editDraft.price.replace(/[^\d.]/g, '')) || 0;
    await fetch(`/api/doodles/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...editDraft, ...(editDraft.price ? { price_number: priceNumber } : {}) }),
    });
    setSaving(false); setEditingId(null); onRefresh();
  };

  if (doodles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <span className="text-5xl" aria-hidden="true">✏️</span>
        <p className="font-label text-[10px] uppercase tracking-widest text-neutral-600">No doodles yet. Add your first one.</p>
      </div>
    );
  }

  const inputClass = 'w-full bg-surface-container border border-outline-variant/30 text-on-surface font-label text-[10px] py-2 px-2 focus:outline-none focus:border-primary/50';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {doodles.map((doodle) => (
        <div key={doodle.id} className="bg-surface-container-low border border-outline-variant/5 overflow-hidden group">
          <div className="aspect-square relative overflow-hidden">
            {doodle.image_url
              ? <img src={doodle.image_url} alt={doodle.title} className="w-full h-full object-cover" />
              : <ImagePlaceholder label={doodle.title} icon="draw" accentColor="#4a4a3a" className="w-full h-full rounded-none" />}
            <div className="absolute top-3 right-3">
              <span className={cn(
                'inline-block font-label text-[8px] uppercase tracking-widest px-2 py-0.5',
                doodle.status === 'available' ? 'text-on-surface-variant bg-surface-container' : 'text-neutral-600 bg-surface-container'
              )}>
                {doodle.status === 'available' ? 'For Sale' : 'Sold'}
              </span>
            </div>
          </div>
          <div className="p-5 space-y-3">
            <div>
              <p className="font-headline italic text-lg text-on-surface leading-tight">{doodle.title}</p>
              <p className="font-label text-sm text-primary mt-1">{doodle.price}</p>
            </div>

            {editingId === doodle.id ? (
              <div className="flex flex-col gap-3 border-t border-outline-variant/10 pt-3">
                <input type="text" value={editDraft.title ?? ''} onChange={e => setEditDraft(d => ({ ...d, title: e.target.value }))} placeholder="Title" className={inputClass} />
                <input type="text" value={editDraft.price ?? ''} onChange={e => setEditDraft(d => ({ ...d, price: e.target.value }))} placeholder="Price (₹)" className={inputClass} />
                <select value={editDraft.status ?? 'available'} onChange={e => setEditDraft(d => ({ ...d, status: e.target.value as Doodle['status'] }))} className={`${inputClass} cursor-pointer bg-surface-container`}>
                  <option value="available">Available</option>
                  <option value="sold">Sold</option>
                </select>
                {/* Image re-upload */}
                <div>
                  <input type="file" accept="image/*" disabled={uploading}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setUploading(true);
                      try {
                        const { v4: uuidv4 } = await import('uuid');
                        const fileExt = file.name.split('.').pop() || 'jpg';
                        const fileName = `doodle-${uuidv4()}.${fileExt}`;
                        const { error: uploadError } = await supabase.storage.from('art').upload(fileName, file);
                        if (uploadError) throw uploadError;
                        const { data } = supabase.storage.from('art').getPublicUrl(fileName);
                        setEditDraft(d => ({ ...d, image_url: data.publicUrl }));
                      } catch { /* ignore */ } finally { setUploading(false); }
                    }}
                    className={inputClass}
                  />
                  {uploading && <p className="font-label text-[9px] text-neutral-600 mt-1">Uploading…</p>}
                </div>
                <div className="flex gap-2 pt-2">
                  <button onClick={() => setEditingId(null)} className="flex-1 font-label text-[9px] uppercase tracking-widest text-neutral-600 border border-outline-variant/20 py-1.5 hover:bg-surface-container">Cancel</button>
                  <button onClick={() => handleSave(doodle.id)} disabled={saving} className="flex-1 font-label text-[9px] uppercase tracking-widest text-primary border border-primary/30 py-1.5 hover:bg-primary/5 disabled:opacity-50">
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => { setEditingId(doodle.id); setEditDraft({ title: doodle.title, price: doodle.price, status: doodle.status, image_url: doodle.image_url ?? '' }); }}
                  className="flex-1 font-label text-[9px] uppercase tracking-widest text-neutral-500 border border-outline-variant/20 py-2 hover:border-outline-variant/40 hover:text-on-surface transition-all"
                >
                  Edit
                </button>
                <button onClick={() => handleDelete(doodle.id)} disabled={deleting === doodle.id}
                  className="font-label text-[9px] uppercase tracking-widest text-red-700 border border-red-900/20 px-3 py-2 hover:bg-red-950/30 transition-all disabled:opacity-50" aria-label={`Delete ${doodle.title}`}>
                  {deleting === doodle.id ? '…' : <MaterialIcon name="delete" size="sm" />}
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Settings ─────────────────────────────────────────────────────────────────

function Settings() {
  return (
    <div className="max-w-lg space-y-8">
      <div className="bg-surface-container-low border border-outline-variant/5 p-6 space-y-4">
        <h3 className="font-headline italic text-xl text-on-surface">Paytm / UPI QR Code</h3>
        <p className="font-body text-sm text-on-surface-variant leading-relaxed">
          Save your Paytm QR code image as{' '}
          <code className="bg-surface-container px-2 py-0.5 font-mono text-primary text-xs">public/images/paytm-qr.jpeg</code>{' '}
          in your project. It will automatically appear in the purchase modal shown to buyers.
        </p>
        <div className="border border-primary/10 p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/paytm-qr.jpeg" alt="Current Paytm QR" className="w-32 h-32 object-contain"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          <p className="font-label text-[9px] text-neutral-600 mt-2 uppercase tracking-widest">Current QR — replace file to update</p>
        </div>
      </div>

      <div className="bg-surface-container-low border border-outline-variant/5 p-6 space-y-4">
        <h3 className="font-headline italic text-xl text-on-surface">Payment Email</h3>
        <p className="font-body text-sm text-on-surface-variant leading-relaxed">
          All payment notifications and order confirmations go to{' '}
          <strong className="text-primary">vajra.vyuha.official@gmail.com</strong>.
        </p>
      </div>

      <div className="bg-surface-container-low border border-outline-variant/5 p-6 space-y-4">
        <h3 className="font-headline italic text-xl text-on-surface">How Payment Verification Works</h3>
        <div className="font-body text-sm text-on-surface-variant leading-relaxed space-y-3">
          <p>Buyers pay via Paytm/UPI, then enter their <strong className="text-on-surface">UPI Transaction Reference (UTR)</strong> — a unique number from their payment receipt.</p>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Buyer places order with their UTR number</li>
            <li>You receive an alert in dashboard: <strong className="text-yellow-400">"Verify Payment"</strong></li>
            <li>Open your Paytm or bank app → check if the UTR matches</li>
            <li>Click <strong className="text-green-400">"Verify &amp; Confirm"</strong> if money received</li>
            <li>Click <strong className="text-red-400">"Reject"</strong> if UTR not found</li>
          </ol>
        </div>
      </div>

      <div className="bg-surface-container-low border border-outline-variant/5 p-6 space-y-4">
        <h3 className="font-headline italic text-xl text-on-surface">Supabase — Run These Migrations</h3>
        <p className="font-body text-sm text-on-surface-variant leading-relaxed mb-2">
          Run this SQL in your Supabase SQL Editor to enable all features:
        </p>
        <pre className="bg-surface-container p-4 font-mono text-[10px] text-primary leading-relaxed overflow-x-auto whitespace-pre-wrap">
{`-- Add missing orders columns (safe to run multiple times)
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS order_id TEXT,
  ADD COLUMN IF NOT EXISTS upi_transaction_id TEXT,
  ADD COLUMN IF NOT EXISTS payment_verified BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS tracking_id TEXT,
  ADD COLUMN IF NOT EXISTS buyer_whatsapp TEXT,
  ADD COLUMN IF NOT EXISTS buyer_pincode TEXT;

-- Create doodles table
CREATE TABLE IF NOT EXISTS public.doodles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  image_url TEXT,
  price TEXT NOT NULL,
  price_number NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'available' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
ALTER TABLE public.doodles ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "doodles_all" ON public.doodles FOR ALL USING (true) WITH CHECK (true);

-- Create bids table
CREATE TABLE IF NOT EXISTS public.bids (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  artwork_id UUID REFERENCES public.artworks(id) ON DELETE CASCADE,
  artwork_title TEXT NOT NULL,
  bid_amount TEXT NOT NULL,
  bid_amount_number NUMERIC NOT NULL,
  buyer_name TEXT NOT NULL,
  buyer_email TEXT NOT NULL,
  buyer_phone TEXT NOT NULL,
  buyer_whatsapp TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending' NOT NULL
    CHECK (status IN ('pending','accepted','countered','declined')),
  artist_counter_amount TEXT,
  artist_message TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "bids_all" ON public.bids FOR ALL USING (true) WITH CHECK (true);`}
        </pre>
        <p className="font-label text-[9px] text-neutral-600 uppercase tracking-widest">Run once in Supabase → SQL Editor → New Query</p>
      </div>

      <div className="bg-surface-container-low border border-outline-variant/5 p-6 space-y-4">
        <h3 className="font-headline italic text-xl text-on-surface">Access Code</h3>
        <p className="font-body text-sm text-on-surface-variant leading-relaxed">
          Current code: <strong className="text-primary">1567</strong><br />
          To change it, edit the <code className="bg-surface-container px-2 py-0.5 font-mono text-primary text-xs">SECRET_CODE</code> constant in{' '}
          <code className="bg-surface-container px-2 py-0.5 font-mono text-primary text-xs">src/components/art/SecretArtistEntrance.tsx</code>.
        </p>
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export function ArtistDashboard() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState<NavId>('dashboard');
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [doodles, setDoodles] = useState<Doodle[]>([]);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [artRes, ordRes, doodleRes, bidsRes] = await Promise.all([
        fetch('/api/artworks').then(r => r.json()),
        fetch('/api/orders').then(r => r.json()),
        fetch('/api/doodles').then(r => r.json()),
        fetch('/api/bids').then(r => r.json()),
      ]);
      if (Array.isArray(artRes)) setArtworks(artRes);
      if (Array.isArray(ordRes)) setOrders(ordRes);
      if (Array.isArray(doodleRes)) setDoodles(doodleRes);
      if (Array.isArray(bidsRes)) setBids(bidsRes);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleExit = () => {
    sessionStorage.removeItem('vajravyuha_artist_auth');
    router.push('/art');
  };

  const sectionTitle = NAV_ITEMS.find(n => n.id === activeNav)?.label ?? '';
  const pendingVerification = orders.filter(o => o.status === 'pending_verification').length;
  const unreadBids = bids.filter(b => !b.read && b.status === 'pending').length;

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body flex overflow-x-hidden">

      {/* ─── SIDEBAR ─── */}
      <aside className="h-screen w-72 fixed left-0 top-0 bg-surface-container-lowest shadow-[0_0_64px_rgba(233,195,73,0.05)] z-50 flex flex-col py-8 border-r border-outline-variant/10">
        <div className="px-8 mb-12">
          <h1 className="font-headline text-2xl font-bold tracking-tighter text-primary">VAJRAVYUHA</h1>
          <p className="font-label text-[10px] uppercase tracking-[0.2em] text-neutral-600 mt-1">The Sovereign Archive</p>
        </div>

        <nav className="flex-1" aria-label="Artist panel navigation">
          <ul className="space-y-0.5">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveNav(item.id)}
                  className={cn(
                    'w-full flex items-center gap-4 px-8 py-4 font-label uppercase text-xs tracking-wider transition-all duration-200 relative text-left',
                    activeNav === item.id
                      ? "text-primary font-bold after:content-[''] after:absolute after:left-0 after:top-1/2 after:-translate-y-1/2 after:w-0.5 after:h-6 after:bg-secondary-container"
                      : 'text-neutral-500 hover:text-primary hover:bg-surface-container'
                  )}
                  aria-current={activeNav === item.id ? 'page' : undefined}
                  id={`nav-${item.id}`}
                >
                  <span className="material-symbols-outlined text-[20px]"
                    style={{ fontVariationSettings: activeNav === item.id ? "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" : "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24" }}>
                    {item.icon}
                  </span>
                  {item.label}
                  {/* Orders badges */}
                  {item.id === 'orders' && pendingVerification > 0 && (
                    <span className="ml-auto w-5 h-5 rounded-full bg-yellow-400 text-surface font-bold font-label text-[9px] flex items-center justify-center animate-pulse">
                      {pendingVerification}
                    </span>
                  )}
                  {/* Bids badge */}
                  {item.id === 'bids' && unreadBids > 0 && (
                    <span className="ml-auto w-5 h-5 rounded-full bg-primary text-on-primary font-bold font-label text-[9px] flex items-center justify-center animate-pulse">
                      {unreadBids}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="px-8 pt-6 border-t border-outline-variant/10 space-y-6">
          <button onClick={handleExit} className="w-full flex items-center gap-3 text-neutral-700 hover:text-primary transition-colors font-label text-[10px] uppercase tracking-widest">
            <MaterialIcon name="arrow_back" size="sm" />
            Return to Art Page
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-surface-container-high border border-outline-variant/20 flex items-center justify-center shrink-0">
              <MaterialIcon name="person" size="sm" className="text-primary/60" />
            </div>
            <div>
              <p className="font-label text-[10px] uppercase tracking-widest text-neutral-500">Authorized Artist</p>
              <p className="font-headline italic text-sm text-primary">Aditya&apos;s Sister</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ─── MAIN ─── */}
      <div className="ml-72 flex-1 flex flex-col min-h-screen">
        <header className="fixed top-0 right-0 w-[calc(100%-18rem)] h-20 z-40 bg-surface/60 backdrop-blur-xl flex justify-between items-center px-12 border-b border-outline-variant/10">
          <span className="font-label text-[10px] uppercase tracking-[0.3em] text-primary">{sectionTitle}</span>
          <div className="flex items-center gap-6">
            <button onClick={fetchData} className="flex items-center gap-2 text-neutral-600 hover:text-primary transition-colors font-label text-[10px] uppercase tracking-widest" aria-label="Refresh data">
              <MaterialIcon name="refresh" size="sm" />Refresh
            </button>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="font-label text-[10px] uppercase tracking-[0.2em] text-primary/70">Live</span>
            </div>
          </div>
        </header>

        <main className="pt-28 pb-16 px-12 flex-1">
          <div className="flex justify-between items-end mb-10">
            <h2 className="font-headline text-4xl font-light text-on-surface tracking-tight italic">{sectionTitle}</h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-32 gap-3">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="font-label text-[10px] uppercase tracking-widest text-neutral-600">Loading…</span>
            </div>
          ) : (
            <>
              {activeNav === 'dashboard'       && <DashboardOverview artworks={artworks} orders={orders} doodles={doodles} bids={bids} />}
              {activeNav === 'add'             && <AddArtwork onAdded={fetchData} />}
              {activeNav === 'manage'          && <ManageArtworks artworks={artworks} onRefresh={fetchData} />}
              {activeNav === 'add-doodle'      && <AddDoodle onAdded={fetchData} />}
              {activeNav === 'manage-doodles'  && <ManageDoodles doodles={doodles} onRefresh={fetchData} />}
              {activeNav === 'orders'          && <OrdersPanel orders={orders} onRefresh={fetchData} artworks={artworks} />}
              {activeNav === 'bids'            && <BidsPanel bids={bids} artworks={artworks} onRefresh={fetchData} />}
              {activeNav === 'settings'        && <Settings />}
            </>
          )}
        </main>

        <footer className="bg-surface-container-lowest py-6 px-12 border-t border-outline-variant/5">
          <div className="flex justify-between items-center">
            <span className="font-headline text-lg font-bold text-neutral-700">VAJRAVYUHA</span>
            <p className="font-label text-[9px] uppercase tracking-widest text-neutral-800">Private Artist Panel · Restricted Access</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
