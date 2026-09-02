import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';

export const runtime = 'nodejs';

async function requireAuth() {
  const session = await getServerSession(authOptions);
  return !!session;
}

export async function POST(req: Request) {
  if (!(await requireAuth()))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get('file') as File | null;

  if (!file)
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });

  /* Validation type */
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
  if (!allowed.includes(file.type))
    return NextResponse.json({ error: 'Type de fichier non supporté. Utilisez JPG, PNG, WebP ou GIF.' }, { status: 422 });

  /* Validation taille (5 Mo max) */
  if (file.size > 5 * 1024 * 1024)
    return NextResponse.json({ error: 'Fichier trop volumineux (max 5 Mo).' }, { status: 422 });

  const ext      = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
  const filename = `${randomUUID()}.${ext}`;
  const dir      = join(process.cwd(), 'public', 'uploads');

  await mkdir(dir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(join(dir, filename), buffer);

  return NextResponse.json({ url: `/uploads/${filename}` }, { status: 201 });
}
