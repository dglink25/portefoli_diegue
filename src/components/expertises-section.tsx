import {
  Monitor, Brain, Cpu, Server, Rocket, Users, GraduationCap, Globe2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Expertise { icon: LucideIcon; title: string; desc: string; }

const EXPERTISES: Expertise[] = [
  { icon: Monitor,        title: 'Applications Web & Mobile',  desc: 'Interfaces modernes et réactives avec React, Next.js, Flutter et React Native. UX soignée et performances optimisées.' },
  { icon: Brain,          title: 'IA & Automatisation',        desc: 'Solutions d\'intelligence artificielle, modèles prédictifs, intégration de modèles IA et automatisation de processus métier.' },
  { icon: Cpu,            title: 'IoT & Robotique',            desc: 'Conception de circuits programmables, initiation Arduino, systèmes embarqués et déploiement de solutions IoT.' },
  { icon: Server,         title: 'APIs & Backends',            desc: 'Conception d\'APIs REST robustes avec FastAPI, Express, Laravel. Architecture sécurisée et scalable.' },
  { icon: Rocket,         title: 'DevOps & Déploiement',       desc: 'Containerisation Docker, CI/CD, déploiement cloud. Gestion des infrastructures et maintenance serveurs.' },
  { icon: Users,          title: 'Leadership & Management',    desc: 'Direction d\'organisations tech à l\'échelle nationale. Coordination d\'équipes, planification et gestion de projets agile.' },
  { icon: GraduationCap,  title: 'Formation & Mentorat',       desc: 'Formation de développeurs, encadrement de stagiaires, organisation de workshops et d\'événements tech.' },
  { icon: Globe2,         title: 'Communautés Tech',           desc: 'Animation de communautés de développeurs, organisation d\'événements tech et hackathons, réseau Afrique de l\'Ouest.' },
];

export function ExpertisesSection() {
  return (
    <section id="expertises" style={{ padding: '5rem 0', borderTop: '1px solid var(--c-border)', background: 'var(--c-bg3)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
        <div className="reveal" style={{ marginBottom: '3rem' }}>
          <p className="sec-label">EXPERTISES</p>
          <h2 className="sec-title">Ce que je fais</h2>
          <div className="sec-divider" />
        </div>

        <div className="reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {EXPERTISES.map(({ icon: Icon, title, desc }, idx) => (
            <div
              key={title}
              className="exp-card"
              style={{ transitionDelay: `${idx * 40}ms` }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(9,105,218,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: 'var(--c-blue)', flexShrink: 0 }}>
                <Icon size={22} strokeWidth={1.75} />
              </div>
              <h3 style={{ fontFamily: 'var(--ff-display)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--c-ink)', marginBottom: '0.5rem' }}>{title}</h3>
              <p style={{ fontSize: '0.83rem', lineHeight: 1.65, color: 'var(--c-muted)' }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
