import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const siteKey = process.env.RECAPTCHA_SITE_KEY;
    
    if (!siteKey) {
      return NextResponse.json(
        { error: 'Site key not configured' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      siteKey: siteKey,
      success: true
    });

  } catch (error) {
    console.error('Error getting reCAPTCHA site key:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
