import { WifiOff, Wifi, RefreshCw, Clock, CheckCircle2, XCircle, Upload } from 'lucide-react'
import OperatorLayout from './OperatorLayout'
import Button from '@/components/ui/Button'
import { LinearProgress } from '@/components/ui/ProgressIndicator'
import { cn } from '@/lib/utils'

type SyncState = 'online' | 'offline' | 'syncing' | 'sync-complete' | 'sync-failed'

interface OfflineModeProps {
  syncState?: SyncState
  pendingCount?: number
  lastSyncTime?: string | null
  onSync?: () => void
  onRetry?: () => void
}

export default function OfflineMode({
  syncState = 'offline',
  pendingCount,
  lastSyncTime,
  onSync,
  onRetry,
}: OfflineModeProps) {
  const STATE_META: Record<SyncState, {
    icon: React.ReactNode; title: string; description: string; iconBg: string; textColor: string
  }> = {
    online: {
      icon: <Wifi className="w-8 h-8 text-emerald-600" />,
      title: 'You\'re online',
      description: 'All data is syncing in real-time.',
      iconBg: 'bg-emerald-50',
      textColor: 'text-emerald-700',
    },
    offline: {
      icon: <WifiOff className="w-8 h-8 text-slate-500" />,
      title: 'You\'re offline',
      description: 'Your changes are saved locally and will sync automatically when you reconnect.',
      iconBg: 'bg-slate-100',
      textColor: 'text-slate-700',
    },
    syncing: {
      icon: <RefreshCw className="w-8 h-8 text-brand-600 animate-spin" />,
      title: 'Syncing data…',
      description: 'Your data is being synchronised with the server. Please wait.',
      iconBg: 'bg-brand-50',
      textColor: 'text-brand-700',
    },
    'sync-complete': {
      icon: <CheckCircle2 className="w-8 h-8 text-emerald-600" />,
      title: 'Sync complete',
      description: 'All pending data has been synchronised successfully.',
      iconBg: 'bg-emerald-50',
      textColor: 'text-emerald-700',
    },
    'sync-failed': {
      icon: <XCircle className="w-8 h-8 text-red-500" />,
      title: 'Sync failed',
      description: 'Unable to synchronise your data. Check your connection and try again.',
      iconBg: 'bg-red-50',
      textColor: 'text-red-700',
    },
  }

  const meta = STATE_META[syncState]

  return (
    <OperatorLayout title="Connection Status" backPath="/operator">
      <div className="space-y-4">
        {/* Main status card */}
        <div className={cn('card p-6 text-center', syncState === 'offline' && 'border-amber-200 bg-amber-50/30')}>
          <div className={cn('w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4', meta.iconBg)}>
            {meta.icon}
          </div>
          <h2 className={cn('text-base font-semibold mb-2', meta.textColor)}>{meta.title}</h2>
          <p className="text-sm text-slate-500">{meta.description}</p>
        </div>

        {/* Sync status details */}
        <div className="card p-4 space-y-4">
          {/* Pending records */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-700">Pending Records</span>
            </div>
            <span className={cn(
              'text-sm font-bold',
              pendingCount && pendingCount > 0 ? 'text-amber-600' : 'text-slate-400'
            )}>
              {pendingCount !== undefined ? pendingCount : '—'}
            </span>
          </div>

          {/* Last sync */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-700">Last Sync</span>
            </div>
            <span className="text-sm text-slate-400">{lastSyncTime ?? '—'}</span>
          </div>

          {/* Connection type */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-700">Connection</span>
            </div>
            <span className={cn(
              'text-sm font-semibold',
              syncState === 'offline' ? 'text-slate-400' : 'text-emerald-600'
            )}>
              {syncState === 'offline' ? 'Offline' : 'Online'}
            </span>
          </div>

          {/* Sync progress (shown during syncing) */}
          {syncState === 'syncing' && (
            <LinearProgress indeterminate label="Syncing…" />
          )}
        </div>

        {/* Pending items list */}
        <div className="card p-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Queued for Sync</p>

          {(!pendingCount || pendingCount === 0) ? (
            <div className="py-4 text-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto mb-1.5" />
              <p className="text-xs text-slate-400">No pending data</p>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Rendered from local queue */}
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                <div>
                  <p className="text-xs font-medium text-slate-700">Production Entry</p>
                  <p className="text-[10px] text-slate-400">Queued at —</p>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded font-medium">Pending</span>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-2">
          {syncState === 'offline' && onSync && (
            <Button variant="primary" size="lg" fullWidth icon={<RefreshCw className="w-4 h-4" />} onClick={onSync}>
              Sync When Online
            </Button>
          )}
          {syncState === 'sync-failed' && onRetry && (
            <Button variant="primary" size="lg" fullWidth icon={<RefreshCw className="w-4 h-4" />} onClick={onRetry}>
              Retry Sync
            </Button>
          )}
          {syncState === 'online' && onSync && (
            <Button variant="outline" size="lg" fullWidth icon={<RefreshCw className="w-4 h-4" />} onClick={onSync}>
              Sync Now
            </Button>
          )}
        </div>

        {/* Offline capability notice */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 space-y-1">
          <p className="font-semibold text-slate-600">Available offline:</p>
          {['Production entry', 'Abnormality reporting', 'Cleaning checklist', 'View cached machine data'].map(f => (
            <div key={f} className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" />
              <span>{f}</span>
            </div>
          ))}
        </div>
      </div>
    </OperatorLayout>
  )
}
