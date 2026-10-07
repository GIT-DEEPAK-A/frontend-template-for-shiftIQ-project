import { useState } from 'react'
import { Activity, RefreshCw, Download, Cpu, MoreHorizontal } from 'lucide-react'
import { PageHeader } from '@/components/shell/AppLayout'
import Button from '@/components/ui/Button'
import FilterBar from '@/components/ui/FilterBar'
import { StatusBadge } from '@/components/ui/Badge'
import StatusIndicator, { EfficiencyBar } from '@/components/ui/StatusIndicator'
import EmptyState from '@/components/ui/EmptyState'
import { TableSkeleton } from '@/components/ui/Skeletons'

const COLUMNS = [
  { key: 'machine',     label: 'Machine'      },
  { key: 'status',      label: 'Status'       },
  { key: 'production',  label: 'Production'   },
  { key: 'target',      label: 'Target'       },
  { key: 'efficiency',  label: 'Efficiency'   },
  { key: 'parameter',   label: 'Key Parameter'},
  { key: 'updated',     label: 'Last Updated' },
  { key: 'action',      label: ''             },
]

export default function LiveOperations() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const loading = false
  const empty   = true   // flip to false when API connected

  return (
    <div className="space-y-5">
      <PageHeader
        title="Live Operations"
        subtitle="Real-time machine status and production monitoring"
        actions={
          <>
            <Button variant="outline" size="sm" icon={<Download className="w-3.5 h-3.5" />}>Export</Button>
            <Button variant="outline" size="sm" icon={<RefreshCw className="w-3.5 h-3.5" />}>Refresh</Button>
          </>
        }
      />

      {/* Status summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Running',     dot: 'bg-emerald-500', pulse: true  },
          { label: 'Idle',        dot: 'bg-slate-400',   pulse: false },
          { label: 'Maintenance', dot: 'bg-amber-500',   pulse: false },
          { label: 'Fault',       dot: 'bg-red-500',     pulse: true  },
        ].map(s => (
          <div key={s.label} className="card p-3 flex items-center gap-3">
            <StatusIndicator status={s.label.toLowerCase()} size="md" pulse={s.pulse} />
            <div>
              <p className="text-xs text-slate-500">{s.label}</p>
              <p className="text-lg font-bold text-slate-300">—</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter + table */}
      <div className="card overflow-hidden">
        <div className="px-5 pt-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-brand-600" />
            <h2 className="text-section text-slate-900">Machine Status</h2>
            <span className="text-xs text-slate-400">· Live</span>
          </div>
          <FilterBar
            search={search}
            onSearch={setSearch}
            searchPlaceholder="Search machines, IDs, locations…"
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onRefresh={() => {}}
            filters={[
              {
                key: 'status', label: 'Status',
                options: [
                  { value: 'running', label: 'Running' },
                  { value: 'idle',    label: 'Idle'    },
                  { value: 'fault',   label: 'Fault'   },
                ],
                value: statusFilter, onChange: setStatusFilter,
              },
              {
                key: 'line', label: 'Line',
                options: [], value: '', onChange: () => {},
              },
              {
                key: 'shift', label: 'Shift',
                options: [], value: '', onChange: () => {},
              },
            ]}
          />
        </div>

        {viewMode === 'table' ? (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  {COLUMNS.map(c => <th key={c.key}>{c.label}</th>)}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <TableSkeleton rows={6} columns={COLUMNS.length} />
                ) : empty ? (
                  <tr>
                    <td colSpan={COLUMNS.length}>
                      <EmptyState
                        icon={<Activity className="w-6 h-6" />}
                        title="No operational data available"
                        description="Machine data will appear here once your plant data source is connected."
                        action={{ label: 'Refresh', onClick: () => {}, variant: 'outline' }}
                        compact
                      />
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-5">
            {empty ? (
              <EmptyState
                icon={<Cpu className="w-6 h-6" />}
                title="No machines available"
                description="Machine cards will appear once data is connected."
                compact
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {/* Machine cards rendered by API */}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Reusable Machine Row (used when data is available) ─────────────────────

export function MachineTableRow({
  machine, status, production, target, efficiency, parameter, paramValue, paramUnit, updated
}: {
  machine?: string; status?: string; production?: number | null; target?: number | null
  efficiency?: number | null; parameter?: string; paramValue?: string | null
  paramUnit?: string; updated?: string | null
}) {
  return (
    <tr>
      <td>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
            <Cpu className="w-3.5 h-3.5 text-slate-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-800">{machine ?? '—'}</p>
            <p className="text-xs text-slate-400">ID: —</p>
          </div>
        </div>
      </td>
      <td>
        {status
          ? <StatusBadge status={status} />
          : <span className="text-slate-300 text-sm">—</span>
        }
      </td>
      <td>
        <span className="font-medium text-slate-700">{production ?? '—'}</span>
        <span className="text-xs text-slate-400 ml-1">units</span>
      </td>
      <td className="text-slate-500">{target ?? '—'}</td>
      <td>
        {efficiency !== null && efficiency !== undefined
          ? <EfficiencyBar value={efficiency} className="w-28" />
          : <span className="text-slate-300">—</span>
        }
      </td>
      <td>
        <div>
          <p className="text-xs text-slate-500">{parameter ?? '—'}</p>
          <p className="text-sm font-medium text-slate-700">
            {paramValue ?? '—'} <span className="text-xs text-slate-400">{paramUnit}</span>
          </p>
        </div>
      </td>
      <td className="text-xs text-slate-400">{updated ?? '—'}</td>
      <td>
        <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </td>
    </tr>
  )
}
