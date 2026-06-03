<?php

namespace App\Http\Controllers;

use App\Services\ReportService;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(private ReportService $reportService) {}

    public function index(): Response
    {
        return Inertia::render('dashboard/index', [
            'stats' => $this->reportService->getDashboardStats(),
            'riskLeaderboard' => $this->reportService->getRiskLeaderboard(),
            'alertTrend' => $this->reportService->getAlertTrend(7),
            'severityDistribution' => $this->reportService->getSeverityDistribution(),
        ]);
    }
}
