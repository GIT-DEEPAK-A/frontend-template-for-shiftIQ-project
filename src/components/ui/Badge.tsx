import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type BadgeVariant = 'default' | 'success' | 'warning' | 'critical' | 'info' | 'neutral' | 'teal' | 'purple' | 'orange'

interface BadgeProps {
  variant?: BadgeVariant
  children: ReactNode
  dot?: boolean
  className?: string
  size?: 'sm' | 'md'
}

const VARIANTS: Record<BadgeVariant, string> = {
  default:  'bg-slate-100  text-slate-700',
  neutral:  'bg-slate-100  text-slate-600',
  success:  'bg-emerald-50 text-emerald-700',
  warning:  'bg-amber-50   text-amber-700',
  critical: 'bg-red-50     text-red-700',
  info:     'bg-brand-50   text-brand-700',
  teal:     'bg-teal-50    text-teal-700',
  purple:   'bg-purple-50  text-purple-700',
  orange:   'bg-orange-50  text-orange-700',
}

const DOT_COLORS: Record<BadgeVariant, string> = {
  default:  'bg-slate-400',
  neutral:  'bg-slate-400',
  success:  'bg-emerald-500',
  warning:  'bg-amber-500',
  critical: 'bg-red-500',
  info:     'bg-brand-500',
  teal:     'bg-teal-500',
  purple:   'bg-purple-500',
  orange:   'bg-orange-500',
}

export default function Badge({ variant = 'default', children, dot, className, size = 'sm' }: BadgeProps) {
  return (
    <span className={cn(
      'badge font-medium',
      size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1',
      VARIANTS[variant],
      className
    )}>
      {dot && <span className={cn('status-dot w-1.5 h-1.5', DOT_COLORS[variant])} />}
      {children}
    </span>
  )
}

// ── Status badge shortcut ──────────────────────────────────────────────────

const STATUS_MAP: Record<string, BadgeVariant> = {
  running:    'success',
  active:     'success',
  normal:     'success',
  online:     'success',
  completed:  'success',
  resolved:   'success',
  idle:       'neutral',
  offline:    'neutral',
  inactive:   'neutral',
  warning:    'warning',
  maintenance: 'warning',
  'in-progress': 'info',
  open:       'orange',
  pending:    'neutral',
  fault:      'critical',
  critical:   'critical',
  failed:     'critical',
  overdue:    'critical',
  closed:     'neutral',
}

export function StatusBadge({ status }: { status: string }) {
  const variant = STATUS_MAP[status?.toLowerCase()] ?? 'neutral'
  const label = status?.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) ?? '—'
  return <Badge variant={variant} dot>{label}</Badge>
}

// ── Severity badge ─────────────────────────────────────────────────────────

const SEVERITY_MAP: Record<string, BadgeVariant> = {
  critical: 'critical',
  high:     'orange',
  medium:   'warning',
  low:      'neutral',
}

export function SeverityBadge({ severity }: { severity: string }) {
  const variant = SEVERITY_MAP[severity?.toLowerCase()] ?? 'neutral'
  const label = severity?.replace(/\b\w/g, c => c.toUpperCase()) ?? '—'
  return <Badge variant={variant}>{label}</Badge>
}
