<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use App\Models\Grade;
use App\Models\Payment;
use App\Models\Student;
use App\Models\ThreatAlert;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $totalStudents = Student::count();
        $activeEnrollments = Enrollment::where('status', 'active')->count();
        $avgGpa = Grade::where('status', 'approved')->avg('grade_points');
        $revenueCollected = Payment::where('status', 'completed')->sum('amount');
        $activeThreats = ThreatAlert::whereIn('status', ['open', 'investigating'])->count();
        $lockedAccounts = User::where('is_locked', true)->count();
        $todaysAlerts = ThreatAlert::whereDate('created_at', today())->count();
        $highRiskUsers = User::whereHas('riskScore', fn ($q) => $q->where('current_score', '>=', 60))->count();

        return response()->json([
            'data' => [
                'total_students' => $totalStudents,
                'active_enrollments' => $activeEnrollments,
                'average_gpa' => round($avgGpa ?? 0, 2),
                'revenue_collected' => $revenueCollected,
                'revenue_collected_millions' => round($revenueCollected / 1_000_000, 2),
                'active_threats' => $activeThreats,
                'locked_accounts' => $lockedAccounts,
                'todays_alerts' => $todaysAlerts,
                'high_risk_users' => $highRiskUsers,
            ],
        ]);
    }
}
