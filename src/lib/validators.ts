import { z } from 'zod';

/* Accepte : URL absolue (https://...), chemin relatif (/uploads/...), ou vide */
const imageUrl = z
  .string()
  .trim()
  .refine(
    (v) => v === '' || v.startsWith('/') || v.startsWith('http://') || v.startsWith('https://'),
    { message: 'Chemin invalide (doit commencer par /, http:// ou https://)' }
  )
  .optional()
  .nullable();

const optUrl = z
  .string()
  .trim()
  .refine(
    (v) => v === '' || v.startsWith('/') || v.startsWith('http://') || v.startsWith('https://'),
    { message: 'URL invalide' }
  )
  .optional()
  .nullable();

export const reviewSchema = z.object({
  full_name: z.string().trim().min(2).max(100),
  message:   z.string().trim().min(5).max(600),
  rating:    z.number().int().min(1).max(5),
});

export const messageSchema = z.object({
  full_name: z.string().trim().min(2).max(100),
  email:     z.string().trim().email(),
  subject:   z.string().trim().max(150).optional().nullable(),
  message:   z.string().trim().min(5).max(2000),
});

export const projectSchema = z.object({
  slug:           z.string().trim().min(1).max(120),
  title_fr:       z.string().trim().min(1),
  title_en:       z.string().trim().min(1),
  description_fr: z.string().trim().default(''),
  description_en: z.string().trim().default(''),
  cover_image:    imageUrl,
  tags:           z.array(z.string()).default([]),
  demo_url:       optUrl,
  repo_url:       optUrl,
  featured:       z.boolean().default(false),
  published:      z.boolean().default(true),
  order_index:    z.number().int().default(0),
});

export const skillSchema = z.object({
  name:        z.string().trim().min(1),
  category:    z.string().trim().min(1),
  level:       z.number().int().min(1).max(5),
  icon:        z.string().trim().optional().nullable(),
  order_index: z.number().int().default(0),
});

export const experienceSchema = z.object({
  title_fr:       z.string().trim().min(1),
  title_en:       z.string().trim().min(1),
  company:        z.string().trim().min(1),
  location:       z.string().trim().optional().nullable(),
  description_fr: z.string().trim().default(''),
  description_en: z.string().trim().default(''),
  start_date:     z.string().trim().min(1),
  end_date:       z.string().trim().optional().nullable(),
  order_index:    z.number().int().default(0),
});
