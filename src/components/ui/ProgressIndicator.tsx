import { cn } from '@/lib/utils'
import { CheckCircle2, Loader2, XCircle, Clock } from 'lucide-react'

// ── Linear Progress ────────────────────────────────────────────────────────

interface LinearProgressProps {
  value?: number | null
  label?: string
  color?: 'brand' | 'emerald' | 'amber' | 'red'
  size?: 'sm' | 'md'
  showValue?: boolean
  indeterminate?: boolean
  className?: string
}

const COLOR_MAP: Record<string, string> = {
  brand:   'bg-brand-500',
  emerald: 'bg-emerald-500',
  amber:   'bg-amber-500',
  red:     'bg-red-500',
}

export function LinearProgress({
  value, label, color = 'brand', size = 'md', showValue, indeterminate, className
}: LinearProgressProps) {
  return (
    <div className={cn('w-full', className)}>
      {(label || showValue) && (
        <div className="flex justify-between mb-1.5">
          {label && <span className="text-xs text-slate-600">{label}</span>}
          {showValue && <span className="text-xs font-medium text-slate-700">{value !== null && value !== undefined ? `${value}%` : '—'}</span>}
        </div>
      )}
      <div className={cn('w-full bg-slate-100 rounded-full overflow-hidden', size === 'sm' ? 'h-1.5' : 'h-2.5')}>
        {indeterminate ? (
          <div className={cn('h-full rounded-full animate-pulse w-1/2', COLOR_MAP[color])} />
        ) : (
          <div
            className={cn('h-full rounded-full transition-all duration-700', COLOR_MAP[color])}
            style={{ width: `${Math.min(Math.max(value ?? 0, 0), 100)}%` }}
          />
        )}
      </div>
    </div>
  )
}

// ── Upload progress ────────────────────────────────────────────────────────

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error'

interface UploadProgressProps {
  fileName?: string
  progress?: number
  status?: UploadStatus
  onRemove?: () => void
}

export function UploadProgress({ fileName, progress, status = 'uploading', onRemove }: UploadProgressProps) {
  const iconMap = {
    idle:      <Clock className="w-4 h-4 text-slate-400" />,
    uploading: <Loader2 className="w-4 h-4 text-brand-500 animate-spin" />,
    success:   <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
    error:     <XCircle className="w-4 h-4 text-red-500" />,
  }

  return (
    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
      {iconMap[status]}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-700 truncate">{fileName ?? 'Uploading…'}</p>
        {status === 'uploading' && (
          <LinearProgress value={progress} size="sm" className="mt-1.5" />
        )}
        {status === 'error' && <p className="text-xs text-red-500 mt-0.5">Upload failed. Try again.</p>}
        {status === 'success' && <p className="text-xs text-emerald-600 mt-0.5">Upload complete</p>}
      </div>
      {onRemove && (
        <button onClick={onRemove} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
      )}
    </div>
  )
}

// ── Step indicator ─────────────────────────────────────────────────────────

interface Step {
  id: string
  label: string
  description?: string
}

interface StepIndicatorProps {
  steps: Step[]
  currentStep: number
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <nav aria-label="Progress">
      <ol className="flex items-center gap-0">
        {steps.map((step, i) => {
          const isCompleted = i < currentStep
          const isCurrent   = i === currentStep

          return (
            <li key={step.id} className={cn('flex items-center', i < steps.length - 1 && 'flex-1')}>
              <div className="flex flex-col items-center">
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors',
                  isCompleted ? 'bg-brand-600 border-brand-600 text-white'
                    : isCurrent ? 'bg-white border-brand-600 text-brand-600'
                    : 'bg-white border-slate-300 text-slate-400'
                )}>
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                </div>
                <span className={cn(
                  'mt-1.5 text-xs font-medium text-center whitespace-nowrap',
                  isCurrent ? 'text-brand-700' : isCompleted ? 'text-slate-700' : 'text-slate-400'
                )}>
                  {step.label}
                </span>
              </div>

              {i < steps.length - 1 && (
                <div className={cn('h-0.5 flex-1 mx-2 mb-4', isCompleted ? 'bg-brand-600' : 'bg-slate-200')} />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
