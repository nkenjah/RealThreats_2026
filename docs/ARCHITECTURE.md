# University Management System — System Architecture

## 1. Technology Stack

| Layer                     | Technology                          | Version    |
| ------------------------- | ----------------------------------- | ---------- |
| **Backend Framework**     | Laravel                             | 13.x       |
| **Frontend Framework**    | React                               | 19.x       |
| **Type Safety**           | TypeScript                          | 5.x        |
| **Server-Side Rendering** | Inertia.js                          | 3.x        |
| **Styling**               | Tailwind CSS                        | 4.x        |
| **Build Tool**            | Vite                                | 8.x        |
| **Database**              | MySQL / MariaDB                     | 8+ / 10.6+ |
| **WebSockets**            | Laravel Reverb                      | 1.x        |
| **Auth**                  | Laravel Fortify + WebAuthn Passkeys | Latest     |
| **RBAC**                  | Spatie Laravel Permission           | 8.x        |
| **Audit Logging**         | Spatie Laravel Activitylog          | 5.x        |
| **Charts**                | Recharts                            | 3.x        |
| **Icons**                 | Lucide React                        | Latest     |

## 2. System Topology (High-Level)

```
┌──────────────────────────────────────────────────────┐
│                    CLIENT LAYER                       │
│  React SPA (Inertia.js) + Tailwind CSS + TypeScript  │
└────────────────────┬─────────────────────────────────┘
                     │ HTTP/WebSocket
┌────────────────────▼─────────────────────────────────┐
│              SERVER LAYER (Laravel 13)                │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────────┐  │
│  │ Routes   │ │Middleware│ │ Controllers          │  │
│  │ (web.php)│ │ Auth,RBAC│ │ (53 controllers)     │  │
│  └──────────┘ │Audit,Log │ └──────────────────────┘  │
│               └──────────┘ ┌──────────────────────┐  │
│                            │ Services / Jobs       │  │
│                            │ (Risk scores, Reports)│  │
│                            └──────────────────────┘  │
└────────────────────┬─────────────────────────────────┘
                     │ ORM (Eloquent)
┌────────────────────▼─────────────────────────────────┐
│              DATA LAYER (MySQL/MariaDB)               │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────────┐  │
│  │ Academic │ │ Finance  │ │ Security/Auth        │  │
│  │ (17 tbls)│ │ (8 tbls) │ │ (8 tbls)             │  │
│  ├──────────┤ ├──────────┤ ├──────────────────────┤  │
│  │ Library  │ │ Housing  │ │ LMS / Alumni         │  │
│  │ (3 tbls) │ │ (4 tbls) │ │ (5 tbls)             │  │
│  └──────────┘ └──────────┘ └──────────────────────┘  │
└──────────────────────────────────────────────────────┘
                     │
┌────────────────────▼─────────────────────────────────┐
│           EXTERNAL INTEGRATION LAYER (Planned)        │
│  GePG (Gov. Payments) | TCU/NACTVET | HESLB (Loans)  │
│  NECTA | Banks (Vendor/RTGS) | ResearchGate/Wiley    │
└──────────────────────────────────────────────────────┘
```

## 3. Request Lifecycle

```
User Action → Inertia Link/Form → XHR Request
  → Laravel Router → Middleware Stack
    → Check.lock (account locked?)
    → Track.activity (audit log)
    → Role/permission gate
  → Controller → Eloquent Query → Database
  → Inertia::render() returns page component + props
  → React renders SPA page with server-provided data
```

## 4. Security Architecture

- **Authentication**: Laravel Fortify with email+password, 2FA (TOTP), WebAuthn Passkeys
- **Authorization**: Spatie RBAC with 7 defined roles (SuperAdmin, Registrar, Bursar, HOD, Lecturer, Student, Invigilator)
- **Session Security**: Session tracking with geo-location, force-logout capability
- **Risk Scoring**: Automated user risk score calculation (failed logins, off-hours access, privilege escalation)
- **Audit Trail**: Immutable logging of all database transactions via Spatie Activitylog + custom threat alerts
- **Account Locking**: Automatic lock on suspicious activity, with admin unlock workflow

## 5. Real-Time Architecture

```
Laravel Reverb WebSocket Server
  → Channel: 'threats' (real-time security alerts)
  → Channel: 'admin-alerts' (admin notifications)
  → Private Channel: 'App.Models.User.{id}' (personal notifications)
```

## 6. Scheduled Tasks (Console)

| Job                            | Schedule        | Purpose                      |
| ------------------------------ | --------------- | ---------------------------- |
| RecalculateRiskScoresJob       | Every 15 min    | Update user risk scores      |
| GenerateDailySecurityReportJob | Daily 07:00 EAT | Email daily security summary |

## 7. Directory Architecture

```
app/
├── Http/Controllers/     # 53 controllers (one per resource)
├── Models/                # 59 Eloquent models
├── Console/Kernel.php     # Scheduled task definitions
├── Exceptions/            # Custom exception handlers
└── Providers/             # Service providers

resources/
├── js/
│   ├── pages/             # 149 Inertia page components (React)
│   ├── components/        # 86 reusable React components
│   ├── layouts/           # App, Auth, Settings layouts
│   ├── types/             # TypeScript type definitions (55+ entity types)
│   ├── routes/            # Auto-generated route helpers (Wayfinder)
│   ├── hooks/             # Custom React hooks
│   └── lib/               # Utilities (cn, toUrl)
├── css/                   # Tailwind CSS
└── views/                 # Blade entry point (app.blade.php)

routes/
├── web.php                # Main web routes (192 lines)
├── settings.php           # Settings routes
├── channels.php           # Broadcasting channels
└── console.php            # Scheduled task console routes

database/
├── migrations/            # 18 migration files
└── seeders/               # Database seeders (incl. ComprehensiveUniversitySeeder)
```

## 8. Integration Points (Planned)

| External System        | Integration Type | Purpose                                        |
| ---------------------- | ---------------- | ---------------------------------------------- |
| **GePG**               | REST API         | Government payment gateway for fee collections |
| **TCU**                | REST API / SFTP  | Student data exchange, program accreditation   |
| **NACTVET**            | REST API / SFTP  | Technical/vocational program data exchange     |
| **HESLB**              | REST API         | Loan allocation matching and disbursement      |
| **NECTA**              | File Import      | Form 4 / Form 6 result verification            |
| **Banks (CRDB/NMB)**   | Bank File        | Bulk payment reconciliation                    |
| **Wiley/ResearchGate** | OAuth/Link       | E-library resource access                      |
