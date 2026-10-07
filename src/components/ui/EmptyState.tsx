import { type ReactNode } from 'react'
import {
  Cpu, AlertTriangle, Bell, Wrench, FileText, ArrowLeftRight,
  GitMerge, BarChart2, Search, Users, ClipboardList, History,
  PackageSearch, Inbox
} from 'lucide-react'
import Button from './Button'
import { cn } from '@/lib/utils'

// ── Generic Empty State ────────────────────────────────────────────────────

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
    variant?: 'primary' | 'outline'
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
  className?: string
  compact?: boolean
}

export default function EmptyState({
  icon, title, description, action, secondaryAction, className, compact = false
}: EmptyStateProps) {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center text-center',
      compact ? 'py-10 px-4' : 'py-16 px-8',
      className
    )}>
      {icon && (
        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-4 text-slate-400">
          {icon}
        </div>
      )}
      <h3 className={cn('font-semibold text-slate-700 mb-1.5', compact ? 'text-sm' : 'text-base')}>
        {title}
      </h3>
      {description && (
        <p className={cn('text-slate-500 max-w-sm mb-5', compact ? 'text-xs' : 'text-sm')}>
          {description}
        </p>
      )}
      <div className="flex items-center gap-2">
        {action && (
          <Button
            variant={action.variant ?? 'primary'}
            size="sm"
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        )}
        {secondaryAction && (
          <Button variant="ghost" size="sm" onClick={secondaryAction.onClick}>
            {secondaryAction.label}
          </Button>
        )}
      </div>
    </div>
  )
}

// ── Domain-specific empty states ───────────────────────────────────────────

export function NoMachinesState({ onAdd }: { onAdd?: () => void }) {
  return (
    <EmptyState
      icon={<Cpu className="w-6 h-6" />}
      title="No machines configured"
      description="No machines have been added to this plant yet. Add a machine to start monitoring operations."
      action={onAdd ? { label: 'Add Machine', onClick: onAdd } : undefined}
    />
  )
}

export function NoProductionDataState({ onRefresh }: { onRefresh?: () => void }) {
  return (
    <EmptyState
      icon={<BarChart2 className="w-6 h-6" />}
      title="No production data available"
      description="Production data will appear here once machines start reporting. Check that your machines are connected."
      action={onRefresh ? { label: 'Refresh', onClick: onRefresh, variant: 'outline' } : undefined}
    />
  )
}

export function NoAbnormalitiesState() {
  return (
    <EmptyState
      icon={<AlertTriangle className="w-6 h-6" />}
      title="No abnormalities reported"
      description="No abnormalities have been reported for the selected filters. All systems appear to be operating normally."
    />
  )
}

export function NoAlertsState() {
  return (
    <EmptyState
      icon={<Bell className="w-6 h-6" />}
      title="No alerts to display"
      description="There are currently no active alerts for the selected criteria. The system will notify you when new alerts are generated."
    />
  )
}

export function NoMaintenanceState({ onAdd }: { onAdd?: () => void }) {
  return (
    <EmptyState
      icon={<Wrench className="w-6 h-6" />}
      title="No maintenance records"
      description="No maintenance requests or records found for the selected filters."
      action={onAdd ? { label: 'Create Request', onClick: onAdd } : undefined}
    />
  )
}

export function NoHandoverState({ onCreate }: { onCreate?: () => void }) {
  return (
    <EmptyState
      icon={<ArrowLeftRight className="w-6 h-6" />}
      title="No handover records"
      description="No shift handover records found. Handover summaries will appear here after shifts are completed."
      action={onCreate ? { label: 'Start Handover', onClick: onCreate } : undefined}
    />
  )
}

export function NoCrossShiftMemoryState() {
  return (
    <EmptyState
      icon={<GitMerge className="w-6 h-6" />}
      title="No historical records available"
      description="Cross-shift memory will appear here as operational data is collected across shifts. Select a machine and date range to explore."
    />
  )
}

export function NoReportsState({ onGenerate }: { onGenerate?: () => void }) {
  return (
    <EmptyState
      icon={<FileText className="w-6 h-6" />}
      title="No reports generated"
      description="Select a report type and configure the parameters to generate your first report."
      action={onGenerate ? { label: 'Generate Report', onClick: onGenerate } : undefined}
    />
  )
}

export function NoUsersState({ onAdd }: { onAdd?: () => void }) {
  return (
    <EmptyState
      icon={<Users className="w-6 h-6" />}
      title="No users found"
      description="No users match the current filters. Add a new user or adjust your search criteria."
      action={onAdd ? { label: 'Add User', onClick: onAdd } : undefined}
    />
  )
}

export function NoNotificationsState() {
  return (
    <EmptyState
      icon={<Inbox className="w-6 h-6" />}
      title="No notifications"
      description="You're all caught up. New notifications will appear here as events occur."
      compact
    />
  )
}

export function NoSearchResultsState({ query }: { query?: string }) {
  return (
    <EmptyState
      icon={<Search className="w-6 h-6" />}
      title={query ? `No results for "${query}"` : 'No results found'}
      description="Try adjusting your search or filters to find what you're looking for."
    />
  )
}

export function NoAuditLogsState() {
  return (
    <EmptyState
      icon={<History className="w-6 h-6" />}
      title="No audit logs"
      description="No activity has been recorded yet. User actions will appear in this log."
      compact
    />
  )
}

export function NoParametersState() {
  return (
    <EmptyState
      icon={<ClipboardList className="w-6 h-6" />}
      title="No parameters configured"
      description="No parameters have been defined for this machine. Configure parameters to enable monitoring."
      compact
    />
  )
}

export function NoChecklistState() {
  return (
    <EmptyState
      icon={<PackageSearch className="w-6 h-6" />}
      title="Checklist not loaded"
      description="The cleaning checklist will be loaded from the server. Please wait or refresh to try again."
      compact
    />
  )
}
