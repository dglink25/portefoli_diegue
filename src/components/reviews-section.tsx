'use client';

import { useState, useEffect, useRef } from 'react';
import { Star, Send, CheckCircle2, X, ChevronDown, ChevronUp, Users } from 'lucide-react';

interface Voter { voter_name: string; rating: number; created_at: string; }

interface Review {
  id: number; full_name: string; message: string; rating: number;
  created_at: string; peer_avg: number | null; peer_count: number;
}

function fmt(d: string, l: string) {
  return new Intl.DateTimeFormat(l, { year:'numeric', month:'long' }).format(new Date(d));
}

/* ── Stars ── */
function Stars({ value, size = 14 }: { value:number; size?:number }) {
  const full = Math.round(value);
  return (
    <div style={{ display:'flex', gap:2 }}>
      {[1,2,3,4,5].map((n) => (
        <Star key={n} size={size}
          style={{ fill: n<=full?'var(--c-blue)':'transparent', color: n<=full?'var(--c-blue)':'var(--c-border)', flexShrink:0 }} />
      ))}
    </div>
  );
}

/* ── Star picker ── */
function StarPicker({ value, onChange, size = 30 }: { value:number; onChange:(v:number)=>void; size?:number }) {
  const [hover, setHover] = useState(0);
  const labels = ['','Très mauvais','Mauvais','Correct','Bien','Excellent'];
  return (
    <div>
      <div style={{ display:'flex', gap:8, marginBottom:8 }}>
        {[1,2,3,4,5].map((n) => (
          <button key={n} type="button"
            onClick={() => onChange(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            style={{ background:'none', border:'none', cursor:'pointer', padding:2, lineHeight:1, transition:'transform .1s', transform: hover===n?'scale(1.3)':'scale(1)' }}>
            <Star size={size}
              style={{ fill: n<=(hover||value)?'var(--c-blue)':'transparent', color: n<=(hover||value)?'var(--c-blue)':'var(--c-border)', transition:'all .1s' }} />
          </button>
        ))}
      </div>
      <p style={{ fontSize:'.75rem', color:'var(--c-blue)', fontWeight:600, minHeight:'1rem' }}>
        {(hover||value) > 0 ? `${hover||value}/5 - ${labels[hover||value]}` : ''}
      </p>
    </div>
  );
}

/* ── Modal générique avec overlay ── */
function Modal({ onClose, children }: { onClose:()=>void; children:React.ReactNode }) {
  useEffect(() => {
    const esc = (e:KeyboardEvent) => e.key==='Escape' && onClose();
    document.addEventListener('keydown', esc);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', esc); document.body.style.overflow = ''; };
  }, [onClose]);

  return (
    <div style={{ position:'fixed', inset:0, zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}
      onClick={onClose}>
      <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.52)', backdropFilter:'blur(6px)' }}/>
      <div onClick={(e) => e.stopPropagation()} style={{ position:'relative', zIndex:1 }}>
        {children}
      </div>
    </div>
  );
}

/* ── Modal succès ── */
function SuccessModal({ title, subtitle, onClose }: { title:string; subtitle:string; onClose:()=>void }) {
  useEffect(() => { const t = setTimeout(onClose, 5000); return () => clearTimeout(t); }, [onClose]);
  return (
    <Modal onClose={onClose}>
      <div style={{ background:'var(--c-bg2)', border:'1px solid var(--c-border)', borderRadius:20, padding:'2.5rem 2rem 2rem', maxWidth:360, width:'100%', textAlign:'center', boxShadow:'0 32px 80px rgba(0,0,0,.3)', animation:'bounceIn .35s cubic-bezier(.34,1.56,.64,1) both' }}>
        <button onClick={onClose} style={{ position:'absolute', top:14, right:14, background:'var(--c-bg3)', border:'1px solid var(--c-border)', borderRadius:'50%', width:30, height:30, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--c-muted)' }}>
          <X size={14}/>
        </button>
        <div style={{ width:72, height:72, borderRadius:'50%', background:'rgba(9,105,218,.1)', border:'2px solid rgba(9,105,218,.2)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1.5rem' }}>
          <CheckCircle2 size={38} strokeWidth={1.5} style={{ color:'var(--c-blue)' }}/>
        </div>
        <h3 style={{ fontFamily:'var(--ff-display)', fontSize:'1.2rem', fontWeight:700, color:'var(--c-ink)', marginBottom:'.5rem' }}>{title}</h3>
        <p style={{ fontSize:'.85rem', color:'var(--c-muted)', lineHeight:1.6, marginBottom:'1.5rem' }}>{subtitle}</p>
        <div style={{ height:3, background:'var(--c-bg3)', borderRadius:99, overflow:'hidden' }}>
          <div style={{ height:'100%', background:'var(--c-blue)', borderRadius:99, animation:'shrinkWidth 5s linear forwards' }}/>
        </div>
        <p style={{ fontSize:'.65rem', color:'var(--c-muted)', marginTop:6 }}>Fermeture automatique…</p>
        <style>{`@keyframes shrinkWidth{from{width:100%}to{width:0%}}`}</style>
      </div>
    </Modal>
  );
}

/* ── Modal notation d'un avis ── */
function RateModal({ review, locale, onClose, onDone }: { review:Review; locale:string; onClose:()=>void; onDone:()=>void }) {
  const [name,    setName]    = useState('');
  const [rating,  setRating]  = useState(5);
  const [loading, setLoading] = useState(false);
  const [err,     setErr]     = useState('');

  async function submit(e:React.FormEvent) {
    e.preventDefault(); setLoading(true); setErr('');
    try {
      const res = await fetch(`/api/reviews/${review.id}/rate`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ voter_name:name, rating }),
      });
      if (!res.ok) throw new Error();
      onDone();
      onClose();
    } catch { setErr(locale==='en'?'Error. Try again.':'Erreur. Réessayez.'); setLoading(false); }
  }

  return (
    <Modal onClose={onClose}>
      <div style={{ background:'var(--c-bg2)', border:'1px solid var(--c-border)', borderRadius:16, padding:'2rem', maxWidth:420, width:'100%', boxShadow:'0 24px 60px rgba(0,0,0,.25)', animation:'scaleIn .25s ease both' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1rem' }}>
          <h3 style={{ fontFamily:'var(--ff-display)', fontSize:'1rem', fontWeight:700, color:'var(--c-ink)' }}>
            {locale==='en'?'Rate this review':'Noter cet avis'}
          </h3>
          <button onClick={onClose} style={{ background:'var(--c-bg3)', border:'1px solid var(--c-border)', borderRadius:'50%', width:30, height:30, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--c-muted)' }}>
            <X size={14}/>
          </button>
        </div>
        <div style={{ background:'var(--c-bg3)', borderRadius:10, padding:'.75rem 1rem', marginBottom:'1.25rem', borderLeft:'3px solid var(--c-blue)' }}>
          <p style={{ fontSize:'.82rem', fontWeight:600, color:'var(--c-ink)', marginBottom:2 }}>{review.full_name}</p>
          <p style={{ fontSize:'.78rem', color:'var(--c-muted)' }}>{review.message.slice(0,80)}{review.message.length>80?'…':''}</p>
        </div>
        <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
          <div>
            <label style={{ display:'block', fontSize:'.68rem', fontWeight:700, textTransform:'uppercase' as const, letterSpacing:'.1em', color:'var(--c-muted)', marginBottom:10 }}>
              {locale==='en'?'Your rating':'Votre note'}
            </label>
            <StarPicker value={rating} onChange={setRating} size={32}/>
          </div>
          <div>
            <label style={{ display:'block', fontSize:'.68rem', fontWeight:700, textTransform:'uppercase' as const, letterSpacing:'.1em', color:'var(--c-muted)', marginBottom:8 }}>
              {locale==='en'?'Your name':'Votre prénom'}
            </label>
            <input required maxLength={60} value={name} onChange={(e)=>setName(e.target.value)}
              placeholder={locale==='en'?'First name...':'Prénom...'}
              style={{ width:'100%', background:'var(--c-bg3)', border:'1px solid var(--c-border)', borderRadius:8, color:'var(--c-ink)', padding:'.7rem 1rem', fontSize:'.875rem', fontFamily:'var(--ff-body)', outline:'none', transition:'border-color .2s' }}
              onFocus={(e)=>(e.currentTarget.style.borderColor='var(--c-blue)')}
              onBlur={(e)=>(e.currentTarget.style.borderColor='var(--c-border)')}/>
          </div>
          {err && <p style={{ fontSize:'.78rem', color:'#cf222e' }}>{err}</p>}
          <button type="submit" disabled={loading}
            style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'.8rem', borderRadius:10, border:'none', background:'var(--c-blue-dim)', color:'#fff', fontSize:'.875rem', fontWeight:700, cursor:loading?'not-allowed':'pointer', fontFamily:'var(--ff-body)', opacity:loading?.7:1, transition:'background .2s' }}
            onMouseEnter={(e)=>{ if(!loading) e.currentTarget.style.background='var(--c-blue)'; }}
            onMouseLeave={(e)=>{ e.currentTarget.style.background='var(--c-blue-dim)'; }}>
            <CheckCircle2 size={16}/>
            {loading?'...':(locale==='en'?'Submit rating':'Envoyer ma note')}
          </button>
        </form>
      </div>
    </Modal>
  );
}

/* ── Modal liste des votants ── */
function VotersModal({ reviewId, reviewName, locale, onClose }: { reviewId:number; reviewName:string; locale:string; onClose:()=>void }) {
  const [voters,  setVoters]  = useState<Voter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/reviews/${reviewId}/rate`)
      .then((r) => r.json())
      .then((d) => { setVoters(d.ratings ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [reviewId]);

  const avg = voters.length ? voters.reduce((s,v)=>s+v.rating,0)/voters.length : 0;

  return (
    <Modal onClose={onClose}>
      <div style={{ background:'var(--c-bg2)', border:'1px solid var(--c-border)', borderRadius:16, padding:'1.75rem', maxWidth:420, width:'100%', maxHeight:'80vh', display:'flex', flexDirection:'column', boxShadow:'0 24px 60px rgba(0,0,0,.25)', animation:'scaleIn .25s ease both' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1rem', flexShrink:0 }}>
          <div>
            <h3 style={{ fontFamily:'var(--ff-display)', fontSize:'1rem', fontWeight:700, color:'var(--c-ink)', marginBottom:2 }}>
              {locale==='en'?'Community ratings':'Notes de la communauté'}
            </h3>
            <p style={{ fontSize:'.75rem', color:'var(--c-muted)' }}>{locale==='en'?`"${reviewName}"`:`Avis de ${reviewName}`}</p>
          </div>
          <button onClick={onClose} style={{ background:'var(--c-bg3)', border:'1px solid var(--c-border)', borderRadius:'50%', width:30, height:30, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--c-muted)', flexShrink:0 }}>
            <X size={14}/>
          </button>
        </div>

        {/* Moyenne */}
        {voters.length > 0 && (
          <div style={{ display:'flex', alignItems:'center', gap:12, background:'var(--c-bg3)', borderRadius:10, padding:'.75rem 1rem', marginBottom:'1rem', flexShrink:0 }}>
            <span style={{ fontFamily:'var(--ff-display)', fontSize:'1.8rem', fontWeight:700, color:'var(--c-blue)' }}>{avg.toFixed(1)}</span>
            <div>
              <Stars value={avg} size={16}/>
              <p style={{ fontSize:'.7rem', color:'var(--c-muted)', marginTop:3 }}>{voters.length} vote{voters.length>1?'s':''}</p>
            </div>
          </div>
        )}

        {/* Liste scrollable */}
        <div style={{ overflowY:'auto', flex:1 }}>
          {loading ? (
            <p style={{ textAlign:'center', color:'var(--c-muted)', padding:'2rem', fontSize:'.85rem' }}>Chargement…</p>
          ) : voters.length === 0 ? (
            <div style={{ textAlign:'center', padding:'2rem' }}>
              <Users size={36} strokeWidth={1} style={{ color:'var(--c-border)', margin:'0 auto 1rem', display:'block' }}/>
              <p style={{ fontSize:'.85rem', color:'var(--c-muted)' }}>
                {locale==='en'?'No ratings yet.':'Aucune note pour le moment.'}
              </p>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:'.5rem' }}>
              {voters.map((v, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'.65rem 1rem', borderRadius:8, background:'var(--c-bg3)', transition:'background .2s' }}
                  onMouseEnter={(e)=>((e.currentTarget as HTMLElement).style.background='var(--c-bg)')}
                  onMouseLeave={(e)=>((e.currentTarget as HTMLElement).style.background='var(--c-bg3)')}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{ width:32, height:32, borderRadius:'50%', background:'var(--c-blue-dim)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontFamily:'var(--ff-display)', fontWeight:700, fontSize:'.85rem', flexShrink:0 }}>
                      {v.voter_name.charAt(0).toUpperCase()}
                    </div>
                    <p style={{ fontSize:'.85rem', fontWeight:600, color:'var(--c-ink)' }}>{v.voter_name}</p>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <Stars value={v.rating} size={13}/>
                    <span style={{ fontSize:'.72rem', fontWeight:700, color:'var(--c-blue)' }}>{v.rating}/5</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

/* ════════════════════════════
   SECTION PRINCIPALE
════════════════════════════ */
const PAGE_SIZE = 3;

export function ReviewsSection({ reviews: _initial, locale }: { reviews: Review[]; locale: string }) {
  /* On ignore les props SSR et on fetch toujours côté client pour avoir les données fraîches */
  const [reviews,     setReviews]     = useState<Review[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [visible,     setVisible]     = useState(PAGE_SIZE);
  const [name,        setName]        = useState('');
  const [msg,         setMsg]         = useState('');
  const [submitting,  setSubmitting]  = useState(false);
  const [submitErr,   setSubmitErr]   = useState('');
  const [successData, setSuccessData] = useState<{title:string;subtitle:string}|null>(null);
  const [ratingReview, setRatingReview] = useState<Review|null>(null);
  const [voterReview,  setVoterReview]  = useState<Review|null>(null);

  /* Fetch initial et après chaque action */
  async function fetchReviews() {
    try {
      const res = await fetch('/api/reviews', { cache: 'no-store' });
      const d   = await res.json();
      if (d.reviews) setReviews(d.reviews);
    } catch {}
    finally { setLoading(false); }
  }

  useEffect(() => { fetchReviews(); }, []);

  /* Calculs */
  const avg        = reviews.length ? reviews.reduce((s,r)=>s+r.rating,0)/reviews.length : 0;
  const totalVotes = reviews.reduce((s,r)=>s+(r.peer_count||0), 0);
  const shown      = reviews.slice(0, visible);

  /* Soumettre un avis */
  async function submit(e:React.FormEvent) {
    e.preventDefault();
    setSubmitting(true); setSubmitErr('');
    try {
      const res = await fetch('/api/reviews', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ full_name:name, message:msg }),
      });
      if (!res.ok) throw new Error();
      setName(''); setMsg('');
      /* Rafraîchit sans recharger la page */
      await fetchReviews();
      setVisible(PAGE_SIZE);
      setSuccessData({
        title:    locale==='en'?'Review published!':'Avis publié !',
        subtitle: locale==='en'?'Your review is now visible.':'Votre avis est maintenant visible.',
      });
    } catch { setSubmitErr(locale==='en'?'Error. Try again.':'Erreur. Veuillez réessayer.'); }
    finally { setSubmitting(false); }
  }

  return (
    <section id="reviews" className="sec-pad" style={{ borderTop:'1px solid var(--c-border)', background:'var(--c-bg)' }}>

      {/* Modals */}
      {successData && <SuccessModal title={successData.title} subtitle={successData.subtitle} onClose={()=>setSuccessData(null)}/>}
      {ratingReview && (
        <RateModal review={ratingReview} locale={locale}
          onClose={() => setRatingReview(null)}
          onDone={async () => {
            await fetchReviews();
            setSuccessData({ title: locale==='en'?'Rating submitted!':'Note envoyée !', subtitle: locale==='en'?'Thank you!':'Merci pour votre contribution.' });
          }}/>
      )}
      {voterReview && (
        <VotersModal reviewId={voterReview.id} reviewName={voterReview.full_name} locale={locale} onClose={()=>setVoterReview(null)}/>
      )}

      <div style={{ maxWidth:1200, margin:'0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom:'2.5rem', animation:'fadeUp .5s ease both' }}>
          <p className="sec-label">{locale==='en'?'TESTIMONIALS':'TÉMOIGNAGES'}</p>
          <h2 className="sec-title">{locale==='en'?'Reviews':'Avis'}</h2>
          <div className="animated-line" style={{ width:'3rem', marginTop:'.75rem' }}/>
        </div>

        {/* Badge moyenne + votes totaux */}
        {reviews.length > 0 && (
          <div style={{ display:'flex', flexWrap:'wrap', gap:'1rem', marginBottom:'2rem', animation:'fadeUp .6s ease both' }}>
            {/* Moyenne des avis */}
            <div style={{ display:'inline-flex', alignItems:'center', gap:'1rem', background:'var(--c-bg3)', border:'1px solid var(--c-border)', borderRadius:12, padding:'.875rem 1.5rem' }}>
              <span style={{ fontFamily:'var(--ff-display)', fontSize:'2.5rem', fontWeight:700, color:'var(--c-blue)' }}>{avg.toFixed(1)}</span>
              <div>
                <Stars value={avg} size={18}/>
                <p style={{ fontSize:'.72rem', color:'var(--c-muted)', marginTop:4 }}>
                  {reviews.length} {locale==='en'?`review${reviews.length>1?'s':''} · out of 5`:'avis · sur 5'}
                </p>
              </div>
            </div>
            {/* Nombre total de votes communautaires */}
            {totalVotes > 0 && (
              <div style={{ display:'inline-flex', alignItems:'center', gap:10, background:'var(--c-bg3)', border:'1px solid var(--c-border)', borderRadius:12, padding:'.875rem 1.5rem' }}>
                <Users size={22} style={{ color:'var(--c-blue)' }}/>
                <div>
                  <p style={{ fontFamily:'var(--ff-display)', fontSize:'1.4rem', fontWeight:700, color:'var(--c-blue)', lineHeight:1 }}>{totalVotes}</p>
                  <p style={{ fontSize:'.72rem', color:'var(--c-muted)', marginTop:4 }}>
                    {locale==='en'?'community votes':'votes communautaires'}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="reviews-grid">

          {/* ── Liste ── */}
          <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>

            {loading ? (
              /* Skeleton */
              [1,2,3].map((i) => (
                <div key={i} style={{ borderRadius:14, border:'1px solid var(--c-border)', background:'var(--c-bg3)', padding:'1.25rem', animation:'pulse .8s ease infinite alternate', height:120 }}/>
              ))
            ) : reviews.length === 0 ? (
              <p style={{ fontSize:'.9rem', color:'var(--c-muted)' }}>
                {locale==='en'?'Be the first to leave a review.':'Soyez le premier à laisser un avis.'}
              </p>
            ) : (
              <>
                {shown.map((r, i) => (
                  <div key={r.id}
                    style={{ background:'var(--c-bg3)', border:'1px solid var(--c-border)', borderRadius:14, padding:'1.25rem', transition:'border-color .25s, box-shadow .25s', animation:`fadeUp .5s ease both ${i * 80}ms` }}
                    onMouseEnter={(e)=>{ const el=e.currentTarget as HTMLElement; el.style.borderColor='var(--c-blue)'; el.style.boxShadow='0 4px 16px var(--c-shadow)'; }}
                    onMouseLeave={(e)=>{ const el=e.currentTarget as HTMLElement; el.style.borderColor='var(--c-border)'; el.style.boxShadow='none'; }}>

                    {/* Header */}
                    <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12, marginBottom:'.75rem' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                        <div style={{ width:42, height:42, borderRadius:'50%', background:'var(--c-blue-dim)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--ff-display)', fontWeight:700, color:'#fff', fontSize:'1.05rem', flexShrink:0 }}>
                          {r.full_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p style={{ fontSize:'.9rem', fontWeight:700, color:'var(--c-ink)' }}>{r.full_name}</p>
                          <Stars value={r.rating} size={12}/>
                        </div>
                      </div>
                      <span style={{ fontSize:'.72rem', color:'var(--c-muted)', flexShrink:0 }}>{fmt(r.created_at, locale)}</span>
                    </div>

                    {/* Message */}
                    <p style={{ fontSize:'.88rem', lineHeight:1.7, color:'var(--c-muted)', marginBottom:'1rem' }}>{r.message}</p>

                    {/* Footer */}
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:8, paddingTop:'.75rem', borderTop:'1px solid var(--c-border)' }}>

                      {/* Votes communautaires - cliquable */}
                      <button
                        onClick={() => setVoterReview(r)}
                        style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'none', cursor: r.peer_count>0?'pointer':'default', padding:0, fontFamily:'var(--ff-body)', transition:'opacity .2s' }}
                        onMouseEnter={(e)=>{ if(r.peer_count>0) e.currentTarget.style.opacity='.7'; }}
                        onMouseLeave={(e)=>{ e.currentTarget.style.opacity='1'; }}>
                        {r.peer_count > 0 ? (
                          <>
                            <Stars value={r.peer_avg??0} size={12}/>
                            <span style={{ fontSize:'.7rem', color:'var(--c-blue)', fontWeight:600, textDecoration:'underline', textDecorationStyle:'dotted' }}>
                              {(r.peer_avg??0).toFixed(1)} · {r.peer_count} vote{r.peer_count>1?'s':''}
                            </span>
                          </>
                        ) : (
                          <span style={{ fontSize:'.7rem', color:'var(--c-muted)', fontStyle:'italic' }}>
                            {locale==='en'?'Not yet rated':'Pas encore noté'}
                          </span>
                        )}
                      </button>

                      {/* Bouton noter */}
                      <button
                        onClick={() => setRatingReview(r)}
                        style={{ display:'flex', alignItems:'center', gap:6, background:'var(--c-bg2)', border:'1px solid var(--c-border)', borderRadius:8, padding:'5px 12px', cursor:'pointer', fontSize:'.75rem', fontWeight:600, color:'var(--c-muted)', fontFamily:'var(--ff-body)', transition:'all .2s' }}
                        onMouseEnter={(e)=>{ const el=e.currentTarget; el.style.borderColor='var(--c-blue)'; el.style.color='var(--c-blue)'; el.style.background='rgba(9,105,218,.05)'; }}
                        onMouseLeave={(e)=>{ const el=e.currentTarget; el.style.borderColor='var(--c-border)'; el.style.color='var(--c-muted)'; el.style.background='var(--c-bg2)'; }}>
                        <Star size={12}/>
                        {locale==='en'?'Rate this review':'Noter cet avis'}
                      </button>
                    </div>
                  </div>
                ))}

                {/* Voir plus / Réduire */}
                <div style={{ display:'flex', justifyContent:'center', gap:8, marginTop:'.5rem' }}>
                  {visible < reviews.length && (
                    <button
                      onClick={() => setVisible((v) => v + PAGE_SIZE)}
                      style={{ display:'flex', alignItems:'center', gap:8, padding:'.65rem 1.5rem', borderRadius:10, border:'1px solid var(--c-border)', background:'var(--c-bg2)', cursor:'pointer', fontSize:'.82rem', fontWeight:600, color:'var(--c-muted)', fontFamily:'var(--ff-body)', transition:'all .2s' }}
                      onMouseEnter={(e)=>{ const el=e.currentTarget; el.style.borderColor='var(--c-blue)'; el.style.color='var(--c-blue)'; }}
                      onMouseLeave={(e)=>{ const el=e.currentTarget; el.style.borderColor='var(--c-border)'; el.style.color='var(--c-muted)'; }}>
                      <ChevronDown size={16}/>
                      {locale==='en'?`See more (${reviews.length-visible} left)`:`Voir plus (${reviews.length-visible} restant${reviews.length-visible>1?'s':''})`}
                    </button>
                  )}
                  {visible > PAGE_SIZE && (
                    <button
                      onClick={() => setVisible(PAGE_SIZE)}
                      style={{ display:'flex', alignItems:'center', gap:8, padding:'.65rem 1.5rem', borderRadius:10, border:'1px solid var(--c-border)', background:'var(--c-bg2)', cursor:'pointer', fontSize:'.82rem', fontWeight:600, color:'var(--c-muted)', fontFamily:'var(--ff-body)', transition:'all .2s' }}
                      onMouseEnter={(e)=>{ const el=e.currentTarget; el.style.borderColor='var(--c-blue)'; el.style.color='var(--c-blue)'; }}
                      onMouseLeave={(e)=>{ const el=e.currentTarget; el.style.borderColor='var(--c-border)'; el.style.color='var(--c-muted)'; }}>
                      <ChevronUp size={16}/>
                      {locale==='en'?'Show less':'Réduire'}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>

          {/* ── Formulaire ── */}
          <form onSubmit={submit}
            style={{ background:'var(--c-bg2)', border:'1px solid var(--c-border)', borderRadius:16, padding:'1.75rem', display:'flex', flexDirection:'column', gap:'1.25rem', position:'sticky', top:80, boxShadow:'0 4px 20px var(--c-shadow)', animation:'fadeUp .6s ease both .1s' }}>
            <div>
              <h3 style={{ fontFamily:'var(--ff-display)', fontSize:'1.05rem', fontWeight:700, color:'var(--c-ink)', marginBottom:'.35rem' }}>
                {locale==='en'?'Leave a review':'Laisser un avis'}
              </h3>
              <p style={{ fontSize:'.78rem', color:'var(--c-muted)' }}>
                {locale==='en'?'Published immediately.':'Publié immédiatement.'}
              </p>
            </div>
            <div>
              <label style={{ display:'block', fontSize:'.68rem', fontWeight:700, textTransform:'uppercase' as const, letterSpacing:'.1em', color:'var(--c-muted)', marginBottom:8 }}>
                {locale==='en'?'Full name':'Nom complet'}
              </label>
              <input required maxLength={100} value={name} onChange={(e)=>setName(e.target.value)}
                placeholder={locale==='en'?'Your name...':'Votre nom...'}
                style={{ width:'100%', background:'var(--c-bg3)', border:'1px solid var(--c-border)', borderRadius:10, color:'var(--c-ink)', padding:'.75rem 1rem', fontSize:'.875rem', fontFamily:'var(--ff-body)', outline:'none', transition:'border-color .2s' }}
                onFocus={(e)=>(e.currentTarget.style.borderColor='var(--c-blue)')}
                onBlur={(e)=>(e.currentTarget.style.borderColor='var(--c-border)')}/>
            </div>
            <div>
              <label style={{ display:'block', fontSize:'.68rem', fontWeight:700, textTransform:'uppercase' as const, letterSpacing:'.1em', color:'var(--c-muted)', marginBottom:8 }}>
                Message
              </label>
              <textarea required rows={4} maxLength={600} value={msg} onChange={(e)=>setMsg(e.target.value)}
                placeholder={locale==='en'?'Share your experience...':'Partagez votre expérience...'}
                style={{ width:'100%', background:'var(--c-bg3)', border:'1px solid var(--c-border)', borderRadius:10, color:'var(--c-ink)', padding:'.75rem 1rem', fontSize:'.875rem', fontFamily:'var(--ff-body)', outline:'none', transition:'border-color .2s', resize:'none' }}
                onFocus={(e)=>(e.currentTarget.style.borderColor='var(--c-blue)')}
                onBlur={(e)=>(e.currentTarget.style.borderColor='var(--c-border)')}/>
              <p style={{ fontSize:'.65rem', color:'var(--c-muted)', marginTop:4, textAlign:'right' }}>{msg.length}/600</p>
            </div>
            <button type="submit" disabled={submitting}
              style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, width:'100%', padding:'.875rem 1.5rem', background:'var(--c-blue-dim)', color:'#fff', fontFamily:'var(--ff-body)', fontSize:'.9rem', fontWeight:700, border:'none', borderRadius:10, cursor:submitting?'not-allowed':'pointer', transition:'all .25s', opacity:submitting?.7:1 }}
              onMouseEnter={(e)=>{ if(!submitting) e.currentTarget.style.background='var(--c-blue)'; }}
              onMouseLeave={(e)=>{ e.currentTarget.style.background='var(--c-blue-dim)'; }}>
              <Send size={16}/>
              {submitting?(locale==='en'?'Sending...':'Envoi...'):(locale==='en'?'Publish review':"Publier l'avis")}
            </button>
            {submitErr && (
              <div style={{ background:'rgba(207,34,46,.08)', border:'1px solid rgba(207,34,46,.25)', borderRadius:8, padding:'.6rem 1rem', fontSize:'.82rem', color:'#cf222e' }}>
                {submitErr}
              </div>
            )}
          </form>
        </div>
      </div>

      <style>{`
        @keyframes pulse { from{opacity:1} to{opacity:.5} }
      `}</style>
    </section>
  );
}
