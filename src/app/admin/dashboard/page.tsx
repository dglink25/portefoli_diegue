'use client';

import { AdminShell } from '@/components/admin-shell';
import { FolderKanban, Sparkles, Briefcase, Star, Images, User } from 'lucide-react';
import Link from 'next/link';

const SHORTCUTS = [
  { href:'/admin/profile',    label:'Gérer le profil',       icon:User,        desc:'Nom, photo, bio, réseaux' },
  { href:'/admin/projects',   label:'Gérer les projets',     icon:FolderKanban,desc:'Ajouter et publier vos projets' },
  { href:'/admin/skills',     label:'Gérer les compétences', icon:Sparkles,    desc:'Langages, frameworks, outils' },
  { href:'/admin/experiences',label:'Gérer le parcours',     icon:Briefcase,   desc:'Stages et expériences pro' },
  { href:'/admin/gallery',    label:'Galerie photos',        icon:Images,      desc:'Souvenirs et moments' },
  { href:'/admin/reviews',    label:'Modérer les avis',      icon:Star,        desc:'Approuver les témoignages' },
];

export default function DashboardPage() {
  return (
    <AdminShell title="Tableau de bord">
      <p style={{ fontSize:'.88rem', color:'var(--c-muted)', marginBottom:'1.5rem' }}>
        Bienvenue. Utilisez le menu ou les raccourcis ci-dessous pour mettre à jour votre portfolio.
      </p>

      <div className="admin-grid-cards">
        {SHORTCUTS.map(({ href, label, icon:Icon, desc }) => (
          <Link key={href} href={href}
            style={{ display:'flex', flexDirection:'column', gap:'.75rem', padding:'1.25rem', borderRadius:12, border:'1px solid var(--c-border)', background:'var(--c-bg2)', textDecoration:'none', transition:'all .2s', cursor:'pointer' }}
            onMouseEnter={(e)=>{ const el=e.currentTarget; el.style.borderColor='var(--c-blue)'; el.style.transform='translateY(-2px)'; el.style.boxShadow='0 4px 16px var(--c-shadow)'; }}
            onMouseLeave={(e)=>{ const el=e.currentTarget; el.style.borderColor='var(--c-border)'; el.style.transform='translateY(0)'; el.style.boxShadow='none'; }}>
            <div style={{ width:40, height:40, borderRadius:10, background:'rgba(9,105,218,.1)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--c-blue)', flexShrink:0 }}>
              <Icon size={20} strokeWidth={1.75}/>
            </div>
            <div>
              <p style={{ fontSize:'.88rem', fontWeight:600, color:'var(--c-ink)', marginBottom:3 }}>{label}</p>
              <p style={{ fontSize:'.75rem', color:'var(--c-muted)' }}>{desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}
