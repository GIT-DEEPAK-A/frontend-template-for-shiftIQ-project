import { type ClassValue, clsx } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatPlaceholder(value: unknown, fallback = '—'): string {
  if (value === null || value === undefined || value === '') return fallback
  return String(value)
}

export type StatusVariant = 'success' | 'warning' | 'critical' | 'info' | 'neutral' | 'active' | 'idle'
export type SeverityVariant = 'critical' | 'high' | 'medium' | 'low'
export type PriorityVariant = 'critical' | 'high' | 'medium' | 'low'

export const STATUS_CONFIG: Record<StatusVariant, { label: string; color: string; dot: string; bg: string }> = {
  success:  { label: 'Running',  color: 'text-emerald-700', dot: 'bg-emerald-500', bg: 'bg-emerald-50' },
  active:   { label: 'Active',   color: 'text-emerald-700', dot: 'bg-emerald-500', bg: 'bg-emerald-50' },
  warning:  { label: 'Warning',  color: 'text-amber-700',   dot: 'bg-amber-500',   bg: 'bg-amber-50'   },
  critical: { label: 'Critical', color: 'text-red-700',     dot: 'bg-red-500',     bg: 'bg-red-50'     },
  info:     { label: 'Info',     color: 'text-brand-700',   dot: 'bg-brand-500',   bg: 'bg-brand-50'   },
  neutral:  { label: 'Idle',     color: 'text-slate-600',   dot: 'bg-slate-400',   bg: 'bg-slate-100'  },
  idle:     { label: 'Idle',     color: 'text-slate-600',   dot: 'bg-slate-400',   bg: 'bg-slate-100'  },
}

export const SEVERITY_CONFIG: Record<SeverityVariant, { label: string; color: string; bg: string; border: string }> = {
  critical: { label: 'Critical', color: 'text-red-700',    bg: 'bg-red-50',    border: 'border-red-200'    },
  high:     { label: 'High',     color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200' },
  medium:   { label: 'Medium',   color: 'text-amber-700',  bg: 'bg-amber-50',  border: 'border-amber-200'  },
  low:      { label: 'Low',      color: 'text-slate-600',  bg: 'bg-slate-50',  border: 'border-slate-200'  },
}

export const PRIORITY_CONFIG: Record<PriorityVariant, { label: string; color: string; bg: string }> = {
  critical: { label: 'Critical', color: 'text-red-700',    bg: 'bg-red-50'    },
  high:     { label: 'High',     color: 'text-orange-700', bg: 'bg-orange-50' },
  medium:   { label: 'Medium',   color: 'text-amber-700',  bg: 'bg-amber-50'  },
  low:      { label: 'Low',      color: 'text-slate-600',  bg: 'bg-slate-100' },
}
