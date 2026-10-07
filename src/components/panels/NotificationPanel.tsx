import { CheckCheck, AlertOctagon, AlertTriangle, Info, ChevronRight } from 'lucide-react'
import { useAppContext } from '@/context/AppContext'
import { Drawer } from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import { NoNotificationsState } from '@/components/ui/EmptyState'
import { NotificationSkeleton } from '@/components/ui/Skeletons'
import { Tabs, TabList, Tab, TabPanel } from '@/components/ui/Tabs'
import { cn } from '@/lib/utils'

type Category = 'critical' | 'warning' | 'info'

const CATEGORY_META: Record<Category, {
  Icon: typeof AlertOctagon; color: string; bg: string; border: string
}> = {
  critical: { Icon: AlertOctagon,  color: 'text-red-500',    bg: 'bg-red-50',    border: 'border-red-100'    },
  warning:  { Icon: AlertTriangle, color: 'text-amber-500',  bg: 'bg-amber-50',  border: 'border-amber-100'  },
  info:     { Icon: Info,          color: 'text-brand-500',  bg: 'bg-brand-50',  border: 'border-brand-100'  },
}

const loading = false
const empty   = true

export default function NotificationPanel() {
  const { notificationPanelOpen, setNotificationPanelOpen } = useAppContext()

  return (
    <Drawer
      open={notificationPanelOpen}
      onClose={() => setNotificationPanelOpen(false)}
      title="Notifications"
      width="w-96 max-w-full"
      footer={
        empty ? undefined : (
          <Button variant="ghost" size="sm" icon={<CheckCheck className="w-3.5 h-3.5" />}>
            Mark all as read
          </Button>
        )
      }
    >
      {loading ? (
        <NotificationSkeleton count={4} />
      ) : (
        <Tabs defaultTab="all">
          <TabList className="mb-4" variant="pills">
            <Tab id="all"      variant="pill">All</Tab>
            <Tab id="critical" variant="pill">Critical</Tab>
            <Tab id="warning"  variant="pill">Warnings</Tab>
            <Tab id="info"     variant="pill">Info</Tab>
          </TabList>

          {(['all', 'critical', 'warning', 'info'] as const).map(tabId => (
            <TabPanel key={tabId} id={tabId}>
              <NotificationList
                category={tabId === 'all' ? undefined : tabId}
                empty={empty}
              />
            </TabPanel>
          ))}
        </Tabs>
      )}
    </Drawer>
  )
}

// ── Notification List ──────────────────────────────────────────────────────

function NotificationList({ category, empty }: { category?: Category; empty: boolean }) {
  if (empty) return <NoNotificationsState />

  return (
    <div className="space-y-1">
      {/* Rows rendered from API */}
      <NotificationRowPlaceholder category={category ?? 'info'} unread />
      <NotificationRowPlaceholder category={category ?? 'warning'} />
    </div>
  )
}

// ── Notification Row ───────────────────────────────────────────────────────

function NotificationRowPlaceholder({
  category, unread
}: { category: Category; unread?: boolean }) {
  const meta = CATEGORY_META[category]

  return (
    <div className={cn(
      'flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors hover:bg-slate-50',
      unread && 'bg-slate-50/80'
    )}>
      {/* Icon */}
      <div className={cn(
        'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
        meta.bg
      )}>
        <meta.Icon className={cn('w-4 h-4', meta.color)} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-1">
          <p className="text-sm font-medium text-slate-700 truncate">— Notification title —</p>
          {unread && (
            <span className="w-2 h-2 rounded-full bg-brand-500 flex-shrink-0 mt-1.5" />
          )}
        </div>
        <p className="text-xs text-slate-400 mt-0.5 truncate-2">— Notification description —</p>
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-[10px] text-slate-400">—</span>
          <button className="text-[10px] text-brand-600 font-medium flex items-center gap-0.5">
            View <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  )
}
