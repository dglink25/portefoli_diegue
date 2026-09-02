'use client';

import { useState, useEffect, useRef } from 'react';
import type { Profile, Skill, Project, Experience, Review } from '@/types';
import { SidebarNav } from './sidebar-nav';
import { HeroSection } from './hero-section';
import { AboutSection } from './about-section';
import { SkillsSection } from './skills-section';
import { ProjectsSection } from './projects-section';
import { ExperienceSection } from './experience-section';
import { GallerySection } from './gallery-section';
import { ReviewsSection } from './reviews-section';
import { ContactSection } from './contact-section';

interface GalleryItem {
  id: number; title: string; description: string | null;
  image_url: string; category: string; order_index: number;
}

interface Props {
  profile: Profile | null;
  skills: Skill[];
  projects: Project[];
  experiences: Experience[];
  reviews: Review[];
  gallery: GalleryItem[];
  locale: string;
}

export function PortfolioLayout({ profile, skills, projects, experiences, reviews, gallery, locale }: Props) {
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const sections = ['hero', 'about', 'skills', 'projects', 'experience', 'gallery', 'reviews', 'contact'];
    const observers: IntersectionObserver[] = [];

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { rootMargin: '-30% 0px -60% 0px' }
      );
      obs.observe(el);
      observers.push(obs);
    });

    // Reveal animations
    const revealEls = document.querySelectorAll('.reveal');
    const revealObs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    revealEls.forEach((el) => revealObs.observe(el));

    return () => {
      observers.forEach((o) => o.disconnect());
      revealObs.disconnect();
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-bg">
      {/* Sidebar */}
      <SidebarNav profile={profile} activeSection={activeSection} locale={locale} />

      {/* Main content */}
      <main className="flex-1 lg:ml-72">
        <HeroSection profile={profile} locale={locale} stats={[]} />
        <AboutSection profile={profile} locale={locale} stats={[]} />
        <SkillsSection skills={skills} />
        <ProjectsSection projects={projects} locale={locale} />
        <ExperienceSection experiences={experiences} locale={locale} />
        <GallerySection items={gallery} />
        <ReviewsSection reviews={reviews} locale={locale} />
        <ContactSection profile={profile} />

        {/* Footer */}
        <footer className="border-t border-border px-8 py-6 text-center text-xs text-muted">
          <p>© {new Date().getFullYear()} Hotègni Diègue HOUNDOKINNOU - Tous droits réservés</p>
          <p className="mt-1">Conçu &amp; développé avec Next.js · Lokossa, Bénin</p>
        </footer>
      </main>
    </div>
  );
}
