'use client';

import { useEffect, useState } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { Check, X, Trash2, Star, Eye, EyeOff, MessageSquare } from 'lucide-react';
import type { Review } from '@/types';

function Stars({ value }: { value: number }) {
  return (
    <div style={{ display:'flex', gap:2 }}>
      {[1,2,3,4,5].map((n) => (
        <Star key={n} size={12} strokeWidth={1.5}
          style={{ fill: n<=value?'var(--c-blue)':'transparent', color: n<=value?'var(--c-blue)':'var(--c-border)' }}/>
      ))}
    </div>
  );
}

function fmtDate(d: string) {
  return new Intl.DateTimeFormat('fr', { year:'numeric', month:'short', day:'numeric' }).format(new Date(d));
}

export default function ReviewsAdminPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState<'all'|'published'|'pending'>('all');

  async function load() {
    setLoading(true);
    const res  = await fetch('/api/admin/reviews');
    const data = await res.json();
    setReviews(data.reviews ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function togglePublish(id: number, published: boolean) {
    await fetch(`/api/admin/reviews/${id}`, {
      method: 'PATCH', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ published }),
    });
    load();
  }

  async function handleDelete(id: number) {
    if (!confirm('Supprimer cet avis définitivement ?')) return;
    await fetch(`/api/admin/reviews/${id}`, { method:'DELETE' });
    load();
  }

  const filtered = reviews.filter((r) =>
    filter === 'all' ? true :
    filter === 'published' ? r.published :
    !r.published
  );

  const counts = {
    all:       reviews.length,
    published: reviews.filter((r) => r.published).length,
    pending:   reviews.filter((r) => !r.published).length,
  };

  return (
    <AdminShell title="Avis">
      {/* Stats rapides */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1rem', marginBottom:'1.5rem' }}>
        {[
          { key:'all',       label:'Total',        value: counts.all },
          { key:'published', label:'Publiés',       value: counts.published },
          { key:'pending',   label:'En attente',    value: counts.pending },
        ].map(({ key, label, value }) => (
          <button key={key} type="button"
            onClick={() => setFilter(key as any)}
            style={{ textAlign:'left', padding:'.875rem 1rem', borderRadius:10, border:`1px solid ${filter===key?'var(--c-blue)':'var(--c-border)'}`, background: filter===key?'rgba(9,105,218,.06)':'var(--c-bg2)', cursor:'pointer', transition:'all .2s' }}>
            <p style={{ fontFamily:'var(--ff-display)', fontSize:'1.5rem', fontWeight:700, color:'var(--c-blue)', lineHeight:1 }}>{value}</p>
            <p style={{ fontSize:'.75rem', color:'var(--c-muted)', marginTop:4 }}>{label}</p>
          </button>
        ))}
      </div>

      {/* Liste */}
      {loading ? (
        <p style={{ color:'var(--c-muted)', fontSize:'.85rem' }}>Chargement…</p>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign:'center', padding:'3rem', color:'var(--c-muted)' }}>
          <MessageSquare size={36} strokeWidth={1} style={{ margin:'0 auto 1rem', display:'block', color:'var(--c-border)' }}/>
          <p style={{ fontSize:'.88rem' }}>Aucun avis.</p>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:'.75rem' }}>
          {filtered.map((r) => (
            <div key={r.id}
              style={{ borderRadius:12, border:'1px solid var(--c-border)', background:'var(--c-bg2)', overflow:'hidden', transition:'border-color .2s' }}
              onMouseEnter={(e)=>((e.currentTarget as HTMLElement).style.borderColor='rgba(9,105,218,.35)')}
              onMouseLeave={(e)=>((e.currentTarget as HTMLElement).style.borderColor='var(--c-border)')}>

              <div style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'1rem' }}>
                {/* Avatar */}
                <div style={{ width:40, height:40, borderRadius:'50%', background:'var(--c-blue-dim)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--ff-display)', fontWeight:700, color:'#fff', fontSize:'.95rem', flexShrink:0 }}>
                  {r.full_name.charAt(0).toUpperCase()}
                </div>

                {/* Content */}
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', flexWrap:'wrap', alignItems:'center', gap:8, marginBottom:4 }}>
                    <p style={{ fontSize:'.88rem', fontWeight:700, color:'var(--c-ink)' }}>{r.full_name}</p>
                    <Stars value={r.rating}/>
                    <span style={{ fontSize:'.68rem', padding:'1px 7px', borderRadius:20, fontWeight:600, background: r.published?'rgba(26,127,55,.1)':'rgba(207,34,46,.08)', color: r.published?'var(--c-green)':'#cf222e', border: `1px solid ${r.published?'rgba(26,127,55,.2)':'rgba(207,34,46,.2)'}` }}>
                      {r.published ? 'Publié' : 'En attente'}
                    </span>
                    <span style={{ fontSize:'.68rem', color:'var(--c-muted)', marginLeft:'auto' }}>
                      {fmtDate(r.created_at)}
                    </span>
                  </div>
                  <p style={{ fontSize:'.84rem', color:'var(--c-muted)', lineHeight:1.6, wordBreak:'break-word' }}>{r.message}</p>
                </div>

                {/* Actions */}
                <div style={{ display:'flex', gap:4, flexShrink:0 }}>
                  <button
                    type="button"
                    onClick={() => togglePublish(r.id, !r.published)}
                    title={r.published ? 'Masquer' : 'Publier'}
                    style={{ width:32, height:32, borderRadius:7, border:'none', background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--c-muted)', transition:'all .2s' }}
                    onMouseEnter={(e) => { const el=e.currentTarget; el.style.background='rgba(9,105,218,.08)'; el.style.color='var(--c-blue)'; }}
                    onMouseLeave={(e) => { const el=e.currentTarget; el.style.background='transparent'; el.style.color='var(--c-muted)'; }}>
                    {r.published ? <EyeOff size={15}/> : <Eye size={15}/>}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(r.id)}
                    title="Supprimer"
                    style={{ width:32, height:32, borderRadius:7, border:'none', background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--c-muted)', transition:'all .2s' }}
                    onMouseEnter={(e) => { const el=e.currentTarget; el.style.background='rgba(207,34,46,.08)'; el.style.color='#cf222e'; }}
                    onMouseLeave={(e) => { const el=e.currentTarget; el.style.background='transparent'; el.style.color='var(--c-muted)'; }}>
                    <Trash2 size={15}/>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
