<?php

namespace App\Http\Controllers;

use App\Models\ThreatAlert;
use App\Models\User;
use App\Services\ReportService;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReportController extends Controller
{
    public function __construct(private ReportService $reportService) {}

    public function dashboard(): Response
    {
        return Inertia::render('admin/reports/index', [
            'stats' => $this->reportService->getDashboardStats(),
            'riskLeaderboard' => $this->reportService->getRiskLeaderboard(),
            'alertTrend' => $this->reportService->getAlertTrend(30),
            'severityDistribution' => $this->reportService->getSeverityDistribution(),
            'recentAlerts' => ThreatAlert::with('user')->latest()->take(10)->get(),
        ]);
    }

    public function userTimeline(User $user)
    {
        return response()->json($this->reportService->getUserActivityTimeline($user));
    }

    public function exportCsv(): StreamedResponse
    {
        return response()->streamDownload(fn () => print $this->reportService->exportAlertsCsv(), 'kiut-threat-alerts.csv', [
            'Content-Type' => 'text/csv',
        ]);
    }
}
