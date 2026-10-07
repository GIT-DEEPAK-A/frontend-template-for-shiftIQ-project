import { cn } from '@/lib/utils'

type StatusSize = 'sm' | 'md' | 'lg'
type StatusType = 'running' | 'idle' | 'warning' | 'fault' | 'maintenance' | 'offline' | 'online' | 'active' | 'normal' | 'critical'

interface StatusIndicatorProps {
  status: StatusType | string
  size?: StatusSize
  showLabel?: boolean
  pulse?: boolean
  className?: string
}

const STATUS_MAP: Record<string, { dot: string; label: string; pulse?: boolean }> = {
  running:     { dot: 'bg-emerald-500', label: 'Running',     pulse: true  },
  active:      { dot: 'bg-emerald-500', label: 'Active',      pulse: true  },
  online:      { dot: 'bg-emerald-500', label: 'Online',      pulse: true  },
  normal:      { dot: 'bg-emerald-500', label: 'Normal'                    },
  idle:        { dot: 'bg-slate-400',   label: 'Idle'                      },
  offline:     { dot: 'bg-slate-400',   label: 'Offline'                   },
  warning:     { dot: 'bg-amber-500',   label: 'Warning'                   },
  maintenance: { dot: 'bg-amber-500',   label: 'Maintenance'               },
  fault:       { dot: 'bg-red-500',     label: 'Fault',       pulse: true  },
  critical:    { dot: 'bg-red-500',     label: 'Critical',    pulse: true  },
}

const SIZE_MAP: Record<StatusSize, string> = {
  sm: 'w-1.5 h-1.5',
  md: 'w-2 h-2',
  lg: 'w-2.5 h-2.5',
}

export default function StatusIndicator({
  status, size = 'md', showLabel = false, pulse, className
}: StatusIndicatorProps) {
  const config = STATUS_MAP[status?.toLowerCase()] ?? { dot: 'bg-slate-400', label: status }
  const shouldPulse = pulse !== undefined ? pulse : config.pulse

  return (
    <span className={cn('inline-flex items-center gap-1.5', className)}>
      <span className="relative flex-shrink-0 flex items-center justify-center">
        {shouldPulse && (
          <span className={cn(
            'absolute inline-flex rounded-full opacity-75 animate-ping',
            config.dot,
            SIZE_MAP[size]
          )} />
        )}
        <span className={cn('relative rounded-full flex-shrink-0', config.dot, SIZE_MAP[size])} />
      </span>
      {showLabel && (
        <span className="text-sm font-medium text-slate-700">{config.label}</span>
      )}
    </span>
  )
}

// ── Health bar ─────────────────────────────────────────────────────────────

interface HealthBarProps {
  value: number | null
  size?: 'sm' | 'md'
  showValue?: boolean
  className?: string
}

export function HealthBar({ value, size = 'md', showValue = false, className }: HealthBarProps) {
  if (value === null || value === undefined) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <div className={cn('flex-1 bg-slate-100 rounded-full overflow-hidden', size === 'sm' ? 'h-1.5' : 'h-2')}>
          <div className="skeleton h-full w-full rounded-full" />
        </div>
        {showValue && <span className="text-xs text-slate-400 w-8 text-right">—</span>}
      </div>
    )
  }

  const color = value >= 80 ? 'bg-emerald-500' : value >= 60 ? 'bg-amber-500' : 'bg-red-500'

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className={cn('flex-1 bg-slate-100 rounded-full overflow-hidden', size === 'sm' ? 'h-1.5' : 'h-2')}>
        <div
          className={cn('h-full rounded-full transition-all duration-500', color)}
          style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      {showValue && <span className="text-xs font-medium text-slate-600 w-8 text-right">{value}%</span>}
    </div>
  )
}

// ── Efficiency bar ─────────────────────────────────────────────────────────

interface EfficiencyBarProps {
  value: number | null
  target?: number
  className?: string
}

export function EfficiencyBar({ value, target = 85, className }: EfficiencyBarProps) {
  if (value === null || value === undefined) {
    return <div className={cn('skeleton h-2 rounded-full', className)} />
  }

  const color = value >= target ? 'bg-emerald-500' : value >= target * 0.9 ? 'bg-amber-500' : 'bg-red-500'

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden relative">
        <div
          className={cn('h-full rounded-full transition-all duration-500', color)}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
        {/* Target marker */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-slate-400"
          style={{ left: `${target}%` }}
          title={`Target: ${target}%`}
        />
      </div>
      <span className="text-xs font-medium text-slate-600 w-8 text-right">{value}%</span>
    </div>
  )
}
