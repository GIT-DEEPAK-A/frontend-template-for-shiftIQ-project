import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { ChartSkeleton } from './Skeletons'
import { NoProductionDataState } from './EmptyState'
import { LoadError } from './ErrorState'
import { RefreshCw, Maximize2 } from 'lucide-react'

interface ChartContainerProps {
  title: string
  subtitle?: string
  height?: string
  loading?: boolean
  error?: string | null
  empty?: boolean
  onRetry?: () => void
  onExpand?: () => void
  children: ReactNode
  actions?: ReactNode
  className?: string
  legendContent?: ReactNode
}

export default function ChartContainer({
  title, subtitle, height = 'h-64', loading, error, empty,
  onRetry, onExpand, children, actions, className, legendContent
}: ChartContainerProps) {
  return (
    <div className={cn('card p-4 sm:p-5', className)}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {actions}
          {onRetry && (
            <button
              onClick={onRetry}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Refresh chart"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
          {onExpand && (
            <button
              onClick={onExpand}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Expand chart"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {legendContent && (
        <div className="flex flex-wrap items-center gap-4 mb-3">
          {legendContent}
        </div>
      )}

      {/* Chart area */}
      <div className={cn('w-full', height)}>
        {loading ? (
          <ChartSkeleton height="h-full" />
        ) : error ? (
          <LoadError onRetry={onRetry} />
        ) : empty ? (
          <NoProductionDataState onRefresh={onRetry} />
        ) : (
          <div className="w-full h-full">
            {children}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Chart Legend item ──────────────────────────────────────────────────────

interface LegendItemProps {
  color: string
  label: string
}

export function LegendItem({ color, label }: LegendItemProps) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: color }} />
      <span className="text-xs text-slate-500">{label}</span>
    </div>
  )
}
