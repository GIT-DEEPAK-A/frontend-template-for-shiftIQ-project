import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'

// ── Column definition ──────────────────────────────────────────────────────

export interface Column<T = Record<string, unknown>> {
  key: string
  label: string
  sortable?: boolean
  width?: string
  align?: 'left' | 'center' | 'right'
  render?: (row: T) => ReactNode
}

// ── Sort state ─────────────────────────────────────────────────────────────

export interface SortState {
  key: string | null
  direction: 'asc' | 'desc'
}

// ── Data Table ─────────────────────────────────────────────────────────────

interface DataTableProps<T extends Record<string, unknown>> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  emptyState?: ReactNode
  sortState?: SortState
  onSort?: (key: string) => void
  rowKey?: (row: T) => string
  onRowClick?: (row: T) => void
  className?: string
}

export default function DataTable<T extends Record<string, unknown>>({
  columns, data, loading, emptyState, sortState, onSort, rowKey, onRowClick, className
}: DataTableProps<T>) {
  return (
    <div className={cn('overflow-x-auto rounded-xl border border-slate-100', className)}>
      <table className="data-table">
        <thead>
          <tr>
            {columns.map(col => (
              <th
                key={col.key}
                style={col.width ? { width: col.width } : undefined}
                className={cn(
                  col.align === 'center' && 'text-center',
                  col.align === 'right' && 'text-right',
                  col.sortable && 'cursor-pointer select-none hover:bg-slate-100 transition-colors'
                )}
                onClick={col.sortable && onSort ? () => onSort(col.key) : undefined}
                aria-sort={
                  sortState?.key === col.key
                    ? sortState.direction === 'asc' ? 'ascending' : 'descending'
                    : undefined
                }
              >
                <span className="flex items-center gap-1.5">
                  {col.label}
                  {col.sortable && (
                    <span className="text-slate-300">
                      {sortState?.key === col.key
                        ? sortState.direction === 'asc'
                          ? <ChevronUp className="w-3.5 h-3.5 text-brand-500" />
                          : <ChevronDown className="w-3.5 h-3.5 text-brand-500" />
                        : <ChevronsUpDown className="w-3.5 h-3.5" />
                      }
                    </span>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}>
                {columns.map(col => (
                  <td key={col.key}>
                    <div className="skeleton h-4 rounded w-full max-w-[120px]" />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-16 text-center">
                {emptyState ?? (
                  <span className="text-sm text-slate-400">No data available</span>
                )}
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr
                key={rowKey ? rowKey(row) : i}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={onRowClick ? 'cursor-pointer' : ''}
              >
                {columns.map(col => (
                  <td
                    key={col.key}
                    className={cn(
                      col.align === 'center' && 'text-center',
                      col.align === 'right' && 'text-right'
                    )}
                  >
                    {col.render ? col.render(row) : (row[col.key] as ReactNode) ?? '—'}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

// ── Pagination ─────────────────────────────────────────────────────────────

interface PaginationProps {
  page: number
  totalPages: number
  total: number
  pageSize: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, totalPages, total, pageSize, onPageChange }: PaginationProps) {
  const start = (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, total)

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
      <p className="text-xs text-slate-500">
        Showing {total > 0 ? `${start}–${end} of ${total}` : '0'} results
      </p>
      <div className="flex items-center gap-1">
        <button
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="px-2 py-1 rounded text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Prev
        </button>
        {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
          const p = i + 1
          return (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={cn(
                'w-7 h-7 rounded text-xs font-medium transition-colors',
                p === page
                  ? 'bg-brand-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              )}
            >
              {p}
            </button>
          )
        })}
        {totalPages > 5 && <span className="text-xs text-slate-400 px-1">…</span>}
        <button
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="px-2 py-1 rounded text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  )
}
