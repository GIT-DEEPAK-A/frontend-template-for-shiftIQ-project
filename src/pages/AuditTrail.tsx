import { useState } from 'react'
import { Download, RefreshCw, CheckCircle2, XCircle } from 'lucide-react'
import { PageHeader } from '@/components/shell/AppLayout'
import Button from '@/components/ui/Button'
import FilterBar, { DateRangePicker } from '@/components/ui/FilterBar'
import { NoAuditLogsState } from '@/components/ui/EmptyState'
import { TableSkeleton } from '@/components/ui/Skeletons'


const COLS = ['User', 'Action', 'Module', 'Record', 'Timestamp', 'Device', 'Result']

export default function AuditTrail() {
  const [search, setSearch]       = useState('')
  const [moduleFilter, setModule] = useState('')
  const [resultFilter, setResult] = useState('')
  const loading = false
  const empty   = true

  return (
    <div className="space-y-5">
      <PageHeader
        title="Audit Trail"
        subtitle="Complete log of all system actions and changes"
        actions={
          <>
            <DateRangePicker />
            <Button variant="outline" size="sm" icon={<Download className="w-3.5 h-3.5" />}>Export</Button>
            <Button variant="outline" size="sm" icon={<RefreshCw className="w-3.5 h-3.5" />}>Refresh</Button>
          </>
        }
      />

      {/* Summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Actions',    sub: 'All time'     },
          { label: 'Today',            sub: 'Since 00:00'  },
          { label: 'Failed Actions',   sub: 'Errors only'  },
          { label: 'Active Users',     sub: 'Last 24h'     },
        ].map(s => (
          <div key={s.label} className="card p-3">
            <p className="text-xs text-slate-500 mb-0.5">{s.label}</p>
            <p className="text-xl font-bold text-slate-300">—</p>
            <p className="text-[10px] text-slate-400 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="card overflow-hidden">
        {/* Toolbar */}
        <div className="px-5 py-4 border-b border-slate-100">
          <FilterBar
            search={search}
            onSearch={setSearch}
            searchPlaceholder="Search by user, action, or record…"
            onRefresh={() => {}}
            filters={[
              {
                key: 'module', label: 'Module',
                options: [
                  { value: 'machines',       label: 'Machines'       },
                  { value: 'production',     label: 'Production'     },
                  { value: 'abnormalities',  label: 'Abnormalities'  },
                  { value: 'alerts',         label: 'Alerts'         },
                  { value: 'handover',       label: 'Handover'       },
                  { value: 'maintenance',    label: 'Maintenance'    },
                  { value: 'users',          label: 'Users'          },
                  { value: 'settings',       label: 'Settings'       },
                ],
                value: moduleFilter, onChange: setModule,
              },
              {
                key: 'result', label: 'Result',
                options: [
                  { value: 'success', label: 'Success' },
                  { value: 'failure', label: 'Failure' },
                ],
                value: resultFilter, onChange: setResult,
              },
              { key: 'user', label: 'User', options: [], value: '', onChange: () => {} },
            ]}
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                {COLS.map(c => <th key={c}>{c}</th>)}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <TableSkeleton rows={8} columns={COLS.length} />
              ) : empty ? (
                <tr>
                  <td colSpan={COLS.length}>
                    <NoAuditLogsState />
                  </td>
                </tr>
              ) : null /* Rows from API */}
            </tbody>
          </table>
        </div>

        {/* Pagination placeholder */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100">
          <p className="text-xs text-slate-400">Showing 0 results</p>
          <div className="flex items-center gap-1">
            <button disabled className="px-2 py-1 rounded text-xs text-slate-400 disabled:opacity-40">Prev</button>
            <button disabled className="px-2 py-1 rounded text-xs text-slate-400 disabled:opacity-40">Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Reusable audit row (used when data available) ─────────────────────────

export function AuditRow({
  user, action, module: mod, record, timestamp, device, result
}: {
  user?: string; action?: string; module?: string; record?: string
  timestamp?: string; device?: string; result?: 'success' | 'failure'
}) {
  return (
    <tr>
      <td>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-slate-500">
            {user?.[0]?.toUpperCase() ?? '?'}
          </div>
          <span className="text-sm text-slate-700">{user ?? '—'}</span>
        </div>
      </td>
      <td>
        <span className="text-sm font-medium text-slate-700">{action ?? '—'}</span>
      </td>
      <td>
        <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded font-medium">{mod ?? '—'}</span>
      </td>
      <td className="text-sm text-slate-500 max-w-[200px] truncate">{record ?? '—'}</td>
      <td className="text-xs text-slate-400 whitespace-nowrap">{timestamp ?? '—'}</td>
      <td className="text-xs text-slate-400">{device ?? '—'}</td>
      <td>
        {result === 'success' ? (
          <span className="flex items-center gap-1 text-emerald-600 text-xs font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" /> Success
          </span>
        ) : result === 'failure' ? (
          <span className="flex items-center gap-1 text-red-600 text-xs font-medium">
            <XCircle className="w-3.5 h-3.5" /> Failed
          </span>
        ) : (
          <span className="text-slate-300">—</span>
        )}
      </td>
    </tr>
  )
}
