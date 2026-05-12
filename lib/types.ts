export type AITool = 'claude' | 'copilot' | 'chatgpt' | 'cursor' | 'gemini' | 'windsurf' | 'api' | 'other';
export type Plan = string; // e.g., "Pro", "Team", "Enterprise"
export type UseCase = 'coding' | 'writing' | 'research' | 'data-analysis' | 'mixed';

export interface ToolInput {
  tool: AITool;
  plan: Plan;
  monthlySpend: number;
  seats: number;
  useCase: UseCase;
  notes?: string;
}

export interface AuditFinding {
  tool: AITool;
  currentPlan: Plan;
  currentMonthlySpend: number;
  seats: number;
  useCase: UseCase;
  recommendation: string;
  potentialSavings: number;
  reasoning: string;
  category: 'plan-downgrade' | 'cheaper-alternative' | 'credit-arbitrage' | 'optimal';
  confidenceLevel: 'high' | 'medium' | 'low';
  sourceUrl?: string;
}

export interface AuditResult {
  id: string;
  auditId: string;
  findings: AuditFinding[];
  totalCurrentSpend: number;
  totalPotentialSavings: number;
  summary: string;
  createdAt: Date;
}

export interface Lead {
  id: string;
  email: string;
  companyName?: string;
  role?: string;
  auditId: string;
  totalSavings: number;
  highSavingsFlag: boolean; // true if > $500/month
  createdAt: Date;
}
