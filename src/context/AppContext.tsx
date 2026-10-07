import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

interface AppState {
  sidebarCollapsed: boolean
  mobileSidebarOpen: boolean
  notificationPanelOpen: boolean
  searchOpen: boolean
  isOnline: boolean
  syncStatus: 'idle' | 'syncing' | 'success' | 'failed'
  pendingSyncCount: number
}

interface AppContextValue extends AppState {
  toggleSidebar: () => void
  setMobileSidebarOpen: (open: boolean) => void
  setNotificationPanelOpen: (open: boolean) => void
  setSearchOpen: (open: boolean) => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    sidebarCollapsed: false,
    mobileSidebarOpen: false,
    notificationPanelOpen: false,
    searchOpen: false,
    isOnline: true,
    syncStatus: 'idle',
    pendingSyncCount: 0,
  })

  const toggleSidebar = useCallback(() => {
    setState(s => ({ ...s, sidebarCollapsed: !s.sidebarCollapsed }))
  }, [])

  const setMobileSidebarOpen = useCallback((open: boolean) => {
    setState(s => ({ ...s, mobileSidebarOpen: open }))
  }, [])

  const setNotificationPanelOpen = useCallback((open: boolean) => {
    setState(s => ({ ...s, notificationPanelOpen: open }))
  }, [])

  const setSearchOpen = useCallback((open: boolean) => {
    setState(s => ({ ...s, searchOpen: open }))
  }, [])

  return (
    <AppContext.Provider value={{ ...state, toggleSidebar, setMobileSidebarOpen, setNotificationPanelOpen, setSearchOpen }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be used within AppProvider')
  return ctx
}
