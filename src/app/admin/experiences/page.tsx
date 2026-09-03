'use client';

import { useEffect, useState } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { Plus, Trash2, Pencil, Check, X } from 'lucide-react';
import type { Experience } from '@/types';

const EMPTY = {
  title_fr:'', title_en:'', company:'', location:'',
  description_fr:'', description_en:'', start_date:'', end_date:'', order_index:0,
};

type EditState = Experience & { tagsStr?: string };

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
  onFocus:(e:React.FocusEvent<HTMLInputElement|HTMLTextAreaElement>) => (e.currentTarget.style.borderColor='var(--c-blue)'),
  onBlur: (e:React.FocusEvent<HTMLInputElement|HTMLTextAreaElement>) => (e.currentTarget.style.borderColor='var(--c-border)'),
};

function fmtDate(d: string) {
  if (!d) return '';
  const date = new Date(d);
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}

export default function ExperiencesAdminPage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [form,    setForm]    = useState({...EMPTY});
  const [editing, setEditing] = useState<EditState | null>(null);
  const [saving,  setSaving]  = useState(false);
  const [msg,     setMsg]     = useState('');
  const [panel,   setPanel]   = useState<'add'|'edit'>('add');

  async function load() {
    const res = await fetch('/api/admin/experiences');
    setExperiences((await res.json()).experiences ?? []);
  }
  useEffect(() => { load(); }, []);

  /* ── Créer ── */
  async function handleCreate(e:React.FormEvent) {
    e.preventDefault(); setSaving(true); setMsg('');
    const res = await fetch('/api/admin/experiences', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({...form, end_date: form.end_date || null}),
    });
    setSaving(false);
    if (res.ok) { setForm({...EMPTY}); setMsg('Expérience ajoutée'); setTimeout(()=>setMsg(''),3000); load(); }
    else setMsg('Erreur lors de la création');
  }

  /* ── Sauvegarder modification ── */
  async function handleSave() {
    if (!editing) return;
    setSaving(true);
    await fetch(`/api/admin/experiences/${editing.id}`, {
      method:'PUT', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        title_fr: editing.title_fr, title_en: editing.title_en,
        company: editing.company, location: editing.location || null,
        description_fr: editing.description_fr, description_en: editing.description_en,
        start_date: editing.start_date, end_date: editing.end_date || null,
        order_index: Number(editing.order_index),
      }),
    });
    setSaving(false);
    setEditing(null); setPanel('add'); load();
  }

  /* ── Supprimer ── */
  async function handleDelete(id:number) {
    if (!confirm('Supprimer cette expérience ?')) return;
    await fetch(`/api/admin/experiences/${id}`, {method:'DELETE'});
    if (editing?.id === id) { setEditing(null); setPanel('add'); }
    load();
  }

  function openEdit(exp:Experience) {
    setEditing({
      ...exp,
      start_date: fmtDate(exp.start_date),
      end_date:   exp.end_date ? fmtDate(exp.end_date) : '',
    });
    setPanel('edit');
  }

  const FormPanel = () => (
    <div style={{ background:'var(--c-bg2)', border:'1px solid var(--c-border)', borderRadius:14, padding:'1.5rem', position:'sticky', top:80 }}>
      {/* Tabs */}
      <div style={{ display:'flex', gap:4, marginBottom:'1.25rem', background:'var(--c-bg3)', borderRadius:8, padding:3 }}>
        {(['add','edit'] as const).map((p) => (
          <button key={p} onClick={()=>{ setPanel(p); if(p==='add') setEditing(null); }}
            style={{ flex:1, padding:'.4rem', borderRadius:6, border:'none', cursor:'pointer', fontSize:'.78rem', fontWeight:600, fontFamily:'var(--ff-body)', background:panel===p?'var(--c-bg2)':'transparent', color:panel===p?'var(--c-ink)':'var(--c-muted)', transition:'all .2s', boxShadow:panel===p?'0 1px 4px rgba(0,0,0,.08)':'none' }}>
            {p==='add'?'+ Nouveau':'Modifier'}
          </button>
        ))}
      </div>

      {panel==='add' ? (
        <form onSubmit={handleCreate} style={{display:'flex',flexDirection:'column',gap:'.875rem'}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'.75rem'}}>
            <div><label style={lbl}>Poste FR *</label><input required value={form.title_fr} onChange={e=>setForm({...form,title_fr:e.target.value})} style={inp} {...fo}/></div>
            <div><label style={lbl}>Role EN *</label><input required value={form.title_en} onChange={e=>setForm({...form,title_en:e.target.value})} style={inp} {...fo}/></div>
          </div>
          <div><label style={lbl}>Entreprise *</label><input required value={form.company} onChange={e=>setForm({...form,company:e.target.value})} style={inp} {...fo}/></div>
          <div><label style={lbl}>Lieu</label><input value={form.location} onChange={e=>setForm({...form,location:e.target.value})} style={inp} {...fo} placeholder="Ex: Cotonou, Bénin"/></div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'.75rem'}}>
            <div><label style={lbl}>Début *</label><input required type="date" value={form.start_date} onChange={e=>setForm({...form,start_date:e.target.value})} style={inp} {...fo}/></div>
            <div><label style={lbl}>Fin (vide=présent)</label><input type="date" value={form.end_date} onChange={e=>setForm({...form,end_date:e.target.value})} style={inp} {...fo}/></div>
          </div>
          <div><label style={lbl}>Description FR</label><textarea rows={2} value={form.description_fr} onChange={e=>setForm({...form,description_fr:e.target.value})} style={{...inp,resize:'vertical'}} {...fo}/></div>
          <div><label style={lbl}>Description EN</label><textarea rows={2} value={form.description_en} onChange={e=>setForm({...form,description_en:e.target.value})} style={{...inp,resize:'vertical'}} {...fo}/></div>
          <div><label style={lbl}>Ordre</label><input type="number" value={form.order_index} onChange={e=>setForm({...form,order_index:Number(e.target.value)})} style={inp} {...fo}/></div>
          {msg && <p style={{fontSize:'.78rem',color:msg.includes('Erreur')?'#cf222e':'var(--c-green)'}}>{msg}</p>}
          <button type="submit" disabled={saving}
            style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,padding:'.65rem 1rem',borderRadius:8,border:'none',background:'var(--c-blue-dim)',color:'#fff',fontSize:'.83rem',fontWeight:600,cursor:saving?'not-allowed':'pointer',opacity:saving?.6:1,fontFamily:'var(--ff-body)'}}>
            <Plus size={15}/> Ajouter
          </button>
        </form>
      ) : editing ? (
        <div style={{display:'flex',flexDirection:'column',gap:'.875rem'}}>
          <p style={{fontSize:'.78rem',color:'var(--c-blue)',fontWeight:600}}>Modifier : {editing.title_fr}</p>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'.75rem'}}>
            <div><label style={lbl}>Poste FR</label><input value={editing.title_fr} onChange={e=>setEditing({...editing,title_fr:e.target.value})} style={inp} {...fo}/></div>
            <div><label style={lbl}>Role EN</label><input value={editing.title_en} onChange={e=>setEditing({...editing,title_en:e.target.value})} style={inp} {...fo}/></div>
          </div>
          <div><label style={lbl}>Entreprise</label><input value={editing.company} onChange={e=>setEditing({...editing,company:e.target.value})} style={inp} {...fo}/></div>
          <div><label style={lbl}>Lieu</label><input value={editing.location||''} onChange={e=>setEditing({...editing,location:e.target.value})} style={inp} {...fo}/></div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'.75rem'}}>
            <div><label style={lbl}>Début</label><input type="date" value={editing.start_date} onChange={e=>setEditing({...editing,start_date:e.target.value})} style={inp} {...fo}/></div>
            <div><label style={lbl}>Fin</label><input type="date" value={editing.end_date||''} onChange={e=>setEditing({...editing,end_date:e.target.value})} style={inp} {...fo}/></div>
          </div>
          <div><label style={lbl}>Description FR</label><textarea rows={2} value={editing.description_fr} onChange={e=>setEditing({...editing,description_fr:e.target.value})} style={{...inp,resize:'vertical'}} {...fo}/></div>
          <div><label style={lbl}>Description EN</label><textarea rows={2} value={editing.description_en} onChange={e=>setEditing({...editing,description_en:e.target.value})} style={{...inp,resize:'vertical'}} {...fo}/></div>
          <div><label style={lbl}>Ordre</label><input type="number" value={editing.order_index} onChange={e=>setEditing({...editing,order_index:Number(e.target.value)})} style={inp} {...fo}/></div>
          <div style={{display:'flex',gap:8}}>
            <button onClick={handleSave} disabled={saving}
              style={{display:'flex',alignItems:'center',gap:6,flex:1,justifyContent:'center',padding:'.65rem',borderRadius:8,border:'none',background:'var(--c-blue-dim)',color:'#fff',fontSize:'.83rem',fontWeight:600,cursor:'pointer',fontFamily:'var(--ff-body)'}}>
              <Check size={14}/> Enregistrer
            </button>
            <button onClick={()=>{ setEditing(null); setPanel('add'); }}
              style={{display:'flex',alignItems:'center',gap:6,padding:'.65rem 1rem',borderRadius:8,border:'1px solid var(--c-border)',background:'transparent',color:'var(--c-muted)',fontSize:'.83rem',cursor:'pointer',fontFamily:'var(--ff-body)'}}>
              <X size={14}/> Annuler
            </button>
          </div>
        </div>
      ) : (
        <p style={{fontSize:'.85rem',color:'var(--c-muted)',textAlign:'center',padding:'2rem 0'}}>
          Cliquez sur <Pencil size={12} style={{display:'inline',verticalAlign:'middle'}}/> pour modifier
        </p>
      )}
    </div>
  );

  return (
    <AdminShell title="Parcours">
      <div className="admin-form-2col" style={{alignItems:'start',gap:'2rem'}}>
        {/* ── Liste ── */}
        <div style={{display:'flex',flexDirection:'column',gap:'.75rem'}}>
          <p style={{fontSize:'.8rem',color:'var(--c-muted)',marginBottom:4}}>
            {experiences.length} expérience(s)
          </p>
          {experiences.length===0 && <p style={{fontSize:'.85rem',color:'var(--c-muted)'}}>Aucune expérience.</p>}
          {experiences.map((exp) => (
            <div key={exp.id}
              style={{borderRadius:10,border:`1px solid ${editing?.id===exp.id?'var(--c-blue)':'var(--c-border)'}`,background:'var(--c-bg2)',overflow:'hidden',transition:'border-color .2s'}}>
              <div style={{display:'flex',alignItems:'flex-start',gap:12,padding:'.875rem 1rem'}}>
                <div style={{flex:1,minWidth:0}}>
                  <p style={{fontSize:'.85rem',fontWeight:700,color:'var(--c-ink)',marginBottom:2}}>{exp.title_fr}</p>
                  <p style={{fontSize:'.8rem',fontWeight:600,color:'var(--c-blue)',marginBottom:4}}>{exp.company}</p>
                  <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                    <span style={{fontSize:'.7rem',padding:'1px 7px',borderRadius:20,background:'rgba(9,105,218,.08)',color:'var(--c-blue)',fontWeight:500}}>
                      {fmtDate(exp.start_date)} → {exp.end_date ? fmtDate(exp.end_date) : "Aujourd'hui"}
                    </span>
                    {exp.location && (
                      <span style={{display:'flex',alignItems:'center',gap:3,fontSize:'.7rem',color:'var(--c-muted)'}}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 5-8 13-8 13S4 15 4 10a8 8 0 0116 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        {exp.location}
                      </span>
                    )}
                  </div>
                  {exp.description_fr && (
                    <p style={{fontSize:'.76rem',color:'var(--c-muted)',marginTop:5,display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>
                      {exp.description_fr}
                    </p>
                  )}
                </div>
                <div style={{display:'flex',gap:4,flexShrink:0}}>
                  <button onClick={()=>openEdit(exp)} title="Modifier"
                    style={{width:30,height:30,borderRadius:6,border:'none',background:'transparent',cursor:'pointer',color:'var(--c-muted)',display:'flex',alignItems:'center',justifyContent:'center',transition:'all .2s'}}
                    onMouseEnter={e=>{const el=e.currentTarget;el.style.background='rgba(9,105,218,.08)';el.style.color='var(--c-blue)';}}
                    onMouseLeave={e=>{const el=e.currentTarget;el.style.background='transparent';el.style.color='var(--c-muted)';}}>
                    <Pencil size={14}/>
                  </button>
                  <button onClick={()=>handleDelete(exp.id)} title="Supprimer"
                    style={{width:30,height:30,borderRadius:6,border:'none',background:'transparent',cursor:'pointer',color:'var(--c-muted)',display:'flex',alignItems:'center',justifyContent:'center',transition:'all .2s'}}
                    onMouseEnter={e=>{const el=e.currentTarget;el.style.background='rgba(207,34,46,.08)';el.style.color='#cf222e';}}
                    onMouseLeave={e=>{const el=e.currentTarget;el.style.background='transparent';el.style.color='var(--c-muted)';}}>
                    <Trash2 size={14}/>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <FormPanel />
      </div>
    </AdminShell>
  );
}
