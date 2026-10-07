// ─── Shared domain types (all optional/nullable — data comes from API) ───────

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface PaginationMeta {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export interface ApiResponse<T> {
  data: T | null
  loading: boolean
  error: string | null
}

// ─── Navigation ──────────────────────────────────────────────────────────────

export type NavItemId =
  | 'dashboard'
  | 'live-operations'
  | 'machines'
  | 'production'
  | 'abnormalities'
  | 'alerts'
  | 'cross-shift-memory'
  | 'handover'
  | 'maintenance'
  | 'reports'
  | 'users'
  | 'settings'

export interface NavItem {
  id: NavItemId
  label: string
  path: string
  icon: string
  badge?: 'dot' | null
  children?: NavItem[]
}

// ─── KPI Card ────────────────────────────────────────────────────────────────

export interface KpiCardData {
  id: string
  title: string
  value?: string | number | null
  unit?: string
  trend?: 'up' | 'down' | 'flat' | null
  trendValue?: string | null
  status?: 'success' | 'warning' | 'critical' | 'neutral' | null
  comparison?: string | null
  loading?: boolean
}

// ─── Machine ─────────────────────────────────────────────────────────────────

export interface Machine {
  id: string
  name: string
  location: string
  status: 'running' | 'idle' | 'maintenance' | 'fault' | 'offline'
  health: number | null
  production: number | null
  target: number | null
  efficiency: number | null
  lastUpdated: string | null
}

// ─── Parameter ───────────────────────────────────────────────────────────────

export interface Parameter {
  id: string
  name: string
  value: number | null
  unit: string
  minNormal: number | null
  maxNormal: number | null
  status: 'normal' | 'warning' | 'critical' | null
  trend: 'up' | 'down' | 'flat' | null
  lastUpdated: string | null
}

// ─── Abnormality ─────────────────────────────────────────────────────────────

export interface Abnormality {
  id: string
  issue: string
  machineId: string
  machineName: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  reportedBy: string
  shift: string
  time: string
  status: 'open' | 'in-progress' | 'resolved' | 'closed'
  assignedTo: string | null
}

// ─── Alert ───────────────────────────────────────────────────────────────────

export interface Alert {
  id: string
  title: string
  description: string
  severity: 'critical' | 'warning' | 'info'
  machineId: string | null
  timestamp: string
  read: boolean
  acknowledged: boolean
}

// ─── Maintenance ─────────────────────────────────────────────────────────────

export interface MaintenanceRecord {
  id: string
  machineId: string
  machineName: string
  issue: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  assignedTechnician: string | null
  createdAt: string
  dueDate: string | null
  status: 'pending' | 'in-progress' | 'completed' | 'overdue'
}

// ─── User ─────────────────────────────────────────────────────────────────────

export type UserRole = 'operator' | 'supervisor' | 'maintenance' | 'plant-manager' | 'administrator'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  plant: string | null
  status: 'active' | 'inactive' | 'pending'
  lastActive: string | null
}

// ─── Audit Log ───────────────────────────────────────────────────────────────

export interface AuditEntry {
  id: string
  user: string
  action: string
  module: string
  record: string
  timestamp: string
  device: string
  result: 'success' | 'failure'
}

// ─── Handover ────────────────────────────────────────────────────────────────

export interface HandoverRecord {
  id: string
  outgoingShift: string
  incomingShift: string
  date: string
  supervisor: string
  status: 'draft' | 'pending-review' | 'signed-off' | 'acknowledged'
}

// ─── Notification ────────────────────────────────────────────────────────────

export interface Notification {
  id: string
  category: 'critical' | 'warning' | 'info'
  title: string
  description: string
  timestamp: string
  read: boolean
  actionLabel?: string
}
