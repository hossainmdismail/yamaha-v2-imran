import { NextResponse } from 'next/server';
import { query } from '@/lib/server/mysql';
import { z } from 'zod';

const quizSchema = z.object({
  traits: z.array(z.string()).min(1)
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = quizSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Invalid traits array' }, { status: 400 });
    }

    const { traits } = result.data;
    
    // Convert traits to a comma separated string to match rules, or a predictable format
    // Simple approach: Sort traits alphabetically and join with comma
    const traitCombination = traits.sort().join(',');

    // Find rule matching trait_combination exactly or with LIKE
    const rules = await query<any[]>(
      `SELECT r.assigned_bike_id, b.model_name, b.type, b.description, b.image_url 
       FROM rules r 
       JOIN bikes b ON r.assigned_bike_id = b.id
       WHERE r.trait_combination = ? LIMIT 1`,
      [traitCombination]
    );

    let assignedBike;

    if (rules.length > 0) {
      assignedBike = rules[0];
    } else {
      // Fallback: pick a default bike or random bike
      const fallbackBikes = await query<any[]>('SELECT id as assigned_bike_id, model_name, type, description, image_url FROM bikes LIMIT 1');
      if (fallbackBikes.length > 0) {
        assignedBike = fallbackBikes[0];
      } else {
        return NextResponse.json({ error: 'No bikes configured in the system' }, { status: 500 });
      }
    }

    return NextResponse.json({
      success: true,
      persona: traitCombination,
      bike: assignedBike
    });
  } catch (error) {
    console.error('Quiz submit error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
