import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { AuditFinding } from '@/lib/types';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { findings, totalCurrentSpend, totalSavings } = body as {
      findings: AuditFinding[];
      totalCurrentSpend: number;
      totalSavings: number;
    };

    if (!findings || !Array.isArray(findings)) {
      return NextResponse.json(
        { error: 'Invalid findings data' },
        { status: 400 }
      );
    }

    // Build context for Claude
    const findingsText = findings
      .map(
        (f) =>
          `- ${f.tool}: ${f.recommendation} (save $${f.potentialSavings}/month)`
      )
      .join('\n');

    const prompt = `
Summarize this AI spend audit in a friendly, personalized 100-word paragraph.

Current spend: $${totalCurrentSpend}/month
Potential savings: $${totalSavings}/month

Findings:
${findingsText}

Write a compelling summary that:
1. Acknowledges their current spend
2. Highlights the top opportunity
3. Ends with a call to action
4. Is conversational and not salesy
`;

    const message = await client.messages.create({
      model: 'claude-opus-4-20250514',
      max_tokens: 200,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const summary =
      message.content[0].type === 'text'
        ? message.content[0].text
        : 'Unable to generate summary';

    return NextResponse.json({ summary }, { status: 200 });
  } catch (error) {
    console.error('API error:', error);

    // Graceful failure - return template
    return NextResponse.json(
      {
        summary:
          'Your analysis shows strong optimization opportunities. Consider downgrades, switching to cheaper alternatives, or purchasing discounted credits through Credex to maximize your savings.',
      },
      { status: 200 }
    );
  }
}
