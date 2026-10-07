import { useState } from 'react'
import { Cpu, Plus, Upload, MoreHorizontal, Eye } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/shell/AppLayout'
import Button from '@/components/ui/Button'
import FilterBar from '@/components/ui/FilterBar'
import { StatusBadge } from '@/components/ui/Badge'
import { HealthBar } from '@/components/ui/StatusIndicator'
import { NoMachinesState } from '@/components/ui/EmptyState'
import { LoadError } from '@/components/ui/ErrorState'
import { TableSkeleton, MachineCardSkeleton } from '@/components/ui/Skeletons'
import { cn } from '@/lib/utils'

type PageState = 'loading' | 'empty' | 'error' | 'data'
const STATE: PageState = 'empty'

const COLUMNS = ['Machine', 'Status', 'Location', 'Production', 'Health', 'Last Updated', 'Actions']

export default function Machines() {
  const navigate = useNavigate()
  const [search, setSearch]     = useState('')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const [statusFilter, setStatusFilter] = useState('')

  return (
    <div className="space-y-5">
      <PageHeader
        title="Machines"
        subtitle="Manage and monitor all plant equipment"
        actions={
          <>
            <Button variant="outline" size="sm" icon={<Upload className="w-3.5 h-3.5" />}>Import</Button>
            <Button variant="primary" size="sm" icon={<Plus className="w-3.5 h-3.5" />}>Add Machine</Button>
          </>
        }
      />

      <div className="card overflow-hidden">
        {/* Toolbar */}
        <div className="px-5 py-4 border-b border-slate-100">
          <FilterBar
            search={search}
            onSearch={setSearch}
            searchPlaceholder="Search by name, ID, or location…"
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onRefresh={() => {}}
            filters={[
              {
                key: 'status', label: 'Status',
                options: [
                  { value: 'running',     label: 'Running'     },
                  { value: 'idle',        label: 'Idle'        },
                  { value: 'maintenance', label: 'Maintenance' },
                  { value: 'fault',       label: 'Fault'       },
                  { value: 'offline',     label: 'Offline'     },
                ],
                value: statusFilter, onChange: setStatusFilter,
              },
              {
                key: 'location', label: 'Location',
                options: [], value: '', onChange: () => {},
              },
              {
                key: 'type', label: 'Type',
                options: [], value: '', onChange: () => {},
              },
            ]}
          />
        </div>

        {/* Body */}
        {STATE === 'loading' && viewMode === 'table' && (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead><tr>{COLUMNS.map(c => <th key={c}>{c}</th>)}</tr></thead>
              <tbody><TableSkeleton rows={6} columns={COLUMNS.length} /></tbody>
            </table>
          </div>
        )}

        {STATE === 'loading' && viewMode === 'grid' && (
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => <MachineCardSkeleton key={i} />)}
          </div>
        )}

        {STATE === 'error' && (
          <LoadError onRetry={() => {}} />
        )}

        {STATE === 'empty' && (
          <NoMachinesState onAdd={() => {}} />
        )}

        {STATE === 'data' && viewMode === 'table' && (
          <MachineTable onRowClick={id => navigate(`/machines/${id}`)} />
        )}

        {STATE === 'data' && viewMode === 'grid' && (
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Machine cards rendered from API data */}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Machine table (shown when data available) ─────────────────────────────

function MachineTable({ onRowClick }: { onRowClick: (id: string) => void }) {
  return (
    <div className="overflow-x-auto">
      <table className="data-table">
        <thead>
          <tr>{COLUMNS.map(c => <th key={c}>{c}</th>)}</tr>
        </thead>
        <tbody>
          {/* Rows rendered from API */}
          <MachineRow onClick={() => onRowClick('placeholder')} />
        </tbody>
      </table>
    </div>
  )
}

export function MachineRow({ onClick }: { onClick?: () => void }) {
  return (
    <tr className={cn(onClick && 'cursor-pointer')} onClick={onClick}>
      <td>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
            <Cpu className="w-4 h-4 text-slate-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-800">—</p>
            <p className="text-xs text-slate-400">ID: —</p>
          </div>
        </div>
      </td>
      <td><StatusBadge status="idle" /></td>
      <td className="text-sm text-slate-500">—</td>
      <td className="text-sm text-slate-500">— / — units</td>
      <td><HealthBar value={null} showValue className="w-24" /></td>
      <td className="text-xs text-slate-400">—</td>
      <td>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="xs" icon={<Eye className="w-3 h-3" />}>View</Button>
          <button className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  )
}
