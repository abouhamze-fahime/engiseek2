import type { MetadataRoute } from 'next';
export default function sitemap(): MetadataRoute.Sitemap { const url=process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'; return ['','/solutions','/products','/why-engiseek','/faqs','/consultation','/privacy'].map(path=>({url:`${url}${path}`})); }
