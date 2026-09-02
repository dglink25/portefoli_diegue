'use client';

import { useState } from 'react';
import { AdminSidebar } from './admin-sidebar';
import { Menu, X } from 'lucide-react';

export function AdminShell({ title, children }: { title?: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="admin-layout">
      {/* ── Sidebar desktop ── */}
      <div className="admin-sidebar-wrap">
        <aside style={{ width:240, height:'100vh', position:'sticky', top:0, borderRight:'1px solid var(--c-border)', background:'var(--c-bg2)', display:'flex', flexDirection:'column', overflowY:'auto' }}>
          <AdminSidebar onClose={() => setOpen(false)} />
        </aside>
      </div>

      {/* ── Top bar mobile ── */}
      <div className="admin-topbar">
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:32, height:32, borderRadius:8, background:'var(--c-blue-dim)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--ff-display)', fontWeight:700, fontSize:'.8rem', color:'#fff' }}>DH</div>
          <span style={{ fontFamily:'var(--ff-display)', fontWeight:700, fontSize:'.9rem', color:'var(--c-ink)' }}>Backoffice</span>
        </div>
        <button onClick={()=>setOpen(!open)} style={{ background:'none', border:'1px solid var(--c-border)', borderRadius:6, padding:'.3rem', cursor:'pointer', color:'var(--c-muted)', display:'flex', alignItems:'center' }}>
          {open ? <X size={18}/> : <Menu size={18}/>}
        </button>
      </div>

      {/* ── Mobile drawer ── */}
      {open && (
        <div style={{ position:'fixed', inset:0, zIndex:200 }}>
          <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.5)' }} onClick={()=>setOpen(false)} />
          <aside style={{ position:'absolute', left:0, top:0, bottom:0, width:240, background:'var(--c-bg2)', borderRight:'1px solid var(--c-border)', display:'flex', flexDirection:'column', overflowY:'auto', zIndex:1 }}>
            <AdminSidebar onClose={() => setOpen(false)} />
          </aside>
        </div>
      )}

      {/* ── Main ── */}
      <main className="admin-main">
        {title && (
          <div style={{ borderBottom:'1px solid var(--c-border)', padding:'1.25rem 1.5rem' }}>
            <h1 style={{ fontFamily:'var(--ff-display)', fontSize:'1.1rem', fontWeight:700, color:'var(--c-ink)' }}>{title}</h1>
          </div>
        )}
        <div style={{ padding:'1.5rem' }}>{children}</div>
      </main>
    </div>
  );
}
