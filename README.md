# ShiftIQ Pro — AI-Powered Intelligent Cross-Shift Operations Platform

A production-ready enterprise UI/UX template for modern manufacturing operations.  
Built with **React 18 + TypeScript + Tailwind CSS + Vite**.

---

## Quick Start

```bash
npm install
npm run dev        # development server  →  http://localhost:5173
npm run build      # production build    →  dist/
npm run preview    # preview the build
```

---

## Project Structure

```
src/
├── App.tsx                        # Root router — all routes declared here
├── main.tsx                       # Entry point
├── styles/globals.css             # Tailwind base + component classes
│
├── context/
│   └── AppContext.tsx             # Global app state (sidebar, panels, online/offline)
│
├── lib/
│   ├── utils.ts                   # cn(), status/severity config maps
│   └── types.ts                   # Shared domain type definitions
│
├── components/
│   ├── shell/
│   │   ├── AppLayout.tsx          # Desktop layout wrapper + PageHeader
│   │   ├── Sidebar.tsx            # Collapsible sidebar + mobile drawer
│   │   └── TopBar.tsx             # Plant/shift selector, search, notifications
│   │
│   ├── panels/
│   │   ├── NotificationPanel.tsx  # Right-side drawer notification center
│   │   └── GlobalSearch.tsx       # Cmd+K fullscreen search modal
│   │
│   └── ui/
│       ├── Button.tsx             # 6 variants × 4 sizes + loading state
│       ├── Badge.tsx              # Badge, StatusBadge, SeverityBadge
│       ├── Card.tsx               # Card, CardHeader, KpiCard, KpiCardSkeleton
│       ├── Input.tsx              # Input, Select, Textarea, SearchInput
│       ├── Modal.tsx              # Modal + Drawer
│       ├── Tabs.tsx               # Tabs, TabList, Tab, TabPanel
│       ├── Table.tsx              # DataTable with sort + Pagination
│       ├── FilterBar.tsx          # FilterBar, DateRangePicker, ActiveFilters
│       ├── StatusIndicator.tsx    # StatusIndicator, HealthBar, EfficiencyBar
│       ├── ParameterCard.tsx      # Live parameter display card
│       ├── ChartContainer.tsx     # Recharts wrapper with loading/empty/error states
│       ├── ProgressIndicator.tsx  # LinearProgress, UploadProgress, StepIndicator
│       ├── Skeletons.tsx          # All skeleton loaders
│       ├── EmptyState.tsx         # All domain-specific empty states
│       └── ErrorState.tsx         # Error states + AlertBanner + InlineError
│
└── pages/
    ├── Dashboard.tsx              # Main dashboard — KPIs, live ops, charts
    ├── LiveOperations.tsx         # Real-time machine status table/grid
    ├── Machines.tsx               # Machine list — table + grid views
    ├── MachineDetail.tsx          # 8-tab machine detail (overview → audit)
    ├── Production.tsx             # 6-chart production analytics
    ├── Abnormalities.tsx          # Abnormality table + report form modal
    ├── Alerts.tsx                 # Alert center — critical/warning/info tabs
    ├── CrossShiftMemory.tsx       # Operational timeline + AI pattern panel
    ├── Handover.tsx               # Shift handover form + AI summary + sign-off
    ├── Maintenance.tsx            # Maintenance requests + scheduling tabs
    ├── Reports.tsx                # 7 report types with config modal
    ├── Users.tsx                  # User table, roles, permissions matrix
    ├── Settings.tsx               # 11-section settings panel
    ├── AuditTrail.tsx             # Audit log table
    └── mobile/
        ├── OperatorLayout.tsx     # Mobile shell with bottom navigation
        ├── OperatorHome.tsx       # Operator home — quick action grid
        ├── QRScanner.tsx          # QR scanner with all scan states
        ├── ProductionEntry.tsx    # Production entry form with stepper
        ├── CleaningChecklist.tsx  # Dynamic cleaning checklist
        └── OfflineMode.tsx        # Offline status with sync queue
```

---

## Routes

| Path                    | Component            | Layout   |
|-------------------------|----------------------|----------|
| `/`                     | Dashboard            | Desktop  |
| `/live-operations`      | LiveOperations       | Desktop  |
| `/machines`             | Machines             | Desktop  |
| `/machines/:id`         | MachineDetail        | Desktop  |
| `/production`           | Production           | Desktop  |
| `/abnormalities`        | Abnormalities        | Desktop  |
| `/alerts`               | Alerts               | Desktop  |
| `/cross-shift-memory`   | CrossShiftMemory     | Desktop  |
| `/handover`             | Handover             | Desktop  |
| `/maintenance`          | Maintenance          | Desktop  |
| `/reports`              | Reports              | Desktop  |
| `/users`                | Users                | Desktop  |
| `/settings`             | Settings             | Desktop  |
| `/audit`                | AuditTrail           | Desktop  |
| `/operator`             | OperatorHome         | Mobile   |
| `/operator/scan`        | QRScanner            | Mobile   |
| `/operator/production`  | ProductionEntry      | Mobile   |
| `/operator/cleaning`    | CleaningChecklist    | Mobile   |
| `/operator/report`      | (Abnormality shell)  | Mobile   |
| `/operator/handover`    | (Handover shell)     | Mobile   |
| `/operator/offline`     | OfflineMode          | Mobile   |

---

## Design System

### Colours
| Token     | Use                              |
|-----------|----------------------------------|
| `brand`   | Primary actions, active states   |
| `teal`    | Secondary accent                 |
| `emerald` | Success / running / healthy      |
| `amber`   | Warning / maintenance            |
| `red`     | Critical / fault / error         |
| `slate`   | Neutral text, borders, surfaces  |

### Typography scale
`text-display` → `text-page` → `text-section` → body → `text-kpi` → caption

### Shadows
`shadow-card` · `shadow-card-hover` · `shadow-modal` · `shadow-sidebar` · `shadow-topbar`

---

## Connecting Real Data

Every page is built around **empty/loading/error/data states**. To connect an API:

1. Replace the `const loading = false` / `const empty = true` flags with real async state (React Query, SWR, or plain `useState`+`useEffect`).
2. Map API response objects to the existing column/card render functions.
3. The TypeScript types in `src/lib/types.ts` define the expected shape for every entity.

No component renders hardcoded business data — all content placeholders (`—`) are intentional and will be replaced by live values.

---

## Tech Stack

| Package           | Version  | Purpose                     |
|-------------------|----------|-----------------------------|
| react             | 18.3     | UI framework                |
| react-dom         | 18.3     | DOM renderer                |
| react-router-dom  | 6.26     | Client-side routing         |
| tailwindcss       | 3.4      | Utility-first CSS           |
| recharts          | 2.12     | Chart library               |
| lucide-react      | 0.453    | Icon set                    |
| clsx              | 2.1      | Class name composition      |
| date-fns          | 4.1      | Date utilities              |
| vite              | 5.4      | Build tool                  |
| typescript        | 5.5      | Type safety                 |
