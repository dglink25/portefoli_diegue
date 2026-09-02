'use client';

import { useTranslations } from 'next-intl';
import { Github, Linkedin, Mail, Heart } from 'lucide-react';

export function Footer() {
  const t = useTranslations('footer');
  const year = new Date().getFullYear();

  const links = [
    { href: '#about', label: 'À propos' },
    { href: '#skills', label: 'Compétences' },
    { href: '#projects', label: 'Projets' },
    { href: '#experience', label: 'Parcours' },
    { href: '#contact', label: 'Contact' },
  ];

  return (
    <footer className="border-t border-border-light bg-surface-light dark:border-border-dark dark:bg-surface-dark">
      <div className="mx-auto max-w-content px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-3">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <p className="font-display text-xl font-bold">
              <span className="text-primary">D</span>iègue
            </p>
            <p className="max-w-[22ch] text-sm" style={{ color: 'var(--c-muted)' }}>
              Développeur Full-Stack &amp; IA · Bénin
            </p>
            <div className="flex gap-3 mt-1">
              <a href="https://github.com" target="_blank" rel="noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border-light text-muted-light transition-all hover:border-primary hover:text-primary dark:border-border-dark dark:text-muted-dark">
                <Github size={15} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border-light text-muted-light transition-all hover:border-primary hover:text-primary dark:border-border-dark dark:text-muted-dark">
                <Linkedin size={15} />
              </a>
              <a href="mailto:dondiegue21@gmail.com"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border-light text-muted-light transition-all hover:border-primary hover:text-primary dark:border-border-dark dark:text-muted-dark">
                <Mail size={15} />
              </a>
            </div>
          </div>

          {/* Nav */}
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-light dark:text-muted-dark">Navigation</p>
            <ul className="flex flex-col gap-2">
              {links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-muted-light transition-colors hover:text-primary dark:text-muted-dark dark:hover:text-primary">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="flex flex-col gap-3">
            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-light dark:text-muted-dark">Contact rapide</p>
            <a href="mailto:dondiegue21@gmail.com" className="text-sm text-muted-light transition-colors hover:text-primary dark:text-muted-dark">
              dondiegue21@gmail.com
            </a>
            <a href="tel:+22901941194" className="text-sm text-muted-light transition-colors hover:text-primary dark:text-muted-dark">
              +229 01 94 11 94 76
            </a>
            <a href="#contact"
              className="mt-2 inline-flex w-fit items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white shadow-md shadow-primary/30 transition-all hover:opacity-90 hover:-translate-y-0.5">
              Travaillons ensemble →
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-border-light pt-6 text-xs text-muted-light dark:border-border-dark dark:text-muted-dark">
          <p>© {year} Hotègni Diègue HOUNDOKINNOU — {t('rights')}</p>
          <p className="flex items-center gap-1">
            Fait avec <Heart size={12} className="text-red-500 fill-red-500" /> à Lokossa, Bénin
          </p>
        </div>
      </div>
    </footer>
  );
}
