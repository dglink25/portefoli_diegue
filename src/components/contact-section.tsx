'use client';

import { useState } from 'react';
import { Send, Mail, Phone, MapPin, Clock, CheckCircle2, X } from 'lucide-react';
import type { Profile } from '@/types';

const INP: React.CSSProperties = {
  width:'100%', background:'var(--c-bg3)', border:'1px solid var(--c-border)',
  borderRadius:8, color:'var(--c-ink)', padding:'.7rem .9rem',
  fontSize:'.875rem', fontFamily:'var(--ff-body)', outline:'none', transition:'border-color .2s',
};
const FO = {
  onFocus: (e: React.FocusEvent<HTMLInputElement|HTMLTextAreaElement>) => (e.currentTarget.style.borderColor='var(--c-blue)'),
  onBlur:  (e: React.FocusEvent<HTMLInputElement|HTMLTextAreaElement>) => (e.currentTarget.style.borderColor='var(--c-border)'),
};

/* ════════════════════
   Modal succès formulaire
════════════════════ */
function SuccessModal({ onClose }: { onClose:()=>void }) {
  return (
    <div style={{ position:'fixed', inset:0, zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }} onClick={onClose}>
      <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.5)', backdropFilter:'blur(6px)' }}/>
      <div onClick={(e)=>e.stopPropagation()}
        style={{ position:'relative', background:'var(--c-bg2)', border:'1px solid var(--c-border)', borderRadius:20, padding:'2.5rem 2rem', maxWidth:380, width:'100%', textAlign:'center', boxShadow:'0 32px 80px rgba(0,0,0,.25)', animation:'bounceIn .35s cubic-bezier(.34,1.56,.64,1) both' }}>
        <button onClick={onClose} style={{ position:'absolute', top:14, right:14, background:'var(--c-bg3)', border:'1px solid var(--c-border)', borderRadius:'50%', width:30, height:30, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--c-muted)' }}>
          <X size={14}/>
        </button>
        <div style={{ width:68, height:68, borderRadius:'50%', background:'rgba(9,105,218,.1)', border:'2px solid rgba(9,105,218,.2)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1.5rem' }}>
          <CheckCircle2 size={36} strokeWidth={1.5} style={{ color:'var(--c-blue)' }}/>
        </div>
        <h3 style={{ fontFamily:'var(--ff-display)', fontSize:'1.2rem', fontWeight:700, color:'var(--c-ink)', marginBottom:'.5rem' }}>Message envoyé !</h3>
        <p style={{ fontSize:'.85rem', color:'var(--c-muted)', lineHeight:1.6 }}>
          Votre message a bien été reçu. Je vous répondrai dans les plus brefs délais.
        </p>
      </div>
    </div>
  );
}

/* ════════════════════
   Modal composition email → Gmail
════════════════════ */
function GmailModal({ to, onClose }: { to:string; onClose:()=>void }) {
  const [subject, setSubject] = useState('');
  const [body,    setBody]    = useState('');
  const [opened,  setOpened]  = useState(false);

  function openGmail() {
    const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setOpened(true);
  }

  return (
    <div style={{ position:'fixed', inset:0, zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }} onClick={onClose}>
      <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.5)', backdropFilter:'blur(6px)' }}/>
      <div onClick={(e)=>e.stopPropagation()}
        style={{ position:'relative', background:'var(--c-bg2)', border:'1px solid var(--c-border)', borderRadius:20, padding:'2rem', maxWidth:480, width:'100%', boxShadow:'0 32px 80px rgba(0,0,0,.25)', animation:'scaleIn .25s ease both' }}>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.5rem' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:38, height:38, borderRadius:10, background:'rgba(9,105,218,.1)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--c-blue)' }}>
              <Mail size={18}/>
            </div>
            <div>
              <h3 style={{ fontFamily:'var(--ff-display)', fontSize:'1rem', fontWeight:700, color:'var(--c-ink)', lineHeight:1 }}>Nouveau message</h3>
              <p style={{ fontSize:'.7rem', color:'var(--c-muted)', marginTop:2 }}>Pré-rempli dans Gmail</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background:'var(--c-bg3)', border:'1px solid var(--c-border)', borderRadius:'50%', width:30, height:30, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--c-muted)' }}>
            <X size={14}/>
          </button>
        </div>

        {opened ? (
          <div style={{ textAlign:'center', padding:'1.5rem 0' }}>
            <CheckCircle2 size={44} style={{ color:'var(--c-blue)', margin:'0 auto 1rem', display:'block' }}/>
            <p style={{ fontSize:'.9rem', fontWeight:700, color:'var(--c-ink)', marginBottom:'.4rem' }}>Gmail ouvert !</p>
            <p style={{ fontSize:'.8rem', color:'var(--c-muted)', marginBottom:'1.25rem' }}>Votre brouillon est pré-rempli. Envoyez-le depuis Gmail.</p>
            <button onClick={onClose} className="btn-primary" style={{ padding:'.65rem 1.5rem', fontSize:'.82rem' }}>Fermer</button>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
            <div>
              <label style={{ display:'block', fontSize:'.65rem', fontWeight:700, textTransform:'uppercase' as const, letterSpacing:'.1em', color:'var(--c-muted)', marginBottom:6 }}>À</label>
              <input value={to} readOnly style={{ ...INP, opacity:.65, cursor:'not-allowed' }}/>
            </div>
            <div>
              <label style={{ display:'block', fontSize:'.65rem', fontWeight:700, textTransform:'uppercase' as const, letterSpacing:'.1em', color:'var(--c-muted)', marginBottom:6 }}>Sujet</label>
              <input value={subject} onChange={(e)=>setSubject(e.target.value)} placeholder="Objet du message" style={INP} {...FO}/>
            </div>
            <div>
              <label style={{ display:'block', fontSize:'.65rem', fontWeight:700, textTransform:'uppercase' as const, letterSpacing:'.1em', color:'var(--c-muted)', marginBottom:6 }}>Message</label>
              <textarea value={body} onChange={(e)=>setBody(e.target.value)} rows={5} placeholder="Rédigez votre message..." style={{ ...INP, resize:'none' }} {...FO}/>
            </div>
            <button onClick={openGmail}
              style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'.8rem', borderRadius:10, border:'none', background:'var(--c-blue-dim)', color:'#fff', fontSize:'.875rem', fontWeight:700, cursor:'pointer', fontFamily:'var(--ff-body)', transition:'background .2s' }}
              onMouseEnter={(e)=>(e.currentTarget.style.background='var(--c-blue)')}
              onMouseLeave={(e)=>(e.currentTarget.style.background='var(--c-blue-dim)')}>
              <Mail size={16}/> Ouvrir dans Gmail
            </button>
            <p style={{ fontSize:'.68rem', color:'var(--c-muted)', textAlign:'center' }}>
              Le message sera pré-rempli dans Gmail pour l&apos;envoi final.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ════════════════════
   SECTION CONTACT
════════════════════ */
export function ContactSection({ profile }: { profile: Profile | null }) {
  const [status,      setStatus]      = useState<'idle'|'loading'|'err'>('idle');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showGmail,   setShowGmail]   = useState(false);

  const email  = profile?.email    || 'dondiegue21@gmail.com';
  const phone  = '+229 01 94 11 94 76';
  const loc    = profile?.location || 'Lokossa, Bénin';

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setStatus('loading');
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch('/api/contact', {
        method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setStatus('idle');
      setShowSuccess(true);
      (e.target as HTMLFormElement).reset();
    } catch { setStatus('err'); setTimeout(()=>setStatus('idle'), 4000); }
  }

  return (
    <section id="contact" style={{ padding:'5rem 0', borderTop:'1px solid var(--c-border)', background:'var(--c-bg3)' }}>

      {showSuccess && <SuccessModal onClose={()=>setShowSuccess(false)}/>}
      {showGmail   && <GmailModal  to={email} onClose={()=>setShowGmail(false)}/>}

      <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 2rem' }}>
        <div className="reveal" style={{ marginBottom:'3rem' }}>
          <p className="sec-label">CONTACT</p>
          <h2 className="sec-title">Contactez-moi</h2>
          <div className="sec-divider"/>
          <p style={{ fontSize:'.9rem', color:'var(--c-muted)' }}>Un projet, une opportunité, une question ? Écrivez-moi, je réponds rapidement.</p>
        </div>

        <div className="reveal contact-grid">

          {/* ── Infos ── */}
          <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
            <div style={{ background:'var(--c-bg2)', border:'1px solid var(--c-border)', borderRadius:14, padding:'1.5rem' }}>
              <h3 style={{ fontFamily:'var(--ff-display)', fontSize:'.95rem', fontWeight:700, color:'var(--c-ink)', marginBottom:'1.25rem' }}>Informations de contact</h3>
              {[
                { Icon:Mail,  label:'EMAIL',                val:email, href:`mailto:${email}` },
                { Icon:Phone, label:'TÉLÉPHONE / WHATSAPP', val:phone, href:`https://wa.me/22901941194` },
                { Icon:MapPin,label:'LOCALISATION',          val:loc,   href:null },
                { Icon:Clock, label:'DISPONIBILITÉ',         val:'Télétravail ou présentiel', href:null },
              ].map(({ Icon, label, val, href }) => (
                <div key={label} style={{ display:'flex', alignItems:'flex-start', gap:12, marginBottom:'1rem' }}>
                  <div style={{ width:36, height:36, flexShrink:0, background:'rgba(9,105,218,.08)', border:'1px solid rgba(9,105,218,.2)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--c-blue)' }}>
                    <Icon size={15}/>
                  </div>
                  <div>
                    <p style={{ fontSize:'.62rem', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase' as const, color:'var(--c-muted)', marginBottom:2 }}>{label}</p>
                    {href
                      ? <a href={href} target={href.startsWith('http')?'_blank':undefined} rel="noreferrer"
                          style={{ fontSize:'.86rem', fontWeight:500, color:'var(--c-ink)', textDecoration:'none', transition:'color .2s' }}
                          onMouseEnter={(e)=>(e.currentTarget.style.color='var(--c-blue)')}
                          onMouseLeave={(e)=>(e.currentTarget.style.color='var(--c-ink)')}>{val}</a>
                      : <p style={{ fontSize:'.86rem', fontWeight:500, color:'var(--c-ink)' }}>{val}</p>
                    }
                  </div>
                </div>
              ))}
            </div>

            {/* CTA — ouvre le modal Gmail */}
            <div style={{ background:'var(--c-bg2)', border:'1px solid var(--c-border)', borderRadius:14, padding:'1.5rem' }}>
              <h3 style={{ fontFamily:'var(--ff-display)', fontSize:'.95rem', fontWeight:700, color:'var(--c-ink)', marginBottom:'.5rem' }}>Travaillons ensemble</h3>
              <p style={{ fontSize:'.82rem', color:'var(--c-muted)', marginBottom:'1rem', lineHeight:1.6 }}>
                Disponible pour des missions freelance, des projets collaboratifs ou simplement échanger sur la tech.
              </p>
              {/* Bouton ouvre le modal de composition → Gmail */}
              <button
                onClick={() => setShowGmail(true)}
                className="btn-primary"
                style={{ fontSize:'.82rem', padding:'.65rem 1.25rem' }}>
                <Mail size={14}/> Envoyer un email
              </button>
            </div>
          </div>

          {/* ── Formulaire ── */}
          <form onSubmit={submit}
            style={{ background:'var(--c-bg2)', border:'1px solid var(--c-border)', borderRadius:14, padding:'2rem', display:'flex', flexDirection:'column', gap:'1.25rem' }}>
            <h3 style={{ fontFamily:'var(--ff-display)', fontSize:'.95rem', fontWeight:700, color:'var(--c-ink)' }}>Envoyer un message</h3>

            <div className="contact-form-row">
              <div>
                <label style={{ display:'block', fontSize:'.68rem', fontWeight:700, textTransform:'uppercase' as const, letterSpacing:'.1em', color:'var(--c-muted)', marginBottom:6 }}>Nom complet</label>
                <input name="full_name" required maxLength={100} style={INP} placeholder="Votre nom" {...FO}/>
              </div>
              <div>
                <label style={{ display:'block', fontSize:'.68rem', fontWeight:700, textTransform:'uppercase' as const, letterSpacing:'.1em', color:'var(--c-muted)', marginBottom:6 }}>Email</label>
                <input name="email" type="email" required style={INP} placeholder="email@exemple.com" {...FO}/>
              </div>
            </div>

            <div>
              <label style={{ display:'block', fontSize:'.68rem', fontWeight:700, textTransform:'uppercase' as const, letterSpacing:'.1em', color:'var(--c-muted)', marginBottom:6 }}>Sujet</label>
              <input name="subject" maxLength={150} style={INP} placeholder="Objet de votre message" {...FO}/>
            </div>

            <div>
              <label style={{ display:'block', fontSize:'.68rem', fontWeight:700, textTransform:'uppercase' as const, letterSpacing:'.1em', color:'var(--c-muted)', marginBottom:6 }}>Message</label>
              <textarea name="message" required rows={5} maxLength={2000} style={{ ...INP, resize:'none' }} placeholder="Décrivez votre projet ou votre question..." {...FO}/>
            </div>

            <button type="submit" disabled={status==='loading'} className="btn-primary"
              style={{ justifyContent:'center', opacity:status==='loading'?.6:1 }}>
              <Send size={15}/> {status==='loading'?'Envoi en cours...':'Envoyer le message'}
            </button>

            {status==='err' && (
              <div style={{ background:'rgba(207,34,46,.08)', border:'1px solid rgba(207,34,46,.3)', borderRadius:8, padding:'.75rem 1rem', fontSize:'.82rem', color:'#cf222e' }}>
                Erreur lors de l&apos;envoi. Réessayez ou écrivez directement à {email}.
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
