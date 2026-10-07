import { type ReactNode, type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

// ── Base Card ──────────────────────────────────────────────────────────────

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
  as?: 'div' | 'section' | 'article'
}

export default function Card({
  children,
  hover = false,
  padding = 'md',
  as: Tag = 'div',
  className,
  ...props
}: CardProps) {
  const pad = { none: '', sm: 'p-3', md: 'p-4 sm:p-5', lg: 'p-5 sm:p-6' }[padding]

  return (
    <Tag
      className={cn(
        'card',
        pad,
        hover && 'hover:shadow-card-hover transition-shadow duration-200 cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}

// ── Card Header ────────────────────────────────────────────────────────────

interface CardHeaderProps {
  title: string
  subtitle?: string
  icon?: ReactNode
  actions?: ReactNode
  className?: string
}

export function CardHeader({ title, subtitle, icon, actions, className }: CardHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between gap-3 mb-4', className)}>
      <div className="flex items-center gap-3 min-w-0">
        {icon && (
          <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center flex-shrink-0 text-brand-600">
            {icon}
          </div>
        )}
        <div className="min-w-0">
          <h2 className="text-section text-slate-900 truncate">{title}</h2>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
    </div>
  )
}

// ── KPI Card ───────────────────────────────────────────────────────────────

import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface KpiCardProps {
  title: string
  value?: string | number | null
  unit?: string
  trend?: 'up' | 'down' | 'flat' | null
  trendLabel?: string | null
  status?: 'success' | 'warning' | 'critical' | 'neutral' | null
  comparison?: string | null
  icon?: ReactNode
  loading?: boolean
  className?: string
}

const STATUS_RING: Record<string, string> = {
  success:  'border-l-4 border-l-emerald-500',
  warning:  'border-l-4 border-l-amber-500',
  critical: 'border-l-4 border-l-red-500',
  neutral:  'border-l-4 border-l-slate-300',
}

const TREND_CONFIG = {
  up:   { icon: TrendingUp,   color: 'text-emerald-600' },
  down: { icon: TrendingDown, color: 'text-red-600'     },
  flat: { icon: Minus,        color: 'text-slate-400'   },
}

export function KpiCard({
  title, value, unit, trend, trendLabel, status, comparison, icon, loading, className
}: KpiCardProps) {
  if (loading) return <KpiCardSkeleton />

  const TrendIcon = trend ? TREND_CONFIG[trend].icon : null
  const trendColor = trend ? TREND_CONFIG[trend].color : ''
  const borderClass = status ? STATUS_RING[status] : 'border-l-4 border-l-transparent'

  return (
    <div className={cn('card p-4 sm:p-5', borderClass, className)}>
      <div className="flex items-start justify-between gap-2 mb-3">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider leading-tight">{title}</p>
        {icon && (
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 text-slate-500">
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-end gap-1.5 mb-2">
        {value !== null && value !== undefined
          ? (
            <>
              <span className="text-kpi font-bold text-slate-900 leading-none">{value}</span>
              {unit && <span className="text-sm text-slate-500 mb-0.5">{unit}</span>}
            </>
          )
          : <span className="text-2xl font-bold text-slate-300 leading-none">—</span>
        }
      </div>

      <div className="flex items-center justify-between gap-2">
        {trend && TrendIcon ? (
          <div className={cn('flex items-center gap-1 text-xs font-medium', trendColor)}>
            <TrendIcon className="w-3.5 h-3.5" />
            <span>{trendLabel ?? '—'}</span>
          </div>
        ) : (
          <span className="text-xs text-slate-400">No trend data</span>
        )}
        {comparison && (
          <span className="text-[10px] text-slate-400 text-right">{comparison}</span>
        )}
      </div>
    </div>
  )
}

// ── KPI Card Skeleton ──────────────────────────────────────────────────────

export function KpiCardSkeleton() {
  return (
    <div className="card p-4 sm:p-5 border-l-4 border-l-slate-200">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="skeleton h-3 w-24 rounded" />
        <div className="skeleton w-8 h-8 rounded-lg" />
      </div>
      <div className="skeleton h-8 w-20 rounded mb-2" />
      <div className="flex items-center justify-between gap-2">
        <div className="skeleton h-3 w-16 rounded" />
        <div className="skeleton h-3 w-12 rounded" />
      </div>
    </div>
  )
}
