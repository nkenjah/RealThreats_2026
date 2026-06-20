<?php

namespace App\Services;

use App\Models\Enrollment;
use App\Models\Student;
use Illuminate\Support\Collection;

class PredictiveAnalyticsService
{
    public function atRiskStudents(int $limit = 10): Collection
    {
        $students = Student::with(['enrollments', 'grades' => fn ($q) => $q->where('status', 'approved')])
            ->where('status', 'active')
            ->get();

        return $students->map(function ($student) {
            $score = 0;
            $factors = [];

            $recentGrades = $student->grades()->where('status', 'approved')
                ->where('academic_year', now()->year)
                ->get();

            $avgGpa = $recentGrades->avg('grade_points');
            if ($avgGpa !== null && $avgGpa < 2.0) {
                $score += 30;
                $factors[] = 'Low GPA: '.number_format($avgGpa, 2);
            }

            $attendanceRate = $this->calculateAttendanceRate($student);
            if ($attendanceRate !== null && $attendanceRate < 60) {
                $score += 25;
                $factors[] = 'Low attendance: '.$attendanceRate.'%';
            }

            $feeBalance = $this->calculateFeeBalance($student);
            if ($feeBalance > 0) {
                $feeWeight = min(20, ($feeBalance / 1_000_000) * 10);
                $score += $feeWeight;
                $factors[] = 'Fee balance: TZS '.number_format($feeBalance);
            }

            $gradeDecline = $this->detectGradeDecline($student);
            if ($gradeDecline !== null) {
                $score += 15;
                $factors[] = 'Grade decline: -'.number_format($gradeDecline, 2).' GPA';
            }

            $incompleteCount = $student->grades()
                ->where('status', 'draft')
                ->where('academic_year', now()->year)
                ->count();
            if ($incompleteCount > 2) {
                $score += 10;
                $factors[] = $incompleteCount.' incomplete grades';
            }

            return [
                'student' => [
                    'id' => $student->id,
                    'name' => $student->name,
                    'registration_number' => $student->registration_number,
                    'program' => $student->program?->name ?? 'N/A',
                ],
                'risk_score' => min(100, $score),
                'risk_level' => $this->riskLevel(min(100, $score)),
                'factors' => $factors,
                'current_gpa' => $avgGpa ? round($avgGpa, 2) : null,
            ];
        })
            ->sortByDesc('risk_score')
            ->take($limit)
            ->values();
    }

    public function predictGrade(float $caScore, float $feScore = 0): array
    {
        $total = ($caScore * 0.4) + ($feScore * 0.6);

        $letterGrade = match (true) {
            $total >= 80 => 'A',
            $total >= 70 => 'B+',
            $total >= 60 => 'B',
            $total >= 50 => 'C',
            $total >= 40 => 'D',
            default => 'F',
        };

        $gradePoints = match (true) {
            $total >= 80 => 5.0,
            $total >= 70 => 4.0,
            $total >= 60 => 3.0,
            $total >= 50 => 2.0,
            $total >= 40 => 1.0,
            default => 0.0,
        };

        $status = $feScore === 0.0 ? 'predicted_ca_only' : 'predicted';

        return [
            'total_score' => round($total, 2),
            'letter_grade' => $letterGrade,
            'grade_points' => $gradePoints,
            'status' => $status,
            'ca_contribution' => round($caScore * 0.4, 2),
            'fe_contribution' => round($feScore * 0.6, 2),
            'confidence' => $feScore > 0 ? 'high' : 'medium',
        ];
    }

    public function enrollmentTrends(): array
    {
        $currentYear = now()->year;

        $years = range($currentYear - 3, $currentYear);

        $trends = [];
        foreach ($years as $year) {
            $trends[] = [
                'year' => (string) $year,
                'enrollments' => Enrollment::whereYear('created_at', $year)->count(),
                'active' => Enrollment::whereYear('created_at', $year)
                    ->where('status', 'active')
                    ->count(),
            ];
        }

        $counts = array_column($trends, 'enrollments');
        $projection = count($counts) >= 2
            ? $this->linearProjection($counts)
            : null;

        return [
            'trends' => $trends,
            'projection' => $projection,
        ];
    }

    protected function calculateAttendanceRate(Student $student): ?float
    {
        $total = $student->attendances()->count();
        if ($total === 0) {
            return null;
        }

        $present = $student->attendances()->where('status', 'present')->count();

        return round(($present / $total) * 100, 1);
    }

    protected function calculateFeeBalance(Student $student): float
    {
        $account = $student->financialAccount;
        if (! $account) {
            return 0;
        }

        $totalFees = $account->tuitionInvoices()->sum('amount');
        $totalPaid = $student->payments()
            ->where('status', 'completed')
            ->sum('amount');

        return max(0, $totalFees - $totalPaid);
    }

    protected function detectGradeDecline(Student $student): ?float
    {
        $gradesBySemester = $student->grades()
            ->where('status', 'approved')
            ->selectRaw('academic_year, semester, avg(grade_points) as avg_gpa')
            ->groupBy('academic_year', 'semester')
            ->orderBy('academic_year')
            ->orderBy('semester')
            ->get();

        if ($gradesBySemester->count() < 2) {
            return null;
        }

        $lastTwo = $gradesBySemester->slice(-2);

        return (float) ($lastTwo->first()->avg_gpa - $lastTwo->last()->avg_gpa);
    }

    protected function linearProjection(array $values): ?float
    {
        $n = count($values);
        if ($n < 2) {
            return null;
        }

        $x = range(0, $n - 1);
        $xMean = array_sum($x) / $n;
        $yMean = array_sum($values) / $n;

        $num = 0;
        $den = 0;
        for ($i = 0; $i < $n; $i++) {
            $num += ($x[$i] - $xMean) * ($values[$i] - $yMean);
            $den += ($x[$i] - $xMean) ** 2;
        }

        if ($den === 0) {
            return null;
        }

        $slope = $num / $den;
        $intercept = $yMean - $slope * $xMean;

        return round($slope * $n + $intercept);
    }

    protected function riskLevel(int $score): string
    {
        return match (true) {
            $score >= 70 => 'critical',
            $score >= 50 => 'high',
            $score >= 30 => 'medium',
            default => 'low',
        };
    }
}
