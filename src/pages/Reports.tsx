import { useState } from 'react'
import {
  BarChart2, AlertTriangle, Wrench, Cpu, GitMerge,
  Download, Clock, RefreshCw, Filter
} from 'lucide-react'
import { PageHeader } from '@/components/shell/AppLayout'
import Button from '@/components/ui/Button'
import FilterBar, { DateRangePicker } from '@/components/ui/FilterBar'
import { Select } from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import { NoReportsState } from '@/components/ui/EmptyState'
import { Tabs, TabList, Tab, TabPanel } from '@/components/ui/Tabs'
import { cn } from '@/lib/utils'

const REPORT_TYPES = [
  {
    id: 'shift',
    title: 'Shift Report',
    description: 'Complete summary of shift activities including production, abnormalities, and handover notes.',
    icon: Clock,
    color: 'text-brand-600',
    bg: 'bg-brand-50',
    border: 'border-brand-100',
  },
  {
    id: 'production',
    title: 'Production Report',
    description: 'Detailed production analytics including output vs. target, efficiency, and downtime analysis.',
    icon: BarChart2,
    color: 'text-teal-600',
    bg: 'bg-teal-50',
    border: 'border-teal-100',
  },
  {
    id: 'downtime',
    title: 'Downtime Report',
    description: 'Downtime incidents, root causes, duration analysis, and impact on production targets.',
    icon: RefreshCw,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
  },
  {
    id: 'abnormality',
    title: 'Abnormality Report',
    description: 'All reported abnormalities with severity breakdown, resolution status, and trend analysis.',
    icon: AlertTriangle,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    border: 'border-orange-100',
  },
  {
    id: 'maintenance',
    title: 'Maintenance Report',
    description: 'Maintenance requests, completion rates, recurring issues, and scheduled maintenance compliance.',
    icon: Wrench,
    color: 'text-slate-600',
    bg: 'bg-slate-100',
    border: 'border-slate-200',
  },
  {
    id: 'machine-health',
    title: 'Machine Health Report',
    description: 'Overall equipment effectiveness (OEE), health scores, and condition-based monitoring summary.',
    icon: Cpu,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
  },
  {
    id: 'cross-shift',
    title: 'Cross-Shift Report',
    description: 'Pattern analysis across shifts — recurring issues, shift comparisons, and operational continuity.',
    icon: GitMerge,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-100',
  },
] as const

export default function Reports() {
  const [configOpen, setConfigOpen]     = useState(false)
  const [selectedReport, setSelected]   = useState<string | null>(null)
  const [search, setSearch]             = useState('')

  const openConfig = (id: string) => {
    setSelected(id)
    setConfigOpen(true)
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Reports"
        subtitle="Generate and export operational reports for any time range"
        actions={
          <>
            <DateRangePicker />
            <Button variant="outline" size="sm" icon={<Filter className="w-3.5 h-3.5" />}>Configure</Button>
          </>
        }
      />

      {/* ── Report catalog ── */}
      <Tabs defaultTab="generate">
        <div className="card overflow-hidden">
          <div className="px-5 pt-4 border-b border-slate-100">
            <TabList>
              <Tab id="generate">Generate Reports</Tab>
              <Tab id="history">Report History</Tab>
              <Tab id="scheduled">Scheduled Reports</Tab>
            </TabList>
          </div>

          <TabPanel id="generate">
            <div className="p-5">
              <div className="mb-4">
                <FilterBar
                  search={search}
                  onSearch={setSearch}
                  searchPlaceholder="Search report types…"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {REPORT_TYPES.map(report => (
                  <ReportCard
                    key={report.id}
                    {...report}
                    onGenerate={() => openConfig(report.id)}
                  />
                ))}
              </div>
            </div>
          </TabPanel>

          <TabPanel id="history">
            <div className="p-5">
              <NoReportsState onGenerate={() => {}} />
            </div>
          </TabPanel>

          <TabPanel id="scheduled">
            <div className="p-5">
              <div className="py-8 text-center">
                <Clock className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-medium text-slate-500">No scheduled reports</p>
                <p className="text-xs text-slate-400 mt-1">Schedule reports to be generated and delivered automatically.</p>
                <Button variant="outline" size="sm" className="mt-4">Schedule a Report</Button>
              </div>
            </div>
          </TabPanel>
        </div>
      </Tabs>

      {/* ── Report Config Modal ── */}
      <ReportConfigModal
        open={configOpen}
        onClose={() => setConfigOpen(false)}
        reportId={selectedReport}
        reportTitle={REPORT_TYPES.find(r => r.id === selectedReport)?.title ?? ''}
      />
    </div>
  )
}

// ── Report Card ────────────────────────────────────────────────────────────

interface ReportCardProps {
  id: string
  title: string
  description: string
  icon: React.ElementType
  color: string
  bg: string
  border: string
  onGenerate: () => void
}

function ReportCard({ title, description, icon: Icon, color, bg, border, onGenerate }: ReportCardProps) {
  return (
    <div className={cn('card p-4 hover:shadow-card-hover transition-shadow flex flex-col gap-4', border)}>
      {/* Icon + title */}
      <div className="flex items-start gap-3">
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', bg)}>
          <Icon className={cn('w-5 h-5', color)} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-slate-800 leading-tight">{title}</h3>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-slate-500 leading-relaxed flex-1">{description}</p>

      {/* Actions */}
      <div className="flex items-center gap-2 mt-auto pt-2 border-t border-slate-100">
        <Button variant="primary" size="xs" fullWidth onClick={onGenerate}>
          Generate
        </Button>
        <Button variant="outline" size="xs" icon={<Download className="w-3 h-3" />} aria-label="Export">
          Export
        </Button>
      </div>
    </div>
  )
}

// ── Report Config Modal ────────────────────────────────────────────────────

interface ReportConfigModalProps {
  open: boolean
  onClose: () => void
  reportId: string | null
  reportTitle: string
}

function ReportConfigModal({ open, onClose, reportTitle }: Omit<ReportConfigModalProps, 'reportId'> & { reportId?: string | null }) {
  const [generating, setGenerating] = useState(false)

  const generate = () => {
    setGenerating(true)
    setTimeout(() => { setGenerating(false); onClose() }, 2000)
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Generate: ${reportTitle}`}
      subtitle="Configure report parameters before generating"
      size="md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button variant="outline" size="sm" icon={<Download className="w-3.5 h-3.5" />}>
            Export Only
          </Button>
          <Button variant="primary" size="sm" loading={generating} onClick={generate}>
            Generate Report
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Date Range"
            options={[
              { value: 'today',      label: 'Today'          },
              { value: 'yesterday',  label: 'Yesterday'      },
              { value: 'this-week',  label: 'This Week'      },
              { value: 'last-week',  label: 'Last Week'      },
              { value: 'this-month', label: 'This Month'     },
              { value: 'custom',     label: 'Custom Range…'  },
            ]}
          />
          <Select
            label="Shift"
            placeholder="All shifts"
            options={[
              { value: 'morning',   label: 'Morning'   },
              { value: 'afternoon', label: 'Afternoon' },
              { value: 'night',     label: 'Night'     },
            ]}
          />
          <Select
            label="Machine"
            placeholder="All machines"
            options={[]}
          />
          <Select
            label="Export Format"
            options={[
              { value: 'pdf',  label: 'PDF'  },
              { value: 'xlsx', label: 'Excel (XLSX)' },
              { value: 'csv',  label: 'CSV'  },
            ]}
          />
        </div>
        <Select
          label="Include Sections"
          placeholder="All sections (default)"
          options={[]}
          hint="Leave blank to include all report sections"
        />
      </div>
    </Modal>
  )
}
