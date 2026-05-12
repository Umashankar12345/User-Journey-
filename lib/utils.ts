import { ToolInput } from './types';

const STORAGE_KEY = 'credex_audit_inputs';

/**
 * Persist form inputs to localStorage
 */
export function saveFormToStorage(inputs: ToolInput[]): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(inputs));
    }
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

/**
 * Load form inputs from localStorage
 */
export function loadFormFromStorage(): ToolInput[] {
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    }
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
  }
  return [];
}

/**
 * Clear localStorage
 */
export function clearFormStorage(): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
  }
}

/**
 * Generate shareable audit URL slug
 */
export function generateAuditSlug(): string {
  return Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
}

/**
 * Validate email address
 */
export function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Format currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Generate slug from string
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
