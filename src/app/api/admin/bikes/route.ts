import { NextResponse } from 'next/server';
import { query } from '@/lib/server/mysql';
import { verifyAuth, getAuthCookie } from '@/lib/server/auth';

async function checkAdmin() {
  const token = await getAuthCookie();
  if (!token) throw new Error('Unauthorized');
  await verifyAuth(token);
}

export async function GET() {
  try {
    await checkAdmin();
    const bikes = await query('SELECT * FROM bikes ORDER BY created_at DESC');
    return NextResponse.json({ bikes });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    await checkAdmin();
    const body = await req.json();
    const { model_name, type, description, image_url } = body;
    
    await query(
      'INSERT INTO bikes (model_name, type, description, image_url) VALUES (?, ?, ?, ?)',
      [model_name, type, description || '', image_url || '']
    );
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
