export type { Passkey, TwoFactorSetupData, TwoFactorSecretKey } from './auth';
export type * from './navigation';
export type * from './ui';

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
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
    two_factor_enabled?: boolean;
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

export interface Attendance {
    id: number;
    student_id: number;
    lecture_id: number;
    status: string;
    lecture_date: string;
    notes: string | null;
    created_at: string;
    updated_at: string;
    student?: Student;
    lecture?: Lecture;
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
    [key: string]: unknown;
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

// ──────────────────────────────────────────────
// University ERP Entity Types
// ──────────────────────────────────────────────

export interface Prospect {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
    high_school: string | null;
    gpa: number | null;
    entry_term: string | null;
    status: string;
    notes: string | null;
    created_at: string;
    updated_at: string;
    applications?: Application[];
}

export interface ApplicationRequirement {
    id: number;
    application_id: number;
    name: string;
    is_met: boolean;
    notes: string | null;
    created_at: string;
    updated_at: string;
    application?: Application;
}

export interface Application {
    id: number;
    prospect_id: number;
    program_id: number;
    submission_date: string;
    status: string;
    assigned_reviewer_id: number | null;
    reviewed_at: string | null;
    review_notes: string | null;
    created_at: string;
    updated_at: string;
    prospect?: Prospect;
    program?: Program;
    assigned_reviewer?: User;
    application_requirements?: ApplicationRequirement[];
    admission_offer?: AdmissionOffer;
}

export interface AdmissionOffer {
    id: number;
    application_id: number;
    offer_date: string;
    decision_deadline: string;
    tuition_fee: number;
    status: string;
    responded_at: string | null;
    created_at: string;
    updated_at: string;
    application?: Application;
}

export interface Program {
    id: number;
    name: string;
    code: string;
    description: string | null;
    duration_years: number;
    total_credits: number;
    created_at: string;
    updated_at: string;
    program_requirements?: ProgramRequirement[];
    course_offerings?: CourseOffering[];
}

export interface ProgramRequirement {
    id: number;
    program_id: number;
    name: string;
    type: string;
    credits_required: number;
    created_at: string;
    updated_at: string;
    program?: Program;
}

export interface CourseOffering {
    id: number;
    course_id: number;
    program_id: number;
    academic_year: string;
    semester: string;
    section: string | null;
    max_students: number;
    created_at: string;
    updated_at: string;
    course?: Course;
    program?: Program;
    enrollments?: Enrollment[];
    timetables?: Timetable[];
    gradebook_components?: GradebookComponent[];
}

export interface CoursePrerequisite {
    id: number;
    course_id: number;
    prerequisite_course_id: number;
    created_at: string;
    updated_at: string;
    course?: Course;
    prerequisite_course?: Course;
}

export interface Enrollment {
    id: number;
    student_id: number;
    course_offering_id: number;
    enrollment_date: string;
    status: string;
    grade: string | null;
    created_at: string;
    updated_at: string;
    student?: Student;
    course_offering?: CourseOffering;
    final_term_grade?: FinalTermGrade;
}

export interface FacultyStaff {
    id: number;
    user_id: number;
    staff_number: string;
    job_title: string;
    department_id: number;
    contract_type: string;
    employment_date: string;
    created_at: string;
    updated_at: string;
    user?: User;
    department?: Department;
    academic_rank_histories?: AcademicRankHistory[];
    faculty_department_assignments?: FacultyDepartmentAssignment[];
}

export interface AcademicRankHistory {
    id: number;
    faculty_staff_id: number;
    rank: string;
    effective_date: string;
    created_at: string;
    updated_at: string;
    faculty_staff?: FacultyStaff;
}

export interface FacultyDepartmentAssignment {
    id: number;
    faculty_staff_id: number;
    department_id: number;
    is_primary: boolean;
    assigned_at: string;
    created_at: string;
    updated_at: string;
    faculty_staff?: FacultyStaff;
    department?: Department;
}

export interface Timetable {
    id: number;
    course_offering_id: number;
    day_of_week: string;
    start_time: string;
    end_time: string;
    venue: string;
    semester: string;
    lecturer_id: number | null;
    created_at: string;
    updated_at: string;
    course_offering?: CourseOffering;
    lecturer?: FacultyStaff;
}

export interface Grade {
    id: number;
    student_id: number;
    course_offering_id: number;
    grade: string;
    grade_points: number;
    academic_year: string;
    semester: string;
    created_at: string;
    updated_at: string;
    student?: Student;
    course_offering?: CourseOffering;
}

export interface GradebookComponent {
    id: number;
    course_offering_id: number;
    name: string;
    type: string;
    max_score: number;
    weight: number;
    created_at: string;
    updated_at: string;
    course_offering?: CourseOffering;
    student_assessment_grades?: StudentAssessmentGrade[];
}

export interface StudentAssessmentGrade {
    id: number;
    student_id: number;
    lms_course_id: number;
    gradebook_component_id: number;
    score: number;
    created_at: string;
    updated_at: string;
    student?: Student;
    lms_course?: LmsCourse;
    gradebook_component?: GradebookComponent;
}

export interface FinalTermGrade {
    id: number;
    enrollment_id: number;
    course_offering_id: number;
    total_score: number;
    letter_grade: string;
    gpa_points: number;
    created_at: string;
    updated_at: string;
    enrollment?: Enrollment;
    course_offering?: CourseOffering;
}

export interface AcademicTranscript {
    id: number;
    student_id: number;
    program_id: number;
    total_credits_earned: number;
    cumulative_gpa: number;
    generated_at: string;
    created_at: string;
    updated_at: string;
    student?: Student;
    program?: Program;
}

export interface DegreeAudit {
    id: number;
    student_id: number;
    program_id: number;
    total_credits_required: number;
    total_credits_earned: number;
    status: string;
    generated_at: string;
    created_at: string;
    updated_at: string;
    student?: Student;
    program?: Program;
}

export interface GraduationApplication {
    id: number;
    student_id: number;
    application_date: string;
    status: string;
    approved_at: string | null;
    created_at: string;
    updated_at: string;
    student?: Student;
}

export interface StudentRegistration {
    id: number;
    student_id: number;
    academic_year: string;
    semester: string;
    registration_date: string;
    status: string;
    created_at: string;
    updated_at: string;
    student?: Student;
}

export interface StudentStatusLog {
    id: number;
    student_id: number;
    previous_status: string;
    new_status: string;
    reason: string | null;
    changed_by: number | null;
    created_at: string;
    updated_at: string;
    student?: Student;
}

export interface Waitlist {
    id: number;
    course_offering_id: number;
    student_id: number;
    position: number;
    status: string;
    created_at: string;
    updated_at: string;
    course_offering?: CourseOffering;
    student?: Student;
}

export interface Fee {
    id: number;
    student_id: number;
    fee_type: string;
    amount: number;
    due_date: string;
    status: string;
    paid_at: string | null;
    created_at: string;
    updated_at: string;
    student?: Student;
}

export interface FinancialAccount {
    id: number;
    student_id: number;
    account_number: string;
    current_balance: number;
    status: string;
    created_at: string;
    updated_at: string;
    student?: Student;
    payments?: Payment[];
    tuition_invoices?: TuitionInvoice[];
}

export interface Payment {
    id: number;
    financial_account_id: number;
    amount: number;
    payment_method: string;
    payment_date: string;
    reference_number: string | null;
    status: string;
    notes: string | null;
    created_at: string;
    updated_at: string;
    financial_account?: FinancialAccount;
}

export interface TuitionInvoice {
    id: number;
    financial_account_id: number;
    invoice_number: string;
    total_amount: number;
    due_date: string;
    status: string;
    created_at: string;
    updated_at: string;
    financial_account?: FinancialAccount;
    invoice_line_items?: InvoiceLineItem[];
}

export interface InvoiceLineItem {
    id: number;
    tuition_invoice_id: number;
    description: string;
    amount: number;
    created_at: string;
    updated_at: string;
    tuition_invoice?: TuitionInvoice;
}

export interface FundSource {
    id: number;
    name: string;
    description: string | null;
    total_fund: number;
    remaining_balance: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    scholarship_awards?: ScholarshipAward[];
}

export interface ScholarshipAward {
    id: number;
    student_id: number;
    fund_source_id: number;
    award_amount: number;
    award_date: string;
    status: string;
    created_at: string;
    updated_at: string;
    student?: Student;
    fund_source?: FundSource;
    disbursements?: Disbursement[];
}

export interface Disbursement {
    id: number;
    scholarship_award_id: number;
    amount: number;
    disbursement_date: string;
    notes: string | null;
    created_at: string;
    updated_at: string;
    scholarship_award?: ScholarshipAward;
}

export interface LibraryBook {
    id: number;
    isbn: string;
    title: string;
    author: string;
    publisher: string | null;
    category: string;
    total_copies: number;
    available_copies: number;
    shelf_location: string | null;
    created_at: string;
    updated_at: string;
    library_borrowings?: LibraryBorrowing[];
}

export interface LibraryBorrowing {
    id: number;
    library_book_id: number;
    student_id: number;
    borrowed_at: string;
    due_at: string;
    returned_at: string | null;
    status: string;
    created_at: string;
    updated_at: string;
    library_book?: LibraryBook;
    student?: Student;
    library_fine?: LibraryFine;
}

export interface LibraryFine {
    id: number;
    library_borrowing_id: number;
    amount: number;
    paid: boolean;
    paid_at: string | null;
    created_at: string;
    updated_at: string;
    library_borrowing?: LibraryBorrowing;
}

export interface LmsCourse {
    id: number;
    course_offering_id: number;
    title: string;
    description: string | null;
    status: string;
    created_at: string;
    updated_at: string;
    course_offering?: CourseOffering;
    course_modules?: CourseModule[];
    digital_submissions?: DigitalSubmission[];
    student_assessment_grades?: StudentAssessmentGrade[];
}

export interface CourseModule {
    id: number;
    lms_course_id: number;
    title: string;
    description: string | null;
    order_index: number;
    created_at: string;
    updated_at: string;
    lms_course?: LmsCourse;
}

export interface DigitalSubmission {
    id: number;
    lms_course_id: number;
    student_id: number;
    file_url: string;
    submitted_at: string;
    grade: string | null;
    feedback: string | null;
    created_at: string;
    updated_at: string;
    lms_course?: LmsCourse;
    student?: Student;
}

export interface AlumniProfile {
    id: number;
    student_id: number;
    graduation_year: number;
    current_company: string | null;
    job_title: string | null;
    industry: string | null;
    phone: string | null;
    address: string | null;
    linkedin_url: string | null;
    created_at: string;
    updated_at: string;
    student?: Student;
    career_placements?: CareerPlacement[];
    donations?: Donation[];
}

export interface CareerPlacement {
    id: number;
    alumni_profile_id: number;
    company_name: string;
    position: string;
    start_date: string;
    end_date: string | null;
    is_current: boolean;
    created_at: string;
    updated_at: string;
    alumni_profile?: AlumniProfile;
}

export interface Donation {
    id: number;
    alumni_profile_id: number;
    amount: number;
    donation_date: string;
    purpose: string | null;
    created_at: string;
    updated_at: string;
    alumni_profile?: AlumniProfile;
}

export interface Dormitory {
    id: number;
    name: string;
    code: string;
    capacity: number;
    gender: string;
    description: string | null;
    created_at: string;
    updated_at: string;
    hostels?: Hostel[];
}

export interface Hostel {
    id: number;
    name: string;
    dormitory_id: number;
    capacity: number;
    created_at: string;
    updated_at: string;
    dormitory?: Dormitory;
    hostel_allocations?: HostelAllocation[];
}

export interface HostelAllocation {
    id: number;
    hostel_id: number;
    student_id: number;
    room_number: string;
    allocated_at: string;
    vacated_at: string | null;
    status: string;
    created_at: string;
    updated_at: string;
    hostel?: Hostel;
    student?: Student;
}

export interface Campus {
    id: number;
    name: string;
    code: string;
    address: string | null;
    city: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    buildings?: Building[];
}

export interface Building {
    id: number;
    campus_id: number;
    name: string;
    code: string;
    floors: number;
    created_at: string;
    updated_at: string;
    campus?: Campus;
    rooms?: Room[];
}

export interface Room {
    id: number;
    building_id: number;
    room_number: string;
    room_type: string;
    capacity: number;
    is_lab: boolean;
    created_at: string;
    updated_at: string;
    building?: Building;
    room_inventory?: RoomInventory[];
}

export interface RoomInventory {
    id: number;
    room_id: number;
    item_name: string;
    quantity: number;
    condition: string;
    created_at: string;
    updated_at: string;
    room?: Room;
}

export interface SessionLog {
    id: number;
    user_id: number;
    ip_address: string;
    user_agent: string;
    login_at: string;
    logout_at: string | null;
    duration_minutes: number | null;
    created_at: string;
    updated_at: string;
    user?: User;
}
