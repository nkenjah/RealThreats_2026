<?php

namespace App\Http\Controllers;

use App\Models\Enrollment;
use App\Models\Grade;
use App\Models\Payment;
use App\Models\Student;
use App\Services\ReportService;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(private ReportService $reportService) {}

    public function index(): Response
    {
        $totalStudents = Student::count();
        $activeEnrollments = Enrollment::where('status', 'active')->count();
        $totalCollected = Payment::where('status', 'completed')->sum('amount');
        $avgGpa = Grade::where('status', 'approved')->avg('grade_points');

        return Inertia::render('dashboard/index', [
            'stats' => $this->reportService->getDashboardStats(),
            'riskLeaderboard' => $this->reportService->getRiskLeaderboard(),
            'alertTrend' => $this->reportService->getAlertTrend(7),
            'severityDistribution' => $this->reportService->getSeverityDistribution(),
            'academicStats' => [
                'total_students' => $totalStudents,
                'active_enrollments' => $activeEnrollments,
                'avg_gpa' => $avgGpa ? round($avgGpa, 2) : 0,
                'collection_rate' => $totalCollected,
            ],
        ]);
    }
}
