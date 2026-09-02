import { query, queryOne } from '@/lib/db';
import { PortfolioPage } from '@/components/portfolio-page';
import type { Profile, Skill, Project, Experience, Review } from '@/types';

interface GalleryItem {
  id: number; title: string; description: string | null;
  image_url: string; category: string; order_index: number;
}

export default async function HomePage({ params }: { params: { locale: string } }) {
  const [profile, skills, projects, experiences, reviews, gallery] = await Promise.all([
    queryOne<Profile>('SELECT * FROM profile WHERE id = 1'),
    query<Skill>('SELECT * FROM skills WHERE category != $1 ORDER BY order_index ASC, id ASC', ['general']),
    query<Project>('SELECT * FROM projects WHERE published = true ORDER BY order_index ASC, id ASC'),
    query<Experience>('SELECT * FROM experiences ORDER BY order_index ASC, start_date DESC'),
    query<Review>('SELECT * FROM reviews WHERE published = true ORDER BY created_at DESC'),
    query<GalleryItem>('SELECT * FROM gallery WHERE published = true ORDER BY order_index ASC, id ASC'),
  ]);

  return (
    <PortfolioPage
      profile={profile}
      skills={skills}
      projects={projects}
      experiences={experiences}
      reviews={reviews}
      gallery={gallery}
      locale={params.locale}
    />
  );
}
