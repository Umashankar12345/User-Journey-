import { useState, useEffect } from 'react';
import { AuditFinding } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { Button } from './Button';

interface AuditResultsProps {
  findings: AuditFinding[];
  totalCurrentSpend: number;
  totalSavings: number;
  yearlySavings: number;
  auditId: string;
  onCaptureLead: () => void;
  isReadOnly?: boolean;
}

export function AuditResults({
  findings,
  totalCurrentSpend,
  totalSavings,
  yearlySavings,
  auditId,
  onCaptureLead,
  isReadOnly = false,
}: AuditResultsProps) {
  const [summary, setSummary] = useState<string>('');
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const savingsPercentage = totalCurrentSpend > 0 ? ((totalSavings / totalCurrentSpend) * 100).toFixed(1) : 0;

  useEffect(() => {
    async function fetchSummary() {
      setIsLoadingSummary(true);
      try {
        const response = await fetch('/api/summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ findings }),
        });
        const data = await response.json();
        setSummary(data.summary);
      } catch (error) {
        console.error('Failed to fetch summary:', error);
      } finally {
        setIsLoadingSummary(false);
      }
    }

    if (findings.length > 0) {
      fetchSummary();
    }
  }, [findings]);

  const handleCopyLink = () => {
    const url = `${window.location.origin}/audit/${auditId}`;
    navigator.clipboard.writeText(url);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'plan-downgrade':
        return '⬇️';
      case 'cheaper-alternative':
        return '🔄';
      case 'credit-arbitrage':
        return '💳';
      default:
        return '✅';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'plan-downgrade':
        return 'Plan Downgrade';
      case 'cheaper-alternative':
        return 'Cheaper Alternative';
      case 'credit-arbitrage':
        return 'Credit Arbitrage';
      default:
        return 'Optimal';
    }
  };

  return (
    <div className="space-y-8">
      {/* AI Summary */}
      <div className="bg-white border border-credex-200 rounded-lg p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">AI Optimization Summary</h3>
          <button
            onClick={handleCopyLink}
            className={`text-xs px-3 py-1 rounded transition-colors ${
              copySuccess ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {copySuccess ? '✓ Link Copied' : '🔗 Copy Share Link'}
          </button>
        </div>
        
        {isLoadingSummary ? (
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        ) : summary ? (
          <p className="text-gray-700 leading-relaxed italic">&ldquo;{summary}&rdquo;</p>
        ) : (
          <p className="text-gray-500 italic">No summary available. Check your tool configurations for better results.</p>
        )}
      </div>

      {/* Hero Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-credex-50 border-2 border-credex-600 rounded-lg p-6">
          <p className="text-sm font-semibold text-credex-700 uppercase">Monthly Savings</p>
          <p className="text-4xl font-bold text-credex-600 mt-2">${totalSavings.toLocaleString()}</p>
        </div>
        <div className="bg-green-50 border-2 border-green-600 rounded-lg p-6">
          <p className="text-sm font-semibold text-green-700 uppercase">Annual Savings</p>
          <p className="text-4xl font-bold text-green-600 mt-2">${yearlySavings.toLocaleString()}</p>
        </div>
        <div className="bg-blue-50 border-2 border-blue-600 rounded-lg p-6">
          <p className="text-sm font-semibold text-blue-700 uppercase">Savings %</p>
          <p className="text-4xl font-bold text-blue-600 mt-2">{savingsPercentage}%</p>
        </div>
      </div>

      {/* Findings Table */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Detailed Analysis</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-300 bg-gray-50">
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Tool</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Finding</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">Monthly Savings</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {findings.map((finding, idx) => (
                <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {finding.tool.charAt(0).toUpperCase() + finding.tool.slice(1)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <p className="font-medium text-gray-900">
                        {getCategoryIcon(finding.category)} {getCategoryLabel(finding.category)}
                      </p>
                      <p className="text-xs text-gray-600">{finding.recommendation}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-900">
                    {finding.potentialSavings > 0 ? (
                      <span className="text-green-600">${finding.potentialSavings.toLocaleString()}</span>
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded text-xs font-semibold ${
                        finding.confidenceLevel === 'high'
                          ? 'bg-green-100 text-green-800'
                          : finding.confidenceLevel === 'medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {finding.confidenceLevel.charAt(0).toUpperCase() + finding.confidenceLevel.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Reasoning */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900">Reasoning</h3>
        {findings.map((finding, idx) => (
          finding.potentialSavings > 0 && (
            <div key={idx} className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
              <p className="font-semibold text-gray-900 mb-2">
                {finding.tool.toUpperCase()}: {finding.recommendation}
              </p>
              <p className="text-gray-700 text-sm mb-2">{finding.reasoning}</p>
              {finding.sourceUrl && (
                <a
                  href={finding.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-credex-600 hover:underline"
                >
                  View source ↗
                </a>
              )}
            </div>
          )
        ))}
      </div>

      {/* CTA */}
      <div className="bg-credex-900 text-white rounded-lg p-6 text-center space-y-4">
        <h3 className="text-2xl font-bold">Ready to Save {savingsPercentage}%?</h3>
        {totalSavings > 500 && (
          <p className="text-credex-100">
            With ${totalSavings.toLocaleString()}/month in savings, Credex can help you capture this value through discounted credits and optimized procurement.
          </p>
        )}
        {!isReadOnly && (
          <Button onClick={onCaptureLead} className="bg-white text-credex-900 hover:bg-gray-100">
            Get Your Report & Consultation
          </Button>
        )}
      </div>

      {/* Audit ID */}
      <div className="text-center text-xs text-gray-500">
        Audit ID: {auditId}
      </div>
    </div>
  );
}
