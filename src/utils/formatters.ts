/**
 * Utility functions for ImpactHub formatting
 */

export function formatCurrency(amount: number, compact: boolean = false): string {
  if (compact) {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)} Cr`;
    }
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}k`;
    }
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function formatDateTime(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function calculateProgress(current: number, target: number): number {
  if (!target || target <= 0) return 0;
  return Math.min(100, Math.round((current / target) * 100));
}

export function getDaysRemaining(endDateStr: string): number {
  const end = new Date(endDateStr).getTime();
  const now = new Date().getTime();
  const diffTime = end - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

export function getCategoryBadgeClass(category: string): string {
  switch (category) {
    case 'Education':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'Hunger Relief':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'Healthcare':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'Disaster Relief':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    case 'Women Empowerment':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'Environment':
      return 'bg-teal-50 text-teal-700 border-teal-200';
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200';
  }
}

export function getStatusBadgeClass(status: string): string {
  switch (status) {
    case 'Active':
    case 'Completed':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'Pending':
    case 'Planning':
    case 'Draft':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'Follow-up Required':
    case 'On Hold':
    case 'Paused':
      return 'bg-orange-50 text-orange-700 border-orange-200';
    case 'Expired':
    case 'Lapsed':
    case 'Suspended':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    case 'VIP':
      return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
}
