import { useState } from 'react'
import { Zap, FlashlightOff, Flashlight, Keyboard, RefreshCw, CheckCircle2, XCircle } from 'lucide-react'
import OperatorLayout from './OperatorLayout'
import Button from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { cn } from '@/lib/utils'

type ScanState = 'idle' | 'scanning' | 'success' | 'error' | 'loading'

export default function QRScanner() {
  const [scanState, setScanState]   = useState<ScanState>('scanning')
  const [flashOn, setFlashOn]       = useState(false)
  const [manualMode, setManualMode] = useState(false)
  const [manualId, setManualId]     = useState('')

  const simulateScan = () => {
    setScanState('loading')
    setTimeout(() => setScanState('success'), 1500)
  }

  const reset = () => {
    setScanState('scanning')
    setManualId('')
    setManualMode(false)
  }

  return (
    <OperatorLayout
      title="Scan Machine"
      subtitle="Point camera at machine QR code"
      backPath="/operator"
    >
      {/* ── Scanner viewport ── */}
      <div className="relative">
        <div className={cn(
          'relative w-full aspect-square rounded-2xl overflow-hidden',
          scanState === 'scanning' ? 'bg-slate-900' : 'bg-slate-100'
        )}>
          {/* Camera placeholder */}
          {scanState === 'scanning' && (
            <>
              {/* Fake camera feed */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900" />

              {/* Scan guide overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-52 h-52">
                  {/* Corner guides */}
                  {[
                    'top-0 left-0 border-t-4 border-l-4',
                    'top-0 right-0 border-t-4 border-r-4',
                    'bottom-0 left-0 border-b-4 border-l-4',
                    'bottom-0 right-0 border-b-4 border-r-4',
                  ].map((cls, i) => (
                    <div key={i} className={cn('absolute w-8 h-8 border-white rounded-sm', cls)} />
                  ))}

                  {/* Scan line animation */}
                  <div className="absolute inset-x-0 h-0.5 bg-brand-400 opacity-80 animate-pulse top-1/2" />

                  {/* Center cross */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-px h-8 bg-white opacity-30" />
                    <div className="h-px w-8 bg-white opacity-30 absolute" />
                  </div>
                </div>
              </div>

              {/* Guide text */}
              <div className="absolute bottom-4 inset-x-0 text-center">
                <p className="text-white text-sm font-medium opacity-80">Position QR code within the frame</p>
              </div>
            </>
          )}

          {/* Loading state */}
          {scanState === 'loading' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white">
              <div className="w-12 h-12 rounded-2xl bg-brand-600 flex items-center justify-center mb-3 animate-pulse">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-medium text-slate-600">Identifying machine…</p>
              <p className="text-xs text-slate-400 mt-1">Please wait</p>
            </div>
          )}

          {/* Success state */}
          {scanState === 'success' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-emerald-50 p-6">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-3" />
              <p className="text-base font-semibold text-slate-800 mb-1">Machine Found</p>
              <p className="text-xs text-slate-500 text-center">Machine information loaded successfully</p>

              {/* Machine info placeholder */}
              <div className="mt-4 w-full p-4 bg-white rounded-xl border border-emerald-200 space-y-2">
                {[
                  { label: 'Machine Name', value: '—' },
                  { label: 'Machine ID',   value: '—' },
                  { label: 'Location',     value: '—' },
                  { label: 'Status',       value: '—' },
                ].map(f => (
                  <div key={f.label} className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">{f.label}</span>
                    <span className="text-xs font-medium text-slate-400">{f.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error state */}
          {scanState === 'error' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-50 p-6">
              <XCircle className="w-12 h-12 text-red-400 mb-3" />
              <p className="text-base font-semibold text-slate-800 mb-1">Scan Failed</p>
              <p className="text-xs text-slate-500 text-center">
                Unable to read the QR code. Ensure the code is not damaged and the camera is focused.
              </p>
            </div>
          )}
        </div>

        {/* Flash control (scanning only) */}
        {scanState === 'scanning' && (
          <button
            onClick={() => setFlashOn(f => !f)}
            className="absolute top-3 right-3 w-10 h-10 rounded-xl bg-black/40 flex items-center justify-center text-white"
            aria-label={flashOn ? 'Turn off flash' : 'Turn on flash'}
          >
            {flashOn
              ? <FlashlightOff className="w-5 h-5" />
              : <Flashlight className="w-5 h-5" />
            }
          </button>
        )}
      </div>

      {/* ── Controls ── */}
      <div className="space-y-3">
        {scanState === 'scanning' && (
          <>
            <Button variant="primary" size="lg" fullWidth onClick={simulateScan}>
              Simulate Scan
            </Button>
            <Button
              variant="outline"
              size="lg"
              fullWidth
              icon={<Keyboard className="w-4 h-4" />}
              onClick={() => setManualMode(m => !m)}
            >
              Enter Machine ID Manually
            </Button>

            {manualMode && (
              <div className="card p-4 space-y-3">
                <Input
                  label="Machine ID"
                  placeholder="Enter machine ID or scan code…"
                  value={manualId}
                  onChange={e => setManualId(e.target.value)}
                />
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  disabled={!manualId.trim()}
                  onClick={simulateScan}
                >
                  Find Machine
                </Button>
              </div>
            )}
          </>
        )}

        {scanState === 'success' && (
          <div className="grid grid-cols-2 gap-3">
            <Button variant="primary"  size="lg" fullWidth onClick={() => {}}>
              View Machine
            </Button>
            <Button variant="outline"  size="lg" fullWidth onClick={reset}>
              Scan Another
            </Button>
          </div>
        )}

        {(scanState === 'error' || scanState === 'loading') && (
          <Button variant="outline" size="lg" fullWidth icon={<RefreshCw className="w-4 h-4" />} onClick={reset}>
            Try Again
          </Button>
        )}
      </div>
    </OperatorLayout>
  )
}
