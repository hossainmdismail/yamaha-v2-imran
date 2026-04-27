import { NextResponse } from 'next/server';
import { query } from '@/lib/server/mysql';
import { sendSMS } from '@/lib/server/bulksmsbd';
import { z } from 'zod';

const sendOtpSchema = z.object({
  phone: z.string().min(10).max(15)
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = sendOtpSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 });
    }

    const { phone } = result.data;

    // Rate limiting: check if OTP was sent recently (e.g. last 1 minute)
    const recentOtps = await query<any[]>(
      `SELECT id FROM otps WHERE phone = ? AND created_at > NOW() - INTERVAL 1 MINUTE`,
      [phone]
    );

    if (recentOtps.length > 0) {
      return NextResponse.json({ error: 'Please wait before requesting another OTP' }, { status: 429 });
    }

    // Generate 4 digit OTP
    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Save to DB
    await query(
      `INSERT INTO otps (phone, otp_code, expires_at) VALUES (?, ?, ?)`,
      [phone, otpCode, expiresAt]
    );

    // Send SMS
    const message = `Your Yamaha AI Ride Personality OTP is ${otpCode}. Valid for 5 minutes.`;
    const smsSent = await sendSMS(phone, message);

    if (!smsSent) {
      return NextResponse.json({ error: 'Failed to send OTP SMS' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
