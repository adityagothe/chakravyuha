import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Udharo — Track Udhar. No Confusion.',
  description:
    'Udharo helps you track who owes what — instantly and effortlessly. The simplest money tracker for India. Built for friends, students, and small shops.',
  keywords: [
    'money tracker',
    'udhar app',
    'expense tracker India',
    'debt tracker',
    'udharo',
    'split expenses India',
    'who owes me',
    'udhar tracker',
    'informal debt app',
  ],
  openGraph: {
    title: 'Udharo — Track Every Rupee. No Confusion.',
    description:
      'The simplest money tracker for Indian udhar culture. One tap to record, one screen to see everything.',
    type: 'website',
    locale: 'en_IN',
    url: 'https://vajravyuha.in/udharo',
    images: [
      {
        url: '/images/Udharo-cover.png',
        width: 1200,
        height: 630,
        alt: 'Udharo — Track Udhar. No Confusion.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Udharo — Track Udhar. No Confusion.',
    description:
      'The simplest money tracker for Indian udhar culture. One tap to record, one screen to see everything.',
  },
  alternates: { canonical: 'https://vajravyuha.in/udharo' },
  robots: { index: true, follow: true },
};

/* ──────────────────────────────────────────────────────────
   Inline SVG phone mockup — no images needed
────────────────────────────────────────────────────────── */
function PhoneMockup({
  title,
  color,
  children,
}: {
  title: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex-shrink-0" style={{ width: 'clamp(200px, 28vw, 260px)' }}>
      {/* Glow */}
      <div
        className="absolute inset-0 rounded-[2rem] blur-2xl opacity-20 scale-110"
        style={{ background: color }}
      />
      {/* Phone shell */}
      <div
        className="relative rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl"
        style={{ background: '#111', aspectRatio: '9/19' }}
      >
        {/* Status bar */}
        <div className="flex items-center justify-between px-5 pt-3 pb-1">
          <span className="text-[9px] text-white/40 font-mono">9:41</span>
          <div className="w-12 h-3 bg-black rounded-full" />
          <span className="text-[9px] text-white/40">●●●</span>
        </div>
        {/* Screen label */}
        <div className="px-4 py-2 border-b border-white/5">
          <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color }}>{title}</p>
        </div>
        {/* Content */}
        <div className="px-4 py-3 space-y-2 text-[11px]">
          {children}
        </div>
      </div>
    </div>
  );
}

function TransactionRow({ name, amount, type }: { name: string; amount: string; type: 'owed' | 'owing' }) {
  const isOwed = type === 'owed';
  const avatarBg = isOwed ? 'rgba(34,197,94,0.2)' : 'rgba(248,113,113,0.2)';
  const avatarColor = '#22c55e';
  return (
    <div className="flex items-center justify-between rounded-lg px-3 py-2" style={{ background: 'rgba(255,255,255,0.04)' }}>
      <div className="flex items-center gap-2">
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold"
          style={{ background: avatarBg, color: avatarColor }}
        >
          {name[0]}
        </div>
        <span className="text-white/70">{name}</span>
      </div>
      <span className="font-bold" style={{ color: isOwed ? '#22c55e' : '#f87171' }}>
        {isOwed ? '+' : '-'}₹{amount}
      </span>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   Pain point card
────────────────────────────────────────────────────────── */
function PainCard({ icon, title, body }: { icon: string; title: string; body: string }) {
  return (
    <div className="glass-card rounded-xl p-6 border border-white/5 hover:border-white/10 transition-all hover:-translate-y-1 duration-300">
      <span className="material-symbols-outlined text-3xl text-red-400/70 mb-3 block">{icon}</span>
      <h3 className="font-semibold text-white/90 mb-2">{title}</h3>
      <p className="text-sm text-white/40 leading-relaxed">{body}</p>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   Feature card
────────────────────────────────────────────────────────── */
function FeatureCard({
  icon,
  title,
  body,
  accent = '#22c55e',
  large = false,
}: {
  icon: string;
  title: string;
  body: string;
  accent?: string;
  large?: boolean;
}) {
  return (
    <div
      className={`glass-card rounded-xl p-8 border border-white/5 hover:border-white/10 transition-all hover:-translate-y-1 duration-300 ${large ? 'md:col-span-2' : ''}`}
    >
      <span
        className="material-symbols-outlined text-4xl mb-5 block"
        style={{ color: accent, fontVariationSettings: "'FILL' 1" }}
      >
        {icon}
      </span>
      <h3 className={`font-bold text-white mb-3 ${large ? 'text-2xl' : 'text-xl'}`}>{title}</h3>
      <p className="text-sm text-white/50 leading-relaxed">{body}</p>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   Use case card
────────────────────────────────────────────────────────── */
function UseCaseCard({ emoji, title, body }: { emoji: string; title: string; body: string }) {
  return (
    <div className="flex gap-4 p-6 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300">
      <span className="text-2xl flex-shrink-0 mt-0.5">{emoji}</span>
      <div>
        <h3 className="font-semibold text-white/90 mb-1">{title}</h3>
        <p className="text-sm text-white/40 leading-relaxed">{body}</p>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   Trust item
────────────────────────────────────────────────────────── */
function TrustItem({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="material-symbols-outlined text-xl"
        style={{ color: '#22c55e', fontVariationSettings: "'FILL' 1" }}
      >
        {icon}
      </span>
      <span className="text-sm text-white/60">{label}</span>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   Page
────────────────────────────────────────────────────────── */
export default function UdharoPage() {
  const GREEN = '#22c55e';
  const DOWNLOAD_URL =
    'https://github.com/adityagothe/chakravyuha/releases/download/Udharo-v1.1.0/application-2b43f2ce-4aab-4061-b6c5-96a58ac73b07.apk';

  return (
    <main id="main-content" className="animate-page-in bg-[#0a0a0a] text-white overflow-x-hidden">

      {/* ── Back nav ──────────────────────────────────────────── */}
      <div className="fixed top-0 inset-x-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            href="/#projects"
            className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm font-label"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            <span className="hidden sm:inline uppercase tracking-widest text-[10px]">All Projects</span>
          </Link>
          <span className="font-bold tracking-widest text-sm" style={{ color: GREEN }}>UDHARO</span>
          <a
            href={DOWNLOAD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-label font-bold uppercase tracking-widest px-4 py-2 rounded-full border transition-all hover:scale-105 active:scale-95"
            style={{ borderColor: GREEN, color: GREEN }}
          >
            Download
          </a>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          1. HERO SECTION
      ════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-28 pb-24 px-6">
        {/* Background radial glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] opacity-10 pointer-events-none"
          style={{ background: GREEN }}
        />

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          {/* Eyebrow */}
          <p
            className="font-label text-[11px] uppercase tracking-[0.4em] mb-6"
            style={{ color: GREEN }}
          >
            Money Tracker · India-First
          </p>

          {/* Headline */}
          <h1 className="font-headline text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] text-white mb-6">
            Track every rupee.
            <br />
            <span style={{ color: GREEN }}>No confusion.</span>
            <br />
            No awkwardness.
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-white/50 max-w-xl mx-auto leading-relaxed mb-12">
            Udharo helps you track who owes what — instantly and effortlessly.
            Built for how India actually handles money.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              id="hero-download-cta"
              href={DOWNLOAD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-label font-extrabold text-sm uppercase tracking-widest transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(34,197,94,0.3)] active:scale-95"
              style={{ background: GREEN, color: '#0a0a0a' }}
            >
              <span className="material-symbols-outlined text-base">download</span>
              Start Tracking
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-label font-bold text-sm uppercase tracking-widest border border-white/10 text-white/60 hover:border-white/30 hover:text-white transition-all"
            >
              See How It Works
              <span className="material-symbols-outlined text-base">arrow_downward</span>
            </a>
          </div>

          {/* Stat strip */}
          <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12 border-t border-white/5 pt-10">
            {[
              { label: 'Free forever', icon: 'favorite' },
              { label: 'No login required', icon: 'lock_open' },
              { label: 'Works offline', icon: 'wifi_off' },
            ].map(({ label, icon }) => (
              <div key={label} className="flex items-center gap-2 text-white/30">
                <span className="material-symbols-outlined text-base" style={{ color: GREEN, fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                <span className="text-sm">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          2. VISUAL SECTION — CSS Phone Mockups
      ════════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <p className="font-label text-[11px] uppercase tracking-[0.4em] mb-4" style={{ color: GREEN }}>
              Simple by design
            </p>
            <h2 className="font-headline text-4xl md:text-5xl font-bold text-white">
              Three screens. That&apos;s all you need.
            </h2>
          </div>

          {/* Phone trio */}
          <div className="flex flex-col md:flex-row items-stretch justify-center gap-8 md:gap-6">

            {/* Phone 1: Add transaction */}
            <div className="flex flex-col items-center gap-4 flex-1">
              <PhoneMockup title="Add Udhar" color={GREEN}>
                <div className="space-y-3 pt-1">
                  <div>
                    <p className="text-[9px] text-white/30 uppercase tracking-wider mb-1">Who owes you?</p>
                    <div className="rounded-md px-3 py-2 text-white/80" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
                      Rahul
                    </div>
                  </div>
                  <div>
                    <p className="text-[9px] text-white/30 uppercase tracking-wider mb-1">Amount (₹)</p>
                    <div className="rounded-md px-3 py-2 text-white font-bold" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
                      250
                    </div>
                  </div>
                  <div>
                    <p className="text-[9px] text-white/30 uppercase tracking-wider mb-1">Note</p>
                    <div className="rounded-md px-3 py-2 text-white/50" style={{ background: 'rgba(255,255,255,0.04)' }}>
                      chai &amp; snacks
                    </div>
                  </div>
                  <button
                    className="w-full rounded-md py-2 text-[10px] font-bold uppercase tracking-wider mt-1"
                    style={{ background: GREEN, color: '#0a0a0a' }}
                  >
                    Record Udhar
                  </button>
                </div>
              </PhoneMockup>
              <div className="text-center">
                <p className="font-semibold text-white text-sm">One-tap entry</p>
                <p className="text-xs text-white/40 mt-1">Name, amount, done.</p>
              </div>
            </div>

            {/* Arrow */}
            <div className="hidden md:flex items-center text-white/10">
              <span className="material-symbols-outlined text-3xl">arrow_forward</span>
            </div>
            <div className="flex md:hidden justify-center text-white/10">
              <span className="material-symbols-outlined text-3xl">arrow_downward</span>
            </div>

            {/* Phone 2: Balance view */}
            <div className="flex flex-col items-center gap-4 flex-1">
              <PhoneMockup title="Balances" color="#60a5fa">
                <div className="space-y-2 pt-1">
                  <TransactionRow name="Rahul" amount="250" type="owed" />
                  <TransactionRow name="Priya" amount="480" type="owed" />
                  <TransactionRow name="Arjun" amount="120" type="owing" />
                  <TransactionRow name="Sachin" amount="60" type="owed" />
                  <div className="pt-2 border-t border-white/5 flex justify-between text-[10px]">
                    <span className="text-white/30">Net balance</span>
                    <span className="font-bold" style={{ color: GREEN }}>+₹670</span>
                  </div>
                </div>
              </PhoneMockup>
              <div className="text-center">
                <p className="font-semibold text-white text-sm">Clear ledger</p>
                <p className="text-xs text-white/40 mt-1">Never forget who owes what.</p>
              </div>
            </div>

            {/* Arrow */}
            <div className="hidden md:flex items-center text-white/10">
              <span className="material-symbols-outlined text-3xl">arrow_forward</span>
            </div>
            <div className="flex md:hidden justify-center text-white/10">
              <span className="material-symbols-outlined text-3xl">arrow_downward</span>
            </div>

            {/* Phone 3: Settle up */}
            <div className="flex flex-col items-center gap-4 flex-1">
              <PhoneMockup title="Settle Up" color="#a78bfa">
                <div className="space-y-2 pt-1">
                  <div className="rounded-lg p-3 text-center" style={{ background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.2)' }}>
                    <p className="text-[9px] text-white/40 mb-1">Rahul owes you</p>
                    <p className="text-lg font-bold" style={{ color: '#a78bfa' }}>₹250</p>
                  </div>
                  <div className="space-y-1">
                    {[['chai', '50'], ['auto', '100'], ['lunch', '100']].map(([note, amt]) => (
                      <div key={note} className="flex justify-between text-[10px] py-1 border-b border-white/5">
                        <span className="text-white/40">{note}</span>
                        <span className="text-white/60">₹{amt}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    className="w-full rounded-md py-2 text-[10px] font-bold uppercase tracking-wider mt-1"
                    style={{ background: 'rgba(167,139,250,0.15)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.3)' }}
                  >
                    ✓ Mark Settled
                  </button>
                </div>
              </PhoneMockup>
              <div className="text-center">
                <p className="font-semibold text-white text-sm">Settle with one tap</p>
                <p className="text-xs text-white/40 mt-1">No awkward follow-ups.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          3. PROBLEM SECTION
      ════════════════════════════════════════════════════════ */}
      <section className="py-32 px-6 bg-[#0d0d0d]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="font-label text-[11px] uppercase tracking-[0.4em] text-red-400/70 mb-4">
              The real problem
            </p>
            <h2 className="font-headline text-4xl md:text-5xl font-bold text-white">
              We&apos;ve all been here.
            </h2>
            <p className="text-white/40 mt-4 max-w-xl mx-auto">
              Udhar is a part of daily life in India. But tracking it shouldn&apos;t be painful.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <PainCard
              icon="psychology"
              title="You keep forgetting"
              body="₹50 here, ₹80 there — small amounts that vanish from memory but add up over time."
            />
            <PainCard
              icon="chat_bubble"
              title="Awkward reminders"
              body="Asking friends to pay back feels uncomfortable. You end up letting it slide."
            />
            <PainCard
              icon="note_alt"
              title="Messy notes & chats"
              body="WhatsApp threads and paper notes you can't search, can't trust, and always lose."
            />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          4. SOLUTION SECTION
      ════════════════════════════════════════════════════════ */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            {/* Left: Text */}
            <div>
              <p className="font-label text-[11px] uppercase tracking-[0.4em] mb-4" style={{ color: GREEN }}>
                The solution
              </p>
              <h2 className="font-headline text-4xl md:text-5xl font-bold text-white mb-6">
                Udharo is your
                <br />
                <span style={{ color: GREEN }}>silent ledger.</span>
              </h2>
              <p className="text-white/50 leading-relaxed mb-10">
                No spreadsheets. No group chats. No mental effort.
                Just open the app, record what happened, and move on.
                The math is done for you.
              </p>
              <div className="space-y-5">
                {[
                  { icon: 'bolt', text: 'Record a transaction in under 5 seconds' },
                  { icon: 'calculate', text: 'Balances update automatically' },
                  { icon: 'check_circle', text: 'Settle with one tap — history stays clean' },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-start gap-4">
                    <span
                      className="material-symbols-outlined text-xl mt-0.5 flex-shrink-0"
                      style={{ color: GREEN, fontVariationSettings: "'FILL' 1" }}
                    >
                      {icon}
                    </span>
                    <p className="text-white/70">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Large balance illustration */}
            <div className="relative flex justify-center">
              <div
                className="absolute inset-0 rounded-3xl blur-3xl opacity-10"
                style={{ background: GREEN }}
              />
              <div
                className="relative rounded-2xl p-8 border border-white/8 w-full max-w-xs"
                style={{ background: '#111' }}
              >
                <p className="text-[10px] uppercase tracking-widest text-white/30 mb-6">Net summary</p>
                <div className="space-y-4">
                  {[
                    { name: 'Rahul', amount: '₹250', type: 'owed' as const },
                    { name: 'Priya', amount: '₹480', type: 'owed' as const },
                    { name: 'Arjun', amount: '₹120', type: 'owing' as const },
                  ].map(({ name, amount, type }) => (
                    <div
                      key={name}
                      className="flex items-center justify-between p-3 rounded-lg"
                      style={{ background: 'rgba(255,255,255,0.03)' }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{ background: type === 'owed' ? 'rgba(34,197,94,0.15)' : 'rgba(248,113,113,0.15)', color: type === 'owed' ? GREEN : '#f87171' }}
                        >
                          {name[0]}
                        </div>
                        <div>
                          <p className="text-sm text-white/80 font-medium">{name}</p>
                          <p className="text-[10px] text-white/30">{type === 'owed' ? 'owes you' : 'you owe'}</p>
                        </div>
                      </div>
                      <span className="font-bold text-sm" style={{ color: type === 'owed' ? GREEN : '#f87171' }}>
                        {type === 'owed' ? '+' : '-'}{amount}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-white/5 flex justify-between">
                  <span className="text-xs text-white/30">You receive net</span>
                  <span className="font-bold" style={{ color: GREEN }}>+₹610</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          5. FEATURES SECTION
      ════════════════════════════════════════════════════════ */}
      <section className="py-32 px-6 bg-[#0d0d0d]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="font-label text-[11px] uppercase tracking-[0.4em] mb-4" style={{ color: GREEN }}>
              Features
            </p>
            <h2 className="font-headline text-4xl md:text-5xl font-bold text-white">
              Designed to disappear.
            </h2>
            <p className="text-white/40 mt-4">
              The best tool is the one you forget you&apos;re using.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <FeatureCard
              icon="bolt"
              title="Instant add"
              body="Open. Tap. Done. Recording an udhar takes fewer taps than unlocking your phone."
              accent={GREEN}
              large={true}
            />
            <FeatureCard
              icon="account_balance_wallet"
              title="Clean ledger"
              body="One screen. All your balances. Who owes. What you owe. Crystal clear."
              accent="#60a5fa"
            />
            <FeatureCard
              icon="handshake"
              title="Settle up"
              body="Mark debts as settled with a single tap. Keep history forever."
              accent="#a78bfa"
            />
            <FeatureCard
              icon="offline_bolt"
              title="Works offline"
              body="No internet needed. No login. Your data lives on your device, privately."
              accent="#f59e0b"
            />
            <FeatureCard
              icon="speed"
              title="Lightweight"
              body="Built for minimal storage. Launches in under a second. Always snappy."
              accent={GREEN}
              large={true}
            />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          6. USE CASES
      ════════════════════════════════════════════════════════ */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="font-label text-[11px] uppercase tracking-[0.4em] mb-4" style={{ color: GREEN }}>
              Who it&apos;s for
            </p>
            <h2 className="font-headline text-4xl md:text-5xl font-bold text-white">
              Real life. Real udhar.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <UseCaseCard
              emoji="👥"
              title="Friends splitting money"
              body="Dinner, auto, trip expenses — track who paid what and settle cleanly without awkwardness."
            />
            <UseCaseCard
              emoji="🎓"
              title="Students & hostels"
              body="Mess bills, stationery, notes, snacks — the small amounts that pile up between roommates."
            />
            <UseCaseCard
              emoji="🏪"
              title="Small shopkeepers"
              body="Know exactly which customer owes what. Never lose track of credit extended to regulars."
            />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          7. TRUST SECTION
      ════════════════════════════════════════════════════════ */}
      <section className="py-32 px-6 bg-[#0d0d0d]">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="font-label text-[11px] uppercase tracking-[0.4em] mb-4" style={{ color: GREEN }}>
                Built with intent
              </p>
              <h2 className="font-headline text-4xl font-bold text-white mb-6">
                Made for real-world usage.
              </h2>
              <p className="text-white/50 leading-relaxed mb-8">
                Udharo isn&apos;t a startup with a growth team. It&apos;s a founder-built tool,
                crafted for a real problem that millions of Indians face every day.
                No bloat. No dark patterns. No ads.
              </p>
              <div className="space-y-4">
                <TrustItem icon="verified_user" label="No account, no cloud — your data stays on your device" />
                <TrustItem icon="favorite" label="Built by a developer who uses it daily" />
                <TrustItem icon="architecture" label="Designed for simplicity, not for engagement metrics" />
                <TrustItem icon="shield" label="Open release via GitHub — transparent and auditable" />
              </div>
            </div>

            <div className="space-y-4">
              {/* Credibility stat cards */}
              {[
                { value: '< 5s', label: 'To record any transaction' },
                { value: '0', label: 'Ads, trackers, or upsells' },
                { value: '1', label: 'Screen to see all your balances' },
              ].map(({ value, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-6 p-6 rounded-xl border border-white/5"
                  style={{ background: 'rgba(34,197,94,0.04)' }}
                >
                  <span
                    className="font-headline text-5xl font-black tabular-nums"
                    style={{ color: GREEN }}
                  >
                    {value}
                  </span>
                  <p className="text-white/50 text-sm leading-snug">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          8. CTA SECTION
      ════════════════════════════════════════════════════════ */}
      <section className="py-40 px-6 relative">
        {/* Large glow */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div
            className="w-[800px] h-[400px] rounded-full blur-[150px] opacity-[0.06]"
            style={{ background: GREEN }}
          />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <p
            className="font-label text-[11px] uppercase tracking-[0.4em] mb-6"
            style={{ color: GREEN }}
          >
            Ready to start?
          </p>
          <h2 className="font-headline text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter text-white mb-6">
            Start using Udharo today.
          </h2>
          <p className="text-white/40 text-lg mb-12">
            Free. No login. Works on any Android phone.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              id="bottom-download-cta"
              href={DOWNLOAD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-full font-label font-extrabold text-sm uppercase tracking-widest transition-all hover:scale-105 hover:shadow-[0_0_60px_rgba(34,197,94,0.25)] active:scale-95"
              style={{ background: GREEN, color: '#0a0a0a' }}
            >
              <span className="material-symbols-outlined">download</span>
              Download APK
            </a>
            <Link
              href="/projects/udharo"
              className="inline-flex items-center gap-2 px-8 py-5 rounded-full font-label font-bold text-sm uppercase tracking-widest border border-white/10 text-white/50 hover:border-white/20 hover:text-white transition-all"
            >
              View Project Details
            </Link>
          </div>

          <p className="mt-6 text-xs text-white/20 flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>android</span>
            Android 8.0+ · Direct APK via GitHub Releases
          </p>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="border-t border-white/5 py-10 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-bold tracking-widest text-sm" style={{ color: GREEN }}>UDHARO</span>
            <span className="text-white/20 text-xs">by</span>
            <Link href="/" className="text-xs text-white/30 hover:text-white/60 transition-colors uppercase tracking-wider">
              Vajravyuha
            </Link>
          </div>
          <p className="text-xs text-white/20">
            Built by <Link href="/founder" className="hover:text-white/50 transition-colors">Aditya Gothe</Link> · Free &amp; Open Source
          </p>
          <Link
            href="/#projects"
            className="text-xs text-white/20 hover:text-white/50 transition-colors uppercase tracking-widest"
          >
            ← All Projects
          </Link>
        </div>
      </footer>

      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'MobileApplication',
            name: 'Udharo',
            description:
              'A simple, fast money tracker for Indian udhar culture. Track who owes what among friends, students, and small shops.',
            url: 'https://vajravyuha.in/udharo',
            applicationCategory: 'FinanceApplication',
            operatingSystem: 'Android',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
            author: {
              '@type': 'Person',
              name: 'Aditya Gothe',
              url: 'https://vajravyuha.in/founder',
            },
            publisher: {
              '@type': 'Organization',
              name: 'Vajravyuha',
              url: 'https://vajravyuha.in',
            },
            keywords: 'money tracker, udhar app, expense tracker India, debt tracker',
          }),
        }}
      />
    </main>
  );
}
