import { useState } from 'react'
import { CheckCircle2, Camera, ChevronDown, ClipboardCheck } from 'lucide-react'
import OperatorLayout from './OperatorLayout'
import Button from '@/components/ui/Button'
import { NoChecklistState } from '@/components/ui/EmptyState'
import { cn } from '@/lib/utils'

interface ChecklistItem {
  id: string
  label: string
  required: boolean
  completed: boolean
  notes: string
  hasPhoto: boolean
  section: string
}

// Structural placeholder items — in production these come from API
const PLACEHOLDER_ITEMS: ChecklistItem[] = [
  { id: '1', label: 'Clean machine exterior surfaces', required: true,  completed: false, notes: '', hasPhoto: false, section: 'Exterior' },
  { id: '2', label: 'Wipe down control panel',         required: true,  completed: false, notes: '', hasPhoto: false, section: 'Exterior' },
  { id: '3', label: 'Clean production area floor',     required: true,  completed: false, notes: '', hasPhoto: false, section: 'Area'     },
  { id: '4', label: 'Dispose of waste materials',      required: true,  completed: false, notes: '', hasPhoto: false, section: 'Area'     },
  { id: '5', label: 'Inspect and clean filters',        required: true,  completed: false, notes: '', hasPhoto: false, section: 'Internal' },
  { id: '6', label: 'Lubricate moving parts',          required: false, completed: false, notes: '', hasPhoto: false, section: 'Internal' },
  { id: '7', label: 'Check and replace consumables',   required: false, completed: false, notes: '', hasPhoto: false, section: 'Internal' },
]

export default function CleaningChecklist() {
  const [items, setItems]         = useState<ChecklistItem[]>(PLACEHOLDER_ITEMS)
  const [submitting, setSubmit]   = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const hasItems = items.length > 0

  const toggle = (id: string) =>
    setItems(prev => prev.map(item => item.id === id ? { ...item, completed: !item.completed } : item))

  const completedCount = items.filter(i => i.completed).length
  const requiredCount  = items.filter(i => i.required).length
  const requiredDone   = items.filter(i => i.required && i.completed).length
  const progress       = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0

  const sections = [...new Set(items.map(i => i.section))]

  const handleSubmit = () => {
    setSubmit(true)
    setTimeout(() => { setSubmit(false); setSubmitted(true) }, 1200)
  }

  if (submitted) {
    return (
      <OperatorLayout title="Cleaning Checklist" backPath="/operator">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-lg font-semibold text-slate-800 mb-1">Checklist Submitted</h2>
          <p className="text-sm text-slate-500 mb-6">Cleaning record saved successfully.</p>
          <Button variant="primary" size="md" onClick={() => setSubmitted(false)}>
            Back to Home
          </Button>
        </div>
      </OperatorLayout>
    )
  }

  return (
    <OperatorLayout
      title="Cleaning Checklist"
      subtitle={hasItems ? `${completedCount} / ${items.length} complete` : undefined}
      backPath="/operator"
    >
      {!hasItems ? (
        <NoChecklistState />
      ) : (
        <div className="space-y-4">
          {/* Progress bar */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">Overall Progress</span>
              <span className="text-sm font-bold text-brand-600">{progress}%</span>
            </div>
            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-500 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-1.5">
              {requiredDone} of {requiredCount} required items complete
            </p>
          </div>

          {/* Items by section */}
          {sections.map(section => {
            const sectionItems = items.filter(i => i.section === section)
            const sectionDone  = sectionItems.filter(i => i.completed).length

            return (
              <div key={section} className="card overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-100">
                  <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">{section}</span>
                  <span className="text-xs text-slate-400">{sectionDone}/{sectionItems.length}</span>
                </div>
                <div className="divide-y divide-slate-50">
                  {sectionItems.map(item => (
                    <ChecklistItemRow key={item.id} item={item} onToggle={() => toggle(item.id)} />
                  ))}
                </div>
              </div>
            )
          })}

          {/* Submit */}
          <Button
            variant="primary"
            size="lg"
            fullWidth
            loading={submitting}
            disabled={requiredDone < requiredCount}
            onClick={handleSubmit}
            icon={<ClipboardCheck className="w-4 h-4" />}
          >
            {requiredDone < requiredCount
              ? `Complete ${requiredCount - requiredDone} required items`
              : 'Submit Checklist'
            }
          </Button>
        </div>
      )}
    </OperatorLayout>
  )
}

// ── Checklist Item Row ─────────────────────────────────────────────────────

function ChecklistItemRow({ item, onToggle }: { item: ChecklistItem; onToggle: () => void }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className={cn('transition-colors', item.completed && 'bg-emerald-50/40')}>
      <div
        className="flex items-start gap-3 px-4 py-3.5 cursor-pointer"
        onClick={onToggle}
      >
        {/* Checkbox */}
        <div className={cn(
          'w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors',
          item.completed
            ? 'bg-emerald-500 border-emerald-500'
            : 'border-slate-300 bg-white'
        )}>
          {item.completed && <CheckCircle2 className="w-4 h-4 text-white" strokeWidth={2.5} />}
        </div>

        {/* Label */}
        <div className="flex-1 min-w-0">
          <p className={cn(
            'text-sm font-medium transition-colors',
            item.completed ? 'text-slate-400 line-through' : 'text-slate-800'
          )}>
            {item.label}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            {item.required
              ? <span className="text-[10px] text-red-500 font-semibold">Required</span>
              : <span className="text-[10px] text-slate-400">Optional</span>
            }
          </div>
        </div>

        {/* Expand toggle */}
        <button
          onClick={e => { e.stopPropagation(); setExpanded(x => !x) }}
          className="p-1 text-slate-400 hover:text-slate-600 flex-shrink-0"
          aria-label="Expand item options"
        >
          <ChevronDown className={cn('w-4 h-4 transition-transform', expanded && 'rotate-180')} />
        </button>
      </div>

      {/* Expanded: notes + photo */}
      {expanded && (
        <div className="px-4 pb-3 pt-0 space-y-2 border-t border-slate-100" onClick={e => e.stopPropagation()}>
          <input
            type="text"
            placeholder="Add a note…"
            className="form-input text-xs py-2"
            defaultValue={item.notes}
          />
          <button className="flex items-center gap-1.5 text-xs text-brand-600 font-medium">
            <Camera className="w-3.5 h-3.5" />
            Attach photo
          </button>
        </div>
      )}
    </div>
  )
}
