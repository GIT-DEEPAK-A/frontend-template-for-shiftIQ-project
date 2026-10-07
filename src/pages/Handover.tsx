import { useState } from 'react'
import {
  Zap, Plus, Check, Edit,
  Download, PenLine, UserCheck, Clock
} from 'lucide-react'
import { PageHeader } from '@/components/shell/AppLayout'
import Button from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/Badge'
import { Tabs, TabList, Tab, TabPanel } from '@/components/ui/Tabs'
import { Input, Select, Textarea } from '@/components/ui/Input'
import { NoHandoverState } from '@/components/ui/EmptyState'
import { AiSummarySkeleton } from '@/components/ui/Skeletons'
import { AlertBanner } from '@/components/ui/ErrorState'
import { cn } from '@/lib/utils'

export default function Handover() {
  const [_activeTab, setActiveTab] = useState('current')

  return (
    <div className="space-y-5">
      <PageHeader
        title="Shift Handover"
        subtitle="Manage shift transitions and ensure continuity of operations"
        actions={
          <>
            <Button variant="outline" size="sm" icon={<Download className="w-3.5 h-3.5" />}>Export</Button>
            <Button variant="primary" size="sm" icon={<Plus className="w-3.5 h-3.5" />}>New Handover</Button>
          </>
        }
      />

      <Tabs defaultTab="current" onChange={setActiveTab}>
        <div className="card overflow-hidden">
          <div className="px-5 pt-4 border-b border-slate-100">
            <TabList>
              <Tab id="current">Current Handover</Tab>
              <Tab id="history">History</Tab>
              <Tab id="templates">Templates</Tab>
            </TabList>
          </div>

          <div className="p-5">
            <TabPanel id="current">
              <CurrentHandoverTab />
            </TabPanel>
            <TabPanel id="history">
              <NoHandoverState onCreate={() => {}} />
            </TabPanel>
            <TabPanel id="templates">
              <div className="py-10 text-center text-sm text-slate-400">No templates configured.</div>
            </TabPanel>
          </div>
        </div>
      </Tabs>
    </div>
  )
}

// ── Current Handover Tab ───────────────────────────────────────────────────

function CurrentHandoverTab() {
  const [aiGenerating, setAiGenerating] = useState(false)
  const [aiGenerated, setAiGenerated]   = useState(false)

  const generateSummary = () => {
    setAiGenerating(true)
    setTimeout(() => { setAiGenerating(false); setAiGenerated(true) }, 2500)
  }

  return (
    <div className="space-y-5">
      <AlertBanner
        variant="info"
        title="No active handover in progress"
        description="Start a new handover to document the current shift status and hand over to the incoming team."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left column — main form */}
        <div className="lg:col-span-2 space-y-4">

          {/* Shift Information */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-brand-600" />
              <h2 className="text-section text-slate-900">Shift Information</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Select label="Outgoing Shift" placeholder="— Select —"
                options={[
                  { value: 'morning',   label: 'Morning Shift'   },
                  { value: 'afternoon', label: 'Afternoon Shift' },
                  { value: 'night',     label: 'Night Shift'     },
                ]}
              />
              <Select label="Incoming Shift" placeholder="— Select —"
                options={[
                  { value: 'morning',   label: 'Morning Shift'   },
                  { value: 'afternoon', label: 'Afternoon Shift' },
                  { value: 'night',     label: 'Night Shift'     },
                ]}
              />
              <Input label="Date" type="date" />
              <Select label="Supervisor" placeholder="— Select supervisor —" options={[]} />
            </div>
          </div>

          {/* Handover Summary */}
          <div className="card p-5">
            <h2 className="text-section text-slate-900 mb-4">Handover Summary</h2>
            <div className="space-y-4">
              <Textarea label="Production Status" placeholder="Summarise production performance for this shift — targets achieved, shortfalls, reasons…" rows={3} />
              <Textarea label="Major Changes" placeholder="List any significant changes made during this shift — settings, configurations, processes…" rows={3} />
              <Textarea label="Recurring Issues" placeholder="Note any issues that have appeared in multiple shifts or remain unresolved…" rows={2} />
              <Textarea label="Pending Actions" placeholder="List actions that the incoming shift must follow up on…" rows={3} />
              <Textarea label="Maintenance Requirements" placeholder="Describe any maintenance needs identified during the shift…" rows={2} />
              <Textarea label="Cleaning Notes" placeholder="Note cleaning requirements or tasks completed/pending…" rows={2} />
              <Textarea label="Priority for Next Shift" placeholder="What should the incoming shift focus on first? List priorities in order…" rows={3} />
            </div>
          </div>
        </div>

        {/* Right column — AI summary + sign-off */}
        <div className="space-y-4">
          {/* AI Handover Summary */}
          <AiHandoverSummary
            generating={aiGenerating}
            generated={aiGenerated}
            onGenerate={generateSummary}
          />

          {/* Digital Sign-off */}
          <DigitalSignOff />
        </div>
      </div>
    </div>
  )
}

// ── AI Handover Summary ────────────────────────────────────────────────────

interface AiHandoverSummaryProps {
  generating: boolean
  generated: boolean
  onGenerate: () => void
}

function AiHandoverSummary({ generating, generated, onGenerate }: AiHandoverSummaryProps) {
  return (
    <div className="card p-4">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center flex-shrink-0">
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">AI-Assisted Handover Summary</h3>
            <p className="text-xs text-slate-400">Automatically generated from shift data</p>
          </div>
        </div>
        {generated && (
          <span className="text-[10px] font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
            Ready
          </span>
        )}
      </div>

      {/* Content area */}
      {generating ? (
        <AiSummarySkeleton />
      ) : generated ? (
        <div className="space-y-3">
          {[
            { section: 'Production Status',     content: '[AI-generated production summary will appear here]'  },
            { section: 'Significant Changes',   content: '[AI-generated change summary will appear here]'      },
            { section: 'Recurring Issues',      content: '[AI-identified recurring issue patterns]'            },
            { section: 'Pending Actions',       content: '[AI-compiled pending action list]'                   },
            { section: 'Next Shift Priorities', content: '[AI-recommended priority order for incoming shift]'  },
          ].map(item => (
            <div key={item.section} className="p-3 bg-slate-50 rounded-lg">
              <p className="text-xs font-semibold text-brand-700 mb-1">{item.section}</p>
              <p className="text-xs text-slate-400 italic">{item.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 bg-brand-50/40 rounded-xl border border-brand-100 text-center">
          <Zap className="w-6 h-6 text-brand-400 mx-auto mb-2" />
          <p className="text-sm text-slate-500 mb-1">AI summary not yet generated</p>
          <p className="text-xs text-slate-400">Complete the handover form or generate from available shift data.</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-slate-100">
        <Button
          variant="primary"
          size="xs"
          icon={<Zap className="w-3 h-3" />}
          loading={generating}
          onClick={onGenerate}
        >
          {generated ? 'Regenerate' : 'Generate Summary'}
        </Button>
        {generated && (
          <>
            <Button variant="outline" size="xs" icon={<Edit className="w-3 h-3" />}>Edit</Button>
            <Button variant="success"  size="xs" icon={<Check className="w-3 h-3" />}>Approve</Button>
            <Button variant="outline"  size="xs">Save Draft</Button>
          </>
        )}
      </div>
    </div>
  )
}

// ── Digital Sign-off ──────────────────────────────────────────────────────

function DigitalSignOff() {
  const [outgoingSigned, setOutgoing] = useState(false)
  const [incomingAcked, setIncoming]  = useState(false)

  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 mb-4">
        <PenLine className="w-4 h-4 text-brand-600" />
        <h3 className="text-section text-slate-900">Digital Sign-Off</h3>
      </div>

      <div className="space-y-4">
        {/* Outgoing Supervisor */}
        <div className={cn(
          'p-4 rounded-xl border transition-colors',
          outgoingSigned ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'
        )}>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Outgoing Supervisor</p>

          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
              <UserCheck className="w-4 h-4 text-slate-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">— User —</p>
              <StatusBadge status={outgoingSigned ? 'completed' : 'pending'} />
            </div>
          </div>

          {/* Signature area */}
          {!outgoingSigned ? (
            <div className="border-2 border-dashed border-slate-300 rounded-lg h-16 flex items-center justify-center mb-3">
              <p className="text-xs text-slate-400">Signature area</p>
            </div>
          ) : (
            <div className="border border-emerald-200 bg-emerald-50 rounded-lg h-16 flex items-center justify-center mb-3">
              <div className="flex items-center gap-2 text-emerald-600">
                <Check className="w-4 h-4" />
                <span className="text-xs font-medium">Signed</span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Timestamp: —</span>
            {!outgoingSigned && (
              <div className="flex gap-2">
                <Button variant="outline" size="xs">Review</Button>
                <Button variant="primary" size="xs" onClick={() => setOutgoing(true)}>Sign</Button>
              </div>
            )}
          </div>
        </div>

        {/* Incoming Supervisor */}
        <div className={cn(
          'p-4 rounded-xl border transition-colors',
          incomingAcked ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'
        )}>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Incoming Supervisor</p>

          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
              <UserCheck className="w-4 h-4 text-slate-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">— User —</p>
              <StatusBadge status={incomingAcked ? 'completed' : 'pending'} />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              {incomingAcked ? 'Acknowledged' : 'Acknowledgement pending'}
            </span>
            {!incomingAcked && outgoingSigned && (
              <Button variant="success" size="xs" icon={<Check className="w-3 h-3" />} onClick={() => setIncoming(true)}>
                Acknowledge
              </Button>
            )}
          </div>
        </div>

        {/* Submit */}
        {outgoingSigned && incomingAcked && (
          <Button variant="primary" size="sm" fullWidth icon={<Check className="w-3.5 h-3.5" />}>
            Submit Handover
          </Button>
        )}
      </div>
    </div>
  )
}
