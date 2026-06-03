<?php

namespace App\Traits;

use App\Jobs\AnalyzeThreatJob;
use App\Models\ActivityLog;
use Spatie\Activitylog\Models\Concerns\LogsActivity;
use Spatie\Activitylog\Support\LogOptions;

trait HasActivityLog
{
    use LogsActivity;

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty()
            ->setDescriptionForEvent(fn (string $eventName) => "{$eventName} ".class_basename($this));
    }

    public function logSecurityActivity(string $action, string $description, string $module = 'system', int $riskScore = 0): void
    {
        $log = ActivityLog::create([
            'user_id' => auth()->id(),
            'action' => $action,
            'module' => $module,
            'description' => $description,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'risk_score_contribution' => $riskScore,
            'alert_triggered' => false,
            'log_name' => 'security',
            'event' => $action,
        ]);

        if ($log && auth()->check()) {
            AnalyzeThreatJob::dispatch($log, auth()->user());
        }
    }
}
