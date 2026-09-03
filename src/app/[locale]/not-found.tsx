import Link from 'next/link';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div style={{ minHeight:'100vh', background:'var(--c-bg)', display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem', fontFamily:'var(--ff-body)' }}>
      <div style={{ maxWidth:520, width:'100%', textAlign:'center' }}>

        {/* Code 404 stylisé */}
        <div style={{ position:'relative', marginBottom:'2rem' }}>
          <p style={{
            fontFamily:'var(--ff-display)', fontSize:'clamp(7rem,20vw,10rem)',
            fontWeight:900, color:'var(--c-bg3)', lineHeight:1,
            userSelect:'none', letterSpacing:'-0.05em',
          }}>
            404
          </p>
          <div style={{
            position:'absolute', top:'50%', left:'50%',
            transform:'translate(-50%,-50%)',
            width:80, height:80, borderRadius:'50%',
            background:'rgba(9,105,218,.1)', border:'2px solid rgba(9,105,218,.2)',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <Search size={32} strokeWidth={1.5} style={{ color:'var(--c-blue)' }}/>
          </div>
        </div>

        {/* Message */}
        <h1 style={{ fontFamily:'var(--ff-display)', fontSize:'clamp(1.4rem,3vw,1.8rem)', fontWeight:700, color:'var(--c-ink)', marginBottom:'.75rem' }}>
          Page introuvable
        </h1>
        <p style={{ fontSize:'.95rem', color:'var(--c-muted)', lineHeight:1.7, marginBottom:'2.5rem', maxWidth:380, margin:'0 auto 2.5rem' }}>
          La page que vous cherchez a peut-être été déplacée, renommée ou n&apos;existe pas.
        </p>

        {/* Actions */}
        <div style={{ display:'flex', flexWrap:'wrap', gap:'1rem', justifyContent:'center' }}>
          <Link href="/"
            style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'.8rem 1.75rem', borderRadius:10, background:'var(--c-blue-dim)', color:'#fff', textDecoration:'none', fontSize:'.875rem', fontWeight:700, fontFamily:'var(--ff-body)', transition:'background .2s' }}
            onMouseEnter={(e)=>(e.currentTarget.style.background='var(--c-blue)')}
            onMouseLeave={(e)=>(e.currentTarget.style.background='var(--c-blue-dim)')}>
            <Home size={16}/> Retour à l&apos;accueil
          </Link>
          <button onClick={() => history.back()}
            style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'.8rem 1.75rem', borderRadius:10, border:'1px solid var(--c-border)', background:'transparent', color:'var(--c-ink)', fontSize:'.875rem', fontWeight:600, fontFamily:'var(--ff-body)', cursor:'pointer', transition:'all .2s' }}
            onMouseEnter={(e)=>{ const el=e.currentTarget; el.style.borderColor='var(--c-blue)'; el.style.color='var(--c-blue)'; }}
            onMouseLeave={(e)=>{ const el=e.currentTarget; el.style.borderColor='var(--c-border)'; el.style.color='var(--c-ink)'; }}>
            <ArrowLeft size={16}/> Page précédente
          </button>
        </div>

        {/* Liens rapides */}
        <div style={{ marginTop:'3rem', paddingTop:'2rem', borderTop:'1px solid var(--c-border)' }}>
          <p style={{ fontSize:'.78rem', color:'var(--c-muted)', marginBottom:'1rem', textTransform:'uppercase', letterSpacing:'.1em', fontWeight:700 }}>
            Pages populaires
          </p>
          <div style={{ display:'flex', flexWrap:'wrap', gap:'.5rem', justifyContent:'center' }}>
            {[
              { href:'/#about',      label:'À propos' },
              { href:'/#projects',   label:'Projets' },
              { href:'/#skills',     label:'Compétences' },
              { href:'/#contact',    label:'Contact' },
            ].map(({ href, label }) => (
              <Link key={href} href={href}
                style={{ padding:'.4rem .875rem', borderRadius:20, border:'1px solid var(--c-border)', background:'var(--c-bg2)', color:'var(--c-muted)', textDecoration:'none', fontSize:'.78rem', fontWeight:500, transition:'all .2s', fontFamily:'var(--ff-body)' }}
                onMouseEnter={(e)=>{ const el=e.currentTarget as HTMLElement; el.style.borderColor='var(--c-blue)'; el.style.color='var(--c-blue)'; }}
                onMouseLeave={(e)=>{ const el=e.currentTarget as HTMLElement; el.style.borderColor='var(--c-border)'; el.style.color='var(--c-muted)'; }}>
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
