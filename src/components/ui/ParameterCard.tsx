import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Skeleton } from './Skeletons'

interface ParameterCardProps {
  name?: string
  value?: number | string | null
  unit?: string
  minNormal?: number | null
  maxNormal?: number | null
  status?: 'normal' | 'warning' | 'critical' | null
  trend?: 'up' | 'down' | 'flat' | null
  loading?: boolean
  className?: string
}

const STATUS_STYLES = {
  normal:   { border: 'border-t-emerald-400', dot: 'bg-emerald-400', text: 'text-emerald-700', bg: 'bg-emerald-50' },
  warning:  { border: 'border-t-amber-400',   dot: 'bg-amber-400',   text: 'text-amber-700',   bg: 'bg-amber-50'   },
  critical: { border: 'border-t-red-400',     dot: 'bg-red-400',     text: 'text-red-700',     bg: 'bg-red-50'     },
}

const TREND_ICONS = {
  up:   { icon: TrendingUp,   color: 'text-emerald-500' },
  down: { icon: TrendingDown, color: 'text-red-500'     },
  flat: { icon: Minus,        color: 'text-slate-400'   },
}

export default function ParameterCard({
  name, value, unit, minNormal, maxNormal, status, trend, loading, className
}: ParameterCardProps) {
  if (loading) {
    return (
      <div className={cn('card p-4 border-t-4 border-t-slate-200', className)}>
        <Skeleton className="h-3 w-24 mb-3" />
        <Skeleton className="h-7 w-20 mb-2" />
        <div className="flex justify-between">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
    )
  }

  const s = status ? STATUS_STYLES[status] : null
  const TrendIcon = trend ? TREND_ICONS[trend].icon : null
  const trendColor = trend ? TREND_ICONS[trend].color : ''

  return (
    <div className={cn(
      'card p-4 border-t-4',
      s ? s.border : 'border-t-slate-200',
      className
    )}>
      {/* Parameter name */}
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider truncate pr-2">
          {name ?? <span className="text-slate-300">Parameter Name</span>}
        </p>
        {status && s && (
          <span className={cn('flex-shrink-0 w-2 h-2 rounded-full', s.dot)} />
        )}
      </div>

      {/* Value */}
      <div className="flex items-end gap-1 mb-2">
        {value !== null && value !== undefined
          ? <span className="text-2xl font-bold text-slate-900 leading-none">{value}</span>
          : <span className="text-xl font-bold text-slate-300 leading-none">—</span>
        }
        {unit && <span className="text-sm text-slate-500 mb-0.5">{unit}</span>}
      </div>

      {/* Normal range */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] text-slate-400">
          {minNormal !== null && maxNormal !== null && minNormal !== undefined && maxNormal !== undefined
            ? `Range: ${minNormal}–${maxNormal} ${unit ?? ''}`
            : 'Range: —'
          }
        </span>
        {trend && TrendIcon && (
          <TrendIcon className={cn('w-3.5 h-3.5', trendColor)} />
        )}
      </div>

      {/* Status label */}
      {status && s && (
        <div className={cn('mt-2 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide inline-block', s.bg, s.text)}>
          {status}
        </div>
      )}
    </div>
  )
}
