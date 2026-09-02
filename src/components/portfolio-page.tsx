'use client';

import { useEffect, useState } from 'react';
import type { Profile, Skill, Project, Experience, Review } from '@/types';
import { NavBar } from './nav-bar';
import { HeroSection } from './hero-section';
import { AboutSection } from './about-section';
import { ExpertisesSection } from './expertises-section';
import { SkillsSection } from './skills-section';
import { ExperienceSection } from './experience-section';
import { ProjectsSection } from './projects-section';
import { GallerySection } from './gallery-section';
import { ReviewsSection } from './reviews-section';
import { ContactSection } from './contact-section';
import { SiteFooter } from './site-footer';

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

export function PortfolioPage({ profile, skills, projects, experiences, reviews, gallery, locale }: Props) {
  const [active, setActive] = useState('hero');

  useEffect(() => {
    /* ── Active section tracker ── */
    const ids = ['hero','about','expertises','skills','experience','projects','gallery','reviews','contact'];
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }),
      { rootMargin: '-40% 0px -55% 0px' }
    );
    ids.forEach((id) => { const el = document.getElementById(id); if (el) obs.observe(el); });

    /* ── Reveal on scroll ── */
    const revObs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach((el) => revObs.observe(el));

    return () => { obs.disconnect(); revObs.disconnect(); };
  }, []);

  return (
    <>
      <NavBar profile={profile} active={active} locale={locale} />
      <HeroSection profile={profile} locale={locale} />
      <AboutSection profile={profile} locale={locale} />
      <ExpertisesSection />
      <SkillsSection skills={skills} />
      <ExperienceSection experiences={experiences} locale={locale} />
      <ProjectsSection projects={projects} locale={locale} />
      <GallerySection items={gallery} />
      <ReviewsSection reviews={reviews} locale={locale} />
      <ContactSection profile={profile} />
      <SiteFooter profile={profile} />
    </>
  );
}