import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from '@/context/AppContext'
import AppLayout from '@/components/shell/AppLayout'
import NotificationPanel from '@/components/panels/NotificationPanel'
import GlobalSearch from '@/components/panels/GlobalSearch'

// ── Desktop pages ─────────────────────────────────────────────────────────
import Dashboard         from '@/pages/Dashboard'
import LiveOperations    from '@/pages/LiveOperations'
import Machines          from '@/pages/Machines'
import MachineDetail     from '@/pages/MachineDetail'
import Production        from '@/pages/Production'
import Abnormalities     from '@/pages/Abnormalities'
import Alerts            from '@/pages/Alerts'
import CrossShiftMemory  from '@/pages/CrossShiftMemory'
import Handover          from '@/pages/Handover'
import Maintenance       from '@/pages/Maintenance'
import Reports           from '@/pages/Reports'
import UsersPage         from '@/pages/Users'
import SettingsPage      from '@/pages/Settings'
import AuditTrail        from '@/pages/AuditTrail'

// ── Mobile / Operator pages ───────────────────────────────────────────────
import OperatorHome      from '@/pages/mobile/OperatorHome'
import QRScanner         from '@/pages/mobile/QRScanner'
import ProductionEntry   from '@/pages/mobile/ProductionEntry'
import CleaningChecklist from '@/pages/mobile/CleaningChecklist'
import OfflineMode       from '@/pages/mobile/OfflineMode'

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          {/* ── Desktop shell routes ── */}
          <Route
            path="/*"
            element={
              <AppLayout>
                <GlobalSearch />
                <NotificationPanel />
                <Routes>
                  <Route index                          element={<Dashboard />} />
                  <Route path="live-operations"         element={<LiveOperations />} />
                  <Route path="machines"                element={<Machines />} />
                  <Route path="machines/:id"            element={<MachineDetail />} />
                  <Route path="production"              element={<Production />} />
                  <Route path="abnormalities"           element={<Abnormalities />} />
                  <Route path="alerts"                  element={<Alerts />} />
                  <Route path="cross-shift-memory"      element={<CrossShiftMemory />} />
                  <Route path="handover"                element={<Handover />} />
                  <Route path="maintenance"             element={<Maintenance />} />
                  <Route path="reports"                 element={<Reports />} />
                  <Route path="users"                   element={<UsersPage />} />
                  <Route path="settings"                element={<SettingsPage />} />
                  <Route path="audit"                   element={<AuditTrail />} />
                  <Route path="*"                       element={<NotFound />} />
                </Routes>
              </AppLayout>
            }
          />

          {/* ── Mobile / Operator routes (own layout) ── */}
          <Route path="/operator"             element={<OperatorHome />} />
          <Route path="/operator/scan"        element={<QRScanner />} />
          <Route path="/operator/production"  element={<ProductionEntry />} />
          <Route path="/operator/cleaning"    element={<CleaningChecklist />} />
          <Route path="/operator/report"      element={<OperatorAbnormalityReport />} />
          <Route path="/operator/handover"    element={<OperatorHandoverView />} />
          <Route path="/operator/offline"     element={<OfflineMode />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  )
}

// ── 404 page ──────────────────────────────────────────────────────────────

import { AlertOctagon, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Button from '@/components/ui/Button'

function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-5">
        <AlertOctagon className="w-8 h-8 text-slate-400" />
      </div>
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Page not found</h1>
      <p className="text-slate-500 mb-6 max-w-sm">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button
        variant="primary"
        size="md"
        icon={<ArrowLeft className="w-4 h-4" />}
        onClick={() => navigate('/')}
      >
        Back to Dashboard
      </Button>
    </div>
  )
}

// ── Operator-specific thin wrappers ───────────────────────────────────────
// These reuse the desktop abnormality form + handover inside the mobile layout

import OperatorLayout from '@/pages/mobile/OperatorLayout'
import { AlertTriangle, ArrowLeftRight } from 'lucide-react'

function OperatorAbnormalityReport() {
  return (
    <OperatorLayout title="Report Issue" subtitle="Log an abnormality" backPath="/operator">
      <div className="card p-5 text-center">
        <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto mb-3" />
        <p className="text-sm font-medium text-slate-600 mb-1">Report Abnormality</p>
        <p className="text-xs text-slate-400">
          The abnormality form will load here.
          Connected to the same backend as the desktop view.
        </p>
      </div>
    </OperatorLayout>
  )
}

function OperatorHandoverView() {
  return (
    <OperatorLayout title="Handover" subtitle="Shift transition" backPath="/operator">
      <div className="card p-5 text-center">
        <ArrowLeftRight className="w-8 h-8 text-brand-400 mx-auto mb-3" />
        <p className="text-sm font-medium text-slate-600 mb-1">Shift Handover</p>
        <p className="text-xs text-slate-400">
          Handover summary and sign-off will appear here.
          Connected to the same backend as the desktop view.
        </p>
      </div>
    </OperatorLayout>
  )
}
