import { Monitor, Brain, Cpu, Server, Rocket, Users, GraduationCap, Globe2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Expertise { icon: LucideIcon; title: string; desc: string }

const EXPERTISES: Expertise[] = [
  { icon: Monitor, title: 'Applications web et mobiles', desc: "Interfaces modernes avec React, Next.js, Flutter et React Native, pensées pour l'ergonomie et la performance." },
  { icon: Brain, title: 'IA et automatisation', desc: "Intégration de modèles d'intelligence artificielle, modèles prédictifs et automatisation de processus métier." },
  { icon: Cpu, title: 'IoT et systèmes embarqués', desc: 'Conception de circuits programmables, Arduino, systèmes embarqués et déploiement de solutions IoT.' },
  { icon: Server, title: 'APIs et back-ends', desc: "Conception d'APIs REST avec FastAPI, Express et Laravel, avec une architecture sécurisée et évolutive." },
  { icon: Rocket, title: 'DevOps et déploiement', desc: 'Conteneurisation avec Docker, intégration continue, déploiement cloud et maintenance de serveurs.' },
  { icon: Users, title: 'Leadership et gestion de projet', desc: "Direction d'organisations technologiques, coordination d'équipes et conduite de projets en méthode agile." },
  { icon: GraduationCap, title: 'Formation et mentorat', desc: 'Formation de développeurs, encadrement de stagiaires, organisation d’ateliers et d’événements techniques.' },
  { icon: Globe2, title: 'Communautés techniques', desc: "Animation de communautés de développeurs, organisation de hackathons, réseau en Afrique de l'Ouest." },
];

export function ExpertisesSection() {
  return (
    <section id="expertises" style={{ borderTop: '1px solid var(--c-border)', background: 'var(--c-bg)' }}>
      <div className="sec-pad">
        <div className="reveal" style={{ marginBottom: '2.5rem' }}>
          <p className="sec-label">Expertises</p>
          <h2 className="sec-title">Domaines d&apos;intervention</h2>
          <div className="sec-divider" style={{ marginBottom: 0 }} />
        </div>

        <ul className="expertises-grid" style={{ listStyle: 'none' }}>
          {EXPERTISES.map(({ icon: Icon, title, desc }, idx) => (
            <li
              key={title}
              className="reveal card"
              style={{ transitionDelay: `${idx * 50}ms`, maxWidth: 'none', display: 'flex', flexDirection: 'column', gap: '.75rem' }}
            >
              <div className="icon-box">
                <Icon size={26} strokeWidth={1.75} aria-hidden />
              </div>
              <h3 style={{ fontSize: '1.2rem' }}>{title}</h3>
              <p style={{ fontSize: '1.02rem', lineHeight: 1.65, color: 'var(--c-muted)' }}>{desc}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}