<?php

namespace App\Jobs;

use App\Models\User;
use App\Notifications\DailySecurityReportNotification;
use App\Services\ReportService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Notification;

class GenerateDailySecurityReportJob implements ShouldQueue
{
    use Queueable;

    public function handle(ReportService $reportService): void
    {
        Notification::send(
            User::role(['admin', 'superadmin'])->get(),
            new DailySecurityReportNotification($reportService->getDashboardStats())
        );
    }
}
