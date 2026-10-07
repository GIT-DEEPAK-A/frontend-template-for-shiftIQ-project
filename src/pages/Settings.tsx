import { useState } from 'react'
import {
  Building2, MapPin, Cpu, Gauge, Bell, Clock, Shield,
  Zap, Plug, Save, ChevronRight, Settings as SettingsIcon, Sliders
} from 'lucide-react'
import { PageHeader } from '@/components/shell/AppLayout'
import Button from '@/components/ui/Button'
import { Input, Select } from '@/components/ui/Input'
import { AlertBanner } from '@/components/ui/ErrorState'
import { cn } from '@/lib/utils'

const SETTING_SECTIONS = [
  { id: 'organisation', label: 'Organisation',  icon: Building2  },
  { id: 'plant',        label: 'Plant',          icon: MapPin     },
  { id: 'machines',     label: 'Machines',       icon: Cpu        },
  { id: 'parameters',   label: 'Parameters',     icon: Gauge      },
  { id: 'thresholds',   label: 'Thresholds',     icon: Sliders    },
  { id: 'alerts',       label: 'Alerts',         icon: Bell       },
  { id: 'shifts',       label: 'Shifts',         icon: Clock      },
  { id: 'roles',        label: 'Roles',          icon: Shield     },
  { id: 'notifications',label: 'Notifications',  icon: Bell       },
  { id: 'ai',           label: 'AI Settings',    icon: Zap        },
  { id: 'integrations', label: 'Integrations',   icon: Plug       },
] as const

type SectionId = typeof SETTING_SECTIONS[number]['id']

export default function SettingsPage() {
  const [activeSection, setSection] = useState<SectionId>('organisation')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const ActiveIcon = SETTING_SECTIONS.find(s => s.id === activeSection)?.icon ?? SettingsIcon
  const activeLabel = SETTING_SECTIONS.find(s => s.id === activeSection)?.label ?? 'Settings'

  return (
    <div className="space-y-5">
      <PageHeader
        title="Settings"
        subtitle="Configure your ShiftIQ Pro platform"
        actions={
          <Button variant="primary" size="sm" icon={<Save className="w-3.5 h-3.5" />} onClick={handleSave}>
            Save Changes
          </Button>
        }
      />

      {saved && (
        <AlertBanner
          variant="success"
          title="Settings saved"
          description="Your configuration changes have been saved successfully."
          onDismiss={() => setSaved(false)}
        />
      )}

      <div className="flex gap-5">
        {/* Left nav */}
        <aside className="w-52 flex-shrink-0">
          <nav className="card p-2 space-y-0.5">
            {SETTING_SECTIONS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setSection(id)}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left',
                  activeSection === id
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1 truncate">{label}</span>
                {activeSection === id && <ChevronRight className="w-3 h-3 text-brand-400 flex-shrink-0" />}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content panel */}
        <div className="flex-1 min-w-0">
          <div className="card p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center">
                <ActiveIcon className="w-4 h-4 text-brand-600" />
              </div>
              <div>
                <h2 className="text-section text-slate-900">{activeLabel}</h2>
                <p className="text-xs text-slate-400">Configure {activeLabel.toLowerCase()} settings</p>
              </div>
            </div>

            {/* Render active section */}
            <div className="animate-fade-in">
              {activeSection === 'organisation' && <OrganisationSettings />}
              {activeSection === 'plant'         && <PlantSettings />}
              {activeSection === 'machines'      && <MachineSettings />}
              {activeSection === 'parameters'    && <ParameterSettings />}
              {activeSection === 'thresholds'    && <ThresholdSettings />}
              {activeSection === 'alerts'        && <AlertSettings />}
              {activeSection === 'shifts'        && <ShiftSettings />}
              {activeSection === 'roles'         && <RolesSettings />}
              {activeSection === 'notifications' && <NotificationSettings />}
              {activeSection === 'ai'            && <AiSettings />}
              {activeSection === 'integrations'  && <IntegrationsSettings />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Settings Sections ──────────────────────────────────────────────────────

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-5">
      <div className="pb-3 border-b border-slate-100">
        <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
      </div>
      {children}
    </div>
  )
}

function FieldRow({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-6">
      <div className="w-52 flex-shrink-0 pt-2">
        <p className="text-sm font-medium text-slate-700">{label}</p>
        {hint && <p className="text-xs text-slate-400 mt-0.5">{hint}</p>}
      </div>
      <div className="flex-1 max-w-md">{children}</div>
    </div>
  )
}

function OrganisationSettings() {
  return (
    <div className="space-y-6">
      <SettingsSection title="Organisation Details">
        <FieldRow label="Organisation Name" hint="Your company or organisation name">
          <Input placeholder="Organisation name" />
        </FieldRow>
        <FieldRow label="Industry" hint="Primary industry classification">
          <Select
            placeholder="— Select industry —"
            options={[
              { value: 'automotive',   label: 'Automotive'   },
              { value: 'food-beverage',label: 'Food & Beverage'},
              { value: 'pharma',       label: 'Pharmaceutical'},
              { value: 'electronics',  label: 'Electronics'  },
              { value: 'general',      label: 'General Manufacturing'},
              { value: 'other',        label: 'Other'        },
            ]}
          />
        </FieldRow>
        <FieldRow label="Timezone" hint="Default timezone for all operations">
          <Select placeholder="— Select timezone —" options={[]} />
        </FieldRow>
        <FieldRow label="Date Format">
          <Select
            options={[
              { value: 'dd/mm/yyyy', label: 'DD/MM/YYYY' },
              { value: 'mm/dd/yyyy', label: 'MM/DD/YYYY' },
              { value: 'yyyy-mm-dd', label: 'YYYY-MM-DD' },
            ]}
          />
        </FieldRow>
        <FieldRow label="Language">
          <Select
            options={[
              { value: 'en', label: 'English' },
              { value: 'ms', label: 'Bahasa Malaysia' },
              { value: 'zh', label: 'Chinese (Simplified)' },
            ]}
          />
        </FieldRow>
      </SettingsSection>
    </div>
  )
}

function PlantSettings() {
  return (
    <div className="space-y-6">
      <SettingsSection title="Plant Configuration">
        <FieldRow label="Plant Name">
          <Input placeholder="Plant / site name" />
        </FieldRow>
        <FieldRow label="Location">
          <Input placeholder="City, Country" />
        </FieldRow>
        <FieldRow label="Plant Code" hint="Short alphanumeric identifier">
          <Input placeholder="e.g. PLT-01" />
        </FieldRow>
        <FieldRow label="Production Lines" hint="Number of active production lines">
          <Input type="number" placeholder="0" min={0} />
        </FieldRow>
      </SettingsSection>
    </div>
  )
}

function MachineSettings() {
  return (
    <div className="space-y-6">
      <SettingsSection title="Machine Defaults">
        <FieldRow label="Default Update Interval" hint="How often machine data refreshes (seconds)">
          <Input type="number" placeholder="30" min={5} max={300} />
        </FieldRow>
        <FieldRow label="Auto-detect Fault" hint="Automatically flag machines as fault after missed heartbeats">
          <Select options={[
            { value: 'enabled',  label: 'Enabled'  },
            { value: 'disabled', label: 'Disabled' },
          ]} />
        </FieldRow>
        <FieldRow label="Health Calculation Method">
          <Select placeholder="— Select method —" options={[
            { value: 'oee',    label: 'OEE-based' },
            { value: 'uptime', label: 'Uptime-based' },
            { value: 'custom', label: 'Custom formula' },
          ]} />
        </FieldRow>
      </SettingsSection>
    </div>
  )
}

function ParameterSettings() {
  return (
    <div className="space-y-6">
      <SettingsSection title="Parameter Configuration">
        <div className="p-4 bg-slate-50 rounded-xl text-sm text-slate-500 text-center">
          Parameters are configured per-machine. <br />
          Navigate to a machine and open the <strong>Parameters</strong> tab.
        </div>
        <FieldRow label="Default Units System">
          <Select options={[
            { value: 'metric',   label: 'Metric (SI)' },
            { value: 'imperial', label: 'Imperial'    },
          ]} />
        </FieldRow>
        <FieldRow label="Value Precision">
          <Select options={[
            { value: '0', label: '0 decimal places' },
            { value: '1', label: '1 decimal place'  },
            { value: '2', label: '2 decimal places' },
            { value: '3', label: '3 decimal places' },
          ]} />
        </FieldRow>
      </SettingsSection>
    </div>
  )
}

function ThresholdSettings() {
  return (
    <div className="space-y-6">
      <SettingsSection title="Alert Thresholds">
        <p className="text-sm text-slate-500 -mt-3 pb-2">
          Configure global threshold rules. Machine-specific thresholds override these defaults.
        </p>
        {['Temperature', 'Pressure', 'Vibration', 'Current'].map(param => (
          <FieldRow key={param} label={param} hint="Warning / Critical thresholds">
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="Warning threshold" type="number" />
              <Input placeholder="Critical threshold" type="number" />
            </div>
          </FieldRow>
        ))}
      </SettingsSection>
    </div>
  )
}

function AlertSettings() {
  return (
    <div className="space-y-6">
      <SettingsSection title="Alert Configuration">
        <FieldRow label="Alert Delivery" hint="How alerts are sent to users">
          <div className="space-y-2">
            {['In-app notification', 'Email', 'SMS', 'Push notification'].map(channel => (
              <label key={channel} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-brand-600" />
                <span className="text-sm text-slate-700">{channel}</span>
              </label>
            ))}
          </div>
        </FieldRow>
        <FieldRow label="Critical Alert Cooldown" hint="Minimum time between repeated critical alerts (minutes)">
          <Input type="number" placeholder="15" min={1} />
        </FieldRow>
        <FieldRow label="Auto-acknowledge" hint="Auto-acknowledge info alerts after">
          <Select options={[
            { value: 'never',  label: 'Never'         },
            { value: '1h',     label: '1 hour'        },
            { value: '4h',     label: '4 hours'       },
            { value: '8h',     label: '8 hours (1 shift)' },
            { value: '24h',    label: '24 hours'      },
          ]} />
        </FieldRow>
      </SettingsSection>
    </div>
  )
}

function ShiftSettings() {
  return (
    <div className="space-y-6">
      <SettingsSection title="Shift Configuration">
        <p className="text-sm text-slate-500 -mt-3 pb-2">
          Define your shift schedule. Times use the plant's configured timezone.
        </p>
        {[
          { name: 'Morning Shift',   start: '06:00', end: '14:00' },
          { name: 'Afternoon Shift', start: '14:00', end: '22:00' },
          { name: 'Night Shift',     start: '22:00', end: '06:00' },
        ].map(shift => (
          <div key={shift.name} className="p-4 border border-slate-200 rounded-xl">
            <div className="grid grid-cols-3 gap-3">
              <Input label="Shift Name" defaultValue={shift.name} />
              <Input label="Start Time" type="time" defaultValue={shift.start} />
              <Input label="End Time"   type="time" defaultValue={shift.end}   />
            </div>
          </div>
        ))}
        <Button variant="outline" size="sm" icon={<Clock className="w-3.5 h-3.5" />}>Add Shift</Button>
      </SettingsSection>
    </div>
  )
}

function RolesSettings() {
  return (
    <div className="space-y-6">
      <SettingsSection title="Role Management">
        <p className="text-sm text-slate-500 -mt-3 pb-4">
          Role permissions are managed in <strong>User Management → Permissions</strong>.
        </p>
        <FieldRow label="Default New User Role">
          <Select options={[
            { value: 'operator',    label: 'Operator'    },
            { value: 'supervisor',  label: 'Supervisor'  },
            { value: 'maintenance', label: 'Maintenance' },
          ]} />
        </FieldRow>
        <FieldRow label="Require Approval" hint="New users require admin approval before activation">
          <Select options={[
            { value: 'yes', label: 'Yes — require approval' },
            { value: 'no',  label: 'No — activate immediately' },
          ]} />
        </FieldRow>
      </SettingsSection>
    </div>
  )
}

function NotificationSettings() {
  return (
    <div className="space-y-6">
      <SettingsSection title="Notification Preferences">
        {[
          { label: 'Critical Alerts',           hint: 'Immediate notification for critical issues'    },
          { label: 'Abnormality Reports',        hint: 'When a new abnormality is reported'           },
          { label: 'Handover Ready',             hint: 'When an outgoing shift submits a handover'    },
          { label: 'Maintenance Due',            hint: 'Before scheduled maintenance is due'          },
          { label: 'Shift Summary',              hint: 'End-of-shift summary report'                  },
          { label: 'AI Insights Available',      hint: 'When AI analysis produces new insights'       },
        ].map(item => (
          <FieldRow key={item.label} label={item.label} hint={item.hint}>
            <div className="flex items-center gap-4">
              {['In-app', 'Email', 'Push'].map(ch => (
                <label key={ch} className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" className="w-3.5 h-3.5 rounded border-slate-300 text-brand-600" />
                  <span className="text-xs text-slate-600">{ch}</span>
                </label>
              ))}
            </div>
          </FieldRow>
        ))}
      </SettingsSection>
    </div>
  )
}

function AiSettings() {
  return (
    <div className="space-y-6">
      <SettingsSection title="AI & Intelligence Settings">
        <FieldRow label="AI Features" hint="Enable or disable AI-powered analysis">
          <Select options={[
            { value: 'enabled',  label: 'Enabled'  },
            { value: 'disabled', label: 'Disabled' },
          ]} />
        </FieldRow>
        <FieldRow label="Pattern Detection Sensitivity" hint="Higher sensitivity detects more patterns but may increase noise">
          <Select options={[
            { value: 'low',    label: 'Low'    },
            { value: 'medium', label: 'Medium (recommended)' },
            { value: 'high',   label: 'High'   },
          ]} />
        </FieldRow>
        <FieldRow label="AI Handover Summary" hint="Automatically generate AI-assisted handover summaries">
          <Select options={[
            { value: 'auto',   label: 'Generate automatically at shift end' },
            { value: 'manual', label: 'Generate on request only'            },
            { value: 'off',    label: 'Disabled'                            },
          ]} />
        </FieldRow>
        <FieldRow label="Minimum Data Required" hint="Minimum shifts before AI insights become available">
          <Input type="number" placeholder="3" min={1} max={30} />
        </FieldRow>
        <FieldRow label="Data Retention for AI" hint="How long operational data is retained for AI training (months)">
          <Input type="number" placeholder="12" min={1} />
        </FieldRow>
      </SettingsSection>
    </div>
  )
}

function IntegrationsSettings() {
  const integrations = [
    { name: 'SCADA System',       status: 'disconnected', desc: 'Connect to your plant SCADA for real-time data'    },
    { name: 'ERP System',         status: 'disconnected', desc: 'Sync production orders and targets from ERP'        },
    { name: 'CMMS',               status: 'disconnected', desc: 'Connect your Computerised Maintenance System'       },
    { name: 'OPC-UA / OPC-DA',    status: 'disconnected', desc: 'Direct OPC server connection for machine data'     },
    { name: 'MQTT Broker',        status: 'disconnected', desc: 'IoT sensor data via MQTT protocol'                  },
    { name: 'REST API',           status: 'active',       desc: 'Generic REST API for custom integrations'           },
    { name: 'Webhook Outbound',   status: 'disconnected', desc: 'Send events to external systems via webhooks'       },
    { name: 'Email (SMTP)',       status: 'disconnected', desc: 'Configure outbound email for notifications'         },
  ]

  return (
    <div className="space-y-3">
      {integrations.map(intg => (
        <div key={intg.name} className="flex items-center gap-4 p-4 border border-slate-200 rounded-xl hover:border-slate-300 transition-colors">
          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
            <Plug className="w-4 h-4 text-slate-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-800">{intg.name}</p>
            <p className="text-xs text-slate-500">{intg.desc}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={cn(
              'text-xs font-medium px-2 py-0.5 rounded-full',
              intg.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
            )}>
              {intg.status === 'active' ? 'Connected' : 'Not connected'}
            </span>
            <Button variant="outline" size="xs">
              {intg.status === 'active' ? 'Configure' : 'Connect'}
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
