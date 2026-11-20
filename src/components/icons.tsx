export function Arrow({ diagonal = false, className = '' }: { diagonal?: boolean; className?: string }) {
  return <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={diagonal ? 'M6 18 18 6M6 6h12v12' : 'M4 12h15m-6-6 6 6-6 6'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
export function DomainIcon({ name }: { name: string }) {
  const paths: Record<string, string> = { asset: 'M4 8 12 3l8 5v9l-8 5-8-5V8Zm0 0 8 5 8-5M12 13v9', bridge: 'M2 17h20M5 6v15M19 6v15M5 8c3 9 11 9 14 0M9 13v4m6-4v4', airspace: 'm3 11 18-8-8 18-2-8-8-2Zm8 2L21 3', electrical: 'm13 2-9 12h7l-1 8 10-13h-7l0-7Z', forecast: 'M3 20V4m0 16h18M6 15l5-6 4 3 6-8m-5 0h5v5', integration: 'M8 4H4v6h4V4Zm12 10h-4v6h4v-6ZM8 7h7a3 3 0 0 1 3 3v4M16 17H9a3 3 0 0 1-3-3v-4' };
  return <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={paths[name] || paths.asset} stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round" /></svg>;
}
