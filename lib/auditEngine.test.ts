import { describe, it, expect } from 'vitest';
import { performAudit, calculateMetrics } from '@/lib/auditEngine';
import { ToolInput, AuditFinding } from '@/lib/types';

describe('Audit Engine', () => {
  it('should identify downgrade opportunity for Claude Max', () => {
    const inputs: ToolInput[] = [
      {
        tool: 'claude',
        plan: 'Max',
        monthlySpend: 200,
        seats: 1,
        useCase: 'research',
        notes: 'light usage',
      },
    ];

    const findings = performAudit(inputs);

    expect(findings.length).toBeGreaterThan(0);
    const hasDowngrade = findings.some(
      (f) => f.category === 'plan-downgrade' && f.potentialSavings > 0
    );
    expect(hasDowngrade).toBe(true);
  });

  it('should recommend team plan for multiple Claude Pro users', () => {
    const inputs: ToolInput[] = [
      {
        tool: 'claude',
        plan: 'Pro',
        monthlySpend: 80, // 4 users × $20
        seats: 4,
        useCase: 'coding',
      },
    ];

    const findings = performAudit(inputs);
    const hasTeamRecommendation = findings.some(
      (f) =>
        f.category === 'plan-downgrade' &&
        f.recommendation.includes('Team')
    );
    expect(hasTeamRecommendation).toBe(true);
  });

  it('should identify Copilot Business unnecessary for small team', () => {
    const inputs: ToolInput[] = [
      {
        tool: 'copilot',
        plan: 'Business',
        monthlySpend: 24,
        seats: 2,
        useCase: 'coding',
      },
    ];

    const findings = performAudit(inputs);
    const hasDowngrade = findings.some(
      (f) =>
        f.category === 'plan-downgrade' &&
        f.recommendation.includes('Individual')
    );
    expect(hasDowngrade).toBe(true);
  });

  it('should mark optimal usage when no savings', () => {
    const inputs: ToolInput[] = [
      {
        tool: 'claude',
        plan: 'Pro',
        monthlySpend: 20,
        seats: 1,
        useCase: 'research',
      },
    ];

    const findings = performAudit(inputs);
    const isOptimal = findings.some(
      (f) => f.category === 'optimal' && f.potentialSavings === 0
    );
    expect(isOptimal).toBe(true);
  });

  it('should calculate metrics correctly', () => {
    const findings: AuditFinding[] = [
      {
        tool: 'claude',
        currentPlan: 'Max',
        currentMonthlySpend: 200,
        seats: 1,
        useCase: 'research',
        recommendation: 'Downgrade to Pro',
        potentialSavings: 180,
        reasoning: 'Test',
        category: 'plan-downgrade',
        confidenceLevel: 'high',
      },
      {
        tool: 'copilot',
        currentPlan: 'Business',
        currentMonthlySpend: 24,
        seats: 2,
        useCase: 'coding',
        recommendation: 'Downgrade to Individual',
        potentialSavings: 4, // $24 - ($10 × 2)
        reasoning: 'Test',
        category: 'plan-downgrade',
        confidenceLevel: 'high',
      },
    ];

    const metrics = calculateMetrics(findings);

    expect(metrics.totalCurrentSpend).toBe(224);
    expect(metrics.totalSavings).toBe(184);
    expect(metrics.yearlySavings).toBe(2208);
    expect(metrics.optimizedSpend).toBe(40);
  });

  it('should handle multiple tools correctly', () => {
    const inputs: ToolInput[] = [
      {
        tool: 'claude',
        plan: 'Max',
        monthlySpend: 200,
        seats: 1,
        useCase: 'coding',
      },
      {
        tool: 'chatgpt',
        plan: 'Plus',
        monthlySpend: 20,
        seats: 1,
        useCase: 'writing',
      },
      {
        tool: 'copilot',
        plan: 'Individual',
        monthlySpend: 10,
        seats: 1,
        useCase: 'coding',
      },
    ];

    const findings = performAudit(inputs);

    expect(findings.length).toBe(3);
    expect(findings.every((f) => f.tool !== undefined)).toBe(true);
  });

  it('should suggest credit arbitrage for ChatGPT', () => {
    const inputs: ToolInput[] = [
      {
        tool: 'chatgpt',
        plan: 'Enterprise',
        monthlySpend: 600,
        seats: 5,
        useCase: 'mixed',
      },
    ];

    const findings = performAudit(inputs);
    const hasArbitrage = findings.some(
      (f) => f.category === 'credit-arbitrage' && f.potentialSavings > 0
    );
    expect(hasArbitrage).toBe(true);
  });

  it('should recommend cheaper alternative for high ChatGPT spend', () => {
    const inputs: ToolInput[] = [
      {
        tool: 'chatgpt',
        plan: 'Enterprise',
        monthlySpend: 600,
        seats: 5,
        useCase: 'coding',
      },
    ];

    const findings = performAudit(inputs);
    const hasCheaperAlt = findings.some(
      (f) =>
        f.category === 'cheaper-alternative' &&
        f.recommendation.includes('Claude')
    );
    expect(hasCheaperAlt).toBe(true);
  });
});
