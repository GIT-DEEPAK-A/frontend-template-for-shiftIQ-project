import { WifiOff, ShieldX, RefreshCw, ArrowLeft, AlertOctagon, ServerOff, Lock } from 'lucide-react'
import Button from './Button'
import { cn } from '@/lib/utils'

// ── Generic Error State ────────────────────────────────────────────────────

interface ErrorStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  onRetry?: () => void
  onBack?: () => void
  onRefresh?: () => void
  className?: string
  compact?: boolean
  variant?: 'default' | 'inline'
}

export default function ErrorState({
  icon, title, description, onRetry, onBack, onRefresh, className, compact = false, variant = 'default'
}: ErrorStateProps) {
  const isInline = variant === 'inline'

  return (
    <div className={cn(
      'flex flex-col items-center justify-center text-center',
      isInline ? 'p-6' : compact ? 'py-10 px-4' : 'py-16 px-8',
      className
    )}>
      <div className={cn(
        'rounded-2xl flex items-center justify-center mb-4',
        isInline ? 'w-10 h-10 bg-red-50 text-red-400' : 'w-12 h-12 bg-red-50 text-red-400'
      )}>
        {icon ?? <AlertOctagon className={isInline ? 'w-5 h-5' : 'w-6 h-6'} />}
      </div>
      <h3 className={cn('font-semibold text-slate-700 mb-1.5', compact || isInline ? 'text-sm' : 'text-base')}>
        {title}
      </h3>
      {description && (
        <p className={cn('text-slate-500 max-w-sm mb-5', compact || isInline ? 'text-xs' : 'text-sm')}>
          {description}
        </p>
      )}
      <div className="flex items-center gap-2">
        {onRetry && (
          <Button variant="primary" size="sm" icon={<RefreshCw className="w-3.5 h-3.5" />} onClick={onRetry}>
            Try Again
          </Button>
        )}
        {onRefresh && (
          <Button variant="outline" size="sm" icon={<RefreshCw className="w-3.5 h-3.5" />} onClick={onRefresh}>
            Refresh
          </Button>
        )}
        {onBack && (
          <Button variant="ghost" size="sm" icon={<ArrowLeft className="w-3.5 h-3.5" />} onClick={onBack}>
            Go Back
          </Button>
        )}
      </div>
    </div>
  )
}

// ── Specific error variants ────────────────────────────────────────────────

export function ConnectionError({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorState
      icon={<WifiOff className="w-6 h-6" />}
      title="Connection unavailable"
      description="Unable to reach the server. Check your network connection and try again."
      onRetry={onRetry}
    />
  )
}

export function LoadError({ onRetry, onBack }: { onRetry?: () => void; onBack?: () => void }) {
  return (
    <ErrorState
      icon={<ServerOff className="w-6 h-6" />}
      title="Unable to load data"
      description="Something went wrong while fetching data. The server may be temporarily unavailable."
      onRetry={onRetry}
      onBack={onBack}
    />
  )
}

export function SyncError({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorState
      icon={<RefreshCw className="w-6 h-6" />}
      title="Synchronisation failed"
      description="Your changes could not be synced. They are saved locally and will sync when the connection is restored."
      onRetry={onRetry}
      compact
    />
  )
}

export function PermissionError({ onBack }: { onBack?: () => void }) {
  return (
    <ErrorState
      icon={<Lock className="w-6 h-6" />}
      title="Permission denied"
      description="You don't have permission to view this resource. Contact your administrator if you believe this is an error."
      onBack={onBack}
    />
  )
}

export function GenericError({ onRetry, onBack }: { onRetry?: () => void; onBack?: () => void }) {
  return (
    <ErrorState
      icon={<ShieldX className="w-6 h-6" />}
      title="Something went wrong"
      description="An unexpected error occurred. Our team has been notified. Please try again."
      onRetry={onRetry}
      onBack={onBack}
    />
  )
}

// ── Inline error (inside a card/form) ─────────────────────────────────────

interface InlineErrorProps {
  message: string
  onDismiss?: () => void
  className?: string
}

export function InlineError({ message, onDismiss, className }: InlineErrorProps) {
  return (
    <div className={cn(
      'flex items-start gap-2.5 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700',
      className
    )}>
      <AlertOctagon className="w-4 h-4 flex-shrink-0 mt-0.5" />
      <p className="flex-1">{message}</p>
      {onDismiss && (
        <button onClick={onDismiss} className="text-red-400 hover:text-red-600 flex-shrink-0 text-base leading-none">
          &times;
        </button>
      )}
    </div>
  )
}

// ── Toast-style alert banner ───────────────────────────────────────────────

type AlertBannerVariant = 'info' | 'success' | 'warning' | 'error'

interface AlertBannerProps {
  variant?: AlertBannerVariant
  title: string
  description?: string
  onDismiss?: () => void
  className?: string
}

const BANNER_STYLES: Record<AlertBannerVariant, { bg: string; text: string; border: string; icon: React.ReactNode }> = {
  info:    { bg: 'bg-brand-50',   text: 'text-brand-800',   border: 'border-brand-200',   icon: <AlertOctagon className="w-4 h-4 text-brand-500" /> },
  success: { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200', icon: <AlertOctagon className="w-4 h-4 text-emerald-500" /> },
  warning: { bg: 'bg-amber-50',   text: 'text-amber-800',   border: 'border-amber-200',   icon: <AlertOctagon className="w-4 h-4 text-amber-500" /> },
  error:   { bg: 'bg-red-50',     text: 'text-red-800',     border: 'border-red-200',     icon: <AlertOctagon className="w-4 h-4 text-red-500" /> },
}

export function AlertBanner({ variant = 'info', title, description, onDismiss, className }: AlertBannerProps) {
  const s = BANNER_STYLES[variant]
  return (
    <div className={cn('flex items-start gap-3 p-4 rounded-xl border', s.bg, s.border, s.text, className)}>
      <span className="flex-shrink-0 mt-0.5">{s.icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{title}</p>
        {description && <p className="text-xs mt-0.5 opacity-80">{description}</p>}
      </div>
      {onDismiss && (
        <button onClick={onDismiss} className="opacity-60 hover:opacity-100 text-base leading-none flex-shrink-0">
          &times;
        </button>
      )}
    </div>
  )
}
