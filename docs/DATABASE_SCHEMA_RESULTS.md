# Database Schema — Student Results, Classes & Pass/Fail Marks

## Core Tables Relationship Diagram

```
students ──┐
            ├── enrollments ──┬── course_offerings ──── courses
            │                 │
            │                 ├── grades
            │                 │     ├── gradebook_components (CA)
            │                 │     └── final_term_grades (FE)
            │                 │
            │                 └── academic_transcripts
            │
            ├── student_registrations
            ├── student_status_logs
            ├── degree_audits
            └── graduation_applications
```

---

## Table: `grades`

**Purpose**: Stores final computed grades for each student-course-enrollment combination.

| Column               | Type                   | Constraints                                            | Description                        |
| -------------------- | ---------------------- | ------------------------------------------------------ | ---------------------------------- |
| `id`                 | bigint, auto-increment | PK                                                     |                                    |
| `enrollment_id`      | bigint                 | FK → enrollments.id, NOT NULL                          | Links to specific enrollment       |
| `student_id`         | bigint                 | FK → students.id, NOT NULL                             | Denormalized for query performance |
| `course_offering_id` | bigint                 | FK → course_offerings.id, NOT NULL                     | Denormalized                       |
| `ca_score`           | decimal(5,2)           | DEFAULT 0.00, CHECK (ca_score BETWEEN 0 AND 40)        | Continuous Assessment (out of 40)  |
| `fe_score`           | decimal(5,2)           | DEFAULT 0.00, CHECK (fe_score BETWEEN 0 AND 60)        | Final Exam (out of 60)             |
| `supp_score`         | decimal(5,2)           | NULL, CHECK (supp_score BETWEEN 0 AND 60)              | Supplementary exam score           |
| `total_score`        | decimal(5,2)           | GENERATED ALWAYS AS (ca_score + fe_score)              | Computed column                    |
| `grade_letter`       | varchar(2)             | CHECK (grade_letter IN ('A','B+','B','C','D','E','F')) | Tanzanian grade                    |
| `gpa_points`         | decimal(3,1)           | CHECK (gpa_points IN (5.0,4.5,4.0,3.0,2.0,1.0,0.0))    | GPA points for grade               |
| `status`             | enum                   | 'pass', 'supp', 'retake', 'incomplete'                 | Academic status                    |
| `is_approved`        | boolean                | DEFAULT false                                          | HOD/Registrar approval flag        |
| `approved_by`        | bigint                 | NULL, FK → users.id                                    | Who approved                       |
| `approved_at`        | timestamp              | NULL                                                   | When approved                      |
| `submitted_at`       | timestamp              | NULL                                                   | When lecturer submitted            |
| `notes`              | text                   | NULL                                                   | Lecturer remarks                   |
| `semester`           | varchar(20)            | NOT NULL                                               | e.g., "2025/2026-Sem1"             |
| `created_at`         | timestamp              |                                                        |                                    |
| `updated_at`         | timestamp              |                                                        |                                    |

**Indexes:**

- `idx_grades_student_semester` ON (`student_id`, `semester`)
- `idx_grades_course_offering` ON (`course_offering_id`)
- `idx_grades_status` ON (`status`)
- `idx_grades_grade_letter` ON (`grade_letter`)

**Audit Trigger**: All UPDATE operations on `grades` are logged to `activity_log` with old/new values and automatic HIGH severity alert.

---

## Table: `gradebook_components`

**Purpose**: Stores individual CA components (assignments, quizzes, midterms, practicals) that sum up to the CA score.

| Column               | Type                   | Constraints                                                      | Description                                   |
| -------------------- | ---------------------- | ---------------------------------------------------------------- | --------------------------------------------- |
| `id`                 | bigint, auto-increment | PK                                                               |                                               |
| `course_offering_id` | bigint                 | FK → course_offerings.id, NOT NULL                               |                                               |
| `name`               | varchar(255)           | NOT NULL                                                         | e.g., "Assignment 1", "Midterm Exam"          |
| `type`               | enum                   | 'assignment', 'quiz', 'midterm', 'practical', 'project', 'other' | Component type                                |
| `max_score`          | decimal(5,2)           | NOT NULL                                                         | Maximum possible score for this component     |
| `weight`             | decimal(5,2)           | NOT NULL                                                         | Weight within CA (all CA weights sum to 100%) |
| `due_date`           | date                   | NULL                                                             | Submission deadline                           |
| `created_at`         | timestamp              |                                                                  |                                               |
| `updated_at`         | timestamp              |                                                                  |                                               |

**Validation**: Sum of all gradebook_component `weight` for a given course_offering_id must equal 100.

---

## Table: `student_assessment_grades`

**Purpose**: Individual student scores per gradebook component. Only for CA tracking; the `grades.ca_score` is the aggregate.

| Column                   | Type                   | Constraints                            | Description             |
| ------------------------ | ---------------------- | -------------------------------------- | ----------------------- |
| `id`                     | bigint, auto-increment | PK                                     |                         |
| `student_id`             | bigint                 | FK → students.id, NOT NULL             |                         |
| `gradebook_component_id` | bigint                 | FK → gradebook_components.id, NOT NULL |                         |
| `score`                  | decimal(5,2)           | CHECK (score >= 0)                     | Score achieved          |
| `submitted_at`           | timestamp              | NULL                                   | When lecturer submitted |
| `created_at`             | timestamp              |                                        |                         |
| `updated_at`             | timestamp              |                                        |                         |

**Unique**: UNIQUE(`student_id`, `gradebook_component_id`)

**Auto-calculation** (when all components for a course are graded):

```
ca_score = Σ(student_assessment_grade.score × component.weight / component.max_score)
         / Σ(component.weight) × 40
```

---

## Table: `final_term_grades`

**Purpose**: Stores the final exam score for each student-course offering.

| Column               | Type                   | Constraints                        | Description                |
| -------------------- | ---------------------- | ---------------------------------- | -------------------------- |
| `id`                 | bigint, auto-increment | PK                                 |                            |
| `student_id`         | bigint                 | FK → students.id, NOT NULL         |                            |
| `course_offering_id` | bigint                 | FK → course_offerings.id, NOT NULL |                            |
| `exam_id`            | bigint                 | FK → exams.id, NOT NULL            | Links to the exam          |
| `score`              | decimal(5,2)           | CHECK (score BETWEEN 0 AND 60)     | Final exam score out of 60 |
| `graded_by`          | bigint                 | FK → users.id, NOT NULL            | Lecturer who graded        |
| `graded_at`          | timestamp              |                                    |                            |
| `created_at`         | timestamp              |                                    |                            |
| `updated_at`         | timestamp              |                                    |                            |

**Unique**: UNIQUE(`student_id`, `course_offering_id`, `exam_id`)

---

## Table: `enrollments`

**Purpose**: Links students to course offerings for a given semester.

| Column               | Type                   | Constraints                                      | Description            |
| -------------------- | ---------------------- | ------------------------------------------------ | ---------------------- |
| `id`                 | bigint, auto-increment | PK                                               |                        |
| `student_id`         | bigint                 | FK → students.id, NOT NULL                       |                        |
| `course_offering_id` | bigint                 | FK → course_offerings.id, NOT NULL               |                        |
| `semester`           | varchar(20)            | NOT NULL                                         | e.g., "2025/2026-Sem1" |
| `semester_gpa`       | decimal(3,1)           | NULL, CHECK (semester_gpa BETWEEN 0 AND 5)       | Computed after grading |
| `status`             | enum                   | 'enrolled', 'completed', 'dropped', 'incomplete' | DEFAULT 'enrolled'     |
| `enrolled_at`        | timestamp              |                                                  |                        |
| `completed_at`       | timestamp              | NULL                                             |                        |
| `created_at`         | timestamp              |                                                  |                        |
| `updated_at`         | timestamp              |                                                  |                        |

**Unique**: UNIQUE(`student_id`, `course_offering_id`, `semester`)

---

## Table: `academic_transcripts`

**Purpose**: Stores computed semester and cumulative GPA records.

| Column                     | Type                   | Constraints                                                          | Description                       |
| -------------------------- | ---------------------- | -------------------------------------------------------------------- | --------------------------------- |
| `id`                       | bigint, auto-increment | PK                                                                   |                                   |
| `student_id`               | bigint                 | FK → students.id, NOT NULL                                           |                                   |
| `semester`                 | varchar(20)            | NOT NULL                                                             |                                   |
| `academic_year`            | varchar(9)             | NOT NULL                                                             | e.g., "2025/2026"                 |
| `total_credits`            | int                    | DEFAULT 0                                                            | Total credits attempted           |
| `passed_credits`           | int                    | DEFAULT 0                                                            | Credits passed                    |
| `semester_gpa`             | decimal(3,1)           | CHECK (semester_gpa BETWEEN 0 AND 5)                                 |                                   |
| `cumulative_gpa`           | decimal(3,1)           | CHECK (cumulative_gpa BETWEEN 0 AND 5)                               |                                   |
| `total_points`             | decimal(10,1)          | DEFAULT 0                                                            | Σ(grade_points × credits)         |
| `total_credits_cumulative` | int                    | DEFAULT 0                                                            | Cumulative credits attempted      |
| `classification`           | varchar(50)            | NULL                                                                 | First Class, Upper Second, etc.   |
| `academic_status`          | enum                   | 'good_standing', 'probation', 'discontinuation_risk', 'discontinued' |                                   |
| `generated_at`             | timestamp              |                                                                      | When transcript was last computed |
| `created_at`               | timestamp              |                                                                      |                                   |
| `updated_at`               | timestamp              |                                                                      |                                   |

**Unique**: UNIQUE(`student_id`, `semester`)

---

## Table: `course_offerings`

**Purpose**: Course instances offered in a specific semester.

| Column          | Type                   | Constraints                        | Description      |
| --------------- | ---------------------- | ---------------------------------- | ---------------- |
| `id`            | bigint, auto-increment | PK                                 |                  |
| `course_id`     | bigint                 | FK → courses.id, NOT NULL          |                  |
| `program_id`    | bigint                 | FK → programs.id, NULL             |                  |
| `semester`      | varchar(20)            | NOT NULL                           |                  |
| `academic_year` | varchar(9)             | NOT NULL                           |                  |
| `lecturer_id`   | bigint                 | FK → faculty_staff.id, NULL        | Primary lecturer |
| `capacity`      | int                    | DEFAULT 0                          | Max students     |
| `room_id`       | bigint                 | FK → rooms.id, NULL                | Default room     |
| `status`        | enum                   | 'active', 'completed', 'cancelled' | DEFAULT 'active' |
| `created_at`    | timestamp              |                                    |                  |
| `updated_at`    | timestamp              |                                    |                  |

---

## Table: `courses`

**Purpose**: Master course catalog.

| Column          | Type                   | Constraints                                   | Description               |
| --------------- | ---------------------- | --------------------------------------------- | ------------------------- |
| `id`            | bigint, auto-increment | PK                                            |                           |
| `code`          | varchar(20)            | UNIQUE, NOT NULL                              | e.g., "CS101", "MATH201"  |
| `name`          | varchar(255)           | NOT NULL                                      |                           |
| `credits`       | int                    | DEFAULT 3                                     | TCU/NACTVET credit hours  |
| `level`         | int                    | NOT NULL                                      | Year level: 1, 2, 3, 4, 5 |
| `department_id` | bigint                 | FK → departments.id, NULL                     |                           |
| `category`      | enum                   | 'core', 'elective', 'prerequisite', 'general' | DEFAULT 'core'            |
| `description`   | text                   | NULL                                          |                           |
| `created_at`    | timestamp              |                                               |                           |
| `updated_at`    | timestamp              |                                               |                           |

---

## Table: `programs`

**Purpose**: Academic programs offered by the institution.

| Column           | Type                   | Constraints                                                 | Description                                     |
| ---------------- | ---------------------- | ----------------------------------------------------------- | ----------------------------------------------- |
| `id`             | bigint, auto-increment | PK                                                          |                                                 |
| `name`           | varchar(255)           | NOT NULL                                                    | e.g., "Bachelor of Science in Computer Science" |
| `code`           | varchar(20)            | UNIQUE, NOT NULL                                            | e.g., "BSC-CS"                                  |
| `level`          | enum                   | 'certificate', 'diploma', 'bachelor', 'postgraduate', 'phd' |                                                 |
| `duration_years` | int                    | NOT NULL                                                    |                                                 |
| `total_credits`  | int                    | NOT NULL                                                    | TCU/NACTVET approved credits                    |
| `department_id`  | bigint                 | FK → departments.id, NULL                                   |                                                 |
| `created_at`     | timestamp              |                                                             |                                                 |
| `updated_at`     | timestamp              |                                                             |                                                 |

---

## Pass/Fail Query Examples

### Example 1: Class Performance Summary

```sql
SELECT
    c.code AS course_code,
    c.name AS course_name,
    COUNT(g.id) AS total_students,
    SUM(CASE WHEN g.grade_letter IN ('A','B+','B','C','D') THEN 1 ELSE 0 END) AS passed,
    SUM(CASE WHEN g.grade_letter = 'E' THEN 1 ELSE 0 END) AS supps,
    SUM(CASE WHEN g.grade_letter = 'F' THEN 1 ELSE 0 END) AS retakes,
    ROUND(AVG(g.total_score), 2) AS average_score,
    ROUND(AVG(g.gpa_points), 2) AS average_gpa
FROM grades g
JOIN course_offerings co ON g.course_offering_id = co.id
JOIN courses c ON co.course_id = c.id
WHERE co.semester = '2025/2026-Sem1'
GROUP BY c.id, c.code, c.name
ORDER BY c.code;
```

### Example 2: Students Eligible for Discontinuation

```sql
SELECT
    s.id,
    s.name,
    s.registration_number,
    t.cumulative_gpa,
    COUNT(CASE WHEN t.academic_status = 'probation' THEN 1 END) AS probation_semesters
FROM students s
JOIN academic_transcripts t ON s.id = t.student_id
WHERE t.cumulative_gpa < 1.5
GROUP BY s.id, s.name, s.registration_number, t.cumulative_gpa
HAVING probation_semesters >= 2;
```

### Example 3: Exam Card Block List

```sql
SELECT
    s.id,
    s.name,
    s.registration_number,
    COALESCE(SUM(ti.amount), 0) AS total_fee,
    COALESCE(SUM(p.amount), 0) AS total_paid,
    CASE
        WHEN COALESCE(SUM(ti.amount), 0) = 0 THEN 100
        ELSE ROUND((COALESCE(SUM(p.amount), 0) / NULLIF(SUM(ti.amount), 0)) * 100, 2)
    END AS payment_percentage,
    CASE
        WHEN COALESCE(SUM(ti.amount), 0) = 0 THEN 'UNBLOCKED'
        WHEN ROUND((COALESCE(SUM(p.amount), 0) / NULLIF(SUM(ti.amount), 0)) * 100, 2) >= 50
            THEN 'UNBLOCKED'
        ELSE 'BLOCKED'
    END AS exam_card_status
FROM students s
LEFT JOIN tuition_invoices ti ON s.id = ti.student_id AND ti.academic_year = '2025/2026'
LEFT JOIN payments p ON s.id = p.student_id AND p.academic_year = '2025/2026'
GROUP BY s.id, s.name, s.registration_number
ORDER BY payment_percentage ASC;
```

### Example 4: Student Result Slip

```sql
SELECT
    c.code,
    c.name,
    c.credits,
    g.ca_score,
    g.fe_score,
    g.total_score,
    g.grade_letter,
    g.gpa_points,
    g.status,
    CASE
        WHEN g.grade_letter IN ('A','B+','B','C','D') THEN 'PASS'
        WHEN g.grade_letter = 'E' THEN 'SUPPLEMENTARY'
        WHEN g.grade_letter = 'F' THEN 'RETAKE'
    END AS result_status
FROM grades g
JOIN course_offerings co ON g.course_offering_id = co.id
JOIN courses c ON co.course_id = c.id
WHERE g.student_id = ? AND g.semester = ?
ORDER BY c.code;
```
