import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { isValidEmail } from '@/lib/utils';

// Rate limiting: store IP + count in memory (in production, use Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + 24 * 60 * 60 * 1000 }); // 24h
    return true;
  }

  if (record.count >= 10) {
    return false; // Max 10 per day
  }

  record.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, companyName, role, auditId, totalSavings, highSavingsFlag } = body;

    // Validate input
    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Max 10 audits per IP per day.' },
        { status: 429 }
      );
    }

    // Save to Supabase
    const { error: insertError } = await supabaseAdmin.from('leads').insert([
      {
        email,
        company_name: companyName || null,
        role: role || null,
        audit_id: auditId,
        total_savings: totalSavings,
        high_savings_flag: highSavingsFlag,
      },
    ]);

    if (insertError) {
      console.error('Supabase insert error:', insertError);
      return NextResponse.json(
        { error: 'Failed to save lead' },
        { status: 500 }
      );
    }

    // Send email via Resend
    const emailHtml = `
      <h1>Your AI Spend Audit Results</h1>
      <p>Hi,</p>
      <p>We analyzed your AI tool spending and found potential savings of <strong>$${totalSavings}/month</strong> (or $${totalSavings * 12}/year).</p>
      ${highSavingsFlag ? `<p>With these significant savings, our team at Credex would love to discuss how we can help you capture them through discounted AI credits and optimized procurement.</p>` : ''}
      <p>Check your audit results and recommendations in our tool.</p>
      <p>Best,<br/>The Credex Team</p>
    `;

    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      try {
        const resendResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: 'audit@credex.io',
            to: email,
            subject: `Your AI Spend Audit Results - Save $${totalSavings}/month`,
            html: emailHtml,
          }),
        });

        if (!resendResponse.ok) {
          console.warn('Resend email failed:', await resendResponse.text());
        }
      } catch (emailError) {
        console.error('Email service error:', emailError);
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json(
      { success: true, message: 'Lead captured successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
