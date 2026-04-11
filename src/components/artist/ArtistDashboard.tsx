'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { MaterialIcon } from '@/components/ui/MaterialIcon';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { artworks } from '@/data/artworks';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', active: true },
  { id: 'create', label: 'Create Artwork', icon: 'add_circle', active: false },
  { id: 'auctions', label: 'Auctions', icon: 'gavel', active: false },
  { id: 'fixed', label: 'Fixed Price Listings', icon: 'sell', active: false },
  { id: 'archive', label: 'Archive', icon: 'inventory_2', active: false },
  { id: 'settings', label: 'Settings', icon: 'settings', active: false },
];

const stats = [
  { label: 'Total Artworks', value: String(artworks.length), icon: 'palette', sub: '+2 this month', subColor: 'text-primary' },
  { label: 'Live Auctions', value: String(artworks.filter(a => a.status === 'auction').length), icon: 'bolt', sub: 'System Active', pulse: true },
  { label: 'Sold Pieces', value: String(artworks.filter(a => a.status === 'sold').length), icon: 'check_circle', sub: 'Archive Total', subColor: 'text-neutral-600' },
  { label: 'Upcoming Drops', value: String(artworks.filter(a => a.status === 'upcoming').length), icon: 'schedule', sub: 'In Studio', subColor: 'text-neutral-600' },
];

const recentActivity = [
  { icon: 'gavel', iconColor: 'text-secondary', bg: 'bg-secondary/10', text: <><span className="font-bold">User_882</span> placed a bid on <span className="italic font-headline text-primary">The Gilded Cage</span></>, amount: '₹3,45,000', time: '2m ago' },
  { icon: 'shopping_cart', iconColor: 'text-primary', bg: 'bg-primary/10', text: <>New enquiry for <span className="italic font-headline text-primary">Ritual Mask IV</span></>, amount: 'Pending', time: '18m ago' },
  { icon: 'gavel', iconColor: 'text-secondary', bg: 'bg-secondary/10', text: <><span className="font-bold">Karthik_A</span> outbid on <span className="italic font-headline text-primary">The Gilded Cage</span></>, amount: '₹3,20,000', time: '41m ago' },
  { icon: 'notifications', iconColor: 'text-primary', bg: 'bg-primary/10', text: <>2 new whitelist sign-ups for <span className="italic font-headline text-primary">Celestial Bloom</span></>, amount: '—', time: '1h ago' },
  { icon: 'info', iconColor: 'text-tertiary', bg: 'bg-tertiary-container/10', text: <>Auction for <span className="italic font-headline text-primary">Sovereign Dark</span> scheduled</>, amount: 'Coming', time: '3h ago' },
];

export function ArtistDashboard() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState('dashboard');
  const liveAuction = artworks.find(a => a.status === 'auction');

  function handleExit() {
    router.push('/art');
  }

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
            {navItems.map((item) => (
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
                >
                  <span
                    className="material-symbols-outlined text-[20px]"
                    style={{ fontVariationSettings: activeNav === item.id ? "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" : "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24" }}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Return to public site */}
        <div className="px-8 pt-6 border-t border-outline-variant/10 space-y-6">
          <button
            onClick={handleExit}
            className="w-full flex items-center gap-3 text-neutral-700 hover:text-primary transition-colors font-label text-[10px] uppercase tracking-widest"
          >
            <MaterialIcon name="arrow_back" size="sm" />
            Return to Art Page
          </button>
          {/* Artist info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-surface-container-high border border-outline-variant/20 flex items-center justify-center shrink-0">
              <MaterialIcon name="person" size="sm" className="text-primary/60" />
            </div>
            <div>
              <p className="font-label text-[10px] uppercase tracking-widest text-neutral-500">
                Authorized Artist
              </p>
              <p className="font-headline italic text-sm text-primary">
                Aditya&apos;s Sister
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* ─── MAIN ─── */}
      <div className="ml-72 flex-1 flex flex-col min-h-screen">

        {/* Top bar */}
        <header className="fixed top-0 right-0 w-[calc(100%-18rem)] h-20 z-40 bg-surface/60 backdrop-blur-xl flex justify-between items-center px-12 border-b border-outline-variant/10">
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-neutral-600 text-[18px]">search</span>
            <input
              className="bg-transparent border-none focus:ring-0 text-sm font-label text-on-surface-variant w-64 placeholder:text-neutral-700 focus:outline-none"
              placeholder="Search archive..."
              type="text"
              aria-label="Search archive"
            />
          </div>
          <div className="flex items-center gap-8">
            <div className="flex gap-5 text-neutral-500">
              <button className="hover:text-primary transition-colors relative" aria-label="Notifications">
                <MaterialIcon name="notifications" size="md" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-secondary rounded-full border-2 border-surface" />
              </button>
              <button className="hover:text-primary transition-colors" aria-label="Wallet">
                <MaterialIcon name="account_balance_wallet" size="md" />
              </button>
            </div>
            <div className="h-5 w-px bg-outline-variant/20" />
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span className="font-label text-[10px] uppercase tracking-[0.2em] text-secondary">
                Live System
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="pt-32 pb-16 px-12 flex-1">
          {/* Title */}
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="font-label text-xs font-bold text-primary uppercase tracking-[0.3em] block mb-2">
                Command Center
              </span>
              <h2 className="font-headline text-5xl font-light text-on-surface tracking-tight italic">
                Artist Control Panel
              </h2>
            </div>
            <div className="bg-surface-container-low px-4 py-2 flex items-center gap-3 border border-outline-variant/10">
              <MaterialIcon name="security" size="sm" className="text-secondary" />
              <span className="font-label text-[10px] uppercase tracking-widest text-neutral-500">
                Security Level: <span className="text-on-surface">Sovereign</span>
              </span>
            </div>
          </div>

          {/* Stats bento */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-5 mb-12">
            {stats.map((s) => (
              <div
                key={s.label}
                className="bg-surface-container-low p-6 hover:bg-surface-container-high transition-colors group border border-outline-variant/5"
              >
                <div className="flex justify-between items-start mb-8">
                  <span className="font-label text-[10px] uppercase tracking-widest text-neutral-500">
                    {s.label}
                  </span>
                  <MaterialIcon
                    name={s.icon}
                    size="md"
                    className="text-primary/20 group-hover:text-primary/50 transition-colors"
                  />
                </div>
                <p className="font-headline italic text-4xl text-on-surface">{s.value}</p>
                <div className="mt-4 flex items-center gap-2">
                  {s.pulse && <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />}
                  <span className={cn('font-label text-[9px] uppercase tracking-widest', s.subColor ?? 'text-neutral-600')}>
                    {s.sub}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Main workspace: Live Auction + Activity */}
          <div className="grid grid-cols-12 gap-8 mb-8">
            {/* Active auction card */}
            <div className="col-span-12 xl:col-span-8">
              {liveAuction ? (
                <div className="bg-surface-container-low overflow-hidden flex flex-col md:flex-row min-h-[400px] border border-outline-variant/5">
                  {/* Artwork image side */}
                  <div className="md:w-2/5 relative group overflow-hidden min-h-[240px]">
                    <ImagePlaceholder
                      label={liveAuction.title}
                      icon="palette"
                      accentColor="#e9c349"
                      className="w-full h-full rounded-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-60 pointer-events-none" />
                    <div className="absolute top-5 left-5 flex items-center gap-2 bg-red-950/80 px-3 py-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                      <span className="font-label text-[9px] uppercase tracking-widest text-red-400 font-bold">Live</span>
                    </div>
                    <div className="absolute bottom-5 left-5">
                      <span className="font-label text-[9px] uppercase tracking-widest text-primary/60 block mb-1">
                        Auction {liveAuction.auctionId}
                      </span>
                      <h3 className="font-headline italic text-2xl text-on-surface">{liveAuction.title}</h3>
                    </div>
                  </div>

                  {/* Bid info side */}
                  <div className="md:w-3/5 p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-8">
                        <div>
                          <span className="font-label text-[9px] uppercase tracking-widest text-neutral-500 block mb-1">Current Bid</span>
                          <p className="font-headline italic text-4xl text-primary">{liveAuction.highestBid}</p>
                        </div>
                        <div className="text-right">
                          <span className="font-label text-[9px] uppercase tracking-widest text-neutral-500 block mb-1">Time Remaining</span>
                          <p className="font-headline text-xl text-on-surface tabular-nums">{liveAuction.timeRemaining}</p>
                        </div>
                      </div>

                      <div className="flex gap-6 mb-8">
                        <div className="flex items-center gap-2">
                          <MaterialIcon name="group" size="sm" className="text-primary" />
                          <span className="font-label text-[10px] uppercase tracking-widest text-neutral-500">
                            {liveAuction.bidders} Bidders
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MaterialIcon name="visibility" size="sm" className="text-primary" />
                          <span className="font-label text-[10px] uppercase tracking-widest text-neutral-500">
                            {liveAuction.watchers} Watching
                          </span>
                        </div>
                      </div>

                      {/* Bid history */}
                      <div className="space-y-2">
                        {liveAuction.bidHistory?.slice(0, 3).map((bid, i) => (
                          <div key={i} className="flex justify-between items-center py-2 border-b border-outline-variant/5 last:border-0">
                            <span className={cn('font-label text-[10px] uppercase tracking-wide', i === 0 ? 'text-on-surface font-bold' : 'text-neutral-600')}>
                              {bid.user}
                            </span>
                            <div className="flex items-center gap-4">
                              <span className={cn('font-label text-xs', i === 0 ? 'text-primary' : 'text-neutral-700')}>{bid.amount}</span>
                              <span className="font-label text-[9px] text-neutral-800 uppercase tracking-widest">{bid.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Admin actions */}
                    <div className="flex gap-4 pt-4">
                      <button className="flex-1 gold-gradient-bg text-on-primary py-3 font-label text-[10px] font-bold uppercase tracking-widest hover:-translate-y-0.5 transition-all hover:shadow-[0_0_20px_rgba(233,195,73,0.2)]">
                        Manage Auction
                      </button>
                      <button className="flex-1 border border-primary/20 text-primary py-3 font-label text-[10px] font-bold uppercase tracking-widest hover:border-primary/40 transition-all">
                        Edit Details
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-surface-container-low border border-outline-variant/5 flex items-center justify-center h-[400px]">
                  <div className="text-center space-y-4">
                    <MaterialIcon name="gavel" size="4xl" className="text-neutral-700 mx-auto" />
                    <p className="font-label text-[10px] uppercase tracking-widest text-neutral-600">No active auctions</p>
                    <button className="font-label text-[10px] uppercase tracking-widest text-primary border border-primary/20 px-6 py-3 hover:bg-primary/5 transition-colors">
                      Launch Auction
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Activity feed */}
            <div className="col-span-12 xl:col-span-4 bg-surface-container-low border border-outline-variant/5 p-8 flex flex-col">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-headline italic text-xl text-on-surface">Recent Activity</h3>
                <MaterialIcon name="history" size="sm" className="text-primary/40" />
              </div>
              <div className="space-y-5 overflow-y-auto flex-1">
                {recentActivity.map((item, i) => (
                  <div key={i} className="flex gap-4 border-b border-outline-variant/5 pb-4 last:border-0 last:pb-0">
                    <div className={cn('w-8 h-8 flex items-center justify-center shrink-0', item.bg)}>
                      <MaterialIcon name={item.icon} size="sm" className={item.iconColor} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-xs text-on-surface leading-relaxed">{item.text}</p>
                      <div className="flex justify-between items-center mt-1.5">
                        <span className="font-label text-[9px] uppercase tracking-widest text-primary/50">{item.amount}</span>
                        <span className="font-label text-[9px] uppercase tracking-widest text-neutral-700">{item.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-6 w-full py-2 font-label text-[9px] uppercase tracking-widest text-neutral-700 hover:text-primary transition-colors flex items-center justify-center gap-2">
                View All Logs
                <MaterialIcon name="arrow_forward" size="sm" />
              </button>
            </div>
          </div>

          {/* Artworks quick grid */}
          <div className="bg-surface-container-low border border-outline-variant/5 p-8">
            <div className="flex justify-between items-end mb-8">
              <h3 className="font-headline italic text-2xl text-on-surface">Archive Quick View</h3>
              <Link
                href="/art"
                className="font-label text-[10px] uppercase tracking-widest text-primary/50 hover:text-primary transition-colors border-b border-primary/10 pb-0.5"
              >
                View Public Page
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {artworks.slice(0, 4).map((artwork) => (
                <div key={artwork.id} className="group relative">
                  <div className="aspect-square bg-surface-container overflow-hidden mb-3 border border-outline-variant/5 group-hover:border-primary/30 transition-colors">
                    <ImagePlaceholder
                      label={artwork.title}
                      icon="palette"
                      accentColor={artwork.status === 'auction' ? '#e9c349' : '#353535'}
                      className="w-full h-full rounded-none"
                    />
                  </div>
                  <p className="font-label text-[9px] uppercase tracking-widest text-neutral-600 mb-0.5 truncate">
                    {artwork.medium}
                  </p>
                  <p className="font-headline italic text-base text-on-surface truncate">{artwork.title}</p>
                  <span className={cn(
                    'inline-block mt-1.5 font-label text-[8px] uppercase tracking-widest px-2 py-0.5',
                    artwork.status === 'auction' && 'text-red-400 bg-red-950/50',
                    artwork.status === 'available' && 'text-primary bg-primary/10',
                    artwork.status === 'sold' && 'text-neutral-600 bg-surface-container',
                    artwork.status === 'upcoming' && 'text-neutral-500 bg-surface-container-high',
                  )}>
                    {artwork.status === 'auction' ? 'Live Auction'
                      : artwork.status === 'available' ? 'Fixed Price'
                      : artwork.status === 'upcoming' ? 'Coming Soon'
                      : 'Sold'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="ml-0 bg-surface-container-lowest py-6 px-12 border-t border-outline-variant/5">
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
