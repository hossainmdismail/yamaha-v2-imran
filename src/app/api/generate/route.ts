import { NextResponse } from 'next/server';
import { query } from '@/lib/server/mysql';
import { generateCinematicImage, generatePersonaCopy } from '@/lib/server/gemini';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export async function POST(req: Request) {
  try {
    // We expect a multipart/form-data request
    const formData = await req.formData();
    const photo = formData.get('photo') as File;
    const persona = formData.get('persona') as string;
    const bikeId = parseInt(formData.get('bikeId') as string, 10);

    if (!photo || !persona || isNaN(bikeId)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Authenticate user
    const cookieStore = await cookies();
    const token = cookieStore.get('user_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let userId: number;
    try {
      const secret = process.env.OTP_SECRET || 'fallback_secret_please_change';
      const verified = await jwtVerify(token, new TextEncoder().encode(secret));
      userId = verified.payload.userId as number;
    } catch (err) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    // Get bike details
    const bikes = await query<any[]>('SELECT model_name FROM bikes WHERE id = ?', [bikeId]);
    if (bikes.length === 0) {
      return NextResponse.json({ error: 'Invalid bike' }, { status: 400 });
    }
    const bikeModel = bikes[0].model_name;

    // Get active prompt template
    const prompts = await query<any[]>('SELECT prompt_template FROM prompts WHERE is_active = TRUE LIMIT 1');
    const promptTemplate = prompts.length > 0 ? prompts[0].prompt_template : 'Create a premium cinematic lifestyle portrait of the uploaded person with a {{bike_model}}. Scene: {{destination}}. Riding personality: {{persona}}.';

    // Convert photo to base64
    const arrayBuffer = await photo.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString('base64');
    const mimeType = photo.type;

    // Map persona to environment/destination
    const destinationMap: Record<string, string> = {
      'Speed Enthusiast,Urban': 'Dhaka City',
      'Speed Enthusiast,Urban Nightscapes': 'Rainy Dhaka',
      'Mountain Trails,Speed Enthusiast': 'Bandarban',
      'Urban,Weekend Explorer': 'Padma Bridge',
      'Urban Nightscapes,Weekend Explorer': 'Coxs Bazar',
      'Mountain Trails,Weekend Explorer': 'Sajek',
      'Daily Commuter,Urban': 'Dhaka City',
      'Daily Commuter,Urban Nightscapes': 'Rainy Dhaka',
      'Daily Commuter,Mountain Trails': 'Sreemangal',
    };
    
    const destination = destinationMap[persona] || 'epic cinematic landscape';

    // Generate Text Persona Copy
    const personaCopy = await generatePersonaCopy(persona, bikeModel);

    // Generate Image
    const generatedImageUrl = await generateCinematicImage(base64Image, mimeType, persona, bikeModel, destination, promptTemplate);

    // Note: In a production app, we would upload the `generatedImageUrl` (base64 or buffer) to an S3 bucket
    // and store the public URL. For this MVP, we will store the base64 string directly or save it locally.
    // Given base64 can be large, saving locally is better.
    const fs = await import('fs');
    const path = await import('path');
    
    // Convert base64 data URI to buffer
    const base64Data = generatedImageUrl.replace(/^data:image\/\w+;base64,/, "");
    const imgBuffer = Buffer.from(base64Data, 'base64');
    
    const fileName = `gen_${userId}_${Date.now()}.jpg`;
    const publicDir = path.join(process.cwd(), 'public', 'uploads');
    
    // Create directory if not exists
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    const filePath = path.join(publicDir, fileName);
    fs.writeFileSync(filePath, imgBuffer);

    const publicUrl = `/uploads/${fileName}`;

    // Save to database
    const insertRes = await query<any>(
      'INSERT INTO generations (user_id, bike_id, generated_image_url, persona_title, traits_summary) VALUES (?, ?, ?, ?, ?)',
      [userId, bikeId, publicUrl, persona, personaCopy]
    );

    return NextResponse.json({
      success: true,
      generationId: insertRes.insertId,
      imageUrl: publicUrl,
      personaCopy
    });

  } catch (error) {
    console.error('Generate API error:', error);
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  }
}
