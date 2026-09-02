'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { locales } from '@/i18n/config';
import type { Profile } from '@/types';

function getLinks(locale: string) {
  return locale === 'en'
    ? [
        { id:'about',      label:'About' },
        { id:'expertises', label:'Expertise' },
        { id:'skills',     label:'Skills' },
        { id:'experience', label:'Experience' },
        { id:'projects',   label:'Projects' },
        { id:'gallery',    label:'Gallery' },
        { id:'reviews',    label:'Reviews' },
        { id:'contact',    label:'Contact' },
      ]
    : [
        { id:'about',      label:'À propos' },
        { id:'expertises', label:'Expertises' },
        { id:'skills',     label:'Compétences' },
        { id:'experience', label:'Expériences' },
        { id:'projects',   label:'Projets' },
        { id:'gallery',    label:'Galerie' },
        { id:'reviews',    label:'Avis' },
        { id:'contact',    label:'Contact' },
      ];
}

function ThemeBtn() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div style={{ width:36, height:36 }} />;
  const dark = resolvedTheme === 'dark';
  return (
    <button onClick={() => setTheme(dark ? 'light' : 'dark')}
      aria-label={dark ? 'Thème clair' : 'Thème sombre'}
      style={{ width:36, height:36, borderRadius:8, border:'1px solid var(--c-border)', background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--c-muted)', transition:'all .2s', flexShrink:0 }}
      onMouseEnter={(e)=>{ e.currentTarget.style.borderColor='var(--c-blue)'; e.currentTarget.style.color='var(--c-blue)'; }}
      onMouseLeave={(e)=>{ e.currentTarget.style.borderColor='var(--c-border)'; e.currentTarget.style.color='var(--c-muted)'; }}>
      {dark ? <Sun size={16}/> : <Moon size={16}/>}
    </button>
  );
}

export function NavBar({ profile, active, locale }: { profile: Profile | null; active: string; locale: string }) {
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const router   = useRouter();
  const pathname = usePathname();
  const LINKS    = getLinks(locale);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  const switchLocale = (next: string) => {
    if (next === locale) return;
    // Force un rechargement complet pour que le Server Component reçoive le nouveau locale
    // next-intl avec localePrefix:'as-needed' : FR=/, EN=/en
    const segs = pathname.split('/').filter(Boolean); // ['en'] ou []
    const hasPrefix = segs[0] === 'en' || segs[0] === 'fr';
    const rest = hasPrefix ? segs.slice(1) : segs;
    const restPath = rest.length > 0 ? '/' + rest.join('/') : '/';
    const target = next === 'fr' ? restPath : `/en${restPath === '/' ? '' : restPath}`;
    window.location.href = target || '/';
  };

  const initials = profile
    ? profile.full_name.split(' ').slice(0,2).map((w)=>w[0]).join('').toUpperCase()
    : 'DH';

  return (
    <>
      <header style={{ position:'fixed', top:0, left:0, right:0, zIndex:100 }}
        className={scrolled ? 'navbar-scrolled' : ''}>
        <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 1.25rem', display:'flex', alignItems:'center', justifyContent:'space-between', height:64, gap:12 }}>

          {/* Logo */}
          <button onClick={()=>scrollTo('hero')}
            style={{ width:40, height:40, borderRadius:8, background:'var(--c-blue-dim)', color:'#fff', fontFamily:'var(--ff-display)', fontWeight:700, fontSize:'.88rem', border:'none', cursor:'pointer', flexShrink:0 }}>
            {initials}
          </button>

          {/* Desktop nav — caché sur mobile via classe CSS .nav-links */}
          <nav className="nav-links">
            {LINKS.map((link) => (
              <button key={link.id} onClick={()=>scrollTo(link.id)}
                className={`nav-link ${active === link.id ? 'active' : ''}`}
                style={{ background:'none', border:'none', cursor:'pointer', padding:'.5rem .7rem', borderRadius:6, fontFamily:'var(--ff-body)', whiteSpace:'nowrap' }}>
                {link.label}
              </button>
            ))}
          </nav>

          {/* Controls */}
          <div style={{ display:'flex', alignItems:'center', gap:8, marginLeft:'auto' }}>
            {/* Locale switcher */}
            <div style={{ display:'flex', gap:3, background:'var(--c-bg3)', borderRadius:8, padding:3, border:'1px solid var(--c-border)', flexShrink:0 }}>
              {(['fr','en'] as const).map((l) => (
                <button key={l} onClick={()=>switchLocale(l)}
                  style={{ padding:'3px 10px', borderRadius:5, border:'none', cursor:l===locale?'default':'pointer', fontSize:'.68rem', fontWeight:700, textTransform:'uppercase' as const, background:locale===l?'var(--c-blue-dim)':'transparent', color:locale===l?'#fff':'var(--c-muted)', transition:'all .2s', fontFamily:'var(--ff-body)' }}>
                  {l}
                </button>
              ))}
            </div>
            <ThemeBtn />
            {/* Burger — visible sur mobile via classe CSS .nav-burger */}
            <button onClick={()=>setMobileOpen(!mobileOpen)}
              className="nav-burger"
              style={{ background:'none', border:'1px solid var(--c-border)', borderRadius:6, padding:'.35rem', cursor:'pointer', color:'var(--c-muted)', alignItems:'center', flexShrink:0 }}>
              {mobileOpen ? <X size={18}/> : <Menu size={18}/>}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{ position:'fixed', inset:0, zIndex:99 }}>
          <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.5)' }} onClick={()=>setMobileOpen(false)} />
          <nav style={{ position:'absolute', top:64, left:0, right:0, background:'var(--c-bg2)', borderBottom:'1px solid var(--c-border)', padding:'1rem', display:'flex', flexDirection:'column', gap:4, maxHeight:'calc(100vh - 64px)', overflowY:'auto' }}>
            {LINKS.map((link) => (
              <button key={link.id} onClick={()=>scrollTo(link.id)}
                style={{ background:active===link.id?'rgba(9,105,218,0.08)':'none', border:'none', cursor:'pointer', padding:'.75rem 1rem', borderRadius:8, textAlign:'left', color:active===link.id?'var(--c-blue)':'var(--c-muted)', fontSize:'.9rem', fontWeight:500, fontFamily:'var(--ff-body)' }}>
                {link.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
