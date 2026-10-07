import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Cpu, ArrowLeft, RefreshCw, Settings, Wrench, Edit,
  MoreHorizontal, Zap, Activity, AlertTriangle, GitMerge, ClipboardList, History
} from 'lucide-react'
import { PageHeader } from '@/components/shell/AppLayout'
import Button from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/Badge'
import { Tabs, TabList, Tab, TabPanel } from '@/components/ui/Tabs'
import { HealthBar } from '@/components/ui/StatusIndicator'
import ParameterCard from '@/components/ui/ParameterCard'
import ChartContainer from '@/components/ui/ChartContainer'
import EmptyState, { NoParametersState, NoCrossShiftMemoryState, NoAbnormalitiesState, NoMaintenanceState } from '@/components/ui/EmptyState'
import { TimelineSkeleton } from '@/components/ui/Skeletons'
import { cn } from '@/lib/utils'

export default function MachineDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [_activeTab, setActiveTab] = useState('overview')
  const loading = false

  return (
    <div className="space-y-5">
      {/* ── Header ── */}
      <PageHeader
        title="Machine"
        subtitle="Detailed machine monitoring and history"
        breadcrumbs={[
          { label: 'Machines', path: '/machines' },
          { label: id ?? 'Detail' },
        ]}
        actions={
          <>
            <Button variant="ghost" size="sm" icon={<ArrowLeft className="w-3.5 h-3.5" />} onClick={() => navigate('/machines')}>
              Back
            </Button>
            <Button variant="outline" size="sm" icon={<RefreshCw className="w-3.5 h-3.5" />}>Refresh</Button>
            <Button variant="outline" size="sm" icon={<Edit className="w-3.5 h-3.5" />}>Edit</Button>
            <Button variant="primary" size="sm" icon={<Wrench className="w-3.5 h-3.5" />}>Maintenance Request</Button>
          </>
        }
      />

      {/* ── Machine identity card ── */}
      <div className="card p-5">
        <div className="flex flex-wrap items-start gap-5">
          {/* Icon */}
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center flex-shrink-0">
            {loading
              ? <div className="skeleton w-8 h-8 rounded-lg" />
              : <Cpu className="w-7 h-7 text-slate-500" />
            }
          </div>

          {/* Identity fields */}
          <div className="flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: 'Machine Name', value: null },
              { label: 'Machine ID',   value: null },
              { label: 'Location',     value: null },
              { label: 'Type',         value: null },
              { label: 'Status',       value: null, isStatus: true },
              { label: 'Last Updated', value: null },
            ].map(field => (
              <div key={field.label}>
                <p className="text-xs text-slate-500 mb-1">{field.label}</p>
                {loading
                  ? <div className="skeleton h-4 w-24 rounded" />
                  : field.isStatus
                    ? <StatusBadge status="idle" />
                    : <p className="text-sm font-medium text-slate-400">—</p>
                }
              </div>
            ))}
          </div>

          {/* Health */}
          <div className="w-full md:w-44">
            <p className="text-xs text-slate-500 mb-2">Machine Health</p>
            <HealthBar value={null} showValue size="md" />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <button className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
              <Settings className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <Tabs defaultTab="overview" onChange={setActiveTab}>
        <div className="card overflow-hidden">
          <TabList className="px-2 pt-2">
            {[
              { id: 'overview',          label: 'Overview',            icon: <Activity className="w-3.5 h-3.5" /> },
              { id: 'live-parameters',   label: 'Live Parameters',     icon: <Zap className="w-3.5 h-3.5" /> },
              { id: 'production',        label: 'Production',          icon: <Activity className="w-3.5 h-3.5" /> },
              { id: 'history',           label: 'History',             icon: <History className="w-3.5 h-3.5" /> },
              { id: 'abnormalities',     label: 'Abnormalities',       icon: <AlertTriangle className="w-3.5 h-3.5" /> },
              { id: 'maintenance',       label: 'Maintenance',         icon: <Wrench className="w-3.5 h-3.5" /> },
              { id: 'cross-shift',       label: 'Cross-Shift Memory',  icon: <GitMerge className="w-3.5 h-3.5" /> },
              { id: 'audit',             label: 'Audit Trail',         icon: <ClipboardList className="w-3.5 h-3.5" /> },
            ].map(t => (
              <Tab key={t.id} id={t.id} icon={t.icon}>{t.label}</Tab>
            ))}
          </TabList>

          <div className="p-5">
            {/* ── Overview ── */}
            <TabPanel id="overview">
              <OverviewTab />
            </TabPanel>

            {/* ── Live Parameters ── */}
            <TabPanel id="live-parameters">
              <LiveParametersTab />
            </TabPanel>

            {/* ── Production ── */}
            <TabPanel id="production">
              <MachineProductionTab />
            </TabPanel>

            {/* ── History ── */}
            <TabPanel id="history">
              <TimelineSkeleton items={4} />
            </TabPanel>

            {/* ── Abnormalities ── */}
            <TabPanel id="abnormalities">
              <NoAbnormalitiesState />
            </TabPanel>

            {/* ── Maintenance ── */}
            <TabPanel id="maintenance">
              <NoMaintenanceState onAdd={() => {}} />
            </TabPanel>

            {/* ── Cross-Shift Memory ── */}
            <TabPanel id="cross-shift">
              <NoCrossShiftMemoryState />
            </TabPanel>

            {/* ── Audit Trail ── */}
            <TabPanel id="audit">
              <EmptyState
                icon={<ClipboardList className="w-5 h-5" />}
                title="No audit entries"
                description="All changes to this machine record will appear here."
                compact
              />
            </TabPanel>
          </div>
        </div>
      </Tabs>
    </div>
  )
}

// ── Overview Tab ──────────────────────────────────────────────────────────

function OverviewTab() {

  return (
    <div className="space-y-5">
      {/* Mini KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Current Production', icon: <Activity className="w-4 h-4" /> },
          { label: 'Today\'s Target',    icon: <Zap className="w-4 h-4" /> },
          { label: 'OEE',                icon: <Zap className="w-4 h-4" /> },
          { label: 'Downtime Today',     icon: <AlertTriangle className="w-4 h-4" /> },
        ].map(k => (
          <div key={k.label} className="card p-4 border-l-4 border-l-slate-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{k.label}</p>
              <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                {k.icon}
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-300">—</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <ChartContainer
        title="Live Production Trend"
        subtitle="Current shift progress"
        height="h-56"
        empty
      >
        <></>
      </ChartContainer>

      {/* What Changed */}
      <WhatChangedCard />
    </div>
  )
}

// ── What Changed Card ──────────────────────────────────────────────────────

function WhatChangedCard() {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-section text-slate-900">What Changed?</h3>
          <p className="text-xs text-slate-500 mt-0.5">Shift-over-shift comparison for this machine</p>
        </div>
        <Button variant="outline" size="sm">View Full Report</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Current Shift',      value: '[Current Value]',    color: 'text-slate-700'    },
          { label: 'Previous Shift',     value: '[Previous Value]',   color: 'text-slate-400'    },
          { label: 'Historical Average', value: '[Historical Value]', color: 'text-slate-400'    },
        ].map(col => (
          <div key={col.label} className="p-4 bg-slate-50 rounded-xl">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">{col.label}</p>
            <div className="space-y-2.5">
              {['Production', 'Efficiency', 'Downtime', 'Quality'].map(metric => (
                <div key={metric} className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">{metric}</span>
                  <span className={cn('text-sm font-semibold', col.color)}>{col.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* AI Insight */}
      <div className="mt-4 p-4 bg-brand-50/60 rounded-xl border border-brand-100">
        <div className="flex items-start gap-3">
          <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-brand-800 mb-1">Pattern Insight</p>
            <p className="text-sm text-slate-400 italic">[AI-generated insight will appear here once data is connected]</p>
            <p className="text-xs font-semibold text-brand-800 mt-3 mb-1">Recommended Attention</p>
            <p className="text-sm text-slate-400 italic">[AI-generated recommendation will appear here]</p>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-brand-100">
          <Button variant="outline" size="xs">View Related Records</Button>
          <Button variant="outline" size="xs">Create Maintenance Request</Button>
          <Button variant="outline" size="xs">Add to Handover</Button>
        </div>
      </div>
    </div>
  )
}

// ── Live Parameters Tab ────────────────────────────────────────────────────

function LiveParametersTab() {
  const loading = false
  const empty   = true

  return (
    <div>
      {empty ? (
        <NoParametersState />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {loading
            ? Array.from({ length: 10 }).map((_, i) => <ParameterCard key={i} loading />)
            : <p className="text-sm text-slate-400 col-span-full">Parameters from API</p>
          }
        </div>
      )}
    </div>
  )
}

// ── Machine Production Tab ─────────────────────────────────────────────────

function MachineProductionTab() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChartContainer title="Production vs Target" height="h-48" empty>
          <></>
        </ChartContainer>
        <ChartContainer title="Production Trend" height="h-48" empty>
          <></>
        </ChartContainer>
      </div>
      <ChartContainer title="Shift Performance Breakdown" height="h-48" empty>
        <></>
      </ChartContainer>
    </div>
  )
}
