import { type CSSProperties } from 'react'
import { cn } from '@/lib/utils'

// ── Base skeleton ──────────────────────────────────────────────────────────

interface SkeletonProps {
  className?: string
  rounded?: 'sm' | 'md' | 'lg' | 'full'
  style?: CSSProperties
}

export function Skeleton({ className, rounded = 'md', style }: SkeletonProps) {
  const r = { sm: 'rounded', md: 'rounded-md', lg: 'rounded-lg', full: 'rounded-full' }[rounded]
  return <div className={cn('skeleton', r, className)} style={style} />
}

// ── KPI skeleton ───────────────────────────────────────────────────────────

export function KpiSkeleton() {
  return (
    <div className="card p-4 sm:p-5 border-l-4 border-l-slate-200">
      <div className="flex items-start justify-between mb-3">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="w-8 h-8" rounded="lg" />
      </div>
      <Skeleton className="h-9 w-20 mb-2" />
      <div className="flex justify-between">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-12" />
      </div>
    </div>
  )
}

// ── Table row skeleton ─────────────────────────────────────────────────────

interface TableSkeletonProps {
  rows?: number
  columns?: number
}

export function TableSkeleton({ rows = 5, columns = 6 }: TableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="border-b border-slate-50">
          {Array.from({ length: columns }).map((_, j) => (
            <td key={j} className="px-4 py-3.5">
              <Skeleton
                className={cn('h-4', j === 0 ? 'w-32' : j === columns - 1 ? 'w-16' : 'w-20')}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}

// ── Chart skeleton ─────────────────────────────────────────────────────────

interface ChartSkeletonProps {
  height?: string
  showLegend?: boolean
}

export function ChartSkeleton({ height = 'h-60', showLegend = false }: ChartSkeletonProps) {
  return (
    <div className="w-full">
      {showLegend && (
        <div className="flex items-center gap-4 mb-4">
          {[80, 60, 70].map((w, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <Skeleton className="w-3 h-3" rounded="full" />
              <Skeleton className={`h-3 w-${w}`} />
            </div>
          ))}
        </div>
      )}
      <div className={cn('w-full bg-slate-100 rounded-xl animate-skeleton', height)}>
        <div className="w-full h-full flex items-end justify-around gap-2 px-4 pb-4 pt-8">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex-1 bg-slate-200 rounded-t" style={{ height: `${40 + Math.random() * 40}%` }} />
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Card skeleton ──────────────────────────────────────────────────────────

export function CardSkeleton() {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-8 h-8" rounded="lg" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-7 w-20" rounded="lg" />
      </div>
      <div className="space-y-2.5">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
        <Skeleton className="h-3 w-3/5" />
      </div>
    </div>
  )
}

// ── Machine card skeleton ──────────────────────────────────────────────────

export function MachineCardSkeleton() {
  return (
    <div className="card p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Skeleton className="w-8 h-8" rounded="lg" />
          <div>
            <Skeleton className="h-4 w-28 mb-1" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <Skeleton className="h-5 w-16" rounded="full" />
      </div>
      <div className="grid grid-cols-2 gap-3 mt-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i}>
            <Skeleton className="h-2.5 w-16 mb-1" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
      <Skeleton className="h-1.5 w-full mt-3" rounded="full" />
    </div>
  )
}

// ── Timeline skeleton ──────────────────────────────────────────────────────

export function TimelineSkeleton({ items = 4 }: { items?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex gap-3">
          <div className="flex flex-col items-center">
            <Skeleton className="w-8 h-8" rounded="full" />
            {i < items - 1 && <div className="w-px flex-1 bg-slate-100 mt-2" />}
          </div>
          <div className="flex-1 pb-4">
            <Skeleton className="h-4 w-40 mb-2" />
            <Skeleton className="h-3 w-full mb-1.5" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Notification skeleton ──────────────────────────────────────────────────

export function NotificationSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex gap-3 p-3 rounded-lg">
          <Skeleton className="w-8 h-8 flex-shrink-0" rounded="full" />
          <div className="flex-1">
            <Skeleton className="h-3.5 w-3/4 mb-1.5" />
            <Skeleton className="h-3 w-full mb-1" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

// ── AI summary skeleton ────────────────────────────────────────────────────

export function AiSummarySkeleton() {
  return (
    <div className="space-y-3 p-4 bg-brand-50/50 rounded-xl border border-brand-100">
      <div className="flex items-center gap-2 mb-2">
        <Skeleton className="w-5 h-5" rounded="full" />
        <Skeleton className="h-4 w-40" />
      </div>
      {[100, 90, 80, 85, 70].map((w, i) => (
        <Skeleton key={i} className={`h-3 w-[${w}%]`} style={{ width: `${w}%` }} />
      ))}
      <div className="pt-2 border-t border-brand-100">
        <Skeleton className="h-3 w-60 mb-1.5" />
        <Skeleton className="h-3 w-3/4" />
      </div>
    </div>
  )
}

// ── Page loading skeleton ──────────────────────────────────────────────────

export function PageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-7 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20" rounded="lg" />
          <Skeleton className="h-8 w-20" rounded="lg" />
        </div>
      </div>
      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <KpiSkeleton key={i} />)}
      </div>
      {/* Content card */}
      <div className="card p-5">
        <Skeleton className="h-5 w-40 mb-4" />
        <ChartSkeleton />
      </div>
    </div>
  )
}
