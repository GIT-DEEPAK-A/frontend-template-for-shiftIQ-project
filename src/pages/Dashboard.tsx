import { useState } from 'react'
import {
  Activity, Cpu, AlertTriangle, Clock,
  RefreshCw, Filter, LayoutGrid, List,
  ArrowRight, Zap, Target, Timer, TrendingUp
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { PageHeader } from '@/components/shell/AppLayout'
import { KpiCard } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/Badge'
import FilterBar, { DateRangePicker } from '@/components/ui/FilterBar'
import ChartContainer, { LegendItem } from '@/components/ui/ChartContainer'
import EmptyState from '@/components/ui/EmptyState'
import { AlertBanner } from '@/components/ui/ErrorState'
import { KpiSkeleton, TableSkeleton } from '@/components/ui/Skeletons'
import { cn } from '@/lib/utils'

// ── Demo loading/empty state control ──────────────────────────────────────
// In production these would be driven by API state hooks.
const DEMO_STATE: 'loading' | 'empty' | 'data' = 'data'

// ── Placeholder chart data shape (no real values) ─────────────────────────
const TREND_PLACEHOLDER = Array.from({ length: 8 }, (_, i) => ({
  label: `T${i + 1}`,
  production: null as number | null,
  target: null as number | null,
}))

// Realistic-looking structure chart — values are structural only
const CHART_DATA = Array.from({ length: 7 }, (_, i) => ({
  name: ['', '', '', '', '', '', ''][i],
  actual: 0,
  target: 0,
  efficiency: 0,
}))

export default function Dashboard() {
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const loading = DEMO_STATE === 'loading'
  const empty   = DEMO_STATE === 'empty'

  return (
    <div className="space-y-6">
      {/* ── Page header ── */}
      <PageHeader
        title="Dashboard"
        subtitle="Operational overview — connect your data source to populate this view"
        actions={
          <>
            <DateRangePicker />
            <Button variant="outline" size="sm" icon={<Filter className="w-3.5 h-3.5" />}>
              Filter
            </Button>
            <Button variant="outline" size="sm" icon={<RefreshCw className="w-3.5 h-3.5" />}>
              Refresh
            </Button>
          </>
        }
      />

      {/* ── Status banner (shown when offline/degraded) ── */}
      <AlertBanner
        variant="info"
        title="Awaiting live data connection"
        description="Connect your plant data source via Settings → Integrations to populate this dashboard."
        onDismiss={() => {}}
      />

      {/* ── KPI Row ── */}
      <section aria-label="Key performance indicators">
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <KpiSkeleton key={i} />)
          ) : (
            <>
              <KpiCard
                title="Overall Equipment Effectiveness"
                icon={<Zap className="w-4 h-4" />}
                status={null}
                trend={null}
              />
              <KpiCard
                title="Production vs Target"
                icon={<Target className="w-4 h-4" />}
                status={null}
                trend={null}
              />
              <KpiCard
                title="Active Machines"
                icon={<Cpu className="w-4 h-4" />}
                status={null}
                trend={null}
              />
              <KpiCard
                title="Open Abnormalities"
                icon={<AlertTriangle className="w-4 h-4" />}
                status={null}
                trend={null}
              />
              <KpiCard
                title="Downtime (hrs)"
                icon={<Timer className="w-4 h-4" />}
                status={null}
                trend={null}
              />
              <KpiCard
                title="Shift Efficiency"
                icon={<TrendingUp className="w-4 h-4" />}
                status={null}
                trend={null}
              />
            </>
          )}
        </div>
      </section>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Production vs Target - wide */}
        <div className="lg:col-span-2">
          <ChartContainer
            title="Production vs Target"
            subtitle="Shift-by-shift comparison"
            height="h-64"
            loading={loading}
            empty={empty}
            onRetry={() => {}}
            legendContent={
              <>
                <LegendItem color="#3b82f6" label="Actual Production" />
                <LegendItem color="#94a3b8" label="Target" />
              </>
            }
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CHART_DATA} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,.08)' }}
                  formatter={() => ['—', '']}
                />
                <Bar dataKey="actual" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Actual" />
                <Bar dataKey="target" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="Target" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* Shift trend - narrow */}
        <ChartContainer
          title="Efficiency Trend"
          subtitle="Last 8 periods"
          height="h-64"
          loading={loading}
          empty={empty}
          onRetry={() => {}}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={TREND_PLACEHOLDER} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="effGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
                formatter={() => ['—', '']}
              />
              <Area type="monotone" dataKey="production" stroke="#3b82f6" fill="url(#effGrad)" strokeWidth={2} name="Efficiency" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* ── Live Operations Table ── */}
      <section aria-label="Live operations">
        <div className="card overflow-hidden">
          {/* Section header */}
          <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Activity className="w-4 h-4 text-brand-600" />
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500 border border-white" />
              </div>
              <h2 className="text-section text-slate-900">Live Operations</h2>
              <span className="text-xs text-slate-400 font-normal">· Updates in real-time</span>
            </div>
            <div className="flex items-center gap-2">
              {/* View toggle */}
              <div className="flex border border-slate-200 rounded-lg overflow-hidden bg-white">
                <button
                  onClick={() => setViewMode('table')}
                  className={cn('p-1.5', viewMode === 'table' ? 'bg-brand-50 text-brand-600' : 'text-slate-400 hover:bg-slate-50')}
                  aria-label="Table view"
                ><List className="w-4 h-4" /></button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn('p-1.5', viewMode === 'grid' ? 'bg-brand-50 text-brand-600' : 'text-slate-400 hover:bg-slate-50')}
                  aria-label="Grid view"
                ><LayoutGrid className="w-4 h-4" /></button>
              </div>
              <Button variant="ghost" size="sm" iconRight={<ArrowRight className="w-3.5 h-3.5" />}>
                View all
              </Button>
            </div>
          </div>

          {/* Filter bar */}
          <div className="px-5 py-3 border-b border-slate-50">
            <FilterBar
              search={search}
              onSearch={setSearch}
              searchPlaceholder="Search machines…"
              filters={[
                {
                  key: 'status',
                  label: 'Status',
                  options: [
                    { value: 'running',     label: 'Running'     },
                    { value: 'idle',        label: 'Idle'        },
                    { value: 'maintenance', label: 'Maintenance' },
                    { value: 'fault',       label: 'Fault'       },
                  ],
                  value: statusFilter,
                  onChange: setStatusFilter,
                },
              ]}
            />
          </div>

          {/* Table / Grid body */}
          {loading ? (
            <table className="data-table">
              <thead>
                <tr>
                  {['Machine', 'Status', 'Production', 'Target', 'Efficiency', 'Parameter', 'Last Updated', 'Action'].map(h => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody><TableSkeleton rows={5} columns={8} /></tbody>
            </table>
          ) : empty ? (
            <div className="py-16">
              <EmptyState
                icon={<Activity className="w-6 h-6" />}
                title="No operational data available"
                description="Machine data will appear here once your plant is connected and machines are reporting."
                action={{ label: 'Refresh', onClick: () => {} }}
              />
            </div>
          ) : viewMode === 'table' ? (
            <LiveOpsTable />
          ) : (
            <LiveOpsGrid />
          )}
        </div>
      </section>

      {/* ── Bottom row: Alerts + Shift Summary ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RecentAlertsPanel />
        <ShiftSummaryPanel />
      </div>
    </div>
  )
}

// ── Live Ops Table (empty state ready) ────────────────────────────────────

function LiveOpsTable() {
  const COLS = ['Machine', 'Status', 'Production', 'Target', 'Efficiency', 'Last Key Parameter', 'Updated', '']

  return (
    <div className="overflow-x-auto">
      <table className="data-table">
        <thead>
          <tr>
            {COLS.map(h => <th key={h}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={COLS.length}>
              <EmptyState
                icon={<Cpu className="w-5 h-5" />}
                title="No operational data available"
                description="Machine status will populate once data feeds are connected."
                action={{ label: 'Refresh', onClick: () => {}, variant: 'outline' }}
                compact
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

// ── Live Ops Grid ──────────────────────────────────────────────────────────

function LiveOpsGrid() {
  return (
    <div className="p-5">
      <EmptyState
        icon={<LayoutGrid className="w-5 h-5" />}
        title="No machines to display"
        description="Grid view will show machine cards once data is available."
        compact
      />
    </div>
  )
}

// ── Recent Alerts Panel ────────────────────────────────────────────────────

function RecentAlertsPanel() {
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <h2 className="text-section text-slate-900">Recent Alerts</h2>
        </div>
        <Button variant="ghost" size="sm" iconRight={<ArrowRight className="w-3.5 h-3.5" />}>
          View all
        </Button>
      </div>
      <div className="divide-y divide-slate-50">
        {/* Critical placeholder */}
        <AlertPlaceholderRow severity="critical" />
        <AlertPlaceholderRow severity="warning" />
        <AlertPlaceholderRow severity="info" />
      </div>
      {/* Empty state (hidden when data available) */}
      <div className="py-8">
        <EmptyState
          icon={<AlertTriangle className="w-5 h-5" />}
          title="No active alerts"
          description="All systems are operating within normal parameters."
          compact
        />
      </div>
    </div>
  )
}

function AlertPlaceholderRow({ severity }: { severity: 'critical' | 'warning' | 'info' }) {
  // Structure-only rows — all real data comes from API
  const colorMap = {
    critical: 'bg-red-50 border-l-4 border-l-red-400',
    warning:  'bg-amber-50 border-l-4 border-l-amber-400',
    info:     'bg-brand-50 border-l-4 border-l-brand-400',
  }
  return (
    <div className={cn('hidden px-5 py-3 gap-3', colorMap[severity])}>
      <div className="flex-1 min-w-0">
        <div className="skeleton h-3.5 w-48 mb-1.5" />
        <div className="skeleton h-3 w-32" />
      </div>
      <StatusBadge status={severity} />
    </div>
  )
}

// ── Shift Summary Panel ────────────────────────────────────────────────────

function ShiftSummaryPanel() {
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-brand-600" />
          <h2 className="text-section text-slate-900">Current Shift</h2>
        </div>
        <Button variant="ghost" size="sm" iconRight={<ArrowRight className="w-3.5 h-3.5" />}>
          Handover
        </Button>
      </div>
      <div className="p-5 space-y-4">
        {/* Shift info row */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Shift',         placeholder: '—' },
            { label: 'Supervisor',    placeholder: '—' },
            { label: 'Shift Start',   placeholder: '—' },
            { label: 'Shift End',     placeholder: '—' },
          ].map(item => (
            <div key={item.label}>
              <p className="text-xs text-slate-500 mb-0.5">{item.label}</p>
              <p className="text-sm font-medium text-slate-400">{item.placeholder}</p>
            </div>
          ))}
        </div>

        <div className="section-divider" />

        {/* Machine summary stubs */}
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Machine Status Summary</p>
          <div className="space-y-2">
            {[
              { label: 'Running',     color: 'bg-emerald-400', width: 'w-0' },
              { label: 'Idle',        color: 'bg-slate-300',   width: 'w-0' },
              { label: 'Maintenance', color: 'bg-amber-400',   width: 'w-0' },
              { label: 'Fault',       color: 'bg-red-400',     width: 'w-0' },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-3">
                <span className="text-xs text-slate-500 w-20 flex-shrink-0">{s.label}</span>
                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={cn('h-full rounded-full', s.color, s.width)} />
                </div>
                <span className="text-xs text-slate-400 w-6 text-right">—</span>
              </div>
            ))}
          </div>
        </div>

        <div className="section-divider" />

        {/* Pending handover notice */}
        <div className="flex items-start gap-3 p-3 bg-brand-50 rounded-xl border border-brand-100">
          <ArrowRight className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-brand-800">Handover pending</p>
            <p className="text-xs text-brand-600 mt-0.5">No handover has been started for this shift.</p>
          </div>
          <Button variant="primary" size="xs">Start</Button>
        </div>
      </div>
    </div>
  )
}
