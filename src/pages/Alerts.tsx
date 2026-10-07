import { useState } from 'react'
import { BellOff, Check, CheckCheck, RefreshCw, AlertOctagon, AlertTriangle, Info, ChevronRight } from 'lucide-react'
import { PageHeader } from '@/components/shell/AppLayout'
import Button from '@/components/ui/Button'
import FilterBar from '@/components/ui/FilterBar'
import { NoAlertsState } from '@/components/ui/EmptyState'
import { Tabs, TabList, Tab, TabPanel } from '@/components/ui/Tabs'
import { cn } from '@/lib/utils'

type AlertSeverity = 'critical' | 'warning' | 'info'

export default function Alerts() {
  const [search, setSearch]       = useState('')
  const [statusFilter, setStatus] = useState('')
  const empty = true

  return (
    <div className="space-y-5">
      <PageHeader
        title="Alert Center"
        subtitle="Monitor and manage all system and operational alerts"
        actions={
          <>
            <Button variant="outline" size="sm" icon={<CheckCheck className="w-3.5 h-3.5" />}>
              Mark All Read
            </Button>
            <Button variant="outline" size="sm" icon={<RefreshCw className="w-3.5 h-3.5" />}>
              Refresh
            </Button>
          </>
        }
      />

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Critical',  icon: AlertOctagon,  color: 'text-red-600',   bg: 'bg-red-50',   border: 'border-l-red-500'   },
          { label: 'Warnings',  icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-l-amber-500' },
          { label: 'Info',      icon: Info,          color: 'text-brand-600', bg: 'bg-brand-50', border: 'border-l-brand-500' },
        ].map(({ label, icon: Icon, color, bg, border }) => (
          <div key={label} className={cn('card p-3 border-l-4', border, bg)}>
            <div className="flex items-center gap-2 mb-1">
              <Icon className={cn('w-4 h-4 flex-shrink-0', color)} />
              <p className={cn('text-xs font-semibold', color)}>{label}</p>
            </div>
            <p className="text-xl font-bold text-slate-300">—</p>
          </div>
        ))}
      </div>

      {/* Tabs by severity */}
      <Tabs defaultTab="all">
        <div className="card overflow-hidden">
          <div className="px-5 pt-4 border-b border-slate-100">
            <TabList>
              <Tab id="all">All Alerts</Tab>
              <Tab id="critical">Critical</Tab>
              <Tab id="warning">Warnings</Tab>
              <Tab id="info">Information</Tab>
              <Tab id="acknowledged">Acknowledged</Tab>
            </TabList>
          </div>

          {/* Filter bar */}
          <div className="px-5 py-3 border-b border-slate-50">
            <FilterBar
              search={search}
              onSearch={setSearch}
              searchPlaceholder="Search alerts…"
              filters={[
                {
                  key: 'status', label: 'Status',
                  options: [
                    { value: 'active',       label: 'Active'       },
                    { value: 'acknowledged', label: 'Acknowledged' },
                    { value: 'resolved',     label: 'Resolved'     },
                  ],
                  value: statusFilter, onChange: setStatus,
                },
                { key: 'machine',  label: 'Machine',  options: [], value: '', onChange: () => {} },
                { key: 'date',     label: 'Date',     options: [], value: '', onChange: () => {} },
              ]}
            />
          </div>

          <div className="p-5">
            <TabPanel id="all">
              <AlertListSection severity="critical" empty={empty} />
              <AlertListSection severity="warning" empty={empty} />
              <AlertListSection severity="info" empty={empty} />
            </TabPanel>
            <TabPanel id="critical">
              <AlertListSection severity="critical" empty={empty} />
            </TabPanel>
            <TabPanel id="warning">
              <AlertListSection severity="warning" empty={empty} />
            </TabPanel>
            <TabPanel id="info">
              <AlertListSection severity="info" empty={empty} />
            </TabPanel>
            <TabPanel id="acknowledged">
              <NoAlertsState />
            </TabPanel>
          </div>
        </div>
      </Tabs>
    </div>
  )
}

// ── Alert list section ─────────────────────────────────────────────────────

const SEVERITY_META: Record<AlertSeverity, {
  label: string; Icon: typeof AlertOctagon; iconColor: string; bg: string; border: string
}> = {
  critical: { label: 'Critical Alerts',  Icon: AlertOctagon,  iconColor: 'text-red-500',    bg: 'bg-red-50',    border: 'border-red-200'    },
  warning:  { label: 'Warning Alerts',   Icon: AlertTriangle, iconColor: 'text-amber-500',  bg: 'bg-amber-50',  border: 'border-amber-200'  },
  info:     { label: 'Information',      Icon: Info,          iconColor: 'text-brand-500',  bg: 'bg-brand-50',  border: 'border-brand-200'  },
}

function AlertListSection({ severity, empty }: { severity: AlertSeverity; empty: boolean }) {
  const meta = SEVERITY_META[severity]

  return (
    <div className="mb-6 last:mb-0">
      <div className="flex items-center gap-2 mb-3">
        <meta.Icon className={cn('w-4 h-4', meta.iconColor)} />
        <h3 className="text-sm font-semibold text-slate-700">{meta.label}</h3>
        <span className="text-xs text-slate-400">(—)</span>
      </div>

      {empty ? (
        <div className={cn('rounded-xl border p-6 text-center', meta.bg, meta.border)}>
          <BellOff className={cn('w-5 h-5 mx-auto mb-2', meta.iconColor, 'opacity-50')} />
          <p className="text-sm text-slate-500">No {meta.label.toLowerCase()} to display</p>
        </div>
      ) : (
        <div className="space-y-2">
          {/* AlertRow components rendered from API data */}
          <AlertRowPlaceholder severity={severity} />
        </div>
      )}
    </div>
  )
}

// ── Alert Row (structure-only) ─────────────────────────────────────────────

function AlertRowPlaceholder({ severity }: { severity: AlertSeverity }) {
  const meta = SEVERITY_META[severity]

  // Hidden — real rows rendered from API
  return (
    <div className={cn(
      'hidden flex items-start gap-3 p-4 rounded-xl border transition-colors hover:shadow-card-hover',
      meta.bg, meta.border
    )}>
      <div className="flex-shrink-0 mt-0.5">
        <meta.Icon className={cn('w-4 h-4', meta.iconColor)} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium text-slate-800">— Alert Title —</p>
          <span className="text-[10px] text-slate-400 flex-shrink-0">—</span>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">— Alert description —</p>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-xs text-slate-400">Machine: —</span>
          <span className="text-xs text-slate-400">Shift: —</span>
        </div>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        <Button variant="outline" size="xs" icon={<Check className="w-3 h-3" />}>Acknowledge</Button>
        <button className="p-1 rounded text-slate-400 hover:text-slate-600">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
