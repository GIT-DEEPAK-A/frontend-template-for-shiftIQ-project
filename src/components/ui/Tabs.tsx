import { type ReactNode, createContext, useContext, useState } from 'react'
import { cn } from '@/lib/utils'

// ── Context ────────────────────────────────────────────────────────────────

interface TabsContextValue {
  activeTab: string
  setActiveTab: (id: string) => void
}

const TabsContext = createContext<TabsContextValue | null>(null)

function useTabsContext() {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error('Tabs subcomponent must be used within <Tabs>')
  return ctx
}

// ── Tabs Root ──────────────────────────────────────────────────────────────

interface TabsProps {
  defaultTab: string
  children: ReactNode
  className?: string
  onChange?: (id: string) => void
}

export function Tabs({ defaultTab, children, className, onChange }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab)

  const handleChange = (id: string) => {
    setActiveTab(id)
    onChange?.(id)
  }

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab: handleChange }}>
      <div className={cn('w-full', className)}>{children}</div>
    </TabsContext.Provider>
  )
}

// ── Tab List ───────────────────────────────────────────────────────────────

interface TabListProps {
  children: ReactNode
  className?: string
  variant?: 'underline' | 'pills'
}

export function TabList({ children, className, variant = 'underline' }: TabListProps) {
  if (variant === 'pills') {
    return (
      <div className={cn('flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-xl w-fit', className)} role="tablist">
        {children}
      </div>
    )
  }

  return (
    <div className={cn('flex items-center gap-0 border-b border-slate-200 overflow-x-auto scrollbar-hide', className)} role="tablist">
      {children}
    </div>
  )
}

// ── Tab ────────────────────────────────────────────────────────────────────

interface TabProps {
  id: string
  children: ReactNode
  icon?: ReactNode
  badge?: ReactNode
  disabled?: boolean
  variant?: 'underline' | 'pill'
}

export function Tab({ id, children, icon, badge, disabled, variant = 'underline' }: TabProps) {
  const { activeTab, setActiveTab } = useTabsContext()
  const isActive = activeTab === id

  if (variant === 'pill') {
    return (
      <button
        role="tab"
        aria-selected={isActive}
        disabled={disabled}
        onClick={() => !disabled && setActiveTab(id)}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150',
          'disabled:opacity-40 disabled:cursor-not-allowed',
          isActive
            ? 'bg-white text-slate-900 shadow-sm'
            : 'text-slate-600 hover:text-slate-900'
        )}
      >
        {icon && <span className="w-4 h-4 flex-shrink-0">{icon}</span>}
        {children}
        {badge && <span className="ml-0.5">{badge}</span>}
      </button>
    )
  }

  return (
    <button
      role="tab"
      aria-selected={isActive}
      disabled={disabled}
      onClick={() => !disabled && setActiveTab(id)}
      className={cn(
        'flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors duration-150 whitespace-nowrap',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        isActive
          ? 'border-brand-600 text-brand-700'
          : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
      )}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
      {badge && <span className="ml-0.5">{badge}</span>}
    </button>
  )
}

// ── Tab Panels ─────────────────────────────────────────────────────────────

interface TabPanelProps {
  id: string
  children: ReactNode
  className?: string
}

export function TabPanel({ id, children, className }: TabPanelProps) {
  const { activeTab } = useTabsContext()
  if (activeTab !== id) return null

  return (
    <div role="tabpanel" className={cn('animate-fade-in', className)}>
      {children}
    </div>
  )
}
