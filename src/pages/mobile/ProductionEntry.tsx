import { useState } from 'react'
import { CheckCircle2, Plus, Minus } from 'lucide-react'
import OperatorLayout from './OperatorLayout'
import Button from '@/components/ui/Button'
import { Input, Select, Textarea } from '@/components/ui/Input'
import { InlineError } from '@/components/ui/ErrorState'

export default function ProductionEntry() {
  const [quantity, setQuantity] = useState<string>('')
  const [submitting, setSubmit] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const increment = () => setQuantity(q => String((parseInt(q) || 0) + 1))
  const decrement = () => setQuantity(q => String(Math.max(0, (parseInt(q) || 0) - 1)))

  const handleSubmit = (andContinue = false) => {
    if (!quantity || parseInt(quantity) < 0) {
      setError('Please enter a valid quantity.')
      return
    }
    setSubmit(true)
    setTimeout(() => {
      setSubmit(false)
      if (!andContinue) setSubmitted(true)
      else { setQuantity(''); setError('') }
    }, 1200)
  }

  if (submitted) {
    return (
      <OperatorLayout title="Production Entry" backPath="/operator">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-lg font-semibold text-slate-800 mb-1">Entry Recorded</h2>
          <p className="text-sm text-slate-500 mb-6">Production data has been submitted successfully.</p>
          <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
            <Button variant="outline" size="md" fullWidth onClick={() => setSubmitted(false)}>
              New Entry
            </Button>
            <Button variant="primary" size="md" fullWidth onClick={() => {}}>
              Done
            </Button>
          </div>
        </div>
      </OperatorLayout>
    )
  }

  return (
    <OperatorLayout title="Production Entry" subtitle="Record shift output" backPath="/operator">
      <div className="space-y-4">
        {error && <InlineError message={error} onDismiss={() => setError('')} />}

        {/* Machine context */}
        <div className="card p-4">
          <p className="text-xs text-slate-500 mb-0.5">Machine</p>
          <p className="text-sm font-semibold text-slate-400">— No machine selected —</p>
          <Button variant="ghost" size="xs" className="mt-1 -ml-1">Scan to select</Button>
        </div>

        {/* Form */}
        <div className="card p-4 space-y-4">
          <Select
            label="Product"
            required
            placeholder="— Select product —"
            options={[]}
          />
          <Select
            label="Process / Operation"
            placeholder="— Select process —"
            options={[]}
          />

          {/* Quantity with stepper */}
          <div>
            <label className="form-label">
              Quantity <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={decrement}
                className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 active:bg-slate-200 transition-colors flex-shrink-0"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                placeholder="0"
                min={0}
                className="form-input text-center text-xl font-bold flex-1"
                inputMode="numeric"
              />
              <button
                type="button"
                onClick={increment}
                className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 active:bg-slate-200 transition-colors flex-shrink-0"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Unit"
              options={[
                { value: 'units', label: 'Units'    },
                { value: 'kg',    label: 'kg'       },
                { value: 'pcs',   label: 'Pieces'   },
                { value: 'ltrs',  label: 'Litres'   },
                { value: 'mtr',   label: 'Metres'   },
              ]}
            />
            <Input label="Target (this period)" type="number" placeholder="—" />
          </div>

          {/* Dynamic parameters section */}
          <div>
            <p className="form-label">Process Parameters</p>
            <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-400 text-center border border-dashed border-slate-200">
              Parameters will be loaded based on selected machine and product
            </div>
          </div>

          <Textarea
            label="Notes"
            placeholder="Any observations or notes for this entry…"
            rows={2}
          />
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            size="lg"
            fullWidth
            onClick={() => handleSubmit(false)}
            loading={submitting}
          >
            Save Draft
          </Button>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => handleSubmit(false)}
            loading={submitting}
          >
            Submit
          </Button>
        </div>
        <Button
          variant="secondary"
          size="lg"
          fullWidth
          onClick={() => handleSubmit(true)}
          loading={submitting}
        >
          Save & Continue
        </Button>
      </div>
    </OperatorLayout>
  )
}
