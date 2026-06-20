<?php

namespace App\Services;

use App\Models\Course;
use App\Models\Grade;
use App\Models\Student;
use App\ValueObjects\GradeResult;
use Illuminate\Support\Collection;

class GradingService
{
    private array $scale;

    private array $thresholds;

    private float $caWeight;

    private float $feWeight;

    public function __construct()
    {
        $config = config('grading');
        $this->scale = $config['scale'];
        $this->thresholds = $config['thresholds'];
        $this->caWeight = $config['ca_weight'];
        $this->feWeight = $config['fe_weight'];
    }

    /**
     * Calculate grade from CA and FE scores.
     *
     * @param  float  $caScore  Continuous Assessment (0-40)
     * @param  float  $feScore  Final Exam (0-60)
     * @param  float|null  $suppScore  Supplementary exam score (0-60)
     */
    public function calculateGrade(float $caScore, float $feScore, ?float $suppScore = null): GradeResult
    {
        $effectiveScore = $suppScore !== null
            ? $caScore + $suppScore
            : $caScore + $feScore;

        $totalScore = round(min(max($effectiveScore, 0), 100), 2);

        foreach ($this->scale as $band) {
            if ($totalScore >= $band['min'] && $totalScore <= $band['max']) {
                return new GradeResult(
                    totalScore: $totalScore,
                    gradeLetter: $band['grade'],
                    gpaPoints: $band['points'],
                    status: $band['status'],
                    suppScore: $suppScore,
                );
            }
        }

        return new GradeResult(
            totalScore: $totalScore,
            gradeLetter: 'F',
            gpaPoints: 0.0,
            status: 'retake',
            suppScore: $suppScore,
        );
    }

    /**
     * Calculate Semester GPA (SGPA).
     * SGPA = Σ(course_grade_points × course_credits) / Σ(course_credits)
     */
    public function calculateSemesterGPA(Student $student, string $academicYear, string $semester): float
    {
        $grades = Grade::with('courseOffering.course')
            ->where('student_id', $student->id)
            ->where('academic_year', $academicYear)
            ->where('semester', $semester)
            ->get();

        if ($grades->isEmpty()) {
            return 0.0;
        }

        $totalWeightedPoints = 0.0;
        $totalCredits = 0;

        foreach ($grades as $grade) {
            $credits = $grade->courseOffering->course->credit_hours ?? 3;
            $totalWeightedPoints += ($grade->grade_points ?? 0) * $credits;
            $totalCredits += $credits;
        }

        return $totalCredits > 0
            ? round($totalWeightedPoints / $totalCredits, 2)
            : 0.0;
    }

    /**
     * Calculate Cumulative GPA (CGPA) across all semesters.
     */
    public function calculateCGPA(Student $student): float
    {
        $grades = Grade::with('courseOffering.course')
            ->where('student_id', $student->id)
            ->get();

        if ($grades->isEmpty()) {
            return 0.0;
        }

        $totalWeightedPoints = 0.0;
        $totalCredits = 0;

        foreach ($grades as $grade) {
            $credits = $grade->courseOffering->course->credit_hours ?? 3;
            $totalWeightedPoints += ($grade->grade_points ?? 0) * $credits;
            $totalCredits += $credits;
        }

        return $totalCredits > 0
            ? round($totalWeightedPoints / $totalCredits, 2)
            : 0.0;
    }

    /**
     * Determine academic status based on TCU GPA thresholds.
     */
    public function determineAcademicStatus(float $cgpa): string
    {
        if ($cgpa >= $this->thresholds['good_standing']) {
            return 'good_standing';
        }
        if ($cgpa >= $this->thresholds['probation']) {
            return 'probation';
        }

        return 'discontinuation_risk';
    }

    /**
     * Get remedial courses (supp/retake) for a student in a semester.
     */
    public function getRemedialCourses(Student $student, string $academicYear, string $semester): Collection
    {
        return Grade::with('courseOffering.course')
            ->where('student_id', $student->id)
            ->where('academic_year', $academicYear)
            ->where('semester', $semester)
            ->whereIn('grade', ['E', 'F'])
            ->get();
    }

    /**
     * Get degree classification label based on CGPA.
     */
    public function getClassification(float $cgpa): string
    {
        $classifications = config('grading.classifications', []);
        foreach ($classifications as $band) {
            if ($cgpa >= $band['min'] && $cgpa <= $band['max']) {
                return $band['label'];
            }
        }

        return 'Unclassified';
    }

    /**
     * Validate prerequisite chain for a course.
     * Returns array of failed prerequisite course codes.
     */
    public function validatePrerequisites(Student $student, Course $course): array
    {
        $prerequisites = $course->prerequisites()->with('prerequisiteCourse')->get();
        $failed = [];

        foreach ($prerequisites as $prereq) {
            $prereqCourse = $prereq->prerequisiteCourse;
            $grade = Grade::where('student_id', $student->id)
                ->whereHas('courseOffering', fn ($q) => $q->where('course_id', $prereqCourse->id))
                ->latest()
                ->first();

            if (! $grade || in_array($grade->grade, ['E', 'F', null], true)) {
                $failed[] = $prereqCourse->code;
            }
        }

        return $failed;
    }
}
