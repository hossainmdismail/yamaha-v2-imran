import { NextResponse } from 'next/server';
import { query } from '@/lib/server/mysql';
import { generateCinematicImage, generatePersonaCopy } from '@/lib/server/gemini';
import { buildImagePrompt, parsePersonaPayload, selectBikeForPersona } from '@/lib/server/ride-persona';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export async function POST(req: Request) {
  try {
    // We expect a multipart/form-data request
    const formData = await req.formData();
    const photo = formData.get('photo') as File;
    const persona = formData.get('persona') as string;

    if (!photo || !persona) {
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

    // Rate Limiting Check
    const settings = await query<any[]>('SELECT setting_key, setting_value FROM app_settings');
    const getSetting = (key: string, def: number) => {
      const s = settings.find(x => x.setting_key === key);
      return s ? parseInt(s.setting_value, 10) : def;
    };
    
    const maxDaily = getSetting('max_daily_generations', 10);
    const maxWeekly = getSetting('max_weekly_generations', 50);
    const maxMonthly = getSetting('max_monthly_generations', 100);

    const [dailyCountRes, weeklyCountRes, monthlyCountRes] = await Promise.all([
      query<any[]>('SELECT COUNT(*) as count FROM generations WHERE user_id = ? AND created_at > NOW() - INTERVAL 1 DAY', [userId]),
      query<any[]>('SELECT COUNT(*) as count FROM generations WHERE user_id = ? AND created_at > NOW() - INTERVAL 1 WEEK', [userId]),
      query<any[]>('SELECT COUNT(*) as count FROM generations WHERE user_id = ? AND created_at > NOW() - INTERVAL 1 MONTH', [userId])
    ]);

    if (dailyCountRes[0].count >= maxDaily) {
      return NextResponse.json({ error: `You have reached the daily limit of ${maxDaily} images. Please try again tomorrow.` }, { status: 429 });
    }
    if (weeklyCountRes[0].count >= maxWeekly) {
      return NextResponse.json({ error: `You have reached the weekly limit of ${maxWeekly} images. Please try again next week.` }, { status: 429 });
    }
    if (monthlyCountRes[0].count >= maxMonthly) {
      return NextResponse.json({ error: `You have reached the monthly limit of ${maxMonthly} images. Please try again next month.` }, { status: 429 });
    }

    // Convert photo to base64
    const arrayBuffer = await photo.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString('base64');
    const mimeType = photo.type;

    let personaData;
    try {
      personaData = parsePersonaPayload(persona);
    } catch (e: any) {
      console.error('Persona parsing error:', e);
      return NextResponse.json({ error: 'Quiz data is invalid. Please retake the quiz.' }, { status: 400 });
    }

    const selection = await selectBikeForPersona(personaData);
    const bikeId = selection.bike.id;
    const bikeModel = selection.bike.model_name;
    const bikeColor = selection.resolvedColor;
    const destinationScene = personaData.destination_meta?.scene || personaData.destination || 'premium scenic road';
    const destinationMood = personaData.destination_meta?.personality || `${personaData.destination} rider energy`;
    const aspirationTone = personaData.aspiration || 'signature rider energy';

    // Generate Text Persona Copy
    console.log('Generating persona copy...');
    const personaSummary = `${destinationMood} with ${aspirationTone.toLowerCase()}`;
    const personaCopy = await generatePersonaCopy(personaSummary, bikeModel);
    const finalPrompt = buildImagePrompt({
      bikeModel,
      bikeColor,
      destinationScene,
      destinationMood,
      aspiration: aspirationTone,
    });

    // Generate Image
    console.log('Starting Gemini image generation...');
    let generatedImageUrl;
    try {
      generatedImageUrl = await generateCinematicImage(base64Image, mimeType, finalPrompt);
    } catch (aiError: any) {
      console.error('Gemini Image Generation Error:', aiError);
      throw new Error(`AI Generation failed: ${aiError.message || 'Unknown AI error'}`);
    }

    // Upload to AWS S3 instead of local public folder
    console.log('Uploading to S3...');
    const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3');
    const crypto = await import('crypto');
    
    // Generate secure random hash for public URL
    const hashId = crypto.randomBytes(16).toString('hex');
    
    // Convert base64 data URI to buffer
    const base64Data = generatedImageUrl.replace(/^data:image\/\w+;base64,/, "");
    const imgBuffer = Buffer.from(base64Data, 'base64');
    
    const s3Client = new S3Client({ region: process.env.AWS_REGION || 'us-east-1' });
    const bucketName = process.env.S3_BUCKET_NAME;
    
    if (!bucketName) {
      throw new Error('S3_BUCKET_NAME is not configured in .env.local');
    }

    const fileName = `generations/gen_${hashId}.jpg`;
    
    try {
      const s3Command = new PutObjectCommand({
        Bucket: bucketName,
        Key: fileName,
        Body: imgBuffer,
        ContentType: 'image/jpeg',
        ACL: 'public-read' // Make it publicly accessible
      });
      
      await s3Client.send(s3Command);
    } catch (s3Error: any) {
      console.error('S3 Upload Error:', s3Error);
      throw new Error(`S3 Upload failed: ${s3Error.message || 'Check AWS credentials and Bucket Block Public Access settings'}`);
    }

    const publicS3Url = `https://${bucketName}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${fileName}`;

    // Save to database
    console.log('Saving to database...');
    await query(
      `INSERT INTO generations (
        user_id,
        bike_id,
        behavior_option_id,
        destination_option_id,
        aspiration_option_id,
        generated_image_url,
        persona_title,
        traits_summary,
        resolved_bike_color,
        selection_meta,
        hash_id,
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        bikeId,
        personaData.behavior,
        personaData.destination_id,
        personaData.aspiration_id,
        publicS3Url,
        persona,
        personaCopy,
        bikeColor,
        JSON.stringify(selection.selectionMeta),
        hashId,
        'completed',
      ]
    );

    // Clear the OTP session token so they must verify again to generate another image
    const cookieStoreForDelete = await cookies();
    cookieStoreForDelete.delete('user_token');

    return NextResponse.json({
      success: true,
      generationId: hashId,
      imageUrl: publicS3Url,
      personaCopy,
      status: 'completed'
    });

  } catch (error: any) {
    console.error('Generate API error:', error);
    
    // Provide granular error messages back to the user
    let errorMessage = 'Image generation failed. Please try again.';
    
    if (error.message) {
      const msg = error.message.toLowerCase();
      if (msg.includes('503') || msg.includes('overloaded')) {
        errorMessage = 'AI servers are currently overloaded. Please try again in a few moments.';
      } else if (msg.includes('safety') || msg.includes('blocked') || msg.includes('policy')) {
        errorMessage = 'The generated image was blocked by AI safety filters. Please try a different photo.';
      } else if (msg.includes('payload') || msg.includes('no image')) {
        errorMessage = 'The AI model failed to construct the image. Please try a different photo or angle.';
      }
    }
    
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
