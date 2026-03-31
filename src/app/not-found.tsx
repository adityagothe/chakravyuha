import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 — Layer Not Found',
  description: 'This realm does not exist in the Sovereign Archive.',
};

export default function NotFound() {
  return (
    <main className="min-h-screen bg-surface flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary rounded-full blur-[200px] opacity-[0.04]" />
      </div>

      <div className="relative z-10 max-w-xl mx-auto">
        {/* 404 number */}
        <div className="relative mb-6">
          <span className="font-headline text-[clamp(6rem,20vw,12rem)] font-extrabold tracking-tighter leading-none gold-gradient-text select-none">
            404
          </span>
          <div className="absolute inset-0 font-headline text-[clamp(6rem,20vw,12rem)] font-extrabold tracking-tighter leading-none text-primary/5 blur-xl select-none">
            404
          </div>
        </div>

        <span className="font-label text-primary uppercase tracking-[0.4em] text-xs mb-6 block">
          Layer Not Found
        </span>

        <h1 className="font-headline text-3xl md:text-4xl font-bold text-on-surface mb-4 italic">
          This realm does not exist.
        </h1>

        <p className="font-body text-neutral-400 leading-relaxed mb-10 text-base md:text-lg">
          The layer you&apos;ve entered is outside the Sovereign Archive. It may have been relocated,
          archived, or never constructed.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            id="not-found-home"
            className="gold-gradient-bg text-on-primary px-8 py-4 rounded-lg font-label font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-10px_rgba(233,195,73,0.3)] active:scale-95 transition-all"
          >
            <span
              className="material-symbols-outlined text-[18px]"
              style={{ fontVariationSettings: "'FILL' 0, 'wght' 500, 'GRAD' 0, 'opsz' 24" }}
            >
              home
            </span>
            Return Home
          </Link>
          <Link
            href="/#projects"
            id="not-found-projects"
            className="border border-primary/20 text-primary px-8 py-4 rounded-lg font-label font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2 hover:border-primary/50 hover:bg-primary/5 active:scale-95 transition-all"
          >
            <span
              className="material-symbols-outlined text-[18px]"
              style={{ fontVariationSettings: "'FILL' 0, 'wght' 500, 'GRAD' 0, 'opsz' 24" }}
            >
              deployed_code
            </span>
            View Projects
          </Link>
        </div>

        {/* Decorative line */}
        <div className="mt-16 flex items-center gap-4 text-neutral-700">
          <div className="flex-1 h-px bg-current" />
          <span className="font-label text-[9px] uppercase tracking-[0.4em]">CHAKRAVYUHA</span>
          <div className="flex-1 h-px bg-current" />
        </div>
      </div>
    </main>
  );
}
