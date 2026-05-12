'use client';

import { useState } from 'react';
import { ToolInput, AITool, UseCase } from '@/lib/types';
import { Button } from './Button';
import { Input } from './Input';
import { Select } from './Select';

const TOOL_OPTIONS: { value: AITool; label: string }[] = [
  { value: 'claude', label: 'Claude (Anthropic)' },
  { value: 'copilot', label: 'GitHub Copilot' },
  { value: 'chatgpt', label: 'ChatGPT (OpenAI)' },
  { value: 'cursor', label: 'Cursor' },
  { value: 'gemini', label: 'Gemini (Google)' },
  { value: 'windsurf', label: 'Windsurf' },
  { value: 'api', label: 'API Usage' },
  { value: 'other', label: 'Other' },
];

const USE_CASE_OPTIONS: { value: UseCase; label: string }[] = [
  { value: 'coding', label: '💻 Coding' },
  { value: 'writing', label: '✍️ Writing' },
  { value: 'research', label: '🔍 Research' },
  { value: 'data-analysis', label: '📊 Data Analysis' },
  { value: 'mixed', label: '🔄 Mixed' },
];

interface SpendFormProps {
  inputs: ToolInput[];
  onChange: (inputs: ToolInput[]) => void;
  onSubmit: (inputs: ToolInput[]) => Promise<void>;
  isLoading: boolean;
}

export function SpendForm({ inputs, onChange, onSubmit, isLoading }: SpendFormProps) {
  const [errors, setErrors] = useState<Record<number, string>>({});

  const handleAddTool = () => {
    const newInput: ToolInput = {
      tool: 'claude',
      plan: '',
      monthlySpend: 0,
      seats: 1,
      useCase: 'mixed',
    };
    onChange([...inputs, newInput]);
  };

  const handleRemoveTool = (index: number) => {
    onChange(inputs.filter((_, i) => i !== index));
    const newErrors = { ...errors };
    delete newErrors[index];
    setErrors(newErrors);
  };

  const handleUpdateInput = (index: number, updates: Partial<ToolInput>) => {
    const updated = [...inputs];
    updated[index] = { ...updated[index], ...updates };
    onChange(updated);
  };

  const validateInputs = (): boolean => {
    const newErrors: Record<number, string> = {};
    let isValid = true;

    inputs.forEach((input, index) => {
      if (!input.plan.trim()) {
        newErrors[index] = 'Plan is required';
        isValid = false;
      }
      if (input.monthlySpend <= 0) {
        newErrors[index] = 'Monthly spend must be greater than 0';
        isValid = false;
      }
      if (input.seats < 1) {
        newErrors[index] = 'At least 1 seat required';
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateInputs()) return;
    await onSubmit(inputs);
  };

  const totalSpend = inputs.reduce((sum, input) => sum + input.monthlySpend, 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-credex-50 border border-credex-200 rounded-lg p-4">
        <h3 className="font-semibold text-credex-900 mb-2">Monthly AI Spend Summary</h3>
        <p className="text-2xl font-bold text-credex-600">
          ${totalSpend.toLocaleString()}
        </p>
        <p className="text-sm text-credex-700 mt-1">
          ${(totalSpend * 12).toLocaleString()} per year
        </p>
      </div>

      <div className="space-y-4">
        {inputs.map((input, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-4 space-y-4 bg-white"
          >
            <div className="flex justify-between items-start">
              <h4 className="font-semibold text-gray-900">Tool #{index + 1}</h4>
              {inputs.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveTool(index)}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Remove
                </button>
              )}
            </div>

            {errors[index] && (
              <div className="bg-red-50 text-red-700 px-3 py-2 rounded text-sm">
                {errors[index]}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="AI Tool"
                value={input.tool}
                onChange={(value) => handleUpdateInput(index, { tool: value as AITool })}
                options={TOOL_OPTIONS}
              />

              <Input
                label="Plan Name"
                placeholder="e.g., Pro, Team, Enterprise"
                value={input.plan}
                onChange={(value) => handleUpdateInput(index, { plan: value })}
              />

              <Input
                label="Monthly Spend ($)"
                type="number"
                placeholder="e.g., 20"
                min="0"
                step="1"
                value={input.monthlySpend}
                onChange={(value) => handleUpdateInput(index, { monthlySpend: Number(value) })}
              />

              <Input
                label="Number of Seats"
                type="number"
                placeholder="e.g., 1"
                min="1"
                step="1"
                value={input.seats}
                onChange={(value) => handleUpdateInput(index, { seats: Number(value) })}
              />

              <Select
                label="Primary Use Case"
                value={input.useCase}
                onChange={(value) => handleUpdateInput(index, { useCase: value as UseCase })}
                options={USE_CASE_OPTIONS}
              />

              <Input
                label="Additional Notes (optional)"
                placeholder="e.g., fine-tuning, extended context"
                value={input.notes || ''}
                onChange={(value) => handleUpdateInput(index, { notes: value })}
              />
            </div>
          </div>
        ))}
      </div>

      <Button
        type="button"
        onClick={handleAddTool}
        variant="secondary"
        className="w-full"
      >
        + Add Another Tool
      </Button>

      <Button
        type="submit"
        disabled={inputs.length === 0 || isLoading}
        className="w-full"
      >
        {isLoading ? 'Analyzing...' : 'Get My Audit Results'}
      </Button>
    </form>
  );
}
