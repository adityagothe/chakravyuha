import type { Metadata } from 'next';
import { getProjectBySlug, getProjectSlugs } from '@/data/projects';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import NextImage from 'next/image';
import { MaterialIcon } from '@/components/ui/MaterialIcon';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};

  return {
    title: project.metaTitle,
    description: project.metaDescription,
    openGraph: {
      title: project.metaTitle,
      description: project.metaDescription,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: project.metaTitle,
      description: project.metaDescription,
    },
  };
}

export async function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="animate-page-in pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
      {/* Breadcrumb / Back Link */}
      <div className="mb-12">
        <Link
          href="/#projects"
          className="group flex items-center gap-2 font-label text-[10px] uppercase tracking-[0.2em] text-primary/60 hover:text-primary transition-colors"
        >
          <MaterialIcon name="arrow_back" size="sm" className="group-hover:-translate-x-1 transition-transform" />
          Back to Projects
        </Link>
      </div>

      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-24">
        {/* Left: Info */}
        <div className="space-y-8">
          <header>
            <span className="font-label text-primary uppercase tracking-[0.3em] text-xs block mb-4">
              {project.categoryLabel}
            </span>
            <h1 className="font-headline text-7xl md:text-8xl font-black tracking-tighter text-on-surface leading-none italic mb-4">
              {project.name}
            </h1>
            <p className="font-headline text-2xl text-primary/80 italic">
              {project.tagline}
            </p>
          </header>

          <p className="text-on-surface-variant text-lg leading-relaxed max-w-xl">
            {project.description}
          </p>

          {/* Features Summary */}
          {project.features.length > 0 && (
            <div className="grid grid-cols-2 gap-4 py-8">
              {project.features.map((feature) => (
                <div key={feature.title} className="flex items-center gap-3">
                  <MaterialIcon
                    name={feature.icon}
                    size="lg"
                    className="text-primary"
                    // @ts-expect-error - style prop for material icon fill
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  />
                  <span className="font-label text-[11px] uppercase tracking-widest text-on-surface">
                    {feature.title}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* CTA Section */}
          <div className="flex flex-col gap-6 pt-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={`/projects/${project.slug}/download`}
                className="gold-gradient-bg text-on-primary px-10 py-5 rounded font-label font-extrabold text-sm tracking-wider btn-glow flex items-center justify-center gap-3"
              >
                <MaterialIcon name="download" size="sm" />
                Download APK
              </Link>
              {project.downloads.sourceCodeUrl && (
                <Link
                  href={project.downloads.sourceCodeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-primary/20 hover:border-primary text-primary px-10 py-5 rounded font-label font-bold text-sm tracking-wider btn-outline-glow flex items-center justify-center gap-3"
                >
                  <MaterialIcon name="code" size="sm" />
                  View Source Code
                </Link>
              )}
            </div>
            <p className="font-label text-[10px] text-on-surface-variant/50 tracking-wider italic flex items-center gap-2">
              <MaterialIcon name="info" size="sm" />
              Download available on next page
            </p>
          </div>
        </div>

        {/* Right: Trust & Info Panel */}
        <div className="relative group">
          <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full" />
          <div className="relative glass-panel rounded p-8 border border-primary/10 hover:border-primary/30 transition-all shadow-[0_0_80px_rgba(233,195,73,0.03)]">
            <h3 className="font-label text-primary tracking-widest uppercase text-xs mb-8">
              Verification & Metadata
            </h3>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                    verified_user
                  </span>
                </div>
                <div>
                  <p className="text-sm font-bold text-on-surface tracking-tight">Safe APK</p>
                  <p className="text-xs text-on-surface-variant/60">No malware, no trackers detected</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded bg-secondary-container/20 flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                    shield_person
                  </span>
                </div>
                <div>
                  <p className="text-sm font-bold text-on-surface tracking-tight">Built by Chakravyuha</p>
                  <p className="text-xs text-on-surface-variant/60">Verified Developer Signature</p>
                </div>
              </div>

              <div className="pt-6 grid grid-cols-2 gap-8 border-t border-outline-variant/20">
                <div>
                  <p className="font-label text-[10px] text-on-surface-variant/40 uppercase tracking-widest mb-1">Version</p>
                  <p className="text-primary font-bold">v{project.downloads.version}</p>
                </div>
                <div>
                  <p className="font-label text-[10px] text-on-surface-variant/40 uppercase tracking-widest mb-1">Platform</p>
                  <p className="text-on-surface font-bold">{project.platforms.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(', ')}</p>
                </div>
                <div>
                  <p className="font-label text-[10px] text-on-surface-variant/40 uppercase tracking-widest mb-1">Last Updated</p>
                  <p className="text-on-surface font-bold">
                    {new Date(project.updatedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </p>
                </div>
                {project.downloads.fileSize && (
                  <div>
                    <p className="font-label text-[10px] text-on-surface-variant/40 uppercase tracking-widest mb-1">Package Size</p>
                    <p className="text-on-surface font-bold">{project.downloads.fileSize}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Screenshot Gallery — horizontal scroll carousel */}
      {project.screenshots && project.screenshots.length > 0 && (
        <section className="mb-24">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="font-label text-primary uppercase tracking-[0.3em] text-[10px] mb-2">Visuals</p>
              <h2 className="font-headline text-3xl italic font-bold">Interface Archives</h2>
            </div>
            <p className="font-label text-[10px] text-on-surface-variant/40 uppercase tracking-widest hidden sm:flex items-center gap-2">
              <MaterialIcon name="swipe" size="sm" />
              Scroll to explore
            </p>
          </div>

          {/* Fade edges */}
          <div className="relative">
            {/* left fade */}
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 z-10 bg-gradient-to-r from-[var(--color-surface)] to-transparent" />
            {/* right fade */}
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 z-10 bg-gradient-to-l from-[var(--color-surface)] to-transparent" />

            <div
              className="screenshot-scroll flex gap-5 overflow-x-auto pb-4 px-1"
              style={{
                scrollSnapType: 'x mandatory',
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(233,195,73,0.25) transparent',
              }}
            >
              {project.screenshots.map((shot, idx) => (
                <div
                  key={idx}
                  className="relative flex-none rounded-xl overflow-hidden glass-panel border border-outline-variant/20 shadow-2xl group"
                  style={{
                    scrollSnapAlign: 'start',
                    width: 'clamp(280px, 55vw, 720px)',
                    aspectRatio: '16 / 9',
                  }}
                >
                  {shot.image ? (
                    <NextImage
                      src={shot.image.src}
                      alt={shot.image.alt || shot.caption || 'Screenshot'}
                      fill
                      className="object-contain group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                      sizes="(max-width: 768px) 90vw, 55vw"
                    />
                  ) : (
                    <ImagePlaceholder
                      label={shot.caption || 'Screenshot'}
                      icon="image"
                      accentColor={project.colorAccent}
                      className="rounded-none w-full h-full"
                    />
                  )}
                  {/* Caption */}
                  {shot.caption && (
                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/75 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="font-label text-[10px] text-on-surface uppercase tracking-widest">{shot.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Bento Grid */}
      {project.features.length > 0 && (
        <section className="mb-24">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="font-label text-primary uppercase tracking-[0.3em] text-[10px] mb-2">Core Modules</p>
              <h2 className="font-headline text-5xl italic font-bold">
                {project.name === 'Habitropolis' ? 'The Architecture of Discipline' : 'The Strategic Canvas'}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {project.features.map((feature, index) => (
              <div
                key={feature.title}
                className={`glass-panel p-10 rounded border border-primary/5 hover:bg-surface-container-high transition-all hover-lift ${
                  index === 0 ? 'md:col-span-2 crimson-glow' : ''
                }`}
              >
                <MaterialIcon name={feature.icon} size="4xl" className={`mb-6 ${index === 0 ? 'text-primary' : 'text-secondary'}`} />
                <h3 className={`font-headline font-bold italic mb-4 ${index === 0 ? 'text-3xl' : 'text-2xl'}`}>
                  {feature.title}
                </h3>
                <p className="text-on-surface-variant leading-relaxed text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tech Stack */}
      {project.techStack && project.techStack.length > 0 && (
        <section className="mb-24">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="font-label text-primary uppercase tracking-[0.3em] text-[10px] mb-2">Foundation</p>
              <h2 className="font-headline text-3xl italic font-bold">Technology Stack</h2>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="font-label text-xs uppercase tracking-widest text-neutral-400 bg-surface-container-high px-5 py-3 rounded border border-outline-variant/10 hover:border-primary/20 transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Bottom Navigation */}
      <div className="flex justify-center pt-12">
        <Link
          href="/#projects"
          className="group inline-flex items-center gap-4 py-8 border-y border-primary/10 w-full justify-center hover:bg-surface-container-lowest transition-colors"
        >
          <MaterialIcon
            name="arrow_back"
            size="lg"
            className="text-primary group-hover:-translate-x-2 transition-transform"
          />
          <span className="font-label text-[10px] uppercase tracking-[0.5em] text-on-surface-variant group-hover:text-primary transition-colors">
            Return to Sovereign Projects
          </span>
        </Link>
      </div>
    </main>
  );
}
