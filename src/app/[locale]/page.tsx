import { query, queryOne } from '@/lib/db';
import { PortfolioPage } from '@/components/portfolio-page';
import type { Profile, Skill, Project, Experience, Review } from '@/types';

interface GalleryItem {
  id: number; title: string; description: string | null;
  image_url: string; category: string; order_index: number;
}

export interface Stat {
  value: number;
  suffix: string;
  label_fr: string;
  label_en: string;
}

export default async function HomePage({ params }: { params: { locale: string } }) {
  const [profile, skills, projects, experiences, reviews, gallery, statsRow] = await Promise.all([
    queryOne<Profile>('SELECT * FROM profile WHERE id = 1'),
    query<Skill>('SELECT * FROM skills WHERE category != $1 ORDER BY order_index ASC, id ASC', ['general']),
    query<Project>('SELECT * FROM projects WHERE published = true ORDER BY order_index ASC, id ASC'),
    query<Experience>('SELECT * FROM experiences ORDER BY order_index ASC, start_date DESC'),
    query<Review>('SELECT * FROM reviews WHERE published = true ORDER BY created_at DESC'),
    query<GalleryItem>('SELECT * FROM gallery WHERE published = true ORDER BY order_index ASC, id ASC'),
    queryOne<{ value: Stat[] }>('SELECT value FROM settings WHERE key = $1', ['stats']),
  ]);

  const DEFAULT_STATS: Stat[] = [
    { value: 3,  suffix: '+', label_fr: "Années d'expérience", label_en: "Years' experience" },
    { value: 10, suffix: '+', label_fr: 'Projets réalisés',    label_en: 'Projects done' },
    { value: 15, suffix: '+', label_fr: 'Technologies',         label_en: 'Technologies' },
    { value: 2,  suffix: '',  label_fr: 'Organisations dirigées', label_en: 'Organisations led' },
  ];

  const stats: Stat[] = statsRow?.value ?? DEFAULT_STATS;

  return (
    <PortfolioPage
      profile={profile}
      skills={skills}
      projects={projects}
      experiences={experiences}
      reviews={reviews}
      gallery={gallery}
      stats={stats}
      locale={params.locale}
    />
  );
}
