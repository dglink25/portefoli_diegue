'use client';

import { useEffect, useState } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { Plus, Trash2 } from 'lucide-react';
import type { Skill } from '@/types';

const EMPTY = { name:'', category:'Langages', level:3, order_index:0 };
const s = { inp:{ width:'100%', background:'var(--c-bg3)', border:'1px solid var(--c-border)', borderRadius:8, color:'var(--c-ink)', padding:'.6rem .875rem', fontSize:'.83rem', fontFamily:'var(--ff-body)', outline:'none' } as React.CSSProperties };
const focus = { onFocus:(e:any)=>e.currentTarget.style.borderColor='var(--c-blue)', onBlur:(e:any)=>e.currentTarget.style.borderColor='var(--c-border)' };

export default function SkillsAdminPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [form, setForm] = useState({...EMPTY});

  async function load() {
    const res = await fetch('/api/admin/skills');
    setSkills((await res.json()).skills ?? []);
  }
  useEffect(()=>{ load(); },[]);

  async function handleCreate(e:React.FormEvent) {
    e.preventDefault();
    await fetch('/api/admin/skills',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)});
    setForm({...EMPTY}); load();
  }
  async function handleDelete(id:number) {
    await fetch(`/api/admin/skills/${id}`,{method:'DELETE'}); load();
  }

  return (
    <AdminShell title="Compétences">
      <div className="admin-form-2col" style={{alignItems:'start', gap:'1.5rem'}}>
        {/* List */}
        <div style={{display:'flex',flexDirection:'column',gap:'.75rem'}}>
          {skills.length===0 && <p style={{fontSize:'.85rem',color:'var(--c-muted)'}}>Aucune compétence.</p>}
          {skills.map((s)=>(
            <div key={s.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'.875rem 1rem',borderRadius:10,border:'1px solid var(--c-border)',background:'var(--c-bg2)'}}>
              <div>
                <p style={{fontSize:'.85rem',fontWeight:600,color:'var(--c-ink)'}}>{s.name}</p>
                <p style={{fontSize:'.72rem',color:'var(--c-muted)'}}>{s.category} · niveau {s.level}/5</p>
              </div>
              <button onClick={()=>handleDelete(s.id)} style={{padding:'.4rem',borderRadius:6,border:'none',background:'transparent',cursor:'pointer',color:'var(--c-muted)',transition:'all .2s'}}
                onMouseEnter={(e)=>{const el=e.currentTarget;el.style.background='rgba(207,34,46,.08)';el.style.color='#cf222e';}}
                onMouseLeave={(e)=>{const el=e.currentTarget;el.style.background='transparent';el.style.color='var(--c-muted)';}}>
                <Trash2 size={15}/>
              </button>
            </div>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleCreate} style={{background:'var(--c-bg2)',border:'1px solid var(--c-border)',borderRadius:14,padding:'1.25rem',display:'flex',flexDirection:'column',gap:'.875rem'}}>
          <p style={{fontFamily:'var(--ff-display)',fontSize:'.9rem',fontWeight:700,color:'var(--c-ink)'}}>Nouvelle compétence</p>
          <input required placeholder="Nom (ex: TypeScript)" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} style={s.inp} {...focus}/>
          <input required placeholder="Catégorie (ex: Frontend)" value={form.category} onChange={(e)=>setForm({...form,category:e.target.value})} style={s.inp} {...focus}/>
          <div>
            <label style={{fontSize:'.82rem',color:'var(--c-ink)'}}>Niveau : <strong style={{color:'var(--c-blue)'}}>{form.level}/5</strong></label>
            <input type="range" min={1} max={5} value={form.level} onChange={(e)=>setForm({...form,level:Number(e.target.value)})} style={{width:'100%',marginTop:6,accentColor:'var(--c-blue)'}}/>
          </div>
          <button type="submit" className="btn-primary" style={{justifyContent:'center'}}>
            <Plus size={15}/> Ajouter
          </button>
        </form>
      </div>
    </AdminShell>
  );
}
