'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { MaterialIcon } from '@/components/ui/MaterialIcon';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { supabase } from '@/lib/supabase';
import {
  Artwork,
  Order,
  buildDailyReminderHref,
  getReservationDay,
  isReservationExpired,
  reservationCountdown,
} from '@/data/artworks';

// ─── Nav tabs ─────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard',      icon: 'dashboard' },
  { id: 'add',       label: 'Add Artwork',     icon: 'add_circle' },
  { id: 'manage',    label: 'Manage Artworks', icon: 'grid_view' },
  { id: 'orders',    label: 'Orders',          icon: 'receipt_long' },
  { id: 'settings',  label: 'Settings',        icon: 'settings' },
] as const;

type NavId = (typeof NAV_ITEMS)[number]['id'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Badge({ status }: { status: Artwork['status'] }) {
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

function OrderStatusBadge({ status }: { status: Order['status'] }) {
  return (
    <span className={cn(
      'inline-block font-label text-[8px] uppercase tracking-widest px-2 py-0.5',
      status === 'pending'   && 'text-amber-400 bg-amber-950/40',
      status === 'confirmed' && 'text-primary bg-primary/10',
      status === 'completed' && 'text-green-400 bg-green-950/40',
      status === 'expired'   && 'text-neutral-600 bg-surface-container',
      status === 'cancelled' && 'text-red-500 bg-red-950/30',
    )}>
      {status}
    </span>
  );
}

// ─── Section: Dashboard Overview ──────────────────────────────────────────────

function DashboardOverview({ artworks, orders }: { artworks: Artwork[]; orders: Order[] }) {
  const stats = [
    { label: 'Total Artworks', value: artworks.length, icon: 'palette', sub: 'In collection' },
    { label: 'Available',      value: artworks.filter(a => a.status === 'available').length,   icon: 'sell',          sub: 'For sale',       color: 'text-primary' },
    { label: 'Reserved',       value: artworks.filter(a => a.status === 'reserved').length,    icon: 'bookmark',      sub: '7-day holds',    color: 'text-amber-400', pulse: true },
    { label: 'Sold',           value: artworks.filter(a => a.status === 'sold').length,        icon: 'check_circle',  sub: 'Completed',      color: 'text-green-500' },
  ];

  const activeReservations = orders.filter(
    o => o.order_type === 'reservation' && o.status === 'pending' && !isReservationExpired(o.reserved_until)
  );

  return (
    <div className="space-y-10">
      {/* Stats grid */}
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

      {/* Active reservations reminder panel */}
      {activeReservations.length > 0 && (
        <div className="bg-amber-950/20 border border-amber-900/30 p-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <h3 className="font-headline italic text-xl text-amber-300">Active Reservations</h3>
            <span className="font-label text-[9px] uppercase tracking-widest text-amber-600 ml-auto">
              {activeReservations.length} active
            </span>
          </div>
          <div className="space-y-4">
            {activeReservations.map((order) => {
              const day = getReservationDay(order) ?? 1;
              const daysLeft = 7 - day + 1;
              return (
                <ReservationReminderRow key={order.id} order={order} day={day} daysLeft={daysLeft} />
              );
            })}
          </div>
        </div>
      )}

      {/* Recent orders */}
      <div className="bg-surface-container-low border border-outline-variant/5 p-6">
        <h3 className="font-headline italic text-xl text-on-surface mb-6">Recent Orders</h3>
        {orders.length === 0 ? (
          <p className="font-label text-[10px] uppercase tracking-widest text-neutral-700 py-8 text-center">
            No orders yet
          </p>
        ) : (
          <div className="space-y-3">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between py-3 border-b border-outline-variant/5 last:border-0">
                <div>
                  <p className="font-label text-xs text-on-surface">{order.buyer_name}</p>
                  <p className="font-label text-[9px] text-neutral-600">{order.artwork_title} · {order.order_type}</p>
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

// ─── Section: Reservation Reminder Row ────────────────────────────────────────

function ReservationReminderRow({ order, day, daysLeft }: { order: Order; day: number; daysLeft: number }) {
  const [sent, setSent] = useState(false);

  const handleSendEmail = useCallback(async () => {
    const href = buildDailyReminderHref(order, day);
    window.location.href = href;

    // Increment day_reminder_sent
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

      {/* Day progress */}
      <div className="flex items-center gap-3">
        <div className="flex gap-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'w-4 h-1.5 transition-all',
                i < day ? 'bg-amber-500' : 'bg-amber-950/40'
              )}
            />
          ))}
        </div>
        <span className="font-label text-[9px] uppercase tracking-widest text-amber-400/70 whitespace-nowrap">
          Day {day} of 7
        </span>
      </div>

      {/* Countdown */}
      {order.reserved_until && (
        <span className="font-label text-[9px] text-amber-300 tabular-nums whitespace-nowrap">
          {daysLeft}d left
        </span>
      )}

      {/* Send reminder */}
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

// ─── Section: Add Artwork ─────────────────────────────────────────────────────

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
      // Parse price number from string like "₹4,500"
      const priceNumber = parseFloat(form.price.replace(/[^\d.]/g, '')) || 0;
      const res = await fetch('/api/artworks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price_number: priceNumber,
          image_url: form.image_url || null,
        }),
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
            type="file" 
            accept="image/*"
            disabled={loading}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              
              setLoading(true);
              setError('Uploading image...');
              try {
                const { v4: uuidv4 } = await import('uuid');
                const fileExt = file.name.split('.').pop() || 'jpg';
                const fileName = `${uuidv4()}.${fileExt}`;
                
                const { error: uploadError } = await supabase.storage
                  .from('art')
                  .upload(fileName, file);
                  
                if (uploadError) throw uploadError;
                
                const { data } = supabase.storage
                  .from('art')
                  .getPublicUrl(fileName);
                  
                handleChange('image_url', data.publicUrl);
                setError('');
              } catch (err: any) {
                setError(err.message || 'Error uploading image. Is your bucket public?');
              } finally {
                setLoading(false);
              }
            }}
            className={inputClass}
          />
          <p className="mt-2 font-label text-[9px] text-neutral-700">
            Select an image to automatically upload it to your database.
          </p>
        </div>

        {/* Preview */}
        {form.image_url && (
          <div>
            <label className={labelClass}>Image Preview</label>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={form.image_url} alt="Preview" className="w-32 h-32 object-cover border border-outline-variant/20" />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          id="add-artwork-submit"
          className="gold-gradient-bg text-on-primary font-label text-[10px] font-bold uppercase tracking-widest px-10 py-4 hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center gap-3"
        >
          {loading ? <span className="w-3 h-3 border border-on-primary/40 border-t-on-primary rounded-full animate-spin" /> : <MaterialIcon name="add_circle" size="sm" />}
          Publish Artwork
        </button>
      </form>
    </div>
  );
}

// ─── Section: Manage Artworks ─────────────────────────────────────────────────

function ManageArtworks({ artworks, onRefresh }: { artworks: Artwork[]; onRefresh: () => void }) {
  const [deleting, setDeleting] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<Partial<Artwork>>({});
  const [saving, setSaving] = useState(false);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this artwork permanently?')) return;
    setDeleting(id);
    await fetch(`/api/artworks/${id}`, { method: 'DELETE' });
    setDeleting(null);
    onRefresh();
  };

  const handleStatusSave = async (id: string) => {
    setSaving(true);
    let priceNumber = 0;
    if (editDraft.price) {
      priceNumber = parseFloat(editDraft.price.replace(/[^\d.]/g, '')) || 0;
    }
    
    await fetch(`/api/artworks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...editDraft, ...(editDraft.price ? { price_number: priceNumber } : {}) }),
    });
    setSaving(false);
    setEditingId(null);
    onRefresh();
  };

  if (artworks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <MaterialIcon name="palette" size="4xl" className="text-neutral-700" />
        <p className="font-label text-[10px] uppercase tracking-widest text-neutral-600">No artworks yet. Add your first one.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {artworks.map((artwork) => (
        <div key={artwork.id} className="bg-surface-container-low border border-outline-variant/5 overflow-hidden group">
          {/* Image */}
          <div className="aspect-video relative overflow-hidden">
            {artwork.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={artwork.image_url} alt={artwork.title} className="w-full h-full object-cover" />
            ) : (
              <ImagePlaceholder label={artwork.title} icon="palette" accentColor="#353535" className="w-full h-full rounded-none" />
            )}
            <div className="absolute top-3 right-3">
              <Badge status={artwork.status} />
            </div>
          </div>

          {/* Info */}
          <div className="p-5 space-y-3">
            <div>
              <p className="font-headline italic text-lg text-on-surface leading-tight">{artwork.title}</p>
              <p className="font-label text-[9px] text-neutral-600">{artwork.medium} · {artwork.dimensions}</p>
            </div>
            <p className="font-label text-sm text-primary">{artwork.price}</p>

            {artwork.status === 'reserved' && artwork.reserved_until && (
              <p className="font-label text-[9px] text-amber-400/70">
                {isReservationExpired(artwork.reserved_until)
                  ? 'Reservation expired — mark as available'
                  : `Reserved: ${reservationCountdown(artwork.reserved_until)}`}
              </p>
            )}

            {/* Full Editor */}
            {editingId === artwork.id ? (
              <div className="flex flex-col gap-3 border-t border-outline-variant/10 pt-3">
                <input type="text" value={editDraft.title ?? ''} onChange={e => setEditDraft(d => ({ ...d, title: e.target.value }))} placeholder="Title" className="w-full bg-surface-container border border-outline-variant/30 text-on-surface font-label text-[10px] py-2 px-2 focus:outline-none" />
                <textarea value={editDraft.description ?? ''} onChange={e => setEditDraft(d => ({ ...d, description: e.target.value }))} placeholder="Description" rows={3} className="w-full bg-surface-container border border-outline-variant/30 text-on-surface font-label text-[10px] py-2 px-2 focus:outline-none resize-none" />
                <input type="text" value={editDraft.price ?? ''} onChange={e => setEditDraft(d => ({ ...d, price: e.target.value }))} placeholder="Price (₹)" className="w-full bg-surface-container border border-outline-variant/30 text-on-surface font-label text-[10px] py-2 px-2 focus:outline-none" />
                <div className="flex gap-2">
                  <input type="text" value={editDraft.medium ?? ''} onChange={e => setEditDraft(d => ({ ...d, medium: e.target.value }))} placeholder="Medium" className="w-full bg-surface-container border border-outline-variant/30 text-on-surface font-label text-[10px] py-2 px-2 focus:outline-none" />
                  <input type="text" value={editDraft.dimensions ?? ''} onChange={e => setEditDraft(d => ({ ...d, dimensions: e.target.value }))} placeholder="Dimensions" className="w-full bg-surface-container border border-outline-variant/30 text-on-surface font-label text-[10px] py-2 px-2 focus:outline-none" />
                </div>
                <select
                  value={editDraft.status ?? 'available'}
                  onChange={e => setEditDraft(d => ({ ...d, status: e.target.value as Artwork['status'] }))}
                  className="w-full bg-surface-container border border-outline-variant/30 text-on-surface font-label text-[10px] py-2 px-2 focus:outline-none"
                >
                  <option value="available">Available</option>
                  <option value="coming_soon">Coming Soon</option>
                  <option value="reserved">Reserved</option>
                  <option value="sold">Sold</option>
                </select>
                <div className="flex gap-2 pt-2">
                  <button onClick={() => setEditingId(null)}
                    className="flex-1 font-label text-[9px] uppercase tracking-widest text-neutral-600 border border-outline-variant/20 py-1.5 hover:bg-surface-container">
                    Cancel
                  </button>
                  <button onClick={() => handleStatusSave(artwork.id)} disabled={saving}
                    className="flex-1 font-label text-[9px] uppercase tracking-widest text-primary border border-primary/30 py-1.5 hover:bg-primary/5 disabled:opacity-50">
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
                  Edit Status
                </button>
                <button
                  onClick={() => handleDelete(artwork.id)}
                  disabled={deleting === artwork.id}
                  className="font-label text-[9px] uppercase tracking-widest text-red-700 border border-red-900/20 px-3 py-2 hover:bg-red-950/30 transition-all disabled:opacity-50"
                  aria-label={`Delete ${artwork.title}`}
                >
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

// ─── Section: Orders ──────────────────────────────────────────────────────────

function OrdersPanel({ orders, onRefresh }: { orders: Order[]; onRefresh: () => void }) {
  const handleExpire = async (order: Order) => {
    await fetch(`/api/orders/${order.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'expired' }),
    });
    // Also un-reserve the artwork
    await fetch(`/api/artworks/${order.artwork_id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'available', reserved_until: null, reserved_by_name: null, reserved_by_email: null }),
    });
    onRefresh();
  };

  const handleConfirm = async (order: Order) => {
    await fetch(`/api/orders/${order.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'confirmed' }),
    });
    onRefresh();
  };

  const handleComplete = async (order: Order) => {
    await fetch(`/api/orders/${order.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'completed' }),
    });
    // Mark artwork as sold
    await fetch(`/api/artworks/${order.artwork_id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'sold' }),
    });
    onRefresh();
  };

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <MaterialIcon name="receipt_long" size="4xl" className="text-neutral-700" />
        <p className="font-label text-[10px] uppercase tracking-widest text-neutral-600">No orders yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const day = getReservationDay(order);
        const expired = isReservationExpired(order.reserved_until);
        return (
          <div key={order.id} className="bg-surface-container-low border border-outline-variant/5 p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <p className="font-headline italic text-lg text-on-surface">{order.artwork_title}</p>
                  <OrderStatusBadge status={order.status} />
                  <span className={cn(
                    'font-label text-[8px] uppercase tracking-widest px-2 py-0.5',
                    order.order_type === 'reservation' ? 'text-amber-400 bg-amber-950/30' : 'gold-gradient-bg text-on-primary'
                  )}>
                    {order.order_type}
                  </span>
                </div>
                <p className="font-label text-[10px] text-neutral-500">
                  {order.buyer_name} · {order.buyer_email} · {order.buyer_phone}
                </p>
                {order.buyer_address && (
                  <p className="font-label text-[9px] text-neutral-700">Ship to: {order.buyer_address}</p>
                )}
                <div className="flex items-center gap-4 mt-2">
                  <span className="font-label text-sm text-primary">{order.amount}</span>
                  {order.order_type === 'reservation' && order.reserved_until && (
                    <span className={cn(
                      'font-label text-[9px]',
                      expired ? 'text-red-500' : 'text-amber-400/70'
                    )}>
                      {expired ? 'Expired' : reservationCountdown(order.reserved_until)}
                    </span>
                  )}
                  <span className="font-label text-[9px] text-neutral-700">
                    {new Date(order.created_at).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                  </span>
                </div>

                {/* Day progress for reservations */}
                {order.order_type === 'reservation' && day && (
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex gap-1">
                      {Array.from({ length: 7 }).map((_, i) => (
                        <div key={i} className={cn('w-4 h-1 transition-all', i < day ? 'bg-amber-500' : 'bg-amber-950/30')} />
                      ))}
                    </div>
                    <span className="font-label text-[9px] text-amber-400/60">Day {day} of 7</span>
                    {/* Daily reminder */}
                    <a
                      href={buildDailyReminderHref(order, day)}
                      className="font-label text-[9px] uppercase tracking-widest text-amber-400 border border-amber-800/30 px-3 py-1 hover:bg-amber-950/20 transition-all flex items-center gap-1.5"
                    >
                      <MaterialIcon name="mail" size="sm" />Send Day {day} Reminder
                    </a>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 shrink-0">
                {order.status === 'pending' && (
                  <>
                    <button onClick={() => handleConfirm(order)}
                      className="font-label text-[9px] uppercase tracking-widest text-primary border border-primary/30 px-4 py-2 hover:bg-primary/5 transition-all">
                      Confirm
                    </button>
                    <button onClick={() => handleExpire(order)}
                      className="font-label text-[9px] uppercase tracking-widest text-red-500 border border-red-900/30 px-4 py-2 hover:bg-red-950/20 transition-all">
                      Expire
                    </button>
                  </>
                )}
                {order.status === 'confirmed' && (
                  <button onClick={() => handleComplete(order)}
                    className="gold-gradient-bg text-on-primary font-label text-[9px] uppercase tracking-widest px-4 py-2 hover:-translate-y-0.5 transition-all">
                    Mark Complete
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

// ─── Section: Settings ────────────────────────────────────────────────────────

function Settings() {
  return (
    <div className="max-w-lg space-y-8">
      <div className="bg-surface-container-low border border-outline-variant/5 p-6 space-y-4">
        <h3 className="font-headline italic text-xl text-on-surface">Paytm QR Code</h3>
        <p className="font-body text-sm text-on-surface-variant leading-relaxed">
          Save your Paytm QR code image as{' '}
          <code className="bg-surface-container px-2 py-0.5 font-mono text-primary text-xs">
            public/images/paytm-qr.jpeg
          </code>{' '}
          in your project. It will automatically appear in the purchase modal shown to buyers.
        </p>
        <div className="border border-primary/10 p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/paytm-qr.jpeg"
            alt="Current Paytm QR"
            className="w-32 h-32 object-contain"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          <p className="font-label text-[9px] text-neutral-600 mt-2 uppercase tracking-widest">
            Current QR — replace file to update
          </p>
        </div>
      </div>

      <div className="bg-surface-container-low border border-outline-variant/5 p-6 space-y-4">
        <h3 className="font-headline italic text-xl text-on-surface">Access Code</h3>
        <p className="font-body text-sm text-on-surface-variant leading-relaxed">
          Current code: <strong className="text-primary">1567</strong><br />
          To change it, edit the <code className="bg-surface-container px-2 py-0.5 font-mono text-primary text-xs">SECRET_CODE</code> constant in{' '}
          <code className="bg-surface-container px-2 py-0.5 font-mono text-primary text-xs">
            src/components/art/SecretArtistEntrance.tsx
          </code>.
        </p>
      </div>

      <div className="bg-surface-container-low border border-outline-variant/5 p-6 space-y-4">
        <h3 className="font-headline italic text-xl text-on-surface">Adding Artwork Images</h3>
        <div className="font-body text-sm text-on-surface-variant leading-relaxed space-y-3">
          <p><strong className="text-on-surface">Option A (Supabase Storage):</strong></p>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Go to Supabase → Storage → Create bucket <code className="bg-surface-container px-1 text-primary text-xs">art</code> (public)</li>
            <li>Upload your image file</li>
            <li>Copy the public URL</li>
            <li>Paste into the Image URL field when adding an artwork</li>
          </ol>
          <p className="mt-3"><strong className="text-on-surface">Option B (public folder):</strong></p>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Save image to <code className="bg-surface-container px-1 text-primary text-xs">public/images/art/drawing-1.jpg</code></li>
            <li>Use URL <code className="bg-surface-container px-1 text-primary text-xs">/images/art/drawing-1.jpg</code></li>
          </ol>
        </div>
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
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [artRes, ordRes] = await Promise.all([
        fetch('/api/artworks').then(r => r.json()),
        fetch('/api/orders').then(r => r.json()),
      ]);
      if (Array.isArray(artRes)) setArtworks(artRes);
      if (Array.isArray(ordRes)) setOrders(ordRes);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleExit = () => {
    sessionStorage.removeItem('chakravyuha_artist_auth');
    router.push('/art');
  };

  const sectionTitle = NAV_ITEMS.find(n => n.id === activeNav)?.label ?? '';

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body flex overflow-x-hidden">

      {/* ─── SIDEBAR ─── */}
      <aside className="h-screen w-72 fixed left-0 top-0 bg-surface-container-lowest shadow-[0_0_64px_rgba(233,195,73,0.05)] z-50 flex flex-col py-8 border-r border-outline-variant/10">
        {/* Logo */}
        <div className="px-8 mb-12">
          <h1 className="font-headline text-2xl font-bold tracking-tighter text-primary">CHAKRAVYUHA</h1>
          <p className="font-label text-[10px] uppercase tracking-[0.2em] text-neutral-600 mt-1">
            The Sovereign Archive
          </p>
        </div>

        {/* Nav */}
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
                  <span
                    className="material-symbols-outlined text-[20px]"
                    style={{ fontVariationSettings: activeNav === item.id ? "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" : "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24" }}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                  {/* Orders badge */}
                  {item.id === 'orders' && orders.filter(o => o.status === 'pending').length > 0 && (
                    <span className="ml-auto w-5 h-5 rounded-full bg-amber-500 text-surface font-bold font-label text-[9px] flex items-center justify-center">
                      {orders.filter(o => o.status === 'pending').length}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom */}
        <div className="px-8 pt-6 border-t border-outline-variant/10 space-y-6">
          <button
            onClick={handleExit}
            className="w-full flex items-center gap-3 text-neutral-700 hover:text-primary transition-colors font-label text-[10px] uppercase tracking-widest"
          >
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

        {/* Top bar */}
        <header className="fixed top-0 right-0 w-[calc(100%-18rem)] h-20 z-40 bg-surface/60 backdrop-blur-xl flex justify-between items-center px-12 border-b border-outline-variant/10">
          <div>
            <span className="font-label text-[10px] uppercase tracking-[0.3em] text-primary block">{sectionTitle}</span>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={fetchData}
              className="flex items-center gap-2 text-neutral-600 hover:text-primary transition-colors font-label text-[10px] uppercase tracking-widest"
              aria-label="Refresh data"
            >
              <MaterialIcon name="refresh" size="sm" />
              Refresh
            </button>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="font-label text-[10px] uppercase tracking-[0.2em] text-primary/70">Live</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="pt-28 pb-16 px-12 flex-1">
          <div className="flex justify-between items-end mb-10">
            <h2 className="font-headline text-4xl font-light text-on-surface tracking-tight italic">
              {sectionTitle}
            </h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-32 gap-3">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="font-label text-[10px] uppercase tracking-widest text-neutral-600">Loading…</span>
            </div>
          ) : (
            <>
              {activeNav === 'dashboard' && <DashboardOverview artworks={artworks} orders={orders} />}
              {activeNav === 'add'       && <AddArtwork onAdded={fetchData} />}
              {activeNav === 'manage'    && <ManageArtworks artworks={artworks} onRefresh={fetchData} />}
              {activeNav === 'orders'    && <OrdersPanel orders={orders} onRefresh={fetchData} />}
              {activeNav === 'settings'  && <Settings />}
            </>
          )}
        </main>

        {/* Footer */}
        <footer className="bg-surface-container-lowest py-6 px-12 border-t border-outline-variant/5">
          <div className="flex justify-between items-center">
            <span className="font-headline text-lg font-bold text-neutral-700">CHAKRAVYUHA</span>
            <p className="font-label text-[9px] uppercase tracking-widest text-neutral-800">
              Private Artist Panel · Restricted Access
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
