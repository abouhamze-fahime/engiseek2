import type { Metadata } from 'next';
export function pageMetadata(title: string, description: string, path: string): Metadata {
  return { title, description, alternates: { canonical: path }, openGraph: { title: `${title} | EngiSeek`, description, url: path, type: 'website', images: [{ url: '/images/share.jpg', width: 1200, height: 630, alt: 'EngiSeek — Engineering intelligence. Built for the real world.' }] }, twitter: { card: 'summary_large_image', title: `${title} | EngiSeek`, description, images: ['/images/share.jpg'] } };
}
