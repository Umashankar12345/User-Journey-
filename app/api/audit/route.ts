import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { generateAuditSlug } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { inputs, findings, totalCurrentSpend, totalPotentialSavings } = body;

    // Generate a unique ID (or use the one provided by client)
    const id = body.id || generateAuditSlug();

    // Save to Supabase
    const { error } = await supabaseAdmin.from('audits').insert([
      {
        id,
        inputs,
        findings,
        total_current_spend: totalCurrentSpend,
        total_potential_savings: totalPotentialSavings,
      },
    ]);

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json(
        { error: 'Failed to save audit' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, id },
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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing audit ID' }, { status: 400 });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('audits')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Audit not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
