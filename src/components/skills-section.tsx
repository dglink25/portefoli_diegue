import type { Skill } from '@/types';
import { Code2 } from 'lucide-react';

/* Icon URLs from devicons CDN */
const SKILL_ICONS: Record<string, string> = {
  'JavaScript':           'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
  'TypeScript':           'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
  'Python':               'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
  'Dart':                 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg',
  'PHP':                  'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg',
  'C++':                  'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg',
  'Java':                 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
  'React':                'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
  'Next.js':              'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
  'Flutter':              'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg',
  'React Native':         'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
  'FastAPI':              'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg',
  'Laravel':              'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-plain.svg',
  'Express':              'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg',
  'PostgreSQL':           'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
  'MySQL':                'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
  'MongoDB':              'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
  'Docker':               'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
  'Git':                  'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
  'VSCode':               'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg',
  'Postman':              'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg',
  'Arduino':              'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/arduino/arduino-original.svg',
  'HTML5':                'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
  'CSS3':                 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
  'Tailwind CSS':         'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg',
  'Bootstrap':            'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg',
  'Figma':                'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg',
  'Linux':                'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg',
  'Nginx':                'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nginx/nginx-original.svg',
  'Firebase':             'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg',
  'Intelligence Artificielle': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg',
  'IoT':                  'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/arduino/arduino-original.svg',
};

export function SkillsSection({ skills }: { skills: Skill[] }) {
  const byCategory = skills.reduce<Record<string, Skill[]>>((acc, s) => {
    (acc[s.category] ??= []).push(s);
    return acc;
  }, {});

  /* Fallback categories if DB empty */
  const defaultCategories: Record<string, string[]> = {
    'LANGAGES & CORE': ['JavaScript', 'TypeScript', 'Python', 'Dart', 'PHP', 'C++'],
    'FRONTEND': ['React', 'Next.js', 'Flutter', 'React Native', 'Tailwind CSS', 'Bootstrap', 'Figma'],
    'BACKEND & FRAMEWORKS': ['FastAPI', 'Laravel', 'Express'],
    'BASES DE DONNÉES': ['PostgreSQL', 'MySQL', 'MongoDB'],
    'DEVOPS & OUTILS': ['Docker', 'Git', 'VSCode', 'Postman', 'Linux', 'Firebase'],
    'IA & IOT': ['Intelligence Artificielle', 'Arduino', 'IoT'],
  };

  const hasData = skills.length > 0;

  return (
    <section id="skills" style={{ padding: '5rem 0', borderTop: '1px solid var(--c-border)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
        <div className="reveal" style={{ marginBottom: '3rem' }}>
          <p className="sec-label">COMPÉTENCES</p>
          <h2 className="sec-title">Toolbox</h2>
          <div className="sec-divider" />
          <p style={{ fontSize: '0.9rem', color: 'var(--c-muted)' }}>Les langages, frameworks et outils que j&apos;utilise au quotidien.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {hasData
            ? Object.entries(byCategory).map(([cat, items]) => (
                <div key={cat} className="reveal">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--c-muted)' }}>{cat}</span>
                    <div style={{ flex: 1, height: 1, background: 'var(--c-border)' }} />
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                    {items.map((skill) => {
                      const iconUrl = SKILL_ICONS[skill.name];
                      return (
                        <div key={skill.id} className="skill-chip">
                          {iconUrl
                            ? <img src={iconUrl} alt={skill.name} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                            : <Code2 size={20} style={{ color: 'var(--c-blue)' }} />
                          }
                          {skill.name}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            : Object.entries(defaultCategories).map(([cat, names]) => (
                <div key={cat} className="reveal">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--c-muted)' }}>{cat}</span>
                    <div style={{ flex: 1, height: 1, background: 'var(--c-border)' }} />
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                    {names.map((name) => {
                      const iconUrl = SKILL_ICONS[name];
                      return (
                        <div key={name} className="skill-chip">
                          {iconUrl
                            ? <img src={iconUrl} alt={name} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                            : <Code2 size={20} style={{ color: 'var(--c-blue)' }} />
                          }
                          {name}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
          }
        </div>
      </div>
    </section>
  );
}
