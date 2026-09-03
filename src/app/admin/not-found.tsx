import Link from 'next/link';
import { Home, Search } from 'lucide-react';

export default function AdminNotFound() {
  return (
    <div style={{ minHeight:'100vh', background:'var(--c-bg)', display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem', fontFamily:'var(--ff-body)' }}>
      <div style={{ maxWidth:420, width:'100%', textAlign:'center' }}>

        <div style={{ width:72, height:72, borderRadius:'50%', background:'rgba(9,105,218,.08)', border:'2px solid rgba(9,105,218,.15)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1.75rem' }}>
          <Search size={30} strokeWidth={1.5} style={{ color:'var(--c-blue)' }}/>
        </div>

        <h1 style={{ fontFamily:'var(--ff-display)', fontSize:'1.6rem', fontWeight:700, color:'var(--c-ink)', marginBottom:'.6rem' }}>Page introuvable</h1>
        <p style={{ fontSize:'.88rem', color:'var(--c-muted)', lineHeight:1.7, marginBottom:'2rem' }}>
          Cette page du backoffice n&apos;existe pas ou a été déplacée.
        </p>

        <Link href="/admin/dashboard"
          style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'.75rem 1.5rem', borderRadius:10, background:'var(--c-blue-dim)', color:'#fff', textDecoration:'none', fontSize:'.875rem', fontWeight:700, fontFamily:'var(--ff-body)' }}>
          <Home size={15}/> Tableau de bord
        </Link>
      </div>
    </div>
  );
}
