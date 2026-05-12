'use client';

import { useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { isValidEmail } from '@/lib/utils';

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string, companyName?: string, role?: string) => Promise<void>;
  isLoading: boolean;
}

export function LeadCaptureModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: LeadCaptureModalProps) {
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Honeypot field for bot detection

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Honeypot check
    if (honeypot) {
      console.warn('Bot submission detected');
      return;
    }

    // Validation
    if (!email || !isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      await onSubmit(email, companyName || undefined, role || undefined);
      // Clear form on success
      setEmail('');
      setCompanyName('');
      setRole('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Get Your Full Report</h2>
        <p className="text-gray-600 text-sm mb-6">
          Enter your email to receive your detailed audit results and consultation offer.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-50 text-red-700 px-3 py-2 rounded text-sm">{error}</div>}

          {/* Honeypot field (hidden from real users) */}
          <input
            type="text"
            name="website"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            style={{ display: 'none' }}
            tabIndex={-1}
            autoComplete="off"
          />

          <Input
            label="Email Address *"
            type="email"
            placeholder="your@company.com"
            value={email}
            onChange={setEmail}
            required
          />

          <Input
            label="Company Name (optional)"
            placeholder="Your Company Inc."
            value={companyName}
            onChange={setCompanyName}
          />

          <Input
            label="Your Role (optional)"
            placeholder="e.g., Engineering Manager, Founder"
            value={role}
            onChange={setRole}
          />

          <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
            We&apos;ll send you your audit results and, if applicable, discuss Credex&apos;s discounted credit programs.
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Sending...' : 'Send Report'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
