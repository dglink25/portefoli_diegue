export interface Profile {
  id: number;
  full_name: string;
  title_fr: string;
  title_en: string;
  bio_fr: string;
  bio_en: string;
  avatar_url: string | null;      // Photo section À propos
  hero_image_url: string | null;  // Photo cercle Hero (peut différer)
  email: string | null;
  location: string | null;
  social_links: Record<string, string>;
}

export interface Skill {
  id: number;
  name: string;
  category: string;
  level: number;
  icon: string | null;
  order_index: number;
}

export interface Experience {
  id: number;
  title_fr: string;
  title_en: string;
  company: string;
  location: string | null;
  description_fr: string;
  description_en: string;
  start_date: string;
  end_date: string | null;
  order_index: number;
}

export interface Project {
  id: number;
  slug: string;
  title_fr: string;
  title_en: string;
  description_fr: string;
  description_en: string;
  cover_image: string | null;
  tags: string[];
  demo_url: string | null;
  repo_url: string | null;
  featured: boolean;
  published: boolean;
  order_index: number;
}

export interface Review {
  id: number;
  full_name: string;
  message: string;
  rating: number;
  published: boolean;
  created_at: string;
  peer_avg: number | null;
  peer_count: number;
}

export interface Message {
  id: number;
  full_name: string;
  email: string;
  subject: string | null;
  message: string;
  read: boolean;
  created_at: string;
}
