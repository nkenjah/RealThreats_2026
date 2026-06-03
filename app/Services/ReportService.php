<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\ThreatAlert;
use App\Models\User;
use Illuminate\Support\Collection;

class ReportService
{
    public function getDashboardStats(): array
    {
        return [
            'active_threats_count' => ThreatAlert::whereIn('status', ['open', 'investigating'])->count(),
            'locked_users_count' => User::where('is_locked', true)->count(),
            'todays_alerts_count' => ThreatAlert::whereDate('created_at', today())->count(),
            'high_risk_users_count' => User::whereHas('riskScore', fn ($query) => $query->where('current_score', '>=', 60))->count(),
            'critical_count' => ThreatAlert::where('severity', 'critical')->count(),
            'high_count' => ThreatAlert::where('severity', 'high')->count(),
            'medium_count' => ThreatAlert::where('severity', 'medium')->count(),
            'low_count' => ThreatAlert::where('severity', 'low')->count(),
        ];
    }

    public function getRiskLeaderboard(): Collection
    {
        return User::query()
            ->with(['department', 'riskScore'])
            ->whereHas('riskScore')
            ->get()
            ->sortByDesc(fn (User $user) => $user->riskScore?->current_score ?? 0)
            ->take(10)
            ->values();
    }

    public function getAlertTrend(int $days = 7): array
    {
        return collect(range($days - 1, 0))
            ->map(function (int $daysAgo) {
                $date = today()->subDays($daysAgo);

                return [
                    'date' => $date->format('M d'),
                    'count' => ThreatAlert::whereDate('created_at', $date)->count(),
                ];
            })
            ->all();
    }

    public function getSeverityDistribution(): array
    {
        return collect(['critical', 'high', 'medium', 'low'])
            ->mapWithKeys(fn (string $severity) => [$severity => ThreatAlert::where('severity', $severity)->count()])
            ->all();
    }

    public function getUserActivityTimeline(User $user): Collection
    {
        return ActivityLog::with('threatAlert')
            ->where('user_id', $user->id)
            ->latest()
            ->take(50)
            ->get();
    }

    public function exportAlertsCsv(): string
    {
        $rows = ThreatAlert::with('user')->latest()->get();
        $csv = "id,user,email,type,severity,status,auto_mitigated,created_at\n";

        foreach ($rows as $alert) {
            $csv .= collect([
                $alert->id,
                $alert->user?->name,
                $alert->user?->email,
                $alert->alert_type,
                $alert->severity,
                $alert->status,
                $alert->auto_mitigated ? 'yes' : 'no',
                $alert->created_at,
            ])->map(fn ($value) => '"'.str_replace('"', '""', (string) $value).'"')->implode(',')."\n";
        }

        return $csv;
    }
}
