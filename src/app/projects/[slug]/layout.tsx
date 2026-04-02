import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { getProjectBySlug, getProjectSlugs } from '@/data/projects';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}


export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
