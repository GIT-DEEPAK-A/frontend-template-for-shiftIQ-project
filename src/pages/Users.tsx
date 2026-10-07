import { useState } from 'react'
import {
  Plus, Download, Shield, Activity, Edit
} from 'lucide-react'
import { PageHeader } from '@/components/shell/AppLayout'
import Button from '@/components/ui/Button'
import FilterBar from '@/components/ui/FilterBar'
import { Tabs, TabList, Tab, TabPanel } from '@/components/ui/Tabs'
import { NoUsersState } from '@/components/ui/EmptyState'
import { TableSkeleton } from '@/components/ui/Skeletons'
import Modal from '@/components/ui/Modal'
import { Input, Select } from '@/components/ui/Input'
import { cn } from '@/lib/utils'

type UserRole = 'operator' | 'supervisor' | 'maintenance' | 'plant-manager' | 'administrator'

const ROLE_META: Record<UserRole, { label: string; color: string; bg: string }> = {
  operator:       { label: 'Operator',       color: 'text-slate-700',  bg: 'bg-slate-100'  },
  supervisor:     { label: 'Supervisor',      color: 'text-brand-700',  bg: 'bg-brand-50'   },
  maintenance:    { label: 'Maintenance',     color: 'text-amber-700',  bg: 'bg-amber-50'   },
  'plant-manager':{ label: 'Plant Manager',   color: 'text-teal-700',   bg: 'bg-teal-50'    },
  administrator:  { label: 'Administrator',   color: 'text-purple-700', bg: 'bg-purple-50'  },
}

const USER_COLS = ['User', 'Role', 'Plant', 'Status', 'Last Active', '']

const PERMISSIONS = [
  { module: 'Dashboard',          actions: ['View', 'Export'] },
  { module: 'Live Operations',    actions: ['View'] },
  { module: 'Machines',           actions: ['View', 'Create', 'Edit', 'Delete'] },
  { module: 'Production',         actions: ['View', 'Create', 'Export'] },
  { module: 'Abnormalities',      actions: ['View', 'Create', 'Edit', 'Delete'] },
  { module: 'Alerts',             actions: ['View', 'Acknowledge'] },
  { module: 'Handover',           actions: ['View', 'Create', 'Sign'] },
  { module: 'Maintenance',        actions: ['View', 'Create', 'Edit', 'Delete'] },
  { module: 'Reports',            actions: ['View', 'Generate', 'Export'] },
  { module: 'Users',              actions: ['View', 'Create', 'Edit', 'Delete'] },
  { module: 'Settings',           actions: ['View', 'Edit'] },
  { module: 'AI Features',        actions: ['View', 'Use'] },
]

export default function UsersPage() {
  const [search, setSearch]     = useState('')
  const [roleFilter, setRole]   = useState('')
  const [addOpen, setAddOpen]   = useState(false)
  const loading = false
  const empty   = true

  return (
    <div className="space-y-5">
      <PageHeader
        title="User Management"
        subtitle="Manage user accounts, roles, and permissions"
        actions={
          <>
            <Button variant="outline" size="sm" icon={<Download className="w-3.5 h-3.5" />}>Export</Button>
            <Button variant="primary" size="sm" icon={<Plus className="w-3.5 h-3.5" />} onClick={() => setAddOpen(true)}>
              Add User
            </Button>
          </>
        }
      />

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {(Object.entries(ROLE_META) as [UserRole, typeof ROLE_META[UserRole]][]).map(([role, meta]) => (
          <div key={role} className={cn('card p-3', meta.bg)}>
            <p className={cn('text-xs font-medium mb-1', meta.color)}>{meta.label}</p>
            <p className="text-xl font-bold text-slate-300">—</p>
          </div>
        ))}
      </div>

      <Tabs defaultTab="users">
        <div className="card overflow-hidden">
          <div className="px-5 pt-4 border-b border-slate-100">
            <TabList>
              <Tab id="users">Users</Tab>
              <Tab id="roles">Roles</Tab>
              <Tab id="permissions">Permissions</Tab>
              <Tab id="activity">Activity</Tab>
            </TabList>
          </div>

          {/* Users tab */}
          <TabPanel id="users">
            <div className="px-5 py-3 border-b border-slate-50">
              <FilterBar
                search={search}
                onSearch={setSearch}
                searchPlaceholder="Search by name or email…"
                onRefresh={() => {}}
                filters={[
                  {
                    key: 'role', label: 'Role',
                    options: Object.entries(ROLE_META).map(([v, m]) => ({ value: v, label: m.label })),
                    value: roleFilter, onChange: setRole,
                  },
                  {
                    key: 'status', label: 'Status',
                    options: [
                      { value: 'active',   label: 'Active'   },
                      { value: 'inactive', label: 'Inactive' },
                      { value: 'pending',  label: 'Pending'  },
                    ],
                    value: '', onChange: () => {},
                  },
                  { key: 'plant', label: 'Plant', options: [], value: '', onChange: () => {} },
                ]}
              />
            </div>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>{USER_COLS.map(c => <th key={c}>{c}</th>)}</tr>
                </thead>
                <tbody>
                  {loading ? (
                    <TableSkeleton rows={6} columns={USER_COLS.length} />
                  ) : empty ? (
                    <tr>
                      <td colSpan={USER_COLS.length}>
                        <NoUsersState onAdd={() => setAddOpen(true)} />
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </TabPanel>

          {/* Roles tab */}
          <TabPanel id="roles">
            <div className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(Object.entries(ROLE_META) as [UserRole, typeof ROLE_META[UserRole]][]).map(([role, meta]) => (
                  <RoleCard key={role} role={role} meta={meta} />
                ))}
              </div>
            </div>
          </TabPanel>

          {/* Permissions tab */}
          <TabPanel id="permissions">
            <div className="p-5">
              <div className="mb-4 flex items-center gap-3">
                <Select
                  placeholder="— Select role to configure —"
                  options={Object.entries(ROLE_META).map(([v, m]) => ({ value: v, label: m.label }))}
                  className="w-64"
                />
                <Button variant="outline" size="sm">Apply Changes</Button>
              </div>
              <PermissionsMatrix />
            </div>
          </TabPanel>

          {/* Activity tab */}
          <TabPanel id="activity">
            <div className="p-5">
              <div className="py-10 text-center text-sm text-slate-400">
                <Activity className="w-6 h-6 mx-auto mb-2 text-slate-300" />
                <p>No activity data available.</p>
              </div>
            </div>
          </TabPanel>
        </div>
      </Tabs>

      <AddUserModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  )
}

// ── Role Card ──────────────────────────────────────────────────────────────

function RoleCard({ role, meta }: { role: UserRole; meta: typeof ROLE_META[UserRole] }) {
  const descriptions: Record<UserRole, string> = {
    operator:       'Can record production, report abnormalities, and complete cleaning checklists.',
    supervisor:     'Can view all operations, manage handovers, and approve abnormalities.',
    maintenance:    'Can create and manage maintenance requests and complete work orders.',
    'plant-manager':'Can access all reports, configure machines, and manage users.',
    administrator:  'Full access to all system features including settings and user management.',
  }

  return (
    <div className={cn('card p-4 border-2', meta.bg)}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Shield className={cn('w-4 h-4', meta.color)} />
          <span className={cn('text-sm font-semibold', meta.color)}>{meta.label}</span>
        </div>
        <button className="p-1 rounded text-slate-400 hover:text-slate-600">
          <Edit className="w-3.5 h-3.5" />
        </button>
      </div>
      <p className="text-xs text-slate-500">{descriptions[role]}</p>
      <div className="mt-3 pt-3 border-t border-slate-200">
        <p className="text-xs text-slate-400">Users: <span className="text-slate-600 font-medium">—</span></p>
      </div>
    </div>
  )
}

// ── Permissions Matrix ─────────────────────────────────────────────────────

function PermissionsMatrix() {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-100">
      <table className="data-table text-xs">
        <thead>
          <tr>
            <th className="w-48">Module</th>
            {['Operator', 'Supervisor', 'Maintenance', 'Plant Mgr', 'Admin'].map(r => (
              <th key={r} className="text-center">{r}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {PERMISSIONS.map(perm => (
            <tr key={perm.module}>
              <td>
                <div>
                  <p className="font-medium text-slate-700">{perm.module}</p>
                  <p className="text-[10px] text-slate-400">{perm.actions.join(' · ')}</p>
                </div>
              </td>
              {[0, 1, 2, 3, 4].map(i => (
                <td key={i} className="text-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                    defaultChecked={i >= 4 - Math.floor(Math.random() * 2)}
                    readOnly
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── Add User Modal ─────────────────────────────────────────────────────────

function AddUserModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [saving, setSaving] = useState(false)

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add User"
      subtitle="Create a new user account and assign a role"
      size="md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="sm" loading={saving}
            onClick={() => { setSaving(true); setTimeout(() => { setSaving(false); onClose() }, 1200) }}>
            Create User
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input label="First Name" required placeholder="First name" />
          <Input label="Last Name"  required placeholder="Last name"  />
        </div>
        <Input label="Email Address" required type="email" placeholder="user@company.com" />
        <Select
          label="Role"
          required
          placeholder="— Select role —"
          options={Object.entries(ROLE_META).map(([v, m]) => ({ value: v, label: m.label }))}
        />
        <Select
          label="Plant / Location"
          placeholder="— Assign to plant —"
          options={[]}
          hint="Determines which plant's data this user can access"
        />
        <Select
          label="Access Level"
          options={[
            { value: 'full',       label: 'Full access to assigned plant'   },
            { value: 'read-only',  label: 'Read-only'                        },
            { value: 'restricted', label: 'Restricted (custom permissions)'  },
          ]}
        />
        <div className="p-3 bg-brand-50 rounded-lg text-xs text-brand-700 border border-brand-100">
          An invitation email with a temporary password will be sent to the user.
        </div>
      </div>
    </Modal>
  )
}
