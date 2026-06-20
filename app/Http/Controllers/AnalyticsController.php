<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Enrollment;
use App\Models\Grade;
use App\Models\Payment;
use App\Models\Student;
use App\Services\PredictiveAnalyticsService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AnalyticsController extends Controller
{
    public function __construct(
        private readonly PredictiveAnalyticsService $analytics,
    ) {}

    public function index(): Response
    {
        $totalStudents = Student::count();
        $activeEnrollments = Enrollment::where('status', 'active')->count();
        $totalCollected = Payment::where('status', 'completed')->sum('amount');
        $avgGpa = Grade::where('status', 'approved')->avg('grade_points');

        $gradeDistribution = Grade::where('status', 'approved')
            ->selectRaw('grade, COUNT(*) as count')
            ->groupBy('grade')
            ->orderBy('grade')
            ->get();

        $enrollmentTrends = $this->analytics->enrollmentTrends();

        $atRiskStudents = $this->analytics->atRiskStudents(10);

        $attendanceRate = null;
        $totalAttendance = Attendance::count();
        if ($totalAttendance > 0) {
            $presentCount = Attendance::where('status', 'present')->count();
            $attendanceRate = round(($presentCount / $totalAttendance) * 100, 1);
        }

        return Inertia::render('admin/analytics/index', [
            'stats' => [
                'total_students' => $totalStudents,
                'active_enrollments' => $activeEnrollments,
                'avg_gpa' => $avgGpa ? round($avgGpa, 2) : 0,
                'total_collected' => $totalCollected,
                'attendance_rate' => $attendanceRate,
            ],
            'gradeDistribution' => $gradeDistribution,
            'enrollmentTrends' => $enrollmentTrends,
            'atRiskStudents' => $atRiskStudents,
        ]);
    }

    public function atRiskStudents(Request $request)
    {
        $limit = $request->integer('limit', 10);

        return response()->json([
            'data' => $this->analytics->atRiskStudents($limit),
        ]);
    }

    public function enrollmentTrends()
    {
        return response()->json(
            $this->analytics->enrollmentTrends(),
        );
    }
}
