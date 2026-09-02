'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ThemeToggle } from './theme-toggle';
import { LocaleSwitcher } from './locale-switcher';
import { Menu, X } from 'lucide-react';

export function Header() {
  const t = useTranslations('nav');
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  const links = [
    { href: '#about', label: t('about') },
    { href: '#skills', label: t('skills') },
    { href: '#projects', label: t('projects') },
    { href: '#experience', label: t('experience') },
    { href: '#gallery', label: 'Galerie' },
    { href: '#reviews', label: t('reviews') },
    { href: '#contact', label: t('contact') },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const ids = links.map((l) => l.href.slice(1));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'border-b border-border-light bg-surface-light/90 backdrop-blur-md shadow-sm dark:border-border-dark dark:bg-surface-dark/90'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-content items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-lg font-bold tracking-tight">
          <span className="text-primary">D</span>iègue
          <span className="ml-1 text-xs font-normal text-muted-light dark:text-muted-dark">·dev</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => {
            const id = link.href.slice(1);
            const isActive = activeSection === id;
            return (
              <a
                key={link.href}
                href={link.href}
                className={`relative rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-primary'
                    : 'text-muted-light hover:text-ink-light dark:text-muted-dark dark:hover:text-ink-dark'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-1 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-primary" />
                )}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          <ThemeToggle />
          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-border-light md:hidden dark:border-border-dark"
            aria-label="Menu"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-border-light bg-surface-light px-6 py-4 md:hidden dark:border-border-dark dark:bg-surface-dark">
          <nav className="flex flex-col gap-1">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-light hover:bg-canvas-light hover:text-primary dark:text-muted-dark dark:hover:bg-canvas-dark dark:hover:text-primary"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
