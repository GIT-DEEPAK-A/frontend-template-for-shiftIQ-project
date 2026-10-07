import { useState } from 'react'
import { GitMerge, RefreshCw, Download, Clock, Zap, ChevronRight } from 'lucide-react'
import { PageHeader } from '@/components/shell/AppLayout'
import Button from '@/components/ui/Button'
import { Select } from '@/components/ui/Input'
import { DateRangePicker } from '@/components/ui/FilterBar'
import { StatusBadge } from '@/components/ui/Badge'
import { NoCrossShiftMemoryState } from '@/components/ui/EmptyState'
import { TimelineSkeleton } from '@/components/ui/Skeletons'
import ChartContainer from '@/components/ui/ChartContainer'

export default function CrossShiftMemory() {
  const [machine, setMachine]   = useState('')
  const [parameter, setParam]   = useState('')
  const [shift, setShift]       = useState('')
  const [issueType, setIssue]   = useState('')
  const loading = false
  const empty   = true

  return (
    <div className="space-y-5">
      <PageHeader
        title="Cross-Shift Memory"
        subtitle="Operational history and pattern analysis across shift boundaries"
        actions={
          <>
            <Button variant="outline" size="sm" icon={<Download className="w-3.5 h-3.5" />}>Export</Button>
            <Button variant="outline" size="sm" icon={<RefreshCw className="w-3.5 h-3.5" />}>Refresh</Button>
          </>
        }
      />

      {/* ── Control panel ── */}
      <div className="card p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <Select
            placeholder="— Select Machine —"
            options={[]}
            value={machine}
            onChange={e => setMachine(e.target.value)}
          />
          <Select
            placeholder="— Select Parameter —"
            options={[]}
            value={parameter}
            onChange={e => setParam(e.target.value)}
          />
          <DateRangePicker />
          <Select
            placeholder="— Select Shift —"
            options={[
              { value: 'morning',   label: 'Morning'   },
              { value: 'afternoon', label: 'Afternoon' },
              { value: 'night',     label: 'Night'     },
            ]}
            value={shift}
            onChange={e => setShift(e.target.value)}
          />
          <Select
            placeholder="— Issue Type —"
            options={[
              { value: 'abnormality',  label: 'Abnormality'  },
              { value: 'maintenance',  label: 'Maintenance'  },
              { value: 'quality',      label: 'Quality'      },
              { value: 'production',   label: 'Production'   },
              { value: 'parameter',    label: 'Parameter'    },
            ]}
            value={issueType}
            onChange={e => setIssue(e.target.value)}
          />
        </div>
      </div>

      {/* ── Summary KPIs ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Events Recorded',    icon: <Clock className="w-4 h-4 text-brand-500" /> },
          { label: 'Recurring Patterns', icon: <GitMerge className="w-4 h-4 text-teal-600" /> },
          { label: 'Shifts Covered',     icon: <Clock className="w-4 h-4 text-slate-500" /> },
          { label: 'Unresolved Issues',  icon: <Zap className="w-4 h-4 text-amber-500" /> },
        ].map(k => (
          <div key={k.label} className="card p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
              {k.icon}
            </div>
            <div>
              <p className="text-xs text-slate-500">{k.label}</p>
              <p className="text-lg font-bold text-slate-300">—</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* ── Timeline ── */}
        <div className="lg:col-span-2">
          <div className="card overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <h2 className="text-section text-slate-900">Operational Timeline</h2>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-400">Sorted by: </span>
                  <Select
                    options={[
                      { value: 'newest', label: 'Newest first' },
                      { value: 'oldest', label: 'Oldest first' },
                    ]}
                    value="newest"
                    onChange={() => {}}
                    className="text-xs py-1.5 h-7 w-36"
                  />
                </div>
              </div>
            </div>

            <div className="p-5">
              {loading ? (
                <TimelineSkeleton items={5} />
              ) : empty ? (
                <NoCrossShiftMemoryState />
              ) : (
                <TimelineView />
              )}
            </div>
          </div>
        </div>

        {/* ── Pattern analysis sidebar ── */}
        <div className="space-y-4">
          {/* AI Pattern panel */}
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-slate-800">AI Pattern Analysis</h3>
            </div>
            <p className="text-xs text-slate-400 italic mb-4">
              [AI pattern insights will appear here once sufficient historical data is available across shifts]
            </p>
            <Button variant="outline" size="sm" fullWidth>Run Analysis</Button>
          </div>

          {/* Recurrence chart */}
          <ChartContainer title="Issue Recurrence" height="h-40" empty>
            <></>
          </ChartContainer>

          {/* Shift comparison */}
          <div className="card p-4">
            <h3 className="text-sm font-semibold text-slate-800 mb-3">Shift Comparison</h3>
            <div className="space-y-3">
              {['Morning', 'Afternoon', 'Night'].map(shift => (
                <div key={shift} className="flex items-center justify-between">
                  <span className="text-xs text-slate-600">{shift}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 bg-slate-100 rounded-full">
                      <div className="w-0 h-full bg-brand-400 rounded-full" />
                    </div>
                    <span className="text-xs text-slate-400">—</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Timeline View (structure only) ────────────────────────────────────────

function TimelineView() {
  // Rendered from API data — structure placeholder only
  return (
    <div className="relative">
      <div className="absolute left-3.5 top-0 bottom-0 w-px bg-slate-100" />
      <div className="space-y-4">
        <TimelineEvent />
        <TimelineEvent />
      </div>
    </div>
  )
}

function TimelineEvent() {
  return (
    <div className="flex gap-4 relative">
      <div className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center flex-shrink-0 z-10">
        <Clock className="w-3 h-3 text-slate-400" />
      </div>
      <div className="flex-1 pb-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">— Date / Shift —</p>
            <p className="text-sm font-medium text-slate-700 mt-0.5">— Event description —</p>
          </div>
          <StatusBadge status="open" />
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
          <span>Parameter: —</span>
          <span>Machine: —</span>
          <span>Reported by: —</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Button variant="ghost" size="xs" iconRight={<ChevronRight className="w-3 h-3" />}>View Details</Button>
        </div>
      </div>
    </div>
  )
}
