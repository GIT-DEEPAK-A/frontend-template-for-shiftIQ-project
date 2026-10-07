import { type ReactNode } from 'react'
import { Filter, SlidersHorizontal, LayoutGrid, List, RefreshCw } from 'lucide-react'
import { SearchInput, Select } from './Input'
import Button from './Button'
import { cn } from '@/lib/utils'

interface FilterOption {
  key: string
  label: string
  options: { value: string; label: string }[]
  value?: string
  onChange?: (value: string) => void
}

interface FilterBarProps {
  search?: string
  onSearch?: (value: string) => void
  searchPlaceholder?: string
  filters?: FilterOption[]
  viewMode?: 'table' | 'grid'
  onViewModeChange?: (mode: 'table' | 'grid') => void
  onRefresh?: () => void
  actions?: ReactNode
  className?: string
}

export default function FilterBar({
  search, onSearch, searchPlaceholder = 'Search…',
  filters = [], viewMode, onViewModeChange, onRefresh, actions, className
}: FilterBarProps) {
  return (
    <div className={cn('flex flex-wrap items-center gap-2 mb-4', className)}>
      {/* Search */}
      {onSearch !== undefined && (
        <div className="w-60 flex-shrink-0">
          <SearchInput
            value={search}
            onChange={e => onSearch(e.target.value)}
            onClear={() => onSearch('')}
            placeholder={searchPlaceholder}
          />
        </div>
      )}

      {/* Dynamic filter dropdowns */}
      {filters.map(filter => (
        <div key={filter.key} className="flex-shrink-0">
          <Select
            options={[{ value: '', label: `All ${filter.label}` }, ...filter.options]}
            value={filter.value ?? ''}
            onChange={e => filter.onChange?.(e.target.value)}
            className="text-xs py-2 h-[38px] min-w-[140px]"
          />
        </div>
      ))}

      {/* Spacer */}
      <div className="flex-1" />

      {/* View mode toggles */}
      {viewMode && onViewModeChange && (
        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
          <button
            onClick={() => onViewModeChange('table')}
            className={cn(
              'p-2 transition-colors',
              viewMode === 'table'
                ? 'bg-brand-50 text-brand-600'
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
            )}
            aria-label="Table view"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewModeChange('grid')}
            className={cn(
              'p-2 transition-colors',
              viewMode === 'grid'
                ? 'bg-brand-50 text-brand-600'
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
            )}
            aria-label="Grid view"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Refresh */}
      {onRefresh && (
        <Button variant="outline" size="sm" icon={<RefreshCw className="w-3.5 h-3.5" />} onClick={onRefresh}>
          Refresh
        </Button>
      )}

      {/* Extra actions */}
      {actions}
    </div>
  )
}

// ── Date Range Picker (placeholder) ──────────────────────────────────────

interface DateRangeProps {
  className?: string
}

export function DateRangePicker({ className }: DateRangeProps) {
  return (
    <button className={cn(
      'flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-sm text-slate-600 transition-colors',
      className
    )}>
      <SlidersHorizontal className="w-4 h-4 text-slate-400" />
      <span>Date range</span>
    </button>
  )
}

// ── Active filter chips ────────────────────────────────────────────────────

interface FilterChip {
  label: string
  value: string
  onRemove: () => void
}

interface ActiveFiltersProps {
  filters: FilterChip[]
  onClearAll?: () => void
}

export function ActiveFilters({ filters, onClearAll }: ActiveFiltersProps) {
  if (filters.length === 0) return null

  return (
    <div className="flex items-center gap-2 flex-wrap mb-3">
      <span className="text-xs text-slate-500 flex items-center gap-1.5">
        <Filter className="w-3.5 h-3.5" />
        Active filters:
      </span>
      {filters.map(f => (
        <span key={f.value} className="inline-flex items-center gap-1 px-2 py-0.5 bg-brand-50 text-brand-700 rounded-full text-xs font-medium">
          {f.label}: {f.value}
          <button onClick={f.onRemove} className="text-brand-400 hover:text-brand-700 ml-0.5" aria-label={`Remove ${f.label} filter`}>×</button>
        </span>
      ))}
      {onClearAll && (
        <button onClick={onClearAll} className="text-xs text-slate-500 hover:text-slate-700 underline">
          Clear all
        </button>
      )}
    </div>
  )
}
