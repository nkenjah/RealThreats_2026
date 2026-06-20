# Implementation Strategy — Exams & Grading Management

## Current State Assessment

The codebase has full CRUD infrastructure:

- `grades` table + `GradeController` + pages (index, create, edit, show)
- `gradebook_components` table + `GradebookComponentController` + pages
- `final_term_grades` table + `FinalTermGradeController` + pages
- `academic_transcripts` table + `AcademicTranscriptController` + pages
- `degree_audits` table + `DegreeAuditController` + pages
- `graduation_applications` table + `GraduationApplicationController` + pages

**Missing**: GPA/CGPA calculation service, Tanzanian grading scale mapping, supp/retake/discontinuation logic, PDF/QR generation, class performance analytics flags.

---

## Phase 1: Grading Service Layer

### 1.1 Create `app/Services/GradingService.php`

This is the core business logic class. All controllers will delegate to this service.

```php
class GradingService
{
    /**
     * Calculate total score from CA (40%) and FE (60%).
     * Determine grade letter from Tanzanian scale.
     * Handles supp/retake logic.
     */
    public function calculateGrade(
        float $caScore,    // Out of 40
        float $feScore,    // Out of 60
        ?float $suppScore  // Supplementary exam score (out of 60), if applicable
    ): GradeResult;

    /**
     * Calculate Semester GPA (SGPA) for a student in a given semester.
     * SGPA = Σ(course_grade_points × course_credits) / Σ(course_credits)
     */
    public function calculateSemesterGPA(Student $student, int $semesterId): float;

    /**
     * Calculate Cumulative GPA (CGPA) across all semesters.
     * CGPA = Σ(all_course_points × all_course_credits) / Σ(all_course_credits)
     */
    public function calculateCGPA(Student $student): float;

    /**
     * Determine academic status based on TCU thresholds.
     * Returns: 'good_standing' | 'probation' | 'discontinuation_risk'
     */
    public function determineAcademicStatus(float $cgpa): string;

    /**
     * Get supplementary/retake eligible courses for a student.
     */
    public function getRemedialCourses(Student $student, int $semesterId): Collection;
}
```

### 1.2 Create `app/ValueObjects/GradeResult.php`

```php
class GradeResult
{
    public function __construct(
        public readonly float  $totalScore,      // 0-100
        public readonly string $gradeLetter,     // A, B+, B, C, D, E, F
        public readonly float  $gpaPoints,       // 0.0 - 5.0
        public readonly string $status,          // pass, supp, retake
        public readonly ?float $suppScore = null, // For supp exams
    ) {}
}
```

### 1.3 Create Tanzanian Grade Scale Config

Add to `config/grading.php`:

```php
return [
    'scale' => [
        ['min' => 75, 'max' => 100, 'grade' => 'A',  'points' => 5.0, 'status' => 'pass'],
        ['min' => 70, 'max' => 74,  'grade' => 'B+', 'points' => 4.5, 'status' => 'pass'],
        ['min' => 65, 'max' => 69,  'grade' => 'B',  'points' => 4.0, 'status' => 'pass'],
        ['min' => 55, 'max' => 64,  'grade' => 'C',  'points' => 3.0, 'status' => 'pass'],
        ['min' => 40, 'max' => 54,  'grade' => 'D',  'points' => 2.0, 'status' => 'pass'],
        ['min' => 35, 'max' => 39,  'grade' => 'E',  'points' => 1.0, 'status' => 'supp'],
        ['min' => 0,  'max' => 34,  'grade' => 'F',  'points' => 0.0, 'status' => 'retake'],
    ],
    'thresholds' => [
        'good_standing' => 2.0,
        'probation'     => 1.5,
        'discontinuation_consecutive_semesters' => 2,
    ],
    'ca_weight' => 0.40,  // 40%
    'fe_weight' => 0.60,  // 60%
];
```

---

## Phase 2: Grade Entry Workflow

### 2.1 Lecturer Grade Entry Portal

Create `app/Http/Controllers/LecturerGradeController.php`:

```
GET  /lecturer/grades/{course_offering_id}
  → Shows class list with CA and FE entry fields
  → Each row: student name, reg#, CA input (0-40), FE input (0-60)
  → Auto-calculates total, grade, and status on input change

POST /lecturer/grades/{course_offering_id}/save
  → Validates all entries
  → Calculates grades via GradingService
  → Stores in grades table
  → Creates audit log entry
  → If grades changed (edit): triggers threat alert with HIGH severity
```

### 2.2 HOD Approval Workflow

```
Lecturer submits grades → Status = 'submitted'
HOD reviews → Can approve or reject
  → Approved → Status = 'approved' (locked, cannot edit)
  → Rejected → Status = 'draft' (returned to lecturer with comments)
Registrar can force-unlock approved grades if correction needed
```

Add `status` and `hod_approved_at` and `hod_approved_by` columns to `grades` and `final_term_grades` tables via new migration.

---

## Phase 3: Class Performance Analytics

### 3.1 Controller Enhancement

Add to `GradeController@index`:

```php
$stats = [
    'total_students' => $enrollmentCount,
    'passed' => Grade::where(...)->where('grade_letter', '>=', 'D')->count(),
    'failed' => Grade::where(...)->where('grade_letter', 'E')->orWhere('grade_letter', 'F')->count(),
    'supps' => Grade::where(...)->where('grade_letter', 'E')->count(),
    'retakes' => Grade::where(...)->where('grade_letter', 'F')->count(),
    'discontinuation_flagged' => Student::where('cgpa', '<', 1.5)->count(),
    'by_grade' => Grade::where(...)
        ->selectRaw('grade_letter, count(*) as count')
        ->groupBy('grade_letter')
        ->orderBy('grade_letter')
        ->get(),
    'average_gpa' => round(Enrollment::where(...)->avg('semester_gpa'), 2),
];
```

### 3.2 Visual Indicators

```tsx
// ClassPerformanceTable.tsx
const gradeColor = (grade: string) => {
    switch (grade) {
        case 'A':
        case 'B+':
        case 'B':
            return 'bg-green-100 text-green-800';
        case 'C':
        case 'D':
            return 'bg-yellow-100 text-yellow-800';
        case 'E':
            return 'bg-orange-100 text-orange-800'; // Supplementary
        case 'F':
            return 'bg-red-100 text-red-800'; // Retake
    }
};
```

---

## Phase 4: Transcript & Result Slip Generation

### 4.1 PDF Generation

Add `barryvdh/laravel-dompdf` or use Laravel's built-in Browsershot:

```bash
composer require barryvdh/laravel-dompdf
```

Create `app/Exports/TranscriptExport.php` and `app/Exports/ResultSlipExport.php`.

### 4.2 QR Code Verification

Add `simplesoftwareio/simple-qrcode` or use an API:

```php
// Generation
$qrData = json_encode([
    'student_reg' => $student->registration_number,
    'transcript_id' => $transcript->id,
    'generated_at' => now()->toISOString(),
    'hash' => hash_hmac('sha256', $student->registration_number, config('app.key')),
]);
$qrCode = QrCode::size(200)->generate($qrData);

// Verification endpoint
GET /api/verify/transcript/{id}?hash=...
  → Validates hash matches student record
  → Returns JSON with student name, program, graduation year, CGPA
```

### 4.3 Result Slip Frontend Component

Create `resources/js/components/gradebook/result-slip.tsx`:

- Printable layout with university letterhead
- Semester details: course codes, names, credits, grades, GPA
- Cumulative section: CGPA, classification, academic status
- Embedded QR code (rendered as SVG/PNG)
- Download PDF button

---

## Database Schema: Results & Grading

See dedicated schema document: `DATABASE_SCHEMA_RESULTS.md`

---

## Phase 5: Migration Plan

| Step | Description                            | Files to Create/Modify                             |
| ---- | -------------------------------------- | -------------------------------------------------- |
| 1    | Create grading config                  | `config/grading.php`                               |
| 2    | Create GradingService                  | `app/Services/GradingService.php`                  |
| 3    | Create GradeResult VO                  | `app/ValueObjects/GradeResult.php`                 |
| 4    | Add status columns to grades tables    | New migration                                      |
| 5    | Create GradeController enhancement     | Modify `app/Http/Controllers/GradeController.php`  |
| 6    | Create LecturerGradeController         | `app/Http/Controllers/LecturerGradeController.php` |
| 7    | Create grade entry portal pages        | `resources/js/pages/lecturer/grades/`              |
| 8    | Create ClassPerformanceTable component | New component                                      |
| 9    | Create ResultSlip component            | New component                                      |
| 10   | Add PDF/QR packages                    | Composer installs                                  |
| 11   | Create TranscriptExport                | `app/Exports/TranscriptExport.php`                 |
| 12   | Add verification endpoint              | `routes/api.php`                                   |
| 13   | Wire grade view toggle                 | Add dashboard/table toggle to grades index page    |
