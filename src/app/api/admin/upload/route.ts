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

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: 'Requête multipart invalide.' }, { status: 400 });
  }

  const file = formData.get('file') as File | null;
  if (!file)
    return NextResponse.json({ error: 'Aucun fichier fourni.' }, { status: 400 });

  /* ── Validation type ── */
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
  if (!allowed.includes(file.type))
    return NextResponse.json(
      { error: 'Format non supporté. Utilisez JPG, PNG, WebP ou GIF.' },
      { status: 422 }
    );

  /* ── Validation taille (5 Mo) ── */
  if (file.size > 5 * 1024 * 1024)
    return NextResponse.json(
      { error: 'Fichier trop volumineux (maximum 5 Mo).' },
      { status: 422 }
    );

  /* ── Écriture ── */
  const ext      = (file.name.split('.').pop() ?? 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '');
  const filename = `${randomUUID()}.${ext}`;
  const dir      = join(process.cwd(), 'public', 'uploads');

  try {
    await mkdir(dir, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(join(dir, filename), buffer);
  } catch (err: any) {
    console.error('[upload]', err);
    return NextResponse.json(
      { error: `Erreur lors de l'écriture : ${err?.message ?? 'inconnue'}` },
      { status: 500 }
    );
  }

  return NextResponse.json({ url: `/uploads/${filename}` }, { status: 201 });
}
