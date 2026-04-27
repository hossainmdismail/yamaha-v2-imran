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
    const prompts = await query('SELECT * FROM prompts ORDER BY created_at DESC');
    return NextResponse.json({ prompts });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    await checkAdmin();
    const body = await req.json();
    const { prompt_template, is_active } = body;
    
    // If setting as active, maybe deactivate others first
    if (is_active) {
      await query('UPDATE prompts SET is_active = FALSE');
    }

    await query(
      'INSERT INTO prompts (prompt_template, is_active) VALUES (?, ?)',
      [prompt_template, is_active || false]
    );
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
