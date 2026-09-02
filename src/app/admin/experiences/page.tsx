'use client';

import { useEffect, useState } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { Plus, Trash2 } from 'lucide-react';
import type { Experience } from '@/types';

const EMPTY = { title_fr:'',title_en:'',company:'',location:'',description_fr:'',description_en:'',start_date:'',end_date:'',order_index:0 };
const inp:React.CSSProperties = { width:'100%',background:'var(--c-bg3)',border:'1px solid var(--c-border)',borderRadius:8,color:'var(--c-ink)',padding:'.6rem .875rem',fontSize:'.83rem',fontFamily:'var(--ff-body)',outline:'none' };
const f = { onFocus:(e:any)=>e.currentTarget.style.borderColor='var(--c-blue)', onBlur:(e:any)=>e.currentTarget.style.borderColor='var(--c-border)' };

export default function ExperiencesAdminPage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [form, setForm] = useState({...EMPTY});

  async function load() {
    const res = await fetch('/api/admin/experiences');
    setExperiences((await res.json()).experiences ?? []);
  }
  useEffect(()=>{ load(); },[]);

  async function handleCreate(e:React.FormEvent) {
    e.preventDefault();
    await fetch('/api/admin/experiences',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...form,end_date:form.end_date||null})});
    setForm({...EMPTY}); load();
  }
  async function handleDelete(id:number) {
    await fetch(`/api/admin/experiences/${id}`,{method:'DELETE'}); load();
  }

  return (
    <AdminShell title="Parcours">
      <div className="admin-form-2col" style={{alignItems:'start',gap:'1.5rem'}}>
        {/* List */}
        <div style={{display:'flex',flexDirection:'column',gap:'.75rem'}}>
          {experiences.length===0 && <p style={{fontSize:'.85rem',color:'var(--c-muted)'}}>Aucune expérience.</p>}
          {experiences.map((exp)=>(
            <div key={exp.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'.875rem 1rem',borderRadius:10,border:'1px solid var(--c-border)',background:'var(--c-bg2)'}}>
              <div>
                <p style={{fontSize:'.85rem',fontWeight:600,color:'var(--c-ink)'}}>{exp.title_fr} · {exp.company}</p>
                <p style={{fontSize:'.72rem',color:'var(--c-muted)'}}>{exp.start_date} → {exp.end_date ?? "aujourd'hui"}</p>
              </div>
              <button onClick={()=>handleDelete(exp.id)} style={{padding:'.4rem',borderRadius:6,border:'none',background:'transparent',cursor:'pointer',color:'var(--c-muted)',transition:'all .2s'}}
                onMouseEnter={(e)=>{const el=e.currentTarget;el.style.background='rgba(207,34,46,.08)';el.style.color='#cf222e';}}
                onMouseLeave={(e)=>{const el=e.currentTarget;el.style.background='transparent';el.style.color='var(--c-muted)';}}>
                <Trash2 size={15}/>
              </button>
            </div>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleCreate} style={{background:'var(--c-bg2)',border:'1px solid var(--c-border)',borderRadius:14,padding:'1.25rem',display:'flex',flexDirection:'column',gap:'.875rem'}}>
          <p style={{fontFamily:'var(--ff-display)',fontSize:'.9rem',fontWeight:700,color:'var(--c-ink)'}}>Nouvelle expérience</p>
          {[
            {ph:'Poste (FR)',field:'title_fr'},{ph:'Role (EN)',field:'title_en'},
            {ph:'Entreprise',field:'company'},{ph:'Lieu (optionnel)',field:'location'},
          ].map(({ph,field})=>(
            <input key={field} required={field!=='location'} placeholder={ph} value={(form as any)[field]} onChange={(e)=>setForm({...form,[field]:e.target.value})} style={inp} {...f}/>
          ))}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
            <input required type="date" value={form.start_date} onChange={(e)=>setForm({...form,start_date:e.target.value})} style={inp} {...f}/>
            <input type="date" placeholder="Fin (vide=présent)" value={form.end_date} onChange={(e)=>setForm({...form,end_date:e.target.value})} style={inp} {...f}/>
          </div>
          {[{ph:'Description (FR)',field:'description_fr'},{ph:'Description (EN)',field:'description_en'}].map(({ph,field})=>(
            <textarea key={field} rows={2} placeholder={ph} value={(form as any)[field]} onChange={(e)=>setForm({...form,[field]:e.target.value})} style={{...inp,resize:'vertical'}} {...f}/>
          ))}
          <button type="submit" className="btn-primary" style={{justifyContent:'center'}}>
            <Plus size={15}/> Ajouter
          </button>
        </form>
      </div>
    </AdminShell>
  );
}
