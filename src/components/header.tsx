'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Arrow } from './icons';
const links = [['/solutions', 'Solutions'], ['/products', 'Products'], ['/why-engiseek', 'Why EngiSeek'], ['/faqs', 'FAQs']];
export function Header() {
 const [open, setOpen] = useState(false); const pathname = usePathname();
 return <header className="site-header"><div className="header-inner"><Link href="/" aria-label="EngiSeek home" onClick={() => setOpen(false)} className="brand"><img src="/images/engiseek-primary.png" width="174" height="44" alt="EngiSeek — making engineering awesome" /></Link><nav className="desktop-nav" aria-label="Main navigation">{links.map(([href,label]) => <Link key={href} href={href} aria-current={pathname === href ? 'page' : undefined}>{label}</Link>)}</nav><div className="header-actions"><Link className="button button-small" href="/consultation" onClick={() => setOpen(false)}>Let’s talk <Arrow diagonal /></Link><button className="menu-toggle" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}><span>{open ? 'Close' : 'Menu'}</span><span aria-hidden="true">{open ? '−' : '+'}</span></button></div></div>{open && <nav id="mobile-menu" className="mobile-nav" aria-label="Mobile navigation">{links.map(([href,label]) => <Link key={href} href={href} onClick={() => setOpen(false)} aria-current={pathname === href ? 'page' : undefined}>{label}<Arrow /></Link>)}</nav>}</header>;
}
