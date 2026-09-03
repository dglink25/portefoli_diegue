'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <div style={{ minHeight:'100vh', background:'#0d1117', display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem', fontFamily:"'Inter',sans-serif" }}>
      <div style={{ maxWidth:480, width:'100%', textAlign:'center' }}>

        <div style={{ width:80, height:80, borderRadius:'50%', background:'rgba(207,34,46,.08)', border:'2px solid rgba(207,34,46,.2)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1.75rem' }}>
          <AlertTriangle size={36} strokeWidth={1.5} style={{ color:'#cf222e' }}/>
        </div>

        <h1 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'clamp(1.4rem,3vw,1.8rem)', fontWeight:700, color:'#e6edf3', marginBottom:'.75rem' }}>
          Une erreur est survenue
        </h1>
        <p style={{ fontSize:'.93rem', color:'#8b949e', lineHeight:1.7, maxWidth:360, margin:'0 auto 2rem' }}>
          Quelque chose s&apos;est mal passé. Réessayez ou revenez à l&apos;accueil.
        </p>

        {error.digest && (
          <p style={{ fontSize:'.72rem', color:'#8b949e', fontFamily:'monospace', background:'#161b22', border:'1px solid #30363d', borderRadius:6, padding:'.4rem .75rem', display:'inline-block', marginBottom:'1.75rem' }}>
            Code : {error.digest}
          </p>
        )}

        <div style={{ display:'flex', flexWrap:'wrap', gap:'1rem', justifyContent:'center' }}>
          <button onClick={reset}
            style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'.8rem 1.75rem', borderRadius:10, background:'#1f6feb', color:'#fff', border:'none', cursor:'pointer', fontSize:'.875rem', fontWeight:700, fontFamily:"'Inter',sans-serif" }}>
            <RefreshCw size={15}/> Réessayer
          </button>
          <a href="/"
            style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'.8rem 1.75rem', borderRadius:10, border:'1px solid #30363d', background:'transparent', color:'#e6edf3', textDecoration:'none', fontSize:'.875rem', fontWeight:600 }}>
            <Home size={15}/> Accueil
          </a>
        </div>
      </div>
    </div>
  );
}
