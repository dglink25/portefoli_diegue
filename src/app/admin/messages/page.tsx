'use client';

import { useEffect, useState } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { Mail, Trash2, MailOpen, MapPin, Clock, RefreshCw, ExternalLink } from 'lucide-react';

interface Message {
  id: number;
  full_name: string;
  email: string;
  subject: string | null;
  message: string;
  read: boolean;
  created_at: string;
}

function fmt(d: string) {
  return new Intl.DateTimeFormat('fr', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(d));
}

export default function MessagesAdminPage() {
  const [messages,  setMessages]  = useState<Message[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [selected,  setSelected]  = useState<Message | null>(null);
  const [filter,    setFilter]    = useState<'all'|'unread'|'read'>('all');

  async function load() {
    setLoading(true);
    const res = await fetch('/api/admin/messages');
    if (res.ok) setMessages(await res.json());
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function markRead(id: number) {
    await fetch(`/api/admin/messages/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ read: true }),
    });
    setMessages((prev) => prev.map((m) => m.id === id ? { ...m, read: true } : m));
  }

  async function handleDelete(id: number) {
    if (!confirm('Supprimer ce message ?')) return;
    await fetch(`/api/admin/messages/${id}`, { method: 'DELETE' });
    if (selected?.id === id) setSelected(null);
    load();
  }

  async function openMessage(msg: Message) {
    setSelected(msg);
    if (!msg.read) await markRead(msg.id);
  }

  const filtered = messages.filter((m) =>
    filter === 'all' ? true : filter === 'unread' ? !m.read : m.read
  );
  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <AdminShell title="Messages reçus">
      <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>

        {/* Stats + filtres */}
        <div style={{ display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'space-between', gap:'1rem' }}>
          <div style={{ display:'flex', gap:'.75rem', flexWrap:'wrap' }}>
            {[
              { key:'all',    label:`Tous (${messages.length})` },
              { key:'unread', label:`Non lus (${unreadCount})` },
              { key:'read',   label:`Lus (${messages.length - unreadCount})` },
            ].map(({ key, label }) => (
              <button key={key} onClick={() => setFilter(key as any)}
                style={{ padding:'.45rem 1rem', borderRadius:8, border:`1px solid ${filter===key?'var(--c-blue)':'var(--c-border)'}`, background: filter===key?'rgba(9,105,218,.08)':'transparent', cursor:'pointer', fontSize:'.78rem', fontWeight:600, color: filter===key?'var(--c-blue)':'var(--c-muted)', fontFamily:'var(--ff-body)', transition:'all .2s' }}>
                {label}
              </button>
            ))}
          </div>
          <button onClick={load}
            style={{ display:'flex', alignItems:'center', gap:6, padding:'.45rem .875rem', borderRadius:8, border:'1px solid var(--c-border)', background:'transparent', cursor:'pointer', fontSize:'.78rem', color:'var(--c-muted)', fontFamily:'var(--ff-body)', transition:'all .2s' }}
            onMouseEnter={(e)=>{ const el=e.currentTarget; el.style.borderColor='var(--c-blue)'; el.style.color='var(--c-blue)'; }}
            onMouseLeave={(e)=>{ const el=e.currentTarget; el.style.borderColor='var(--c-border)'; el.style.color='var(--c-muted)'; }}>
            <RefreshCw size={13}/> Actualiser
          </button>
        </div>

        {/* Layout 2 colonnes sur desktop */}
        <div style={{ display:'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap:'1.25rem', alignItems:'start' }}>

          {/* Liste */}
          <div style={{ display:'flex', flexDirection:'column', gap:'.5rem' }}>
            {loading ? (
              <p style={{ fontSize:'.85rem', color:'var(--c-muted)', padding:'2rem', textAlign:'center' }}>Chargement…</p>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign:'center', padding:'3rem', color:'var(--c-muted)' }}>
                <Mail size={40} strokeWidth={1} style={{ margin:'0 auto 1rem', display:'block', color:'var(--c-border)' }}/>
                <p style={{ fontSize:'.88rem' }}>Aucun message.</p>
              </div>
            ) : filtered.map((msg) => (
              <div key={msg.id}
                onClick={() => openMessage(msg)}
                style={{ borderRadius:10, border:`1px solid ${selected?.id===msg.id?'var(--c-blue)':!msg.read?'rgba(9,105,218,.3)':'var(--c-border)'}`, background: selected?.id===msg.id?'rgba(9,105,218,.05)':'var(--c-bg2)', padding:'.875rem 1rem', cursor:'pointer', transition:'all .2s', position:'relative' }}
                onMouseEnter={(e)=>{ if(selected?.id!==msg.id)(e.currentTarget as HTMLElement).style.borderColor='var(--c-blue)'; }}
                onMouseLeave={(e)=>{ if(selected?.id!==msg.id)(e.currentTarget as HTMLElement).style.borderColor=!msg.read?'rgba(9,105,218,.3)':'var(--c-border)'; }}>

                {/* Indicateur non-lu */}
                {!msg.read && (
                  <div style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', width:7, height:7, borderRadius:'50%', background:'var(--c-blue)' }}/>
                )}

                <div style={{ paddingLeft: !msg.read ? 16 : 0 }}>
                  <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:8, marginBottom:4 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, minWidth:0 }}>
                      {msg.read
                        ? <MailOpen size={14} style={{ color:'var(--c-muted)', flexShrink:0 }}/>
                        : <Mail size={14} style={{ color:'var(--c-blue)', flexShrink:0 }}/>
                      }
                      <p style={{ fontSize:'.85rem', fontWeight: msg.read?500:700, color:'var(--c-ink)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{msg.full_name}</p>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:6, flexShrink:0 }}>
                      <span style={{ fontSize:'.68rem', color:'var(--c-muted)' }}>{fmt(msg.created_at)}</span>
                      <button onClick={(e)=>{ e.stopPropagation(); handleDelete(msg.id); }}
                        style={{ width:24, height:24, borderRadius:5, border:'none', background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--c-muted)', transition:'all .2s' }}
                        onMouseEnter={(e)=>{ const el=e.currentTarget; el.style.background='rgba(207,34,46,.08)'; el.style.color='#cf222e'; }}
                        onMouseLeave={(e)=>{ const el=e.currentTarget; el.style.background='transparent'; el.style.color='var(--c-muted)'; }}>
                        <Trash2 size={12}/>
                      </button>
                    </div>
                  </div>
                  <p style={{ fontSize:'.78rem', color:'var(--c-blue)', marginBottom:3 }}>{msg.email}</p>
                  {msg.subject && <p style={{ fontSize:'.78rem', fontWeight:600, color:'var(--c-ink)', marginBottom:3 }}>{msg.subject}</p>}
                  <p style={{ fontSize:'.75rem', color:'var(--c-muted)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{msg.message}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Détail du message sélectionné */}
          {selected && (
            <div style={{ background:'var(--c-bg2)', border:'1px solid var(--c-border)', borderRadius:14, padding:'1.5rem', position:'sticky', top:80 }}>
              {/* Header */}
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12, marginBottom:'1.25rem', paddingBottom:'1rem', borderBottom:'1px solid var(--c-border)' }}>
                <div>
                  <h3 style={{ fontFamily:'var(--ff-display)', fontSize:'1rem', fontWeight:700, color:'var(--c-ink)', marginBottom:4 }}>
                    {selected.subject || '(Sans sujet)'}
                  </h3>
                  <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                    <p style={{ fontSize:'.82rem', fontWeight:600, color:'var(--c-ink)' }}>{selected.full_name}</p>
                    <a href={`mailto:${selected.email}`}
                      style={{ fontSize:'.78rem', color:'var(--c-blue)', textDecoration:'none' }}
                      onMouseEnter={(e)=>(e.currentTarget.style.textDecoration='underline')}
                      onMouseLeave={(e)=>(e.currentTarget.style.textDecoration='none')}>
                      {selected.email}
                    </a>
                    <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:'.72rem', color:'var(--c-muted)' }}>
                      <Clock size={11}/>
                      {fmt(selected.created_at)}
                    </div>
                  </div>
                </div>
                {/* Bouton répondre */}
                <a
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(selected.email)}&su=${encodeURIComponent(`Re: ${selected.subject || 'Votre message'}`)}` }
                  target="_blank" rel="noreferrer"
                  style={{ display:'flex', alignItems:'center', gap:6, padding:'.55rem 1rem', borderRadius:8, border:'none', background:'var(--c-blue-dim)', color:'#fff', fontSize:'.78rem', fontWeight:600, textDecoration:'none', transition:'background .2s', flexShrink:0, fontFamily:'var(--ff-body)' }}
                  onMouseEnter={(e)=>(e.currentTarget.style.background='var(--c-blue)')}
                  onMouseLeave={(e)=>(e.currentTarget.style.background='var(--c-blue-dim)')}>
                  <ExternalLink size={13}/> Répondre
                </a>
              </div>

              {/* Corps du message */}
              <div style={{ background:'var(--c-bg3)', borderRadius:10, padding:'1rem', minHeight:120 }}>
                <p style={{ fontSize:'.88rem', lineHeight:1.75, color:'var(--c-muted)', whiteSpace:'pre-wrap' }}>{selected.message}</p>
              </div>

              {/* Actions */}
              <div style={{ display:'flex', gap:8, marginTop:'1rem' }}>
                <button onClick={() => handleDelete(selected.id)}
                  style={{ display:'flex', alignItems:'center', gap:6, padding:'.55rem 1rem', borderRadius:8, border:'1px solid rgba(207,34,46,.3)', background:'rgba(207,34,46,.06)', cursor:'pointer', fontSize:'.78rem', fontWeight:600, color:'#cf222e', fontFamily:'var(--ff-body)', transition:'all .2s' }}
                  onMouseEnter={(e)=>{ const el=e.currentTarget; el.style.background='rgba(207,34,46,.12)'; }}
                  onMouseLeave={(e)=>{ const el=e.currentTarget; el.style.background='rgba(207,34,46,.06)'; }}>
                  <Trash2 size={13}/> Supprimer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
