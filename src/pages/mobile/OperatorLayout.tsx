import { type ReactNode } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  Home, QrCode, BarChart2, AlertTriangle, ArrowLeftRight, Sparkles
} from 'lucide-react'
import { cn } from '@/lib/utils'

const BOTTOM_NAV = [
  { id: 'home',     label: 'Home',     path: '/operator',            icon: Home          },
  { id: 'scan',     label: 'Scan',     path: '/operator/scan',       icon: QrCode        },
  { id: 'entry',    label: 'Entry',    path: '/operator/production',  icon: BarChart2     },
  { id: 'report',   label: 'Report',   path: '/operator/report',     icon: AlertTriangle },
  { id: 'handover', label: 'Handover', path: '/operator/handover',   icon: ArrowLeftRight},
]

interface OperatorLayoutProps {
  children: ReactNode
  title?: string
  subtitle?: string
  backPath?: string
  actions?: ReactNode
}

export default function OperatorLayout({ children, title, subtitle, backPath, actions }: OperatorLayoutProps) {
  const location = useLocation()

  return (
    <div className="flex flex-col min-h-screen bg-surface-50">
      {/* ── Top bar ── */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-100 shadow-topbar">
        <div className="flex items-center h-14 px-4 gap-3">
          {backPath && (
            <NavLink to={backPath} className="p-2 -ml-2 rounded-xl text-slate-500 hover:bg-slate-100">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </NavLink>
          )}

          {!backPath && (
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            {title && <h1 className="text-sm font-semibold text-slate-900 truncate">{title}</h1>}
            {subtitle && <p className="text-xs text-slate-400 truncate">{subtitle}</p>}
          </div>

          {actions && <div className="flex items-center gap-1 flex-shrink-0">{actions}</div>}
        </div>
      </header>

      {/* ── Content ── */}
      <main className="flex-1 overflow-y-auto pb-20">
        <div className="max-w-lg mx-auto p-4 space-y-4 animate-fade-in">
          {children}
        </div>
      </main>

      {/* ── Bottom nav ── */}
      <nav className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-slate-200 safe-area-pb">
        <div className="flex items-stretch h-16 max-w-lg mx-auto">
          {BOTTOM_NAV.map(({ id, label, path, icon: Icon }) => {
            const isActive = path === '/operator'
              ? location.pathname === '/operator'
              : location.pathname.startsWith(path)

            return (
              <NavLink
                key={id}
                to={path}
                className={cn(
                  'flex-1 flex flex-col items-center justify-center gap-0.5 text-center transition-colors',
                  isActive ? 'text-brand-600' : 'text-slate-400 hover:text-slate-600'
                )}
              >
                <Icon className={cn('w-5 h-5', isActive && 'text-brand-600')} strokeWidth={isActive ? 2.5 : 2} />
                <span className={cn('text-[10px] font-medium', isActive ? 'text-brand-700' : 'text-slate-400')}>{label}</span>
              </NavLink>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
