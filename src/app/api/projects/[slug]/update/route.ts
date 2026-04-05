import { NextResponse } from 'next/server';
import { getProjectBySlug } from '@/data/projects';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const resolvedParams = await params;
  const project = getProjectBySlug(resolvedParams.slug);

  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  const downloads = project.downloads;

  if (!downloads || !downloads.apkUrl) {
    return NextResponse.json({ error: 'No APK update available for this project' }, { status: 404 });
  }

  // This endpoint returns a structured JSON that Android/Expo apps can use 
  // to check if an update is available and where to download it from.
  return NextResponse.json({
    appName: project.name,
    appSlug: project.slug,
    version: downloads.version,
    versionCode: downloads.versionCode,
    updateUrl: downloads.apkUrl,
    releaseNotes: downloads.releaseNotes || '',
    releaseDate: downloads.releaseDate,
    sha256Checksum: downloads.sha256Checksum || '',
    minAndroidVersion: downloads.minAndroidVersion || '',
    forceUpdate: false,
  });
}
