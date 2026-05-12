'use client';

import { useState, useEffect } from 'react';
import { SpendForm } from '@/components/SpendForm';
import { AuditResults } from '@/components/AuditResults';
import { LeadCaptureModal } from '@/components/LeadCaptureModal';
import { ToolInput, AuditFinding } from '@/lib/types';
import {
  saveFormToStorage,
  loadFormFromStorage,
  generateAuditSlug,
} from '@/lib/utils';
import { performAudit, calculateMetrics } from '@/lib/auditEngine';

interface AuditState {
  inputs: ToolInput[];
  findings: AuditFinding[];
  auditId: string;
  totalCurrentSpend: number;
  totalSavings: number;
  yearlySavings: number;
}

export default function Home() {
  const [inputs, setInputs] = useState<ToolInput[]>([]);
  const [auditState, setAuditState] = useState<AuditState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCapturingLead, setIsCapturingLead] = useState(false);
  const [showLeadModal, setShowLeadModal] = useState(false);

  // Load saved inputs on mount
  useEffect(() => {
    const saved = loadFormFromStorage();
    setInputs(saved.length > 0 ? saved : [{ tool: 'claude', plan: '', monthlySpend: 0, seats: 1, useCase: 'mixed' }]);
  }, []);

  // Save inputs whenever they change
  useEffect(() => {
    saveFormToStorage(inputs);
  }, [inputs]);

  const handleInputChange = (newInputs: ToolInput[]) => {
    setInputs(newInputs);
  };

  const handleSubmit = async (formInputs: ToolInput[]) => {
    setIsLoading(true);
    try {
      // Generate audit
      const findings = performAudit(formInputs);
      const metrics = calculateMetrics(findings);
      const auditId = generateAuditSlug();

      // Save audit to backend (optional - for now just local state)
      setAuditState({
        inputs: formInputs,
        findings,
        auditId,
        totalCurrentSpend: metrics.totalCurrentSpend,
        totalSavings: metrics.totalSavings,
        yearlySavings: metrics.yearlySavings,
      });
    } catch (error) {
      console.error('Audit failed:', error);
      alert('Failed to generate audit. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCaptureLead = async (email: string, companyName?: string, role?: string) => {
    if (!auditState) return;

    setIsCapturingLead(true);
    try {
      // Call API to capture lead
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          companyName,
          role,
          auditId: auditState.auditId,
          totalSavings: auditState.totalSavings,
          highSavingsFlag: auditState.totalSavings > 500,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to capture lead');
      }

      // Close modal and show success
      setShowLeadModal(false);
      alert('✅ Email sent! Check your inbox for your audit report.');
    } catch (error) {
      console.error('Lead capture failed:', error);
      throw error;
    } finally {
      setIsCapturingLead(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-credex-50 to-white">
      {/* Header */}
      <header className="bg-credex-900 text-white py-12">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Are You Overspending on AI?</h1>
          <p className="text-xl text-credex-100 mb-4">
            Free audit of your Claude, ChatGPT, and GitHub Copilot spending
          </p>
          <p className="text-credex-200 text-lg">
            See exactly how much you could save. No credit card required.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="container py-12">
        {!auditState ? (
          // Form View
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Your AI Spend Breakdown</h2>
                <SpendForm
                  inputs={inputs}
                  onChange={handleInputChange}
                  onSubmit={handleSubmit}
                  isLoading={isLoading}
                />
              </div>
            </div>

            {/* Info Sidebar */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-bold text-gray-900 mb-4">What We Check</h3>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex gap-2">
                    <span className="text-credex-600 font-bold">✓</span>
                    <span>Is your plan right for your team size?</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-credex-600 font-bold">✓</span>
                    <span>Could you downgrade and save?</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-credex-600 font-bold">✓</span>
                    <span>Is there a cheaper alternative?</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-credex-600 font-bold">✓</span>
                    <span>Can you buy discounted credits?</span>
                  </li>
                </ul>
              </div>

              <div className="bg-credex-50 rounded-lg border border-credex-200 p-6">
                <h3 className="font-bold text-gray-900 mb-3">Example Savings</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>Claude Pro → Team: <strong>$180/mo</strong></p>
                  <p>Copilot Business → Individual: <strong>$220/mo</strong></p>
                  <p>ChatGPT via Credex: <strong>$180/mo</strong></p>
                  <p className="border-t border-credex-200 pt-2 mt-2 font-bold text-credex-600">
                    Total: ~$580/month
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Results View
          <div>
            <button
              onClick={() => setAuditState(null)}
              className="text-credex-600 hover:text-credex-700 font-medium mb-6"
            >
              ← Edit inputs
            </button>
            <AuditResults
              findings={auditState.findings}
              totalCurrentSpend={auditState.totalCurrentSpend}
              totalSavings={auditState.totalSavings}
              yearlySavings={auditState.yearlySavings}
              auditId={auditState.auditId}
              onCaptureLead={() => setShowLeadModal(true)}
            />
          </div>
        )}
      </div>

      {/* Lead Capture Modal */}
      <LeadCaptureModal
        isOpen={showLeadModal}
        onClose={() => setShowLeadModal(false)}
        onSubmit={handleCaptureLead}
        isLoading={isCapturingLead}
      />

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 mt-20">
        <div className="container text-center text-sm">
          <p>© 2024 Credex. Free AI spend audits for founders.</p>
          <p className="mt-2">
            <a href="#privacy" className="hover:text-white">
              Privacy
            </a>
            {' '} · {' '}
            <a href="#terms" className="hover:text-white">
              Terms
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
