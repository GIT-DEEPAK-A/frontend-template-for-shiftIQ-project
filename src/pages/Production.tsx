import { useState } from 'react'
import { BarChart2, TrendingUp, Target, Clock, Download, RefreshCw } from 'lucide-react'
import {
  BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { PageHeader } from '@/components/shell/AppLayout'
import Button from '@/components/ui/Button'
import { KpiCard } from '@/components/ui/Card'
import ChartContainer, { LegendItem } from '@/components/ui/ChartContainer'
import FilterBar, { DateRangePicker } from '@/components/ui/FilterBar'
import { Tabs, TabList, Tab, TabPanel } from '@/components/ui/Tabs'
import { NoProductionDataState } from '@/components/ui/EmptyState'
import { KpiSkeleton } from '@/components/ui/Skeletons'

const EMPTY_CHART = Array.from({ length: 7 }, () => ({
  name: '', actual: 0, target: 0, efficiency: 0, downtime: 0
}))

export default function Production() {
  const [search, setSearch] = useState('')
  const [machineFilter, setMachineFilter] = useState('')
  const [shiftFilter, setShiftFilter] = useState('')
  const loading = false
  const empty   = true

  return (
    <div className="space-y-5">
      <PageHeader
        title="Production"
        subtitle="Analytics and performance tracking across all machines and shifts"
        actions={
          <>
            <DateRangePicker />
            <Button variant="outline" size="sm" icon={<Download className="w-3.5 h-3.5" />}>Export</Button>
            <Button variant="outline" size="sm" icon={<RefreshCw className="w-3.5 h-3.5" />}>Refresh</Button>
          </>
        }
      />

      {/* ── Filters ── */}
      <div className="card p-4">
        <FilterBar
          search={search}
          onSearch={setSearch}
          searchPlaceholder="Search by machine or product…"
          filters={[
            {
              key: 'machine', label: 'Machine',
              options: [], value: machineFilter, onChange: setMachineFilter,
            },
            {
              key: 'shift', label: 'Shift',
              options: [
                { value: 'morning',   label: 'Morning'   },
                { value: 'afternoon', label: 'Afternoon' },
                { value: 'night',     label: 'Night'     },
              ],
              value: shiftFilter, onChange: setShiftFilter,
            },
            {
              key: 'product', label: 'Product',
              options: [], value: '', onChange: () => {},
            },
          ]}
        />
      </div>

      {/* ── KPI Summary ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <KpiSkeleton key={i} />)
        ) : (
          <>
            <KpiCard title="Total Production" icon={<BarChart2 className="w-4 h-4" />} status={null} trend={null} />
            <KpiCard title="Production Target" icon={<Target className="w-4 h-4" />} status={null} trend={null} />
            <KpiCard title="Avg. Efficiency"  icon={<TrendingUp className="w-4 h-4" />} status={null} trend={null} />
            <KpiCard title="Total Downtime"   icon={<Clock className="w-4 h-4" />} status={null} trend={null} />
          </>
        )}
      </div>

      {/* ── Chart Tabs ── */}
      <Tabs defaultTab="vs-target">
        <div className="card overflow-hidden">
          <div className="px-5 pt-4 border-b border-slate-100">
            <TabList>
              <Tab id="vs-target">Production vs Target</Tab>
              <Tab id="trend">Production Trend</Tab>
              <Tab id="shift-comparison">Shift Comparison</Tab>
              <Tab id="machine-perf">Machine Performance</Tab>
              <Tab id="efficiency">Efficiency</Tab>
              <Tab id="downtime">Downtime</Tab>
            </TabList>
          </div>

          <div className="p-5">
            {/* Production vs Target */}
            <TabPanel id="vs-target">
              <ChartContainer
                title="Production vs Target"
                subtitle="Actual production compared to set targets"
                height="h-72"
                loading={loading}
                empty={empty}
                onRetry={() => {}}
                legendContent={
                  <>
                    <LegendItem color="#3b82f6" label="Actual" />
                    <LegendItem color="#e2e8f0" label="Target" />
                  </>
                }
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={EMPTY_CHART} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }} formatter={() => ['—', '']} />
                    <Bar dataKey="actual" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="target" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </TabPanel>

            {/* Production Trend */}
            <TabPanel id="trend">
              <ChartContainer title="Production Trend" height="h-72" loading={loading} empty={empty} onRetry={() => {}}
                legendContent={<LegendItem color="#3b82f6" label="Production" />}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={EMPTY_CHART} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="prodGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={() => ['—', '']} />
                    <Area type="monotone" dataKey="actual" stroke="#3b82f6" fill="url(#prodGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </TabPanel>

            {/* Shift Comparison */}
            <TabPanel id="shift-comparison">
              <ChartContainer title="Shift Comparison" height="h-72" loading={loading} empty={empty} onRetry={() => {}}
                legendContent={
                  <>
                    <LegendItem color="#3b82f6" label="Morning" />
                    <LegendItem color="#14b8a6" label="Afternoon" />
                    <LegendItem color="#8b5cf6" label="Night" />
                  </>
                }
              >
                <></>
              </ChartContainer>
            </TabPanel>

            {/* Machine Performance */}
            <TabPanel id="machine-perf">
              <ChartContainer title="Machine Performance" height="h-72" loading={loading} empty={empty} onRetry={() => {}}>
                <></>
              </ChartContainer>
            </TabPanel>

            {/* Efficiency */}
            <TabPanel id="efficiency">
              <ChartContainer title="Efficiency Over Time" height="h-72" loading={loading} empty={empty} onRetry={() => {}}>
                <></>
              </ChartContainer>
            </TabPanel>

            {/* Downtime */}
            <TabPanel id="downtime">
              <ChartContainer title="Downtime Impact" subtitle="Downtime duration and frequency by machine" height="h-72" loading={loading} empty={empty} onRetry={() => {}}>
                <></>
              </ChartContainer>
            </TabPanel>
          </div>
        </div>
      </Tabs>

      {/* ── Production Records Table ── */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-section text-slate-900">Production Records</h2>
        </div>
        {empty ? (
          <NoProductionDataState onRefresh={() => {}} />
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  {['Machine', 'Product', 'Quantity', 'Target', 'Efficiency', 'Shift', 'Date', 'Operator'].map(h => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={8} className="py-12 text-center text-sm text-slate-400">
                    No records
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
