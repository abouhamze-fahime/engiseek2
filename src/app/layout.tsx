import type { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/shared';
import './globals.css';
export const metadata: Metadata = { metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'), title: { default: 'EngiSeek | Engineering intelligence', template: '%s | EngiSeek' }, description: 'Purpose-built software for infrastructure inspection, aerodrome compliance and engineering workflows.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body><a className="skip-link" href="#main">Skip to content</a><Header /><main id="main">{children}</main><Footer /></body></html>; }
