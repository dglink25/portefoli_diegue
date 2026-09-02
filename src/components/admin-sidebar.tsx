'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import {
  LayoutDashboard, FolderKanban, Sparkles, Briefcase,
  Star, User, Settings, LogOut, Images, Sun, Moon,
} from 'lucide-react';

const ITEMS = [
  { href:'/admin/dashboard',  label:'Tableau de bord', icon:LayoutDashboard },
  { href:'/admin/profile',    label:'Profil',          icon:User },
  { href:'/admin/projects',   label:'Projets',         icon:FolderKanban },
  { href:'/admin/skills',     label:'Compétences',     icon:Sparkles },
  { href:'/admin/experiences',label:'Parcours',        icon:Briefcase },
  { href:'/admin/gallery',    label:'Galerie',         icon:Images },
  { href:'/admin/reviews',    label:'Avis',            icon:Star },
  { href:'/admin/settings',   label:'Statistiques',    icon:Settings },
];

function ThemeBtn() {
  const { resolvedTheme, setTheme } = useTheme();
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  if (!m) return null;
  const dark = resolvedTheme === 'dark';
  return (
    <button onClick={()=>setTheme(dark?'light':'dark')}
      style={{ display:'flex', alignItems:'center', gap:8, width:'100%', padding:'.5rem .75rem', borderRadius:8, border:'none', background:'transparent', cursor:'pointer', color:'var(--c-muted)', fontSize:'.82rem', fontFamily:'var(--ff-body)', transition:'all .2s' }}
      onMouseEnter={(e)=>{ const el=e.currentTarget; el.style.background='var(--c-bg3)'; el.style.color='var(--c-ink)'; }}
      onMouseLeave={(e)=>{ const el=e.currentTarget; el.style.background='transparent'; el.style.color='var(--c-muted)'; }}>
      {dark ? <Sun size={15}/> : <Moon size={15}/>}
      {dark ? 'Thème clair' : 'Thème sombre'}
    </button>
  );
}

export function AdminSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <div style={{ display:'flex', height:'100%', flexDirection:'column' }}>
      {/* Header */}
      <div style={{ padding:'1.25rem', borderBottom:'1px solid var(--c-border)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:36, height:36, borderRadius:8, background:'var(--c-blue-dim)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--ff-display)', fontWeight:700, fontSize:'.85rem', color:'#fff', flexShrink:0 }}>DH</div>
          <div>
            <p style={{ fontFamily:'var(--ff-display)', fontSize:'.88rem', fontWeight:700, color:'var(--c-ink)' }}>Backoffice</p>
            <p style={{ fontSize:'.68rem', color:'var(--c-muted)' }}>Portfolio admin</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex:1, overflowY:'auto', padding:'.75rem .5rem' }}>
        {ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link key={href} href={href} onClick={onClose}
              style={{ display:'flex', alignItems:'center', gap:10, padding:'.55rem .75rem', borderRadius:8, marginBottom:2, fontSize:'.82rem', fontWeight:active?600:500, textDecoration:'none', background:active?'rgba(9,105,218,.1)':'transparent', color:active?'var(--c-blue)':'var(--c-muted)', transition:'all .15s' }}
              onMouseEnter={(e)=>{ if(!active){ const el=e.currentTarget as HTMLElement; el.style.background='var(--c-bg3)'; el.style.color='var(--c-ink)'; } }}
              onMouseLeave={(e)=>{ if(!active){ const el=e.currentTarget as HTMLElement; el.style.background='transparent'; el.style.color='var(--c-muted)'; } }}>
              <Icon size={16} strokeWidth={active?2:1.75}/>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ borderTop:'1px solid var(--c-border)', padding:'.75rem .5rem' }}>
        <ThemeBtn />
        <button type="button" onClick={()=>signOut({callbackUrl:'/admin/login'})}
          style={{ display:'flex', alignItems:'center', gap:10, width:'100%', padding:'.55rem .75rem', borderRadius:8, border:'none', background:'transparent', cursor:'pointer', color:'var(--c-muted)', fontSize:'.82rem', fontFamily:'var(--ff-body)', transition:'all .2s', marginTop:2 }}
          onMouseEnter={(e)=>{ const el=e.currentTarget; el.style.background='rgba(207,34,46,.08)'; el.style.color='#cf222e'; }}
          onMouseLeave={(e)=>{ const el=e.currentTarget; el.style.background='transparent'; el.style.color='var(--c-muted)'; }}>
          <LogOut size={15} strokeWidth={1.75}/>
          Se déconnecter
        </button>
      </div>
    </div>
  );
}
