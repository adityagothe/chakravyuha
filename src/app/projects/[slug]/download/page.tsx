import { getProjectBySlug } from '@/data/projects';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MaterialIcon } from '@/components/ui/MaterialIcon';
import { CopyButton } from '@/components/ui/CopyButton';


export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};

  return {
    title: `Download ${project.name}`,
    description: `Download ${project.name} APK — ${project.tagline}`,
  };
}

export default async function DownloadPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const featureIcons: Record<string, string> = {
    habitropolis: 'location_city',
    vittora: 'account_balance_wallet',
  };

  const heroIcon = featureIcons[project.slug] || 'deployed_code';

  return (
    <main className="animate-page-in pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
      {/* Back to Project Link */}
      <div className="mb-12">
        <Link
          href={`/projects/${project.slug}`}
          className="group flex items-center gap-2 font-label text-[10px] uppercase tracking-[0.2em] text-primary/60 hover:text-primary transition-colors"
        >
          <MaterialIcon name="arrow_back" size="sm" className="group-hover:-translate-x-1 transition-transform" />
          Back to {project.name}
        </Link>
      </div>

      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        {/* Left Content: Info & Download */}
        <div className="lg:col-span-7 space-y-8">
          <header>
            <span className="font-label text-primary text-xs uppercase tracking-[0.3em] block mb-4">
              {project.categoryLabel}
            </span>
            <h1 className="font-headline text-6xl md:text-8xl font-black italic tracking-tighter leading-[0.9] text-on-surface">
              {project.name}
            </h1>
            <p className="font-headline text-2xl md:text-3xl text-primary mt-4 italic opacity-90">
              {project.tagline}
            </p>
          </header>

          <p className="text-on-surface-variant text-lg leading-relaxed max-w-2xl">
            {project.description}
          </p>

          {/* Features Summary */}
          {project.features.length > 0 && (
            <div className="grid grid-cols-2 gap-4 py-8">
              {project.features.map((feature) => (
                <div key={feature.title} className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {feature.icon}
                  </span>
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
              {project.downloads.apkUrl ? (
                <a
                  href={project.downloads.apkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gold-gradient-bg text-on-primary px-10 py-5 rounded font-label uppercase text-sm tracking-widest font-extrabold btn-glow flex items-center justify-center gap-3"
                >
                  <MaterialIcon name="download" size="sm" />
                  Download APK
                </a>
              ) : (
                <button
                  disabled
                  className="bg-surface-container-high text-neutral-500 px-10 py-5 rounded font-label uppercase text-sm tracking-widest font-extrabold cursor-not-allowed flex items-center justify-center gap-3"
                >
                  <MaterialIcon name="download" size="sm" />
                  APK Unavailable
                </button>
              )}

            </div>
            <p className="font-label text-[10px] text-on-surface-variant/60 italic tracking-wider flex items-center gap-2">
              <MaterialIcon name="info" size="sm" />
              Install from unknown sources may be required for manual APK installation.
            </p>
          </div>
        </div>

        {/* Right Content: Trust Panel */}
        <div className="lg:col-span-5 space-y-8">
          {/* Security & Metadata Panel */}
          <div className="bg-surface-container-low p-8 relative overflow-hidden group shadow-[0_0_80px_rgba(233,195,73,0.03)] border-l-2 border-primary/10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-primary/10 transition-colors" />
            <h3 className="font-label text-[10px] uppercase tracking-[0.4em] text-primary mb-6">Security & Metadata</h3>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-sm text-on-surface">
                <span className="material-symbols-outlined text-primary text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified_user
                </span>
                Safe APK (No malware, no trackers)
              </li>
              <li className="flex items-center gap-3 text-sm text-on-surface">
                <span className="material-symbols-outlined text-primary text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                  architecture
                </span>
                Built by Vajravyuha
              </li>
            </ul>
            <div className="grid grid-cols-2 gap-y-6 border-t border-primary/10 pt-6">
              <div>
                <span className="font-label text-[9px] uppercase tracking-widest text-on-surface-variant block mb-1">Version</span>
                <span className="text-primary font-mono text-sm">v{project.downloads.version}</span>
              </div>
              <div>
                <span className="font-label text-[9px] uppercase tracking-widest text-on-surface-variant block mb-1">Platform</span>
                <span className="text-on-surface text-sm">
                  {project.platforms.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(', ')}
                </span>
              </div>
              <div>
                <span className="font-label text-[9px] uppercase tracking-widest text-on-surface-variant block mb-1">Updated</span>
                <span className="text-on-surface text-sm">
                  {new Date(project.updatedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </span>
              </div>
              {project.downloads.fileSize && (
                <div>
                  <span className="font-label text-[9px] uppercase tracking-widest text-on-surface-variant block mb-1">Size</span>
                  <span className="text-on-surface text-sm">{project.downloads.fileSize}</span>
                </div>
              )}
            </div>
            {project.downloads.sha256Checksum && project.downloads.sha256Checksum !== 'Pending' && (
              <div className="mt-6 pt-6 border-t border-primary/10">
                <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant block mb-3 flex items-center gap-2">
                  <MaterialIcon name="verified" size="sm" className="text-primary/70" />
                  SHA-256 Checksum
                </span>
                <div className="flex items-center gap-3 bg-surface border border-primary/10 pl-4 pr-1 py-1 rounded">
                  <code className="text-[11px] text-primary/80 font-mono break-all flex-1 select-all py-2">
                    {project.downloads.sha256Checksum}
                  </code>
                  <div className="flex-shrink-0 border-l border-primary/10 pl-2 pr-1">
                    <CopyButton value={project.downloads.sha256Checksum} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Release Notes */}
          {project.downloads.releaseNotes && (
            <div className="bg-surface-container p-6 border border-primary/5 hover:border-primary/15 transition-colors">
              <h3 className="font-label text-[10px] uppercase tracking-[0.4em] text-primary mb-4">Release Notes</h3>
              <div className="text-sm text-on-surface-variant/80 leading-relaxed space-y-1">
                {project.downloads.releaseNotes.split('\n').map((note, i) => (
                  <p key={i}>{note}</p>
                ))}
              </div>
            </div>
          )}

          {/* Live Demo Badge */}
          <div className="bg-surface-container-highest p-6 flex items-center justify-between group cursor-pointer transition-colors hover:bg-surface-bright">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary flex items-center justify-center rounded">
                <span className="material-symbols-outlined text-on-primary">{heroIcon}</span>
              </div>
              <div>
                <p className="font-label text-[10px] uppercase tracking-widest text-on-surface">
                  {project.name}
                </p>
                <p className="text-xs text-on-surface-variant">v{project.downloads.version}{project.downloads.fileSize ? ` • ${project.downloads.fileSize}` : ''}</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-primary transition-transform group-hover:translate-x-1">arrow_forward</span>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="mt-32 flex flex-col sm:flex-row gap-4 justify-center">
        {/* Back to Project Detail */}
        <Link
          href={`/projects/${project.slug}`}
          className="group flex items-center gap-4 py-6 px-8 border border-primary/10 justify-center hover:bg-surface-container-lowest transition-colors flex-1"
        >
          <MaterialIcon
            name="arrow_back"
            size="lg"
            className="text-primary group-hover:-translate-x-2 transition-transform"
          />
          <span className="font-label text-[10px] uppercase tracking-[0.3em] text-on-surface-variant group-hover:text-primary transition-colors">
            Back to {project.name}
          </span>
        </Link>

        {/* Back to Projects Grid */}
        <Link
          href="/#projects"
          className="group flex items-center gap-4 py-6 px-8 border border-primary/10 justify-center hover:bg-surface-container-lowest transition-colors flex-1"
        >
          <MaterialIcon
            name="arrow_back"
            size="lg"
            className="text-primary group-hover:-translate-x-2 transition-transform"
          />
          <span className="font-label text-[10px] uppercase tracking-[0.3em] text-on-surface-variant group-hover:text-primary transition-colors">
            Return to Sovereign Projects
          </span>
        </Link>
      </div>
    </main>
  );
}
