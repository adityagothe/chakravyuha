import type { Metadata } from 'next';
import Link from 'next/link';
import { MaterialIcon } from '@/components/ui/MaterialIcon';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { musicArtist, songs } from '@/data/music';

export const metadata: Metadata = {
  title: 'Two Stars HQ — Music by Aditya Gothe',
  description: 'Explore the music of Two Stars HQ — cinematic tracks by Aditya Gothe, available on Spotify, Apple Music, and YouTube.',
  openGraph: {
    title: 'Two Stars HQ | Chakravyuha Music',
    description: 'A different layer of expression. Two songs released on all major platforms.',
    type: 'website',
  },
};

export default function MusicPage() {
  return (
    <main className="animate-page-in relative pt-24">

      {/* Back Navigation */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-label text-[10px] tracking-widest text-primary/60 hover:text-primary transition-colors uppercase group"
        >
          <MaterialIcon name="arrow_back" size="sm" className="group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
      </div>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative min-h-[70vh] flex flex-col items-center justify-center px-6 md:px-8 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary-container/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[var(--color-surface,#131313)] to-transparent" />
        </div>

        <div className="relative z-10 text-center max-w-4xl">
          <span className="font-label text-primary uppercase tracking-[0.3em] text-xs mb-6 block">
            Music. Story. Identity.
          </span>
          <h1 className="font-headline italic font-extrabold text-[clamp(3.5rem,14vw,9rem)] text-primary leading-none mb-4 tracking-tighter"
            style={{ textShadow: '0 0 40px rgba(233,195,73,0.25)' }}
          >
            {musicArtist.name}
          </h1>
          <p className="font-headline italic text-2xl md:text-3xl text-on-surface-variant mb-12 opacity-80">
            {musicArtist.tagline}
          </p>
          <a
            href="#songs"
            className="inline-block gold-gradient-bg text-on-primary px-10 py-4 font-label font-bold uppercase tracking-widest text-sm hover:-translate-y-0.5 transition-all duration-300 crimson-glow active:scale-95 rounded"
          >
            Listen to the Tracks
          </a>
        </div>
      </section>

      {/* ── Songs ────────────────────────────────────────────── */}
      <section id="songs" className="max-w-7xl mx-auto px-6 md:px-8 py-24 md:py-32">
        <div className="space-y-28 md:space-y-40">
          {songs.map((song, idx) => {
            const isEven = idx % 2 === 0;
            const streamingLinks = [
              { label: 'Spotify', icon: 'brand_awareness', href: song.links.spotify },
              { label: 'Apple Music', icon: 'music_note', href: song.links.appleMusic },
              { label: 'YouTube', icon: 'play_circle', href: song.links.youtube },
              { label: 'YT Music', icon: 'queue_music', href: song.links.youtubeMusic },
            ].filter((l) => l.href);

            return (
              <div
                key={song.id}
                className={`flex flex-col gap-12 items-center ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                {/* Cover */}
                <div className="w-full md:w-1/2 aspect-square relative group overflow-hidden shadow-2xl rounded-xl border border-outline-variant/10">
                  {song.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={song.coverImage}
                      alt={song.title}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    />
                  ) : (
                    <ImagePlaceholder
                      label={song.title}
                      icon="music_note"
                      accentColor="#e9c349"
                      className="w-full h-full rounded-none"
                    />
                  )}
                  <div className="absolute inset-0 bg-secondary-container/10 pointer-events-none" />
                </div>

                {/* Info */}
                <div className="w-full md:w-1/2 space-y-6">
                  <span className="font-label text-primary/60 uppercase tracking-[0.3em] text-[10px]">
                    Track {song.id}
                  </span>
                  <h2 className="font-headline italic text-5xl md:text-6xl text-primary leading-tight">
                    {song.title}
                  </h2>
                  <p className="text-xl text-on-surface font-headline italic opacity-90">
                    {song.tagline}
                  </p>
                  <div className="h-px w-24 bg-primary/30" />
                  <p className="text-on-surface-variant font-body leading-relaxed opacity-70">
                    {song.description}
                  </p>

                  {/* Streaming Buttons */}
                  <div className="pt-4 flex flex-wrap gap-3">
                    {streamingLinks.map((link) => (
                      <a
                        key={link.label}
                        href={link.href!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-surface-container hover:bg-primary/10 border border-outline-variant/30 hover:border-primary/40 px-5 py-3 rounded transition-all duration-300 group/btn"
                      >
                        <MaterialIcon name={link.icon} size="sm" className="text-primary group-hover/btn:scale-110 transition-transform" />
                        <span className="font-label text-[10px] tracking-widest uppercase text-on-surface-variant group-hover/btn:text-primary transition-colors">
                          {link.label}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Listen Everywhere ────────────────────────────────── */}
      <section className="py-24 flex flex-col items-center text-center px-8 border-y border-primary/5">
        <p className="font-label text-on-surface-variant/50 uppercase tracking-[0.4em] text-[10px] mb-10">
          Listen Everywhere
        </p>
        <div className="flex flex-wrap justify-center gap-10 md:gap-16">
          {[
            { label: 'Spotify', icon: 'brand_awareness', href: musicArtist.spotifyUrl },
            { label: 'YouTube', icon: 'play_circle', href: musicArtist.youtubeUrl },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3"
            >
              <MaterialIcon
                name={link.icon}
                size="xl"
                className="text-primary group-hover:scale-110 transition-transform"
              />
              <span className="font-label text-[10px] tracking-widest text-on-surface-variant group-hover:text-primary transition-colors uppercase">
                {link.label}
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* ── Coming Soon ──────────────────────────────────────── */}
      <section className="relative py-40 px-8 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-secondary-container/15 rounded-full blur-[100px]" />
        </div>
        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <h2 className="font-headline italic text-5xl md:text-7xl text-primary mb-6 leading-tight">
            More music<br />coming soon
          </h2>
          <div className="w-12 h-[2px] bg-secondary/60 mx-auto mb-6" />
          <p className="font-body text-on-surface-variant italic text-xl opacity-60">
            New tracks are in progress.
          </p>
          {/* Social follow CTA */}
          <div className="flex flex-wrap justify-center gap-4 mt-12">
            <a
              href={musicArtist.spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 border border-primary/20 hover:border-primary text-primary px-6 py-3 rounded font-label text-[10px] uppercase tracking-widest hover:bg-primary/5 transition-all duration-300"
            >
              <MaterialIcon name="brand_awareness" size="sm" />
              Follow on Spotify
            </a>
            <a
              href={musicArtist.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 border border-outline-variant/20 hover:border-primary/40 text-on-surface-variant px-6 py-3 rounded font-label text-[10px] uppercase tracking-widest hover:text-primary transition-all duration-300"
            >
              <MaterialIcon name="photo_camera" size="sm" />
              Follow on Instagram
            </a>
          </div>
        </div>
      </section>

      {/* ── Bottom Nav ───────────────────────────────────────── */}
      <div className="flex justify-center pb-16 px-6">
        <Link
          href="/"
          className="group inline-flex items-center gap-4 py-8 border-y border-primary/10 w-full max-w-xl justify-center hover:bg-surface-container-lowest transition-colors"
        >
          <MaterialIcon name="arrow_back" size="lg" className="text-primary group-hover:-translate-x-2 transition-transform" />
          <span className="font-label text-[10px] uppercase tracking-[0.5em] text-on-surface-variant group-hover:text-primary transition-colors">
            Return to Sovereign Archive
          </span>
        </Link>
      </div>
    </main>
  );
}
