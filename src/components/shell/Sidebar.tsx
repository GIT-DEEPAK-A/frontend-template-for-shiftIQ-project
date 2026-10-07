import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Activity, Cpu, BarChart2, AlertTriangle,
  Bell, GitMerge, ArrowLeftRight, Wrench, FileText,
  Users, Settings, ChevronLeft, ChevronRight, Zap, X
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppContext } from '@/context/AppContext'

const NAV_ITEMS = [
  { id: 'dashboard',          label: 'Dashboard',          path: '/',                   icon: LayoutDashboard },
  { id: 'live-operations',    label: 'Live Operations',     path: '/live-operations',    icon: Activity,       badge: true },
  { id: 'machines',           label: 'Machines',            path: '/machines',           icon: Cpu },
  { id: 'production',         label: 'Production',          path: '/production',         icon: BarChart2 },
  { id: 'abnormalities',      label: 'Abnormalities',       path: '/abnormalities',      icon: AlertTriangle,  badge: true },
  { id: 'alerts',             label: 'Alerts',              path: '/alerts',             icon: Bell,           badge: true },
  { id: 'cross-shift-memory', label: 'Cross-Shift Memory',  path: '/cross-shift-memory', icon: GitMerge },
  { id: 'handover',           label: 'Handover',            path: '/handover',           icon: ArrowLeftRight, badge: true },
  { id: 'maintenance',        label: 'Maintenance',         path: '/maintenance',        icon: Wrench,         badge: true },
  { id: 'reports',            label: 'Reports',             path: '/reports',            icon: FileText },
] as const

const BOTTOM_NAV = [
  { id: 'users',    label: 'Users',    path: '/users',    icon: Users    },
  { id: 'settings', label: 'Settings', path: '/settings', icon: Settings },
] as const

interface SidebarProps {
  mobile?: boolean
}

export default function Sidebar({ mobile = false }: SidebarProps) {
  const { sidebarCollapsed, toggleSidebar, setMobileSidebarOpen } = useAppContext()
  const location = useLocation()
  const collapsed = !mobile && sidebarCollapsed

  const closeDrawer = () => setMobileSidebarOpen(false)

  return (
    <aside
      className={cn(
        'flex flex-col bg-white border-r border-slate-100 shadow-sidebar h-full transition-all duration-200',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* ── Logo ── */}
      <div className={cn(
        'flex items-center h-14 px-4 border-b border-slate-100 flex-shrink-0',
        collapsed ? 'justify-center' : 'justify-between'
      )}>
        {!collapsed && (
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center flex-shrink-0">
              <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <div className="min-w-0">
              <span className="text-sm font-bold text-slate-900 tracking-tight block leading-tight">ShiftIQ Pro</span>
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-widest leading-tight">Operations</span>
            </div>
          </div>
        )}

        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
        )}

        {mobile ? (
          <button
            onClick={closeDrawer}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={toggleSidebar}
            className={cn(
              'p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors flex-shrink-0',
              collapsed && 'hidden'
            )}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* ── Main nav ── */}
      <nav className="flex-1 overflow-y-auto scrollbar-hide py-3 px-2 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const { id, label, path, icon: Icon } = item
          const badge = 'badge' in item ? item.badge : false
          const isActive = path === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(path)

          return (
            <NavLink
              key={id}
              to={path}
              onClick={mobile ? closeDrawer : undefined}
              className={cn(
                'nav-item group',
                isActive && 'active',
                collapsed && 'justify-center px-0'
              )}
              aria-label={collapsed ? label : undefined}
              title={collapsed ? label : undefined}
            >
              <div className="relative flex-shrink-0">
                <Icon
                  className={cn(
                    'w-[18px] h-[18px]',
                    isActive ? 'text-brand-600' : 'text-slate-500 group-hover:text-slate-700'
                  )}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {badge && (
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                )}
              </div>
              {!collapsed && <span className="flex-1 truncate">{label}</span>}
            </NavLink>
          )
        })}
      </nav>

      {/* ── Expand toggle (collapsed) ── */}
      {collapsed && !mobile && (
        <div className="px-2 py-2 border-t border-slate-100">
          <button
            onClick={toggleSidebar}
            className="w-full flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Expand sidebar"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── Bottom nav ── */}
      <div className={cn('px-2 py-3 border-t border-slate-100 space-y-0.5', collapsed && 'flex flex-col items-center')}>
        {BOTTOM_NAV.map(({ label, path, icon: Icon }) => {
          const isActive = location.pathname.startsWith(path)
          return (
            <NavLink
              key={path}
              to={path}
              onClick={mobile ? closeDrawer : undefined}
              className={cn('nav-item group', isActive && 'active', collapsed && 'justify-center px-0 w-full')}
              aria-label={collapsed ? label : undefined}
              title={collapsed ? label : undefined}
            >
              <Icon
                className={cn('w-[18px] h-[18px] flex-shrink-0', isActive ? 'text-brand-600' : 'text-slate-500 group-hover:text-slate-700')}
                strokeWidth={isActive ? 2.5 : 2}
              />
              {!collapsed && <span className="flex-1 truncate">{label}</span>}
            </NavLink>
          )
        })}
      </div>
    </aside>
  )
}
