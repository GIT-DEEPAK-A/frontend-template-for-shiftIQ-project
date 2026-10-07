import { useState, useEffect, useRef } from 'react'
import {
  Search, X, Cpu, BarChart2, AlertTriangle, Wrench,
  ArrowLeftRight, FileText, Clock, ArrowRight
} from 'lucide-react'
import { useAppContext } from '@/context/AppContext'
import { cn } from '@/lib/utils'

type SearchCategory = 'machines' | 'production' | 'abnormalities' | 'maintenance' | 'handovers' | 'reports'

const CATEGORY_META: Record<SearchCategory, { label: string; icon: React.ElementType; color: string }> = {
  machines:       { label: 'Machines',       icon: Cpu,           color: 'text-brand-600'  },
  production:     { label: 'Production',     icon: BarChart2,     color: 'text-teal-600'   },
  abnormalities:  { label: 'Abnormalities',  icon: AlertTriangle, color: 'text-amber-600'  },
  maintenance:    { label: 'Maintenance',    icon: Wrench,        color: 'text-slate-600'  },
  handovers:      { label: 'Handovers',      icon: ArrowLeftRight,color: 'text-purple-600' },
  reports:        { label: 'Reports',        icon: FileText,      color: 'text-emerald-600'},
}

const RECENT_SEARCHES: string[] = [] // loaded from localStorage/API

export default function GlobalSearch() {
  const { searchOpen, setSearchOpen } = useAppContext()
  const [query, setQuery]             = useState('')
  const [activeCategory, setCategory] = useState<SearchCategory | 'all'>('all')
  const inputRef                      = useRef<HTMLInputElement>(null)

  // Auto-focus on open
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
    } else {
      setQuery('')
    }
  }, [searchOpen])

  // Keyboard shortcut: Cmd/Ctrl+K
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    document.addEventListener('keydown', handle)
    return () => document.removeEventListener('keydown', handle)
  }, [setSearchOpen])

  if (!searchOpen) return null

  const hasQuery = query.trim().length > 0
  const loading  = false
  const results  = 0

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Global search"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={() => setSearchOpen(false)}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-modal overflow-hidden animate-fade-in">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100">
          <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search across ShiftIQ Pro…"
            className="flex-1 text-base text-slate-800 placeholder-slate-400 bg-transparent outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 border border-slate-200 text-slate-400">
            Esc
          </kbd>
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-1 px-4 py-2 border-b border-slate-100 overflow-x-auto scrollbar-hide">
          <CategoryPill label="All" active={activeCategory === 'all'} onClick={() => setCategory('all')} />
          {(Object.entries(CATEGORY_META) as [SearchCategory, typeof CATEGORY_META[SearchCategory]][]).map(([id, meta]) => (
            <CategoryPill
              key={id}
              label={meta.label}
              active={activeCategory === id}
              onClick={() => setCategory(id)}
            />
          ))}
        </div>

        {/* Results body */}
        <div className="max-h-96 overflow-y-auto">
          {/* Empty initial state */}
          {!hasQuery && (
            <div className="p-4 space-y-4">
              {/* Recent searches */}
              {RECENT_SEARCHES.length > 0 ? (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Recent Searches</p>
                  <div className="space-y-1">
                    {RECENT_SEARCHES.map(s => (
                      <SearchSuggestionRow key={s} label={s} onClick={() => setQuery(s)} />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center">
                  <Search className="w-8 h-8 text-slate-200 mx-auto mb-3" />
                  <p className="text-sm font-medium text-slate-500">Search across ShiftIQ Pro</p>
                  <p className="text-xs text-slate-400 mt-1">Find machines, production records, abnormalities, and more</p>
                </div>
              )}

              {/* Category shortcuts */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Browse by Category</p>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.entries(CATEGORY_META) as [SearchCategory, typeof CATEGORY_META[SearchCategory]][]).map(([id, meta]) => (
                    <button
                      key={id}
                      onClick={() => setCategory(id)}
                      className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-colors text-left"
                    >
                      <meta.icon className={cn('w-4 h-4 flex-shrink-0', meta.color)} />
                      <span className="text-xs font-medium text-slate-600 truncate">{meta.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Loading state */}
          {hasQuery && loading && (
            <div className="p-4 space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-2">
                  <div className="skeleton w-8 h-8 rounded-lg" />
                  <div className="flex-1 space-y-1.5">
                    <div className="skeleton h-3.5 w-40 rounded" />
                    <div className="skeleton h-3 w-56 rounded" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No results */}
          {hasQuery && !loading && results === 0 && (
            <div className="py-12 text-center px-4">
              <Search className="w-8 h-8 text-slate-200 mx-auto mb-3" />
              <p className="text-sm font-medium text-slate-500">No results for "{query}"</p>
              <p className="text-xs text-slate-400 mt-1">Try a different search term or browse by category</p>
            </div>
          )}

          {/* Results (rendered from API) */}
          {/* <SearchResult /> ... */}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 text-[10px] text-slate-400">
            <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 bg-white border border-slate-200 rounded text-[10px]">↑↓</kbd> Navigate</span>
            <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 bg-white border border-slate-200 rounded text-[10px]">↵</kbd> Select</span>
            <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 bg-white border border-slate-200 rounded text-[10px]">Esc</kbd> Close</span>
          </div>
          {hasQuery && results > 0 && (
            <span className="text-[10px] text-slate-400">{results} results</span>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Category pill ──────────────────────────────────────────────────────────

function CategoryPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex-shrink-0',
        active
          ? 'bg-brand-100 text-brand-700'
          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
      )}
    >
      {label}
    </button>
  )
}

// ── Search suggestion row ──────────────────────────────────────────────────

function SearchSuggestionRow({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm text-slate-600 hover:bg-slate-100 transition-colors text-left"
    >
      <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
      <span className="flex-1 truncate">{label}</span>
      <ArrowRight className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
    </button>
  )
}
