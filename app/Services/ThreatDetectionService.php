<?php

namespace App\Services;

use App\Events\ThreatDetectedEvent;
use App\Models\ActivityLog;
use App\Models\SystemConfiguration;
use App\Models\ThreatAlert;
use App\Models\User;
use App\Models\UserRiskScore;
use App\Notifications\ThreatAlertNotification;
use Carbon\Carbon;
use Illuminate\Support\Facades\Notification;

class ThreatDetectionService
{
    public function analyzeActivity(ActivityLog $log, User $user): void
    {
        $alert = match ($log->action) {
            'failed_login' => $this->detectFailedLoginPattern($user),
            'off_hours_access' => $this->detectOffHoursAccess($user, $log->created_at ?? now()),
            'unauthorized_access' => $this->detectPrivilegeEscalation($user, (string) data_get($log->properties, 'route', $log->description)),
            'bulk_download', 'data_export' => $this->detectBulkDownload($user),
            default => null,
        };

        if ($alert) {
            $log->update(['alert_triggered' => true]);
        }

        $this->calculateDynamicRiskScore($user);
    }

    public function detectFailedLoginPattern(User $user): ?ThreatAlert
    {
        $count = $user->activityLogs()
            ->where('action', 'failed_login')
            ->where('created_at', '>=', now()->subHour())
            ->count();

        if ($count < 3) {
            return null;
        }

        return $this->createAlert($user, 'failed_login', $count >= 5 ? 'critical' : 'high', "Detected {$count} failed login attempts in the last hour.");
    }

    public function detectOffHoursAccess(User $user, Carbon $time): ?ThreatAlert
    {
        $start = (int) SystemConfiguration::getValue('off_hours_start', 20);
        $end = (int) SystemConfiguration::getValue('off_hours_end', 6);
        $hour = (int) $time->format('G');

        if (! ($hour >= $start || $hour < $end)) {
            return null;
        }

        return $this->createAlert($user, 'off_hours_access', 'medium', 'Authenticated access occurred outside approved KIUT operating hours.');
    }

    public function detectSimultaneousLogin(User $user, string $ip): ?ThreatAlert
    {
        $activeCount = $user->sessionTracker()->where('is_active', true)->distinct('ip_address')->count('ip_address');

        if ($activeCount <= (int) SystemConfiguration::getValue('max_simultaneous_sessions', 1)) {
            return null;
        }

        return $this->createAlert($user, 'simultaneous_login', 'high', "Multiple active sessions detected, latest IP: {$ip}.");
    }

    public function detectPrivilegeEscalation(User $user, string $route): ?ThreatAlert
    {
        return $this->createAlert($user, 'privilege_escalation', 'high', "Unauthorized access attempt against {$route}.");
    }

    public function detectBulkDownload(User $user): ?ThreatAlert
    {
        $threshold = (int) SystemConfiguration::getValue('bulk_download_threshold', 10);
        $count = $user->activityLogs()
            ->whereIn('action', ['bulk_download', 'data_export'])
            ->where('created_at', '>=', now()->subHour())
            ->count();

        if ($count < $threshold) {
            return null;
        }

        return $this->createAlert($user, 'data_exfiltration', 'critical', "Bulk data access exceeded {$threshold} events in one hour.");
    }

    public function calculateDynamicRiskScore(User $user): int
    {
        $score = min(100, (int) $user->activityLogs()
            ->where('created_at', '>=', now()->subDay())
            ->sum('risk_score_contribution'));

        $risk = UserRiskScore::firstOrNew(['user_id' => $user->id]);
        $history = $risk->score_history ?: [];
        $history[] = ['score' => $score, 'timestamp' => now()->toIso8601String()];
        $history = array_slice($history, -96);

        $risk->fill([
            'current_score' => $score,
            'score_history' => $history,
            'last_calculated_at' => now(),
        ])->save();

        $threshold = (int) SystemConfiguration::getValue('risk_score_lock_threshold', 75);
        if ($score >= $threshold && ! $user->is_locked) {
            $user->triggerKillSwitch("Auto-locked: risk score {$score}/100 exceeded threshold");
        }

        return $score;
    }

    public function applyKillSwitch(User $user, string $reason): void
    {
        $user->triggerKillSwitch($reason);
    }

    private function createAlert(User $user, string $type, string $severity, string $notes): ThreatAlert
    {
        $alert = ThreatAlert::create([
            'user_id' => $user->id,
            'alert_type' => $type,
            'severity' => $severity,
            'status' => 'open',
            'notes' => $notes,
        ]);

        broadcast(new ThreatDetectedEvent($alert));

        if (in_array($severity, ['high', 'critical'], true)) {
            Notification::send(User::role(['admin', 'superadmin'])->get(), new ThreatAlertNotification($alert));
        }

        return $alert;
    }
}
