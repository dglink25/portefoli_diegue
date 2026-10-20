'use client';

import { useEffect, useState } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { ImageUpload } from '@/components/image-upload';
import { Plus, Trash2, Pencil, Check, X, Eye, EyeOff, Star } from 'lucide-react';
import type { Project } from '@/types';

const EMPTY = {
  slug:'', title_fr:'', title_en:'', description_fr:'', description_en:'',
  cover_image:'', tags:'', demo_url:'', repo_url:'', featured:false, published:true, order_index:0,
};

type FormState = typeof EMPTY;
type EditState = Omit<Project, 'tags'> & { tags: string };

const inp: React.CSSProperties = {
  width:'100%', background:'var(--c-bg3)', border:'1px solid var(--c-border)',
  borderRadius:8, color:'var(--c-ink)', padding:'.6rem .875rem',
  fontSize:'.83rem', fontFamily:'var(--ff-body)', outline:'none',
};
const lbl: React.CSSProperties = {
  display:'block', fontSize:'.66rem', fontWeight:700,
  textTransform:'uppercase', letterSpacing:'.1em', color:'var(--c-muted)', marginBottom:5,
};
const fo = {
  onFocus:(e:React.FocusEvent<HTMLInputElement|HTMLTextAreaElement>)=>(e.currentTarget.style.borderColor='var(--c-blue)'),
  onBlur: (e:React.FocusEvent<HTMLInputElement|HTMLTextAreaElement>)=>(e.currentTarget.style.borderColor='var(--c-border)'),
};

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [form,     setForm]     = useState<FormState>({ ...EMPTY });
  const [editing,  setEditing]  = useState<EditState | null>(null);
  const [saving,   setSaving]   = useState(false);
  const [msg,      setMsg]      = useState('');
  const [panel,    setPanel]    = useState<'add' | 'edit'>('add');

  async function load() {
    const res = await fetch('/api/admin/projects');
    setProjects((await res.json()).projects ?? []);
  }
  useEffect(() => { load(); }, []);

  /* ── Créer ── */
  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setMsg('');
    const res = await fetch('/api/admin/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        order_index: Number(form.order_index),
      }),
    });
    setSaving(false);
    if (res.ok) { setForm({ ...EMPTY }); setMsg('Projet ajouté'); setTimeout(()=>setMsg(''),3000); load(); }
    else setMsg('Erreur lors de la création');
  }

  /* ── Sauvegarder modification ── */
  async function handleSave() {
    if (!editing) return;
    setSaving(true);
    const res = await fetch(`/api/admin/projects/${editing.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slug: editing.slug, title_fr: editing.title_fr, title_en: editing.title_en,
        description_fr: editing.description_fr, description_en: editing.description_en,
        cover_image: editing.cover_image, demo_url: editing.demo_url, repo_url: editing.repo_url,
        featured: editing.featured, published: editing.published,
        order_index: Number(editing.order_index),
        tags: editing.tags.split(',').map((t) => t.trim()).filter(Boolean),
      }),
    });
    setSaving(false);
    if (res.ok) { setEditing(null); setPanel('add'); load(); }
  }

  /* ── Toggle publish ── */
  async function togglePublish(p: Project) {
    await fetch(`/api/admin/projects/${p.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !p.published }),
    });
    load();
  }

  /* ── Supprimer ── */
  async function handleDelete(id: number) {
    if (!confirm('Supprimer ce projet ?')) return;
    await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
    if (editing?.id === id) { setEditing(null); setPanel('add'); }
    load();
  }

  /* ── Ouvrir l'édition ── */
  function openEdit(p: Project) {
    setEditing({ ...p, tags: p.tags.join(', ') });
    setPanel('edit');
  }

  const FormPanel = () => (
    <div style={{ background:'var(--c-bg2)', border:'1px solid var(--c-border)', borderRadius:14, padding:'1.5rem', position:'sticky', top:80 }}>
      {/* Tabs */}
      <div style={{ display:'flex', gap:4, marginBottom:'1.25rem', background:'var(--c-bg3)', borderRadius:8, padding:3 }}>
        {(['add','edit'] as const).map((p) => (
          <button key={p} onClick={()=>{ setPanel(p); if(p==='add') setEditing(null); }}
            style={{ flex:1, padding:'.4rem', borderRadius:6, border:'none', cursor:'pointer', fontSize:'.78rem', fontWeight:600, fontFamily:'var(--ff-body)', background:panel===p?'var(--c-bg2)':'transparent', color:panel===p?'var(--c-ink)':'var(--c-muted)', transition:'all .2s', boxShadow:panel===p?'0 1px 4px rgba(0,0,0,.08)':'none' }}>
            {p === 'add' ? '+ Nouveau' : 'Modifier'}
          </button>
        ))}
      </div>

      {panel === 'add' ? (
        <form onSubmit={handleCreate} style={{ display:'flex', flexDirection:'column', gap:'.875rem' }}>
          <div><label style={lbl}>Slug *</label><input required placeholder="mon-projet" value={form.slug} onChange={(e)=>setForm({...form,slug:e.target.value})} style={inp} {...fo}/></div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'.75rem' }}>
            <div><label style={lbl}>Titre FR *</label><input required value={form.title_fr} onChange={(e)=>setForm({...form,title_fr:e.target.value})} style={inp} {...fo}/></div>
            <div><label style={lbl}>Title EN *</label><input required value={form.title_en} onChange={(e)=>setForm({...form,title_en:e.target.value})} style={inp} {...fo}/></div>
          </div>
          <div><label style={lbl}>Description FR</label><textarea rows={2} value={form.description_fr} onChange={(e)=>setForm({...form,description_fr:e.target.value})} style={{...inp,resize:'vertical'}} {...fo}/></div>
          <div><label style={lbl}>Description EN</label><textarea rows={2} value={form.description_en} onChange={(e)=>setForm({...form,description_en:e.target.value})} style={{...inp,resize:'vertical'}} {...fo}/></div>
          <ImageUpload label="Image de couverture" value={form.cover_image} onChange={(url)=>setForm({...form,cover_image:url})} aspectRatio="wide"/>
          <div><label style={lbl}>Tags (virgule)</label><input placeholder="React, Next.js, TypeScript" value={form.tags} onChange={(e)=>setForm({...form,tags:e.target.value})} style={inp} {...fo}/></div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'.75rem' }}>
            <div><label style={lbl}>URL Démo</label><input value={form.demo_url} onChange={(e)=>setForm({...form,demo_url:e.target.value})} style={inp} {...fo} placeholder="https://..."/></div>
            <div><label style={lbl}>URL Repo</label><input value={form.repo_url} onChange={(e)=>setForm({...form,repo_url:e.target.value})} style={inp} {...fo} placeholder="https://..."/></div>
          </div>
          <div style={{ display:'flex', gap:'1.5rem' }}>
            <label style={{ display:'flex', alignItems:'center', gap:6, fontSize:'.82rem', cursor:'pointer', color:'var(--c-ink)' }}>
              <input type="checkbox" checked={form.published} onChange={(e)=>setForm({...form,published:e.target.checked})} style={{ accentColor:'var(--c-blue)' }}/> Publié
            </label>
            <label style={{ display:'flex', alignItems:'center', gap:6, fontSize:'.82rem', cursor:'pointer', color:'var(--c-ink)' }}>
              <input type="checkbox" checked={form.featured} onChange={(e)=>setForm({...form,featured:e.target.checked})} style={{ accentColor:'var(--c-blue)' }}/> Brouillon
            </label>
          </div>
          {msg && <p style={{ fontSize:'.78rem', color:msg.includes('Erreur')?'#cf222e':'var(--c-green)' }}>{msg}</p>}
          <button type="submit" disabled={saving}
            style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'.65rem 1rem', borderRadius:8, border:'none', background:'var(--c-blue-dim)', color:'#fff', fontSize:'.83rem', fontWeight:600, cursor:saving?'not-allowed':'pointer', opacity:saving?.6:1, fontFamily:'var(--ff-body)' }}>
            <Plus size={15}/> Ajouter le projet
          </button>
        </form>
      ) : editing ? (
        <div style={{ display:'flex', flexDirection:'column', gap:'.875rem' }}>
          <p style={{ fontSize:'.78rem', color:'var(--c-blue)', fontWeight:600 }}>Modification : {editing.title_fr}</p>
          <div><label style={lbl}>Slug</label><input value={editing.slug} onChange={(e)=>setEditing({...editing,slug:e.target.value})} style={inp} {...fo}/></div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'.75rem' }}>
            <div><label style={lbl}>Titre FR</label><input value={editing.title_fr} onChange={(e)=>setEditing({...editing,title_fr:e.target.value})} style={inp} {...fo}/></div>
            <div><label style={lbl}>Title EN</label><input value={editing.title_en} onChange={(e)=>setEditing({...editing,title_en:e.target.value})} style={inp} {...fo}/></div>
          </div>
          <div><label style={lbl}>Description FR</label><textarea rows={2} value={editing.description_fr} onChange={(e)=>setEditing({...editing,description_fr:e.target.value})} style={{...inp,resize:'vertical'}} {...fo}/></div>
          <div><label style={lbl}>Description EN</label><textarea rows={2} value={editing.description_en} onChange={(e)=>setEditing({...editing,description_en:e.target.value})} style={{...inp,resize:'vertical'}} {...fo}/></div>
          <ImageUpload label="Image de couverture" value={editing.cover_image||''} onChange={(url)=>setEditing({...editing,cover_image:url})} aspectRatio="wide"/>
          <div><label style={lbl}>Tags (virgule)</label><input value={editing.tags} onChange={(e)=>setEditing({...editing,tags:e.target.value})} style={inp} {...fo}/></div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'.75rem' }}>
            <div><label style={lbl}>URL Démo</label><input value={editing.demo_url||''} onChange={(e)=>setEditing({...editing,demo_url:e.target.value})} style={inp} {...fo}/></div>
            <div><label style={lbl}>URL Repo</label><input value={editing.repo_url||''} onChange={(e)=>setEditing({...editing,repo_url:e.target.value})} style={inp} {...fo}/></div>
          </div>
          <div style={{ display:'flex', gap:'1.5rem' }}>
            <label style={{ display:'flex', alignItems:'center', gap:6, fontSize:'.82rem', cursor:'pointer', color:'var(--c-ink)' }}>
              <input type="checkbox" checked={editing.published} onChange={(e)=>setEditing({...editing,published:e.target.checked})} style={{ accentColor:'var(--c-blue)' }}/> Publié
            </label>
            <label style={{ display:'flex', alignItems:'center', gap:6, fontSize:'.82rem', cursor:'pointer', color:'var(--c-ink)' }}>
              <input type="checkbox" checked={editing.featured} onChange={(e)=>setEditing({...editing,featured:e.target.checked})} style={{ accentColor:'var(--c-blue)' }}/> Brouillon
            </label>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <button onClick={handleSave} disabled={saving}
              style={{ display:'flex', alignItems:'center', gap:6, flex:1, justifyContent:'center', padding:'.65rem 1rem', borderRadius:8, border:'none', background:'var(--c-blue-dim)', color:'#fff', fontSize:'.83rem', fontWeight:600, cursor:'pointer', fontFamily:'var(--ff-body)' }}>
              <Check size={14}/> Enregistrer
            </button>
            <button onClick={()=>{ setEditing(null); setPanel('add'); }}
              style={{ display:'flex', alignItems:'center', gap:6, padding:'.65rem 1rem', borderRadius:8, border:'1px solid var(--c-border)', background:'transparent', color:'var(--c-muted)', fontSize:'.83rem', cursor:'pointer', fontFamily:'var(--ff-body)' }}>
              <X size={14}/> Annuler
            </button>
          </div>
        </div>
      ) : (
        <p style={{ fontSize:'.85rem', color:'var(--c-muted)', textAlign:'center', padding:'2rem 0' }}>
          Cliquez sur <Pencil size={12} style={{ display:'inline', verticalAlign:'middle' }}/> pour modifier un projet
        </p>
      )}
    </div>
  );

  return (
    <AdminShell title="Projets">
      <div className="admin-form-2col" style={{ alignItems:'start', gap:'2rem' }}>
        {/* ── Liste ── */}
        <div style={{ display:'flex', flexDirection:'column', gap:'.75rem' }}>
          <p style={{ fontSize:'.8rem', color:'var(--c-muted)', marginBottom:4 }}>
            {projects.length} projet(s) - <Pencil size={12} style={{ display:'inline', verticalAlign:'middle' }}/> modifier / <EyeOff size={12} style={{ display:'inline', verticalAlign:'middle' }}/> masquer
          </p>

          {projects.length === 0 && <p style={{ fontSize:'.85rem', color:'var(--c-muted)' }}>Aucun projet.</p>}

          {projects.map((p) => (
            <div key={p.id}
              style={{ borderRadius:10, border:`1px solid ${editing?.id===p.id?'var(--c-blue)':'var(--c-border)'}`, background:'var(--c-bg2)', overflow:'hidden', transition:'border-color .2s' }}>
              <div style={{ display:'flex', alignItems:'center', gap:12, padding:'.875rem 1rem' }}>
                {/* Cover mini */}
                {p.cover_image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.cover_image} alt={p.title_fr} style={{ width:48, height:36, objectFit:'cover', borderRadius:6, flexShrink:0, border:'1px solid var(--c-border)' }}/>
                )}
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <p style={{ fontSize:'.85rem', fontWeight:600, color:'var(--c-ink)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.title_fr}</p>
                    {p.featured && <Star size={12} style={{ color:'var(--c-purple)', flexShrink:0 }} fill="currentColor"/>}
                  </div>
                  <div style={{ display:'flex', gap:6, marginTop:3, flexWrap:'wrap' }}>
                    <span style={{ fontSize:'.68rem', color:'var(--c-muted)' }}>/{p.slug}</span>
                    <span style={{ fontSize:'.68rem', padding:'1px 6px', borderRadius:4, background:p.published?'rgba(26,127,55,.1)':'rgba(207,34,46,.08)', color:p.published?'var(--c-green)':'#cf222e' }}>
                      {p.published ? 'publié' : 'masqué'}
                    </span>
                    {p.tags.slice(0,3).map((t)=>(
                      <span key={t} style={{ fontSize:'.65rem', padding:'1px 5px', borderRadius:4, background:'rgba(9,105,218,.08)', color:'var(--c-blue)' }}>{t}</span>
                    ))}
                  </div>
                </div>
                {/* Actions */}
                <div style={{ display:'flex', gap:4, flexShrink:0 }}>
                  <button onClick={()=>openEdit(p)} title="Modifier"
                    style={{ width:30, height:30, borderRadius:6, border:'none', background:'transparent', cursor:'pointer', color:'var(--c-muted)', display:'flex', alignItems:'center', justifyContent:'center', transition:'all .2s' }}
                    onMouseEnter={(e)=>{ const el=e.currentTarget; el.style.background='rgba(9,105,218,.08)'; el.style.color='var(--c-blue)'; }}
                    onMouseLeave={(e)=>{ const el=e.currentTarget; el.style.background='transparent'; el.style.color='var(--c-muted)'; }}>
                    <Pencil size={14}/>
                  </button>
                  <button onClick={()=>togglePublish(p)} title={p.published?'Masquer':'Publier'}
                    style={{ width:30, height:30, borderRadius:6, border:'none', background:'transparent', cursor:'pointer', color:'var(--c-muted)', display:'flex', alignItems:'center', justifyContent:'center', transition:'all .2s' }}
                    onMouseEnter={(e)=>{ const el=e.currentTarget; el.style.background='var(--c-bg3)'; el.style.color='var(--c-ink)'; }}
                    onMouseLeave={(e)=>{ const el=e.currentTarget; el.style.background='transparent'; el.style.color='var(--c-muted)'; }}>
                    {p.published ? <EyeOff size={14}/> : <Eye size={14}/>}
                  </button>
                  <button onClick={()=>handleDelete(p.id)} title="Supprimer"
                    style={{ width:30, height:30, borderRadius:6, border:'none', background:'transparent', cursor:'pointer', color:'var(--c-muted)', display:'flex', alignItems:'center', justifyContent:'center', transition:'all .2s' }}
                    onMouseEnter={(e)=>{ const el=e.currentTarget; el.style.background='rgba(207,34,46,.08)'; el.style.color='#cf222e'; }}
                    onMouseLeave={(e)=>{ const el=e.currentTarget; el.style.background='transparent'; el.style.color='var(--c-muted)'; }}>
                    <Trash2 size={14}/>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Panneau formulaire ── */}
        <FormPanel />
      </div>
    </AdminShell>
  );
}
