export interface User {
    id: number;
    name: string;
    email: string;
    department_id: number | null;
    is_active: boolean;
    is_locked: boolean;
    locked_at: string | null;
    lock_reason: string | null;
    failed_login_count: number;
    last_login_at: string | null;
    last_login_ip: string | null;
    email_verified_at: string | null;
    created_at: string;
    roles: Role[];
    department?: Department;
    risk_score?: UserRiskScore;
    sessionTracker?: UserSessionsTracker[];
}

export interface ThreatAlert {
    id: number;
    user_id: number;
    log_id: number | null;
    alert_type:
        | 'failed_login'
        | 'unauthorized_access'
        | 'off_hours_access'
        | 'data_exfiltration'
        | 'privilege_escalation'
        | 'simultaneous_login';
    severity: 'low' | 'medium' | 'high' | 'critical';
    status: 'open' | 'investigating' | 'resolved' | 'false_positive';
    auto_mitigated: boolean;
    mitigation_action: string | null;
    resolved_by: number | null;
    resolved_at: string | null;
    notes: string | null;
    created_at: string;
    user?: User;
    activityLog?: ActivityLog;
    resolver?: User;
}

export interface ActivityLog {
    id: number;
    user_id: number;
    action: string;
    module: string;
    description: string;
    ip_address: string;
    user_agent: string;
    risk_score_contribution: number;
    alert_triggered: boolean;
    created_at: string;
    user?: User;
    threatAlert?: ThreatAlert;
}

export interface UserRiskScore {
    id: number;
    user_id: number;
    current_score: number;
    score_history: ScoreHistoryEntry[];
    last_calculated_at: string;
}

export interface ScoreHistoryEntry {
    score: number;
    timestamp: string;
}

export interface Department {
    id: number;
    name: string;
    risk_policy_level: 'low' | 'medium' | 'high';
}

export interface Role {
    id: number;
    name: string;
    guard_name: string;
}

export interface Permission {
    id: number;
    name: string;
}

export interface SystemConfiguration {
    id: number;
    config_key: string;
    config_value: string;
    config_group: string;
    description: string | null;
}

export interface UserSessionsTracker {
    id: number;
    user_id: number;
    session_id: string;
    ip_address: string;
    user_agent: string;
    location: string | null;
    login_at: string;
    logout_at: string | null;
    is_active: boolean;
    was_force_terminated: boolean;
}

export interface DashboardStats {
    active_threats_count: number;
    locked_users_count: number;
    todays_alerts_count: number;
    high_risk_users_count: number;
    critical_count: number;
    high_count: number;
    medium_count: number;
    low_count: number;
}

export interface Course {
    id: number;
    department_id: number;
    code: string;
    name: string;
    credit_hours: number;
    created_at: string;
    department?: Department;
}

export interface Lecture {
    id: number;
    course_id: number;
    lecturer_id: number | null;
    topic: string;
    scheduled_at: string;
    venue: string;
    created_at: string;
    course?: Course;
    lecturer?: User;
}

export interface Exam {
    id: number;
    course_id: number;
    exam_type: string;
    starts_at: string;
    duration_minutes: number;
    venue: string;
    is_locked: boolean;
    created_at: string;
    course?: Course;
}

export interface Student {
    id: number;
    department_id: number | null;
    registration_number: string;
    name: string;
    email: string;
    program: string;
    year_of_study: number;
    is_active: boolean;
    created_at: string;
    department?: Department;
}

export interface PageProps {
    auth: {
        user: User;
        roles: string[];
        permissions: string[];
    };
    notifications: AppNotification[];
    unread_count: number;
    flash?: { success?: string; error?: string };
}

export interface AppNotification {
    id: string;
    type: string;
    data: Record<string, any>;
    read_at: string | null;
    created_at: string;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavItem {
    title: string;
    href: string;
    icon?: any;
    badge?: number;
}

export interface AuthLayoutProps {
    children: React.ReactNode;
    title?: string;
    description?: string;
}

export interface AppLayoutProps {
    children: React.ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

declare global {
    interface Window {
        Echo: any;
    }
}

export type ThreatEvent = {
    threat_id: number;
    user_name: string;
    alert_type: string;
    severity: string;
    timestamp: string;
};

export type AccountLockedPayload = {
    user_id: number;
    user_name: string;
    user_email: string;
    reason: string;
    locked_at: string;
};
