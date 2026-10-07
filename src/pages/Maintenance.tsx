import { useState } from 'react'
import { Plus, Download, Calendar } from 'lucide-react'
import { PageHeader } from '@/components/shell/AppLayout'
import Button from '@/components/ui/Button'
import FilterBar from '@/components/ui/FilterBar'
import { Tabs, TabList, Tab, TabPanel } from '@/components/ui/Tabs'
import { NoMaintenanceState } from '@/components/ui/EmptyState'
import { TableSkeleton } from '@/components/ui/Skeletons'
import Modal from '@/components/ui/Modal'
import { Input, Select, Textarea } from '@/components/ui/Input'
import { cn } from '@/lib/utils'

const COLS = ['Machine', 'Issue', 'Priority', 'Assigned Technician', 'Created', 'Due', 'Status', '']

export default function Maintenance() {
  const [search, setSearch]       = useState('')
  const [prioFilter, setPrio]     = useState('')
  const [statusFilter, setStatus] = useState('')
  const [createOpen, setCreate]   = useState(false)
  const loading = false
  const empty   = true

  return (
    <div className="space-y-5">
      <PageHeader
        title="Maintenance"
        subtitle="Track and manage all maintenance requests and schedules"
        actions={
          <>
            <Button variant="outline" size="sm" icon={<Calendar className="w-3.5 h-3.5" />}>Schedule View</Button>
            <Button variant="outline" size="sm" icon={<Download className="w-3.5 h-3.5" />}>Export</Button>
            <Button variant="primary" size="sm" icon={<Plus className="w-3.5 h-3.5" />} onClick={() => setCreate(true)}>
              New Request
            </Button>
          </>
        }
      />

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Open Requests',    border: 'border-l-brand-500'  },
          { label: 'Overdue',          border: 'border-l-red-500'    },
          { label: 'In Progress',      border: 'border-l-amber-500'  },
          { label: 'Completed Today',  border: 'border-l-emerald-500'},
        ].map(s => (
          <div key={s.label} className={cn('card p-3 border-l-4', s.border)}>
            <p className="text-xs text-slate-500 mb-1">{s.label}</p>
            <p className="text-xl font-bold text-slate-300">—</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultTab="all">
        <div className="card overflow-hidden">
          <div className="px-5 pt-4 border-b border-slate-100">
            <TabList>
              <Tab id="all">All Requests</Tab>
              <Tab id="scheduled">Scheduled</Tab>
              <Tab id="active">Active</Tab>
              <Tab id="completed">Completed</Tab>
              <Tab id="recurring">Recurring Issues</Tab>
            </TabList>
          </div>

          <div className="px-5 py-3 border-b border-slate-50">
            <FilterBar
              search={search}
              onSearch={setSearch}
              searchPlaceholder="Search by machine, issue, or technician…"
              onRefresh={() => {}}
              filters={[
                {
                  key: 'priority', label: 'Priority',
                  options: [
                    { value: 'critical', label: 'Critical' },
                    { value: 'high',     label: 'High'     },
                    { value: 'medium',   label: 'Medium'   },
                    { value: 'low',      label: 'Low'      },
                  ],
                  value: prioFilter, onChange: setPrio,
                },
                {
                  key: 'status', label: 'Status',
                  options: [
                    { value: 'pending',     label: 'Pending'     },
                    { value: 'in-progress', label: 'In Progress' },
                    { value: 'completed',   label: 'Completed'   },
                    { value: 'overdue',     label: 'Overdue'     },
                  ],
                  value: statusFilter, onChange: setStatus,
                },
                { key: 'machine', label: 'Machine', options: [], value: '', onChange: () => {} },
              ]}
            />
          </div>

          <TabPanel id="all">
            <MaintenanceTable loading={loading} empty={empty} onAdd={() => setCreate(true)} />
          </TabPanel>
          <TabPanel id="scheduled">
            <MaintenanceTable loading={false} empty={true} onAdd={() => setCreate(true)} />
          </TabPanel>
          <TabPanel id="active">
            <MaintenanceTable loading={false} empty={true} onAdd={() => setCreate(true)} />
          </TabPanel>
          <TabPanel id="completed">
            <MaintenanceTable loading={false} empty={true} onAdd={() => setCreate(true)} />
          </TabPanel>
          <TabPanel id="recurring">
            <RecurringIssuesPanel />
          </TabPanel>
        </div>
      </Tabs>

      {/* Create Modal */}
      <MaintenanceRequestModal open={createOpen} onClose={() => setCreate(false)} />
    </div>
  )
}

// ── Maintenance Table ──────────────────────────────────────────────────────

function MaintenanceTable({
  loading, empty, onAdd
}: { loading: boolean; empty: boolean; onAdd: () => void }) {
  return (
    <div className="overflow-x-auto">
      <table className="data-table">
        <thead>
          <tr>{COLS.map(c => <th key={c}>{c}</th>)}</tr>
        </thead>
        <tbody>
          {loading ? (
            <TableSkeleton rows={5} columns={COLS.length} />
          ) : empty ? (
            <tr>
              <td colSpan={COLS.length}>
                <NoMaintenanceState onAdd={onAdd} />
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  )
}

// ── Recurring Issues Panel ─────────────────────────────────────────────────

function RecurringIssuesPanel() {
  return (
    <div className="p-5">
      <p className="text-xs text-slate-500 mb-3">Issues flagged as recurring across multiple maintenance records</p>
      <NoMaintenanceState />
    </div>
  )
}

// ── Maintenance Request Modal ──────────────────────────────────────────────

function MaintenanceRequestModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [submitting, setSubmitting] = useState(false)

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New Maintenance Request"
      subtitle="Log a maintenance issue for technician follow-up"
      size="lg"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="sm" loading={submitting} onClick={() => { setSubmitting(true); setTimeout(() => { setSubmitting(false); onClose() }, 1200) }}>
            Submit Request
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Machine"
            required
            placeholder="— Select machine —"
            options={[]}
          />
          <Select
            label="Issue Type"
            required
            placeholder="— Select issue type —"
            options={[
              { value: 'mechanical',  label: 'Mechanical'   },
              { value: 'electrical',  label: 'Electrical'   },
              { value: 'lubrication', label: 'Lubrication'  },
              { value: 'calibration', label: 'Calibration'  },
              { value: 'cleaning',    label: 'Cleaning'     },
              { value: 'other',       label: 'Other'        },
            ]}
          />
          <Select
            label="Priority"
            required
            placeholder="— Select priority —"
            options={[
              { value: 'critical', label: '🔴 Critical' },
              { value: 'high',     label: '🟠 High'     },
              { value: 'medium',   label: '🟡 Medium'   },
              { value: 'low',      label: '⚪ Low'      },
            ]}
          />
          <Select
            label="Assign To"
            placeholder="— Select technician —"
            options={[]}
          />
          <Input label="Due Date" type="date" />
          <Select
            label="Related Abnormality"
            placeholder="— Link to abnormality (optional) —"
            options={[]}
          />
        </div>
        <Textarea
          label="Issue Description"
          required
          placeholder="Describe the maintenance issue, symptoms observed, and any relevant context…"
          rows={4}
        />
        <Textarea
          label="Recommended Action"
          placeholder="Describe the recommended maintenance action or steps to follow…"
          rows={3}
        />
      </div>
    </Modal>
  )
}
