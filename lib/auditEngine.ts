import { ToolInput, AuditFinding } from './types';

// Pricing reference data
export const PRICING_DATA = {
  claude: {
    free: 0,
    pro: 20,
    team: 25,
    max: 200,
    enterprise: null, // Custom pricing
  },
  copilot: {
    free: 0,
    individual: 10,
    business: 24, // per seat/month
    enterprise: null,
  },
  chatgpt: {
    free: 0,
    plus: 20,
    enterprise: 600, // Starting price for team
  },
  cursor: {
    free: 0,
    pro: 20,
  },
  gemini: {
    free: 0,
    pro: 20,
    enterprise: null,
  },
  windsurf: {
    free: 0,
    pro: 29,
  },
  api: {
    payAsYouGo: 'varies',
  },
};

/**
 * Core audit engine - analyzes AI spend and identifies optimization opportunities
 */
export function performAudit(inputs: ToolInput[]): AuditFinding[] {
  const findings: AuditFinding[] = [];

  for (const input of inputs) {
    const toolFindings = auditTool(input);
    findings.push(...toolFindings);
  }

  return findings;
}

function auditTool(input: ToolInput): AuditFinding[] {
  const findings: AuditFinding[] = [];

  switch (input.tool) {
    case 'claude':
      findings.push(...auditClaude(input));
      break;
    case 'copilot':
      findings.push(...auditCopilot(input));
      break;
    case 'chatgpt':
      findings.push(...auditChatGPT(input));
      break;
    case 'cursor':
      findings.push(...auditCursor(input));
      break;
    case 'gemini':
      findings.push(...auditGemini(input));
      break;
    case 'windsurf':
      findings.push(...auditWindsurf(input));
      break;
    default:
      findings.push(optimalUsage(input));
  }

  return findings;
}

function auditClaude(input: ToolInput): AuditFinding[] {
  const findings: AuditFinding[] = [];

  // Check: Is Max really needed?
  if (input.plan.toLowerCase() === 'max' && input.seats === 1) {
    const usesCasesNeedingMax = ['fine-tuning', 'extended-context', 'high-volume'];
    const needsMax = usesCasesNeedingMax.some((c) => input.notes?.toLowerCase().includes(c));

    if (!needsMax) {
      findings.push({
        tool: input.tool,
        currentPlan: input.plan,
        currentMonthlySpend: input.monthlySpend,
        seats: input.seats,
        useCase: input.useCase,
        recommendation: 'Downgrade to Claude Pro',
        potentialSavings: input.monthlySpend - 20,
        reasoning: `You're on Claude Max ($${input.monthlySpend}/mo) for ${input.useCase} work. Claude Pro ($20/mo) covers 100% of these use cases. Max is designed for fine-tuning and extended context windows you don't use.`,
        category: 'plan-downgrade',
        confidenceLevel: 'high',
        sourceUrl: 'https://www.anthropic.com/pricing',
      });
    } else {
      findings.push(optimalUsage(input));
    }
  }

  // Check: Team plan savings for multiple seats
  if (
    input.plan.toLowerCase() === 'pro' &&
    input.seats >= 3 &&
    input.useCase !== 'mixed'
  ) {
    const teamCost = input.seats * 25;
    const currentTotalCost = input.monthlySpend;

    if (teamCost < currentTotalCost) {
      findings.push({
        tool: input.tool,
        currentPlan: input.plan,
        currentMonthlySpend: input.monthlySpend,
        seats: input.seats,
        useCase: input.useCase,
        recommendation: 'Switch to Claude Team',
        potentialSavings: currentTotalCost - teamCost,
        reasoning: `With ${input.seats} team members, Claude Team at $25/user/month costs $${teamCost} total, versus your current $${currentTotalCost}. Team plan includes usage limits designed for groups and shared history.`,
        category: 'plan-downgrade',
        confidenceLevel: 'high',
        sourceUrl: 'https://www.anthropic.com/pricing',
      });
    }
  }

  if (findings.length === 0) {
    findings.push(optimalUsage(input));
  }

  return findings;
}

function auditCopilot(input: ToolInput): AuditFinding[] {
  const findings: AuditFinding[] = [];

  // Check: Business tier for small teams
  if (
    input.plan.toLowerCase() === 'business' &&
    input.seats <= 3
  ) {
    const individualCost = input.seats * 10;
    const businessCost = input.monthlySpend;

    if (individualCost < businessCost) {
      findings.push({
        tool: input.tool,
        currentPlan: input.plan,
        currentMonthlySpend: input.monthlySpend,
        seats: input.seats,
        useCase: input.useCase,
        recommendation: 'Downgrade to Individual tier',
        potentialSavings: businessCost - individualCost,
        reasoning: `Your team of ${input.seats} people uses GitHub Copilot Business at $${businessCost}/mo. Business tier adds enterprise SSO, admin controls, and audit logs. For a small team doing ${input.useCase} work, Individual ($10/user/mo = $${individualCost}) includes identical code completion. Business features aren't needed.`,
        category: 'plan-downgrade',
        confidenceLevel: 'high',
        sourceUrl: 'https://github.com/pricing',
      });
    }
  }

  if (findings.length === 0) {
    findings.push(optimalUsage(input));
  }

  return findings;
}

function auditChatGPT(input: ToolInput): AuditFinding[] {
  const findings: AuditFinding[] = [];

  // Check: Plus -> Free downgrade for light usage
  if (input.plan.toLowerCase() === 'plus' && input.useCase === 'research') {
    findings.push({
      tool: input.tool,
      currentPlan: input.plan,
      currentMonthlySpend: input.monthlySpend,
      seats: input.seats,
      useCase: input.useCase,
      recommendation: 'Evaluate free tier for research',
      potentialSavings: input.monthlySpend,
      reasoning: `ChatGPT Plus ($${input.monthlySpend}/mo) is designed for power users. For research tasks, the free tier (GPT-4o limited access) may suffice. Trade-off: You lose priority access and faster responses. If usage is 5-10 queries/week, consider free tier.`,
      category: 'plan-downgrade',
      confidenceLevel: 'medium',
      sourceUrl: 'https://openai.com/pricing',
    });
  }

  // Check: Enterprise consolidation
  if (
    input.plan.toLowerCase() === 'enterprise' &&
    input.monthlySpend >= 600 &&
    input.seats <= 5
  ) {
    const claudeTeamCost = input.seats * 25;
    findings.push({
      tool: input.tool,
      currentPlan: input.plan,
      currentMonthlySpend: input.monthlySpend,
      seats: input.seats,
      useCase: input.useCase,
      recommendation: 'Switch to Claude Team for same capability',
      potentialSavings: input.monthlySpend - claudeTeamCost,
      reasoning: `ChatGPT Enterprise for ${input.seats} users costs $${input.monthlySpend}/mo. Claude Team provides identical conversation limits and team collaboration at $25/user/month = $${claudeTeamCost}/mo. Potential savings: $${input.monthlySpend - claudeTeamCost}/month.`,
      category: 'cheaper-alternative',
      confidenceLevel: 'high',
      sourceUrl: 'https://www.anthropic.com/pricing',
    });
  }

  // Check: Credit arbitrage
  if (
    input.plan.toLowerCase() === 'plus' ||
    input.plan.toLowerCase() === 'enterprise'
  ) {
    findings.push({
      tool: input.tool,
      currentPlan: input.plan,
      currentMonthlySpend: input.monthlySpend,
      seats: input.seats,
      useCase: input.useCase,
      recommendation: 'Buy discounted ChatGPT credits through Credex',
      potentialSavings: Math.round(input.monthlySpend * 0.25), // Conservative 25% discount
      reasoning: `You're buying ChatGPT at retail. Credex offers discounted API credits at 20-30% off. Your $${input.monthlySpend}/month spend could cost $${Math.round(input.monthlySpend * 0.7)}-$${Math.round(input.monthlySpend * 0.75)} through Credex. Savings: $${Math.round(input.monthlySpend * 0.25)}-$${Math.round(input.monthlySpend * 0.3)}/month.`,
      category: 'credit-arbitrage',
      confidenceLevel: 'high',
      sourceUrl: 'https://credex.io',
    });
  }

  if (findings.length === 0) {
    findings.push(optimalUsage(input));
  }

  return findings;
}

function auditCursor(input: ToolInput): AuditFinding[] {
  // Cursor: Pro tier is the only paid option
  // Limited optimization opportunity
  return [optimalUsage(input)];
}

function auditGemini(input: ToolInput): AuditFinding[] {
  // Gemini: Basic pro vs free tier. Limited use cases typically
  const findings: AuditFinding[] = [];

  if (input.plan.toLowerCase() === 'pro' && input.useCase === 'research') {
    findings.push({
      tool: input.tool,
      currentPlan: input.plan,
      currentMonthlySpend: input.monthlySpend,
      seats: input.seats,
      useCase: input.useCase,
      recommendation: 'Consider free tier for light research',
      potentialSavings: input.monthlySpend,
      reasoning: `Gemini Pro ($${input.monthlySpend}/mo) for research may be overkill. The free tier includes most model variants. Only upgrade if hitting token limits or needing premium support.`,
      category: 'plan-downgrade',
      confidenceLevel: 'low',
      sourceUrl: 'https://ai.google.dev/pricing',
    });
  }

  if (findings.length === 0) {
    findings.push(optimalUsage(input));
  }

  return findings;
}

function auditWindsurf(input: ToolInput): AuditFinding[] {
  // Windsurf: Single $29/mo tier. No downgrades
  return [optimalUsage(input)];
}

function optimalUsage(input: ToolInput): AuditFinding {
  return {
    tool: input.tool,
    currentPlan: input.plan,
    currentMonthlySpend: input.monthlySpend,
    seats: input.seats,
    useCase: input.useCase,
    recommendation: 'Optimal plan for your use case',
    potentialSavings: 0,
    reasoning: `Your ${input.plan} plan is well-matched to your needs (${input.seats} seat${input.seats > 1 ? 's' : ''}, ${input.useCase} use case). No immediate optimization opportunity. Monitor for plan changes or pricing updates.`,
    category: 'optimal',
    confidenceLevel: 'high',
  };
}

/**
 * Calculate total metrics from findings
 */
export function calculateMetrics(findings: AuditFinding[]) {
  const totalCurrentSpend = findings.reduce((sum, f) => sum + f.currentMonthlySpend, 0);
  const totalSavings = findings.reduce((sum, f) => sum + f.potentialSavings, 0);
  const yearlySavings = totalSavings * 12;
  const optimizedSpend = totalCurrentSpend - totalSavings;

  return {
    totalCurrentSpend,
    totalSavings,
    yearlySavings,
    optimizedSpend,
    savingsPercentage: totalCurrentSpend > 0 ? ((totalSavings / totalCurrentSpend) * 100).toFixed(1) : 0,
  };
}
