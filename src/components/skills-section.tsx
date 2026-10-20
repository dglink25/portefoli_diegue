'use client';

import { useState } from 'react';
import { Code2 } from 'lucide-react';
import type { Skill } from '@/types';

const DEVICON = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons';

/* Les deux icônes qui renvoyaient 403 sont servies depuis /public/icons */
const SKILL_ICONS: Record<string, string> = {
  JavaScript: `${DEVICON}/javascript/javascript-original.svg`,
  TypeScript: `${DEVICON}/typescript/typescript-original.svg`,
  Python: `${DEVICON}/python/python-original.svg`,
  Dart: `${DEVICON}/dart/dart-original.svg`,
  PHP: `${DEVICON}/php/php-original.svg`,
  'C++': `${DEVICON}/cplusplus/cplusplus-original.svg`,
  Java: `${DEVICON}/java/java-original.svg`,
  React: `${DEVICON}/react/react-original.svg`,
  'Next.js': `${DEVICON}/nextjs/nextjs-original.svg`,
  Flutter: `${DEVICON}/flutter/flutter-original.svg`,
  'React Native': `${DEVICON}/react/react-original.svg`,
  FastAPI: `${DEVICON}/fastapi/fastapi-original.svg`,
  Laravel: '/icons/laravel.svg',
  Express: `${DEVICON}/express/express-original.svg`,
  PostgreSQL: `${DEVICON}/postgresql/postgresql-original.svg`,
  MySQL: `${DEVICON}/mysql/mysql-original.svg`,
  MongoDB: `${DEVICON}/mongodb/mongodb-original.svg`,
  Docker: `${DEVICON}/docker/docker-original.svg`,
  Git: `${DEVICON}/git/git-original.svg`,
  VSCode: `${DEVICON}/vscode/vscode-original.svg`,
  Postman: `${DEVICON}/postman/postman-original.svg`,
  Arduino: `${DEVICON}/arduino/arduino-original.svg`,
  HTML5: `${DEVICON}/html5/html5-original.svg`,
  CSS3: `${DEVICON}/css3/css3-original.svg`,
  'Tailwind CSS': '/icons/tailwindcss.svg',
  Bootstrap: `${DEVICON}/bootstrap/bootstrap-original.svg`,
  Figma: `${DEVICON}/figma/figma-original.svg`,
  Linux: `${DEVICON}/linux/linux-original.svg`,
  Nginx: `${DEVICON}/nginx/nginx-original.svg`,
  Firebase: `${DEVICON}/firebase/firebase-plain.svg`,
  'Intelligence Artificielle': `${DEVICON}/tensorflow/tensorflow-original.svg`,
  IoT: `${DEVICON}/arduino/arduino-original.svg`,
};

const DEFAULT_GROUPS: Record<string, string[]> = {
  'Langages': ['JavaScript', 'TypeScript', 'Python', 'Dart', 'PHP', 'C++'],
  'Front-end': ['React', 'Next.js', 'Flutter', 'React Native', 'Tailwind CSS', 'Bootstrap', 'Figma'],
  'Back-end et frameworks': ['FastAPI', 'Laravel', 'Express'],
  'Bases de données': ['PostgreSQL', 'MySQL', 'MongoDB'],
  'DevOps et outils': ['Docker', 'Git', 'VSCode', 'Postman', 'Linux', 'Firebase'],
  'IA et IoT': ['Intelligence Artificielle', 'Arduino', 'IoT'],
};

function SkillIcon({ url }: { url?: string }) {
  const [failed, setFailed] = useState(false);
  if (!url || failed) return <Code2 size={36} aria-hidden style={{ color: 'var(--c-blue)' }} />;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={url} alt="" width={44} height={44} loading="lazy" onError={() => setFailed(true)} />;
}

export function SkillsSection({ skills }: { skills: Skill[] }) {
  const groups: [string, string[]][] =
    skills.length > 0
      ? Object.entries(
          skills.reduce<Record<string, string[]>>((acc, s) => {
            (acc[s.category] ??= []).push(s.name);
            return acc;
          }, {})
        )
      : Object.entries(DEFAULT_GROUPS);

  return (
    <section id="skills" style={{ borderTop: '1px solid var(--c-border)', background: 'var(--c-bg2)' }}>
      <div className="sec-pad">
        <div className="reveal" style={{ marginBottom: '2.5rem' }}>
          <p className="sec-label">Compétences</p>
          <h2 className="sec-title">Outils et technologies</h2>
          <div className="sec-divider" />
          <p style={{ fontSize: '1.1rem', color: 'var(--c-muted)' }}>
            Langages, frameworks et outils utilisés au quotidien.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {groups.map(([cat, names]) => (
            <div key={cat} className="reveal">
              <h3
                style={{ fontSize: '1.2rem', paddingBottom: '.6rem', marginBottom: '1.1rem', borderBottom: '1px solid var(--c-border)', textTransform: 'none' }}
              >
                {cat}
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: '.9rem' }}>
                {names.map((name) => (
                  <li key={name} className="skill-chip" style={{ maxWidth: 'none' }}>
                    <SkillIcon url={SKILL_ICONS[name]} />
                    <span>{name}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}