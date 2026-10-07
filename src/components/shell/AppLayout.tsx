import { type ReactNode } from 'react'
import { useAppContext } from '@/context/AppContext'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import { cn } from '@/lib/utils'

interface AppLayoutProps {
  children: ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { mobileSidebarOpen, setMobileSidebarOpen } = useAppContext()

  return (
    <div className="flex h-screen overflow-hidden bg-surface-50">

      {/* ── Desktop sidebar ── */}
      <div className="hidden lg:flex flex-shrink-0">
        <Sidebar />
      </div>

      {/* ── Mobile drawer backdrop ── */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Mobile sidebar drawer ── */}
      <div className={cn(
        'fixed inset-y-0 left-0 z-50 flex flex-col lg:hidden transition-transform duration-250',
        mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <Sidebar mobile />
      </div>

      {/* ── Main content area ── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar />

        <main
          className={cn(
            'flex-1 overflow-y-auto',
            'transition-all duration-200'
          )}
          id="main-content"
        >
          <div className="max-w-[1440px] mx-auto p-4 sm:p-6 animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

// ── Page header component ──────────────────────────────────────────────────

interface PageHeaderProps {
  title: string
  subtitle?: string
  actions?: ReactNode
  breadcrumbs?: { label: string; path?: string }[]
}

export function PageHeader({ title, subtitle, actions, breadcrumbs }: PageHeaderProps) {
  return (
    <div className="page-header">
      <div className="min-w-0">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-1.5" aria-label="Breadcrumb">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-slate-300">/</span>}
                <span className={i === breadcrumbs.length - 1 ? 'text-slate-600 font-medium' : 'hover:text-slate-600 cursor-pointer transition-colors'}>
                  {crumb.label}
                </span>
              </span>
            ))}
          </nav>
        )}
        <h1 className="text-page text-slate-900 truncate">{title}</h1>
        {subtitle && (
          <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 flex-shrink-0">
          {actions}
        </div>
      )}
    </div>
  )
}
