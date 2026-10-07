import { useNavigate } from 'react-router-dom'
import {
  QrCode, BarChart2, AlertTriangle, ClipboardCheck,
  ArrowLeftRight, Clock, Cpu, ChevronRight, Bell
} from 'lucide-react'
import OperatorLayout from './OperatorLayout'
import { StatusBadge } from '@/components/ui/Badge'
import StatusIndicator from '@/components/ui/StatusIndicator'
import { cn } from '@/lib/utils'

export default function OperatorHome() {
  const navigate = useNavigate()

  return (
    <OperatorLayout
      title="ShiftIQ Pro"
      subtitle="Operator View"
      actions={
        <button className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500" />
        </button>
      }
    >
      {/* ── Current shift banner ── */}
      <div className="card p-4 border-l-4 border-l-brand-500">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-slate-500 mb-0.5">Current Shift</p>
            <p className="text-sm font-semibold text-slate-700">— Shift —</p>
            <p className="text-xs text-slate-400 mt-0.5">Supervisor: —</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1.5 justify-end">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs text-slate-500">—:—</span>
            </div>
            <StatusBadge status="active" />
          </div>
        </div>
      </div>

      {/* ── Quick actions ── */}
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Quick Actions</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              label:    'Scan Machine',
              sub:      'Scan QR code to access machine',
              icon:     QrCode,
              color:    'bg-brand-600',
              path:     '/operator/scan',
              large:    true,
            },
            {
              label:    'Production Entry',
              sub:      'Record production count',
              icon:     BarChart2,
              color:    'bg-teal-600',
              path:     '/operator/production',
              large:    false,
            },
            {
              label:    'Report Issue',
              sub:      'Log an abnormality',
              icon:     AlertTriangle,
              color:    'bg-amber-600',
              path:     '/operator/report',
              large:    false,
            },
            {
              label:    'Cleaning',
              sub:      'Checklist',
              icon:     ClipboardCheck,
              color:    'bg-emerald-600',
              path:     '/operator/cleaning',
              large:    false,
            },
            {
              label:    'Handover',
              sub:      'Start / review handover',
              icon:     ArrowLeftRight,
              color:    'bg-purple-600',
              path:     '/operator/handover',
              large:    false,
            },
          ].map(action => (
            <QuickActionCard key={action.label} {...action} onClick={() => navigate(action.path)} />
          ))}
        </div>
      </div>

      {/* ── My machines strip ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">My Machines</p>
          <button className="text-xs text-brand-600 font-medium flex items-center gap-0.5">
            View all <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-2">
          {/* Empty state */}
          <div className="card p-4 text-center">
            <Cpu className="w-6 h-6 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-400">No machines assigned</p>
            <p className="text-xs text-slate-400 mt-0.5">Scan a QR code to access a machine</p>
          </div>

          {/* Machine row (hidden — rendered from API) */}
          <MobileOperatorMachineRow />
        </div>
      </div>

      {/* ── Recent activity ── */}
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Recent Activity</p>
        <div className="card p-4 text-center">
          <Clock className="w-5 h-5 text-slate-300 mx-auto mb-2" />
          <p className="text-sm text-slate-400">No recent activity this shift</p>
        </div>
      </div>
    </OperatorLayout>
  )
}

// ── Quick Action Card ──────────────────────────────────────────────────────

function QuickActionCard({
  label, sub, icon: Icon, color, onClick, large
}: {
  label: string; sub: string; icon: React.ElementType; color: string; onClick: () => void; large?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'card p-4 text-left hover:shadow-card-hover transition-all duration-150 active:scale-95',
        large && 'col-span-2'
      )}
    >
      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-2.5', color)}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <p className="text-sm font-semibold text-slate-800">{label}</p>
      <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
    </button>
  )
}

// ── Machine row (for when data is available) ───────────────────────────────

function MobileOperatorMachineRow() {
  return (
    <div className="hidden card p-3 flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
        <Cpu className="w-4 h-4 text-slate-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800 truncate">—</p>
        <div className="flex items-center gap-2 mt-0.5">
          <StatusIndicator status="idle" size="sm" showLabel />
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
    </div>
  )
}
