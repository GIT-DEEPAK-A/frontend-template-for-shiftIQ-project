import { useState } from 'react'
import {
  Plus, Download, Camera, Mic, MicOff
} from 'lucide-react'
import { PageHeader } from '@/components/shell/AppLayout'
import Button from '@/components/ui/Button'
import FilterBar from '@/components/ui/FilterBar'
import { NoAbnormalitiesState } from '@/components/ui/EmptyState'
import { TableSkeleton } from '@/components/ui/Skeletons'
import { InlineError } from '@/components/ui/ErrorState'
import Modal from '@/components/ui/Modal'
import { Input, Select, Textarea } from '@/components/ui/Input'
import { UploadProgress } from '@/components/ui/ProgressIndicator'
import { cn } from '@/lib/utils'

const COLS = ['Issue', 'Machine', 'Severity', 'Reported By', 'Shift', 'Time', 'Status', 'Assigned To', '']

export default function Abnormalities() {
  const [search, setSearch]       = useState('')
  const [sevFilter, setSevFilter] = useState('')
  const [statusFilter, setStatus] = useState('')
  const [reportOpen, setReport]   = useState(false)
  const loading = false
  const empty   = true

  return (
    <div className="space-y-5">
      <PageHeader
        title="Abnormalities"
        subtitle="Track, manage and resolve operational abnormalities"
        actions={
          <>
            <Button variant="outline" size="sm" icon={<Download className="w-3.5 h-3.5" />}>Export</Button>
            <Button variant="primary" size="sm" icon={<Plus className="w-3.5 h-3.5" />} onClick={() => setReport(true)}>
              Report Abnormality
            </Button>
          </>
        }
      />

      {/* Summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Critical',    color: 'border-l-red-500'    },
          { label: 'High',        color: 'border-l-orange-500' },
          { label: 'Open',        color: 'border-l-amber-500'  },
          { label: 'In Progress', color: 'border-l-brand-500'  },
        ].map(s => (
          <div key={s.label} className={cn('card p-3 border-l-4', s.color)}>
            <p className="text-xs text-slate-500 mb-1">{s.label}</p>
            <p className="text-xl font-bold text-slate-300">—</p>
          </div>
        ))}
      </div>

      <div className="card overflow-hidden">
        {/* Toolbar */}
        <div className="px-5 py-4 border-b border-slate-100">
          <FilterBar
            search={search}
            onSearch={setSearch}
            searchPlaceholder="Search issues, machines…"
            onRefresh={() => {}}
            filters={[
              {
                key: 'severity', label: 'Severity',
                options: [
                  { value: 'critical', label: 'Critical' },
                  { value: 'high',     label: 'High'     },
                  { value: 'medium',   label: 'Medium'   },
                  { value: 'low',      label: 'Low'      },
                ],
                value: sevFilter, onChange: setSevFilter,
              },
              {
                key: 'status', label: 'Status',
                options: [
                  { value: 'open',        label: 'Open'        },
                  { value: 'in-progress', label: 'In Progress' },
                  { value: 'resolved',    label: 'Resolved'    },
                  { value: 'closed',      label: 'Closed'      },
                ],
                value: statusFilter, onChange: setStatus,
              },
              { key: 'machine', label: 'Machine', options: [], value: '', onChange: () => {} },
              { key: 'date',    label: 'Date',    options: [], value: '', onChange: () => {} },
            ]}
          />
        </div>

        {/* Table */}
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
                    <NoAbnormalitiesState />
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Report Form Modal ── */}
      <AbnormalityReportModal open={reportOpen} onClose={() => setReport(false)} />
    </div>
  )
}

// ── Abnormality Report Modal ───────────────────────────────────────────────

function AbnormalityReportModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [submitting, setSubmitting] = useState(false)
  const [recording, setRecording]   = useState(false)
  const [uploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
  const [formError, setFormError] = useState('')

  const handleSubmit = (_draft = false) => {
    setSubmitting(true)
    setTimeout(() => { setSubmitting(false); onClose() }, 1500)
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Report Abnormality"
      subtitle="Document the issue for investigation and tracking"
      size="lg"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={() => handleSubmit(true)} disabled={submitting}>
            Save Draft
          </Button>
          <Button variant="primary" size="sm" loading={submitting} onClick={() => handleSubmit(false)}>
            Submit Report
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        {formError && <InlineError message={formError} onDismiss={() => setFormError('')} />}

        {/* Row 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Machine"
            required
            placeholder="— Select machine —"
            options={[]}
            hint="Select the machine where the issue occurred"
          />
          <Select
            label="Issue Type"
            required
            placeholder="— Select type —"
            options={[
              { value: 'mechanical',  label: 'Mechanical'   },
              { value: 'electrical',  label: 'Electrical'   },
              { value: 'quality',     label: 'Quality'      },
              { value: 'safety',      label: 'Safety'       },
              { value: 'process',     label: 'Process'      },
              { value: 'other',       label: 'Other'        },
            ]}
          />
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Severity"
            required
            placeholder="— Select severity —"
            options={[
              { value: 'critical', label: '🔴 Critical — Immediate action required' },
              { value: 'high',     label: '🟠 High — Action required this shift'    },
              { value: 'medium',   label: '🟡 Medium — Monitor and schedule'        },
              { value: 'low',      label: '⚪ Low — Document and review'            },
            ]}
          />
          <Select
            label="Parameter Affected"
            placeholder="— Select parameter —"
            options={[]}
            hint="Optional: select the affected parameter"
          />
        </div>

        {/* Description */}
        <Textarea
          label="Description"
          required
          placeholder="Describe the abnormality in detail — what was observed, when it started, any relevant context…"
          rows={4}
          hint="Be specific. This description will be used for root cause analysis."
        />

        {/* Row 3: current value */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Current / Observed Value"
            placeholder="e.g. 87.3"
            hint="The value reading at time of observation"
          />
          <Input
            label="Expected / Normal Value"
            placeholder="e.g. 75.0 – 80.0"
            hint="Normal range or expected value"
          />
        </div>

        {/* Photo upload */}
        <div>
          <label className="form-label">
            Photo Evidence
            <span className="text-slate-400 font-normal ml-1">(optional)</span>
          </label>
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center gap-3 text-center hover:border-brand-300 hover:bg-brand-50/30 transition-colors cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
              <Camera className="w-5 h-5 text-slate-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Click to upload or drag a photo here</p>
              <p className="text-xs text-slate-400 mt-0.5">PNG, JPG, HEIC up to 10 MB</p>
            </div>
            <Button variant="outline" size="sm">Choose File</Button>
          </div>
          {uploadStatus !== 'idle' && (
            <div className="mt-2">
              <UploadProgress status={uploadStatus} />
            </div>
          )}
        </div>

        {/* Voice input */}
        <div>
          <label className="form-label">
            Voice Note
            <span className="text-slate-400 font-normal ml-1">(optional)</span>
          </label>
          <div className={cn(
            'flex items-center gap-3 p-3 rounded-xl border transition-colors',
            recording ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'
          )}>
            <button
              type="button"
              onClick={() => setRecording(r => !r)}
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors',
                recording ? 'bg-red-500 text-white animate-pulse-soft' : 'bg-slate-200 text-slate-500 hover:bg-slate-300'
              )}
              aria-label={recording ? 'Stop recording' : 'Start recording'}
            >
              {recording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
            <div className="flex-1">
              {recording ? (
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-sm font-medium text-red-700">Recording…</span>
                  <span className="text-xs text-red-500">0:00</span>
                </div>
              ) : (
                <p className="text-sm text-slate-500">Tap to record a voice description of the issue</p>
              )}
            </div>
          </div>
        </div>

        {/* Additional notes */}
        <Textarea
          label="Additional Notes"
          placeholder="Any additional context, related issues, or immediate actions taken…"
          rows={2}
        />
      </div>
    </Modal>
  )
}
