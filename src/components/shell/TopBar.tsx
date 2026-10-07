import { Search, Bell, ChevronDown, Wifi, WifiOff, RefreshCw, Menu, User } from 'lucide-react'
import { useAppContext } from '@/context/AppContext'
import { cn } from '@/lib/utils'

export default function TopBar() {
  const {
    isOnline, syncStatus, setSearchOpen,
    setNotificationPanelOpen, setMobileSidebarOpen,
  } = useAppContext()

  return (
    <header className="h-14 bg-white border-b border-slate-100 shadow-topbar flex items-center px-4 gap-3 flex-shrink-0 z-30">

      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileSidebarOpen(true)}
        className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* ── Left: Plant + Shift selectors ── */}
      <div className="hidden md:flex items-center gap-2">
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 transition-colors text-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
          <span className="text-slate-500 text-xs font-medium">Plant</span>
          <span className="text-slate-700 font-medium truncate max-w-[120px]">— Select Plant —</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
        </button>

        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 transition-colors text-sm">
          <span className="text-slate-500 text-xs font-medium">Shift</span>
          <span className="text-slate-700 font-medium">— Select Shift —</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
        </button>
      </div>

      {/* ── Center: Global search ── */}
      <div className="flex-1 max-w-md mx-auto">
        <button
          onClick={() => setSearchOpen(true)}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200/70 transition-colors text-sm text-slate-400 text-left"
          aria-label="Open global search"
        >
          <Search className="w-4 h-4 flex-shrink-0" />
          <span className="flex-1 text-sm">Search across ShiftIQ Pro…</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-white border border-slate-200 text-slate-400">
            <span>⌘</span><span>K</span>
          </kbd>
        </button>
      </div>

      {/* ── Right: Status + Actions ── */}
      <div className="flex items-center gap-1.5">

        {/* Connection status */}
        <div className={cn(
          'hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium',
          isOnline ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
        )}>
          {isOnline
            ? <Wifi className="w-3.5 h-3.5" />
            : <WifiOff className="w-3.5 h-3.5" />
          }
          <span className="hidden lg:inline">{isOnline ? 'Online' : 'Offline'}</span>
        </div>

        {/* Sync indicator */}
        {syncStatus === 'syncing' && (
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-brand-50 text-brand-700">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span className="hidden lg:inline">Syncing…</span>
          </div>
        )}

        {/* Notifications */}
        <button
          onClick={() => setNotificationPanelOpen(true)}
          className="relative p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-[18px] h-[18px]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border-2 border-white" />
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-slate-200 mx-1" />

        {/* User profile */}
        <button className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">
          <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-slate-500" />
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-semibold text-slate-700 leading-tight">— User —</div>
            <div className="text-[10px] text-slate-400 leading-tight">— Role —</div>
          </div>
          <ChevronDown className="hidden lg:block w-3 h-3 text-slate-400" />
        </button>
      </div>
    </header>
  )
}
