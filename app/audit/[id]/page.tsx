import { Metadata } from 'next';
import { AuditResults } from '@/components/AuditResults';
import { supabaseAdmin } from '@/lib/supabase';
import { calculateMetrics } from '@/lib/auditEngine';
import Link from 'next/link';

interface AuditPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: AuditPageProps): Promise<Metadata> {
  const { data: audit } = await supabaseAdmin
    .from('audits')
    .select('total_potential_savings')
    .eq('id', params.id)
    .single();

  const savings = audit?.total_potential_savings || 0;

  return {
    title: `AI Spend Audit Result - Save $${savings}/mo | Credex`,
    description: `Check out these potential AI savings found by the Credex Audit Tool.`,
    openGraph: {
      title: `AI Spend Audit Result - Save $${savings}/mo`,
      description: `We found $${savings}/month in potential AI spend optimization. View the full report.`,
      type: 'website',
    },
  };
}

export default async function AuditPage({ params }: AuditPageProps) {
  const { data: audit, error } = await supabaseAdmin
    .from('audits')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !audit) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-gray-600 mb-6">Audit report not found.</p>
          <Link href="/" className="text-credex-600 hover:underline">
            Go back to home
          </Link>
        </div>
      </div>
    );
  }

  const metrics = calculateMetrics(audit.findings);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-4xl">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Credex Audit Report</h1>
            <p className="text-gray-600">Confidential optimization analysis</p>
          </div>
          <Link
            href="/"
            className="bg-credex-600 text-white px-4 py-2 rounded font-medium hover:bg-credex-700"
          >
            Run New Audit
          </Link>
        </header>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <AuditResults
            findings={audit.findings}
            totalCurrentSpend={audit.total_current_spend}
            totalSavings={audit.total_potential_savings}
            yearlySavings={metrics.yearlySavings}
            auditId={params.id}
            onCaptureLead={() => {}}
            isReadOnly={true}
          />
        </div>

        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>© 2024 Credex. All results are based on conservative estimates.</p>
        </footer>
      </div>
    </div>
  );
}
