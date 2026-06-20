# Module Specification — 8 Core Modules

> **Current Status**: All 8 modules have full CRUD infrastructure (models, migrations, controllers, pages). This document details the business logic, Tanzanian regulatory compliance rules, and integration requirements needed to complete each module.

---

## Module 1: Academic & Curriculum Management

### Sub-Features

| #   | Feature                            | Current Status | Gap                                                           |
| --- | ---------------------------------- | -------------- | ------------------------------------------------------------- |
| 1.1 | Program CRUD (Certificate → PhD)   | ✅ Complete    | TCU/NACTVET credit hours field exists but no validation logic |
| 1.2 | Course CRUD                        | ✅ Complete    | Course codes, units, level fields exist                       |
| 1.3 | Course Offerings per Semester      | ✅ Complete    | Offering CRUD done                                            |
| 1.4 | Course Prerequisites               | ✅ Complete    | Table + Controller exist, validation logic WIP                |
| 1.5 | Self-Service Course Registration   | ✅ Partial     | Enrollments CRUD done; prerequisite validation missing        |
| 1.6 | Timetable Generation               | ✅ Complete    | WeeklyGrid component + Timetable CRUD done                    |
| 1.7 | Credit Hours Mapping (TCU/NACTVET) | ❌ Missing     | No mapping table or validation                                |

### Logic Requirements

**Prerequisite Validation** (for `EnrollmentController@store`):

```
Before enrolling student in Course B:
  1. Check student has passed (grade ≥ D) all courses listed in course_prerequisites for Course B
  2. Check student has not already taken Course B
  3. Check student is in correct year_of_study for this offering
  4. If any prerequisite failed → return validation error with specific prerequisite name
```

**Timetable Clash Detection** (for `TimetableController@store`):

```
Before creating timetable entry:
  1. Check lecturer has no other lecture at same day + time slot + room
  2. Check room is not double-booked at same day + time slot
  3. Check student group has no other lecture at same day + time slot
  4. If clash detected → return specific clash error (e.g., "Room 301 already booked by Dr. Mushi")
```

### Visualizations

- **Program Tree** — Hierarchical view of programs → courses → prerequisites
- **Weekly Timetable Grid** — Existing `WeeklyGrid` component showing time × day matrix
- **Credit Hours Distribution** — Donut chart by program/department

---

## Module 2: Exams & Grading Management

### Sub-Features

| #   | Feature                           | Current Status | Gap                                                     |
| --- | --------------------------------- | -------------- | ------------------------------------------------------- |
| 2.1 | Exam Scheduling                   | ✅ Complete    | CRUD done, seat allocation WIP                          |
| 2.2 | Continuous Assessment Entry       | ✅ Partial     | GradebookComponent created; lecturer portal missing     |
| 2.3 | Final Exam Entry                  | ✅ Complete    | FinalTermGrade CRUD done                                |
| 2.4 | GPA/CGPA Calculation              | ❌ Missing     | No calculation service                                  |
| 2.5 | Result Slip Generation            | ❌ Missing     | No PDF generation                                       |
| 2.6 | Transcript Generation             | ❌ Missing     | Transcript table exists, no generation logic            |
| 2.7 | QR-Code Verification              | ❌ Missing     | Needed for anti-fraud                                   |
| 2.8 | Class Performance Analytics       | ✅ Partial     | Grade index page exists; pass/fail/retake flags missing |
| 2.9 | Supp/Retake/Discontinuation Logic | ❌ Missing     | TCU threshold logic needed                              |

### Tanzanian Grading System

| Grade | Score Range | GPA Points | Status               |
| ----- | ----------- | ---------- | -------------------- |
| A     | 75-100      | 5.0        | Pass                 |
| B+    | 70-74       | 4.5        | Pass                 |
| B     | 65-69       | 4.0        | Pass                 |
| C     | 55-64       | 3.0        | Pass                 |
| D     | 40-54       | 2.0        | Pass (Conditional)   |
| E     | 35-39       | 1.0        | Fail (Supplementary) |
| F     | 0-34        | 0.0        | Fail (Retake)        |

**TCU GPA Thresholds:**

- Good Standing: GPA ≥ 2.0
- Probation: GPA 1.5 - 1.99
- Discontinuation: GPA < 1.5 (two consecutive semesters)

### Calculation Rules

```
CA (Continuous Assessment) = Out of 40%
  → Sum of all gradebook_components with type='ca' for this course
  → Max 40 points

FE (Final Exam) = Out of 60%
  → Score from final_term_grades
  → Max 60 points

Total Score = CA + FE (out of 100)

Grade Letter = lookup(Tanzanian scale)
GPA Points = lookup(grade → points)

Semester GPA (SGPA) = Σ(course_points × course_credits) / Σ(course_credits)
Cumulative GPA (CGPA) = Σ(all_semester_points) / Σ(all_semester_credits)
```

### Pass/Fail Logic

- **Pass**: Grade ≥ D (Total ≥ 40%)
- **Supplementary Exam**: Grade = E (Total 35-39%) → Can retake exam once
- **Retake (Carry)**: Grade = F (Total < 35%) → Must repeat entire course
- **Discontinuation**: CGPA < 1.5 for two consecutive semesters → Flag for academic board review

### Visualizations

- **Grade Distribution** — Bar chart per course showing A/B+/B/C/D/E/F counts
- **Pass/Fail Donut** — Existing donut chart component
- **Class Performance Table** — Color-coded: Green (Pass), Red (Fail), Orange (Supp)
- **Trend Line** — Semester GPA trend over time per student

---

## Module 3: Student Information System (SIS)

### Sub-Features

| #   | Feature                   | Current Status | Gap                                        |
| --- | ------------------------- | -------------- | ------------------------------------------ |
| 3.1 | Online Application Portal | ✅ Complete    | Prospects + Applications CRUD              |
| 3.2 | TCU Selection Sync        | ❌ Missing     | No TCU integration for selection status    |
| 3.3 | 360° Student Profile      | ✅ Complete    | Student show page with all relations       |
| 3.4 | Disciplinary Records      | ❌ Missing     | No discipline table or workflow            |
| 3.5 | Attendance Tracking       | ✅ Complete    | Attendance CRUD + analytics                |
| 3.6 | Graduation Clearance      | ❌ Missing     | Multi-department clearance workflow needed |

### Clearance Workflow

```
Student applies for graduation
  → Registrar checks academic completion
  → Library checks no overdue books/fines
  → Finance checks no outstanding fees
  → Sports/Department checks obligations
  → All departments mark clearance status (Approved/Rejected/Flagged)
  → When all approved → Generate graduation token with QR code
```

### Visualizations

- **Student Lifecycle Timeline** — Horizontal timeline: Applied → Admitted → Enrolled → Studying → Graduated
- **Enrollment Trend** — Line chart by semester/program
- **Demographics** — Pie charts: gender, region, program distribution

---

## Module 4: Financial & Fees Management

### Sub-Features

| #   | Feature                 | Current Status | Gap                                      |
| --- | ----------------------- | -------------- | ---------------------------------------- |
| 4.1 | Fee Structuring         | ✅ Complete    | Fees CRUD, accounts, invoices            |
| 4.2 | Payment Recording       | ✅ Complete    | Payments CRUD, fund sources              |
| 4.3 | GePG Integration        | ❌ Missing     | No API integration for control numbers   |
| 4.4 | HESLB Loan Integration  | ❌ Missing     | No loan matching/disbursement logic      |
| 4.5 | Exam Card Block/Unblock | ❌ Missing     | No fee-check before exam card generation |
| 4.6 | Financial Dashboards    | ✅ Partial     | Stats computed; real-time reports WIP    |

### GePG Integration Strategy

See dedicated implementation document: `IMPLEMENTATION_FINANCIAL_GEPG.md`

### Fee Block/Unblock Logic

```
Before generating exam card for Student X:
  1. Get student's total_fee for current semester/academic year
  2. Get student's total_paid amount
  3. Calculate payment_percentage = (total_paid / total_fee) × 100
  4. If payment_percentage >= 50% → Allow exam card generation (UNBLOCKED)
  5. If payment_percentage < 50% → Block exam card generation (BLOCKED)
  6. System automatically sends SMS/email reminder when approaching exam period
```

### Visualizations

- **Collection vs Target** — Bar chart comparing expected vs actual collections
- **Payment Trend** — Line chart daily/monthly payment volumes
- **Pending Balances** — Conditional formatting (red for > 90 days overdue)
- **HESLB Disbursement Breakdown** — Stacked bar: tuition vs meals vs accommodation

---

## Module 5: Human Resource & Lecturer Portal

### Sub-Features

| #   | Feature                     | Current Status | Gap                                 |
| --- | --------------------------- | -------------- | ----------------------------------- |
| 5.1 | Staff Profiles              | ✅ Complete    | FacultyStaff CRUD with rank history |
| 5.2 | Lecturer Portal Dashboard   | ✅ Complete    | FacultyDashboard component exists   |
| 5.3 | Lecture Notes Upload        | ❌ Missing     | No file upload in LMS module        |
| 5.4 | Payroll Processing          | ❌ Missing     | No payroll tables or logic          |
| 5.5 | Leave Management            | ❌ Missing     | No leave request/approval workflow  |
| 5.6 | Tax Compliance (PAYE/PSSSF) | ❌ Missing     | No deduction calculation            |

### Academic Ranks (Tanzania)

1. Tutorial Assistant
2. Assistant Lecturer
3. Lecturer
4. Senior Lecturer
5. Associate Professor
6. Professor

### Visualizations

- **Teaching Load** — Bar chart per lecturer (current vs max load)
- **Staff Demographics** — Rank distribution pie chart
- **Leave Calendar** — Team calendar showing approved/pending leave

---

## Module 6: Hostel & Accommodation Management

### Sub-Features

| #   | Feature              | Current Status | Gap                                          |
| --- | -------------------- | -------------- | -------------------------------------------- |
| 6.1 | Room Allocation      | ✅ Complete    | CRUD for dormitories, hostels, rooms         |
| 6.2 | Online Booking       | ❌ Missing     | No student-facing booking portal             |
| 6.3 | Allocation Algorithm | ❌ Missing     | No priority-based allocation logic           |
| 6.4 | Asset Tracking       | ✅ Partial     | RoomInventory exists; check-in/check-out WIP |

### Allocation Algorithm

```
Priority scoring for room allocation:
  1. Disability status → +10 points
  2. First-year student → +5 points
  3. Distance from campus (>100km) → +3 points
  4. Orphan status → +3 points
  5. GPA (high achievers) → +2 points

Algorithm:
  → Collect all applications for semester
  → Score each applicant
  → Sort by score descending
  → Assign best available room based on gender and preferences
  → Generate hostel fee control number
```

### Visualizations

- **Occupancy Map** — Visual grid of rooms (green = available, yellow = partial, red = full)
- **Allocation Rate** — Progress bars per hostel block
- **Asset Status** — Checked-in vs checked-out items per room

---

## Module 7: Digital Library / LMS

### Sub-Features

| #   | Feature                     | Current Status | Gap                                          |
| --- | --------------------------- | -------------- | -------------------------------------------- |
| 7.1 | Book Cataloging             | ✅ Complete    | LibraryBook CRUD with categories             |
| 7.2 | Barcode System              | ❌ Missing     | No barcode generation                        |
| 7.3 | Borrowing/Return Automation | ✅ Complete    | LibraryBorrowing CRUD                        |
| 7.4 | Fine Calculation            | ✅ Partial     | LibraryFine CRUD; auto-calculation missing   |
| 7.5 | E-Library Integration       | ❌ Missing     | No external database links                   |
| 7.6 | LMS Course Modules          | ✅ Partial     | LmsCourse + CourseModule created; upload WIP |

### Fine Calculation Logic

```
Fine Rate = TZS 500 per day overdue (configurable)
Overdue Days = Today - Due Date (excluding holidays/weekends)
Total Fine = Overdue Days × Fine Rate
Max Fine = Book Price × 2 (capped at replacement cost)
```

### Visualizations

- **Borrowing Trend** — Line chart: books borrowed per month
- **Category Distribution** — Pie chart of book categories
- **Top Borrowed Books** — Horizontal bar chart
- **Overdue List** — Table with color-coded severity (green < 7 days, yellow 7-30, red > 30)

---

## Module 8: System Administration, Security & Audit

### Sub-Features

| #   | Feature            | Current Status | Gap                                   |
| --- | ------------------ | -------------- | ------------------------------------- |
| 8.1 | RBAC               | ✅ Complete    | Spatie roles/permissions + UI         |
| 8.2 | User Management    | ✅ Complete    | Users CRUD + lock/unlock/force-logout |
| 8.3 | Audit Trails       | ✅ Complete    | Activity logs + threat alerts         |
| 8.4 | System Config      | ✅ Complete    | Key-value config management           |
| 8.5 | API Gateway        | ❌ Missing     | No external API layer                 |
| 8.6 | Security Dashboard | ✅ Complete    | Threat monitoring, risk scoring       |

### Audit Trail Immutability

```
All audit logs are INSERT-only with soft deletes.
No UPDATE operations allowed on log records.

Each audit entry captures:
  - Who performed the action (user_id)
  - What action (create/update/delete)
  - Which module (grades, fees, users, etc.)
  - Old values (JSON)
  - New values (JSON)
  - IP address + user agent
  - Timestamp (with microsecond precision)
  - Risk score contribution (if applicable)

Special case — Grade changes:
  "Lecturer X changed Student Y's Z grade from C (62%) to A (85%) on 2026-06-13 at 14:30:22"
  → Triggers HIGH severity alert automatically
  → Notifies HOD and Registrar via WebSocket
```

### Role Definitions

| Role            | Capabilities                                            |
| --------------- | ------------------------------------------------------- |
| **SuperAdmin**  | Full system access, audit viewing, system config        |
| **Registrar**   | Academic records, transcripts, graduation, enrollments  |
| **Bursar**      | Finance, fees, payments, receivables, GePG              |
| **HOD**         | Department courses, faculty assignments, exam approvals |
| **Lecturer**    | Grade entry, attendance, lecture notes, class lists     |
| **Student**     | Self-service: registration, results, fees, booking      |
| **Invigilator** | Exam attendance, seating plans, incident reports        |

### Visualizations

- **Security Events Timeline** — Existing `ThreatTimeline` component
- **Risk Score Gauge** — Existing `RiskScoreGauge` gauge chart
- **Login Activity Map** — Geographic login locations
- **Audit Trail Explorer** — Searchable, filterable, exportable log viewer
