# KIUT Insider Threat Mitigation System

Real-time insider threat detection and mitigation platform for **Kampala International University of Tanzania (KIUT)**. Built with Laravel 13, Inertia.js v3, React 19, TypeScript, and Laravel Reverb WebSockets.

## Requirements

- PHP 8.3+
- Node.js 20+
- MySQL 8.0+ (or SQLite for development)
- Composer 2.x
- NPM 10+

## Installation

```bash
# 1. Clone the repository
git clone <repository-url> kiut-threat-monitor
cd kiut-threat-monitor

# 2. Install PHP dependencies
composer install

# 3. Install frontend dependencies
npm install

# 4. Environment setup
cp .env.example .env
php artisan key:generate

# 5. Configure .env database (MySQL recommended for production)
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=kiut_threat_monitor
# DB_USERNAME=root
# DB_PASSWORD=

# 6. Run migrations and seeders
php artisan migrate
php artisan db:seed

# 7. Build frontend assets
npm run build

# 8. Start services (in separate terminals or use the dev command)
php artisan serve
php artisan queue:work --tries=3
php artisan reverb:start
npm run dev
```

Or use the all-in-one dev command:

```bash
composer run dev
```

## Default Login Credentials

| Role       | Email                     | Password |
| ---------- | ------------------------- | -------- |
| Superadmin | superadmin@kiut.ac.tz     | password |
| Admin      | ict.director@kiut.ac.tz   | password |
| Admin      | network.admin@kiut.ac.tz  | password |
| Staff      | finance.staff@kiut.ac.tz  | password |
| Staff      | registry.staff@kiut.ac.tz | password |
| Staff      | academic.staff@kiut.ac.tz | password |
| Staff      | library.staff@kiut.ac.tz  | password |
| Staff      | finance.staff2@kiut.ac.tz | password |
| Student    | student001@kiut.ac.tz     | password |
| Student    | student002@kiut.ac.tz     | password |
| Student    | student003@kiut.ac.tz     | password |

## Key Features

### Threat Detection & Mitigation

- Real-time activity logging with risk score calculation
- 6 alert types: failed_login, unauthorized_access, off_hours_access, data_exfiltration, privilege_escalation, simultaneous_login
- Automatic kill switch (account lock) when risk score exceeds threshold
- Role-based access control (superadmin, admin, staff, student)

### Real-Time Monitoring

- Laravel Reverb WebSocket for live threat feed
- Broadcast events for threat detection, mitigation, account locks
- Live dashboard updates via Echo

### Security Controls

- Failed login threshold with auto-lock
- Off-hours access detection (configurable window)
- Simultaneous session detection
- Bulk download/data exfiltration detection
- Configurable risk score thresholds

### User Management

- Full CRUD with role assignment
- Risk score gauges and activity timelines
- Manual lock/unlock and force logout
- Session tracking and termination

### Reporting

- Dashboard with stats cards and charts (Recharts)
- 30-day alert trend analysis
- Severity distribution pie chart
- Risk leaderboard (top 10)
- CSV export capability
- Daily email security reports

## Architecture

### Backend

- **Laravel 13** with **Fortify** authentication (passkeys + 2FA)
- **Spatie Laravel Permission** for RBAC
- **Spatie Activitylog** for comprehensive audit trail
- **Laravel Reverb** for WebSocket real-time events
- Queue jobs for async threat analysis and score recalculation

### Frontend

- **React 19** with **TypeScript**
- **Inertia.js v3** for server-driven SPA
- **Tailwind CSS v4** with CSS variables for theming
- **Recharts** for data visualization
- **Laravel Echo** with Reverb for real-time

### Core Modules

- **Dashboard** — Live threat feed, risk leaderboard, alert trends
- **Threat Alerts** — Paginated, filterable list with status management
- **Activity Logs** — Full audit trail with risk contributions
- **User Management** — RBAC, risk profiles, session control
- **Reports** — Analytics, charts, CSV export
- **System Configuration** — Runtime security parameter tuning

### University Modules

- Departments (ICT, Finance, Registry, Academic Affairs, Library)
- Courses with department assignments
- Lectures scheduling and management
- Exam security and lockdown
- Student records management

## License

MIT
