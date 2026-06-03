<?php

namespace App\Jobs;

use App\Models\ActivityLog;
use App\Models\User;
use App\Services\ThreatDetectionService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class AnalyzeThreatJob implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public function __construct(public ActivityLog $log, public User $user) {}

    public function handle(ThreatDetectionService $service): void
    {
        $service->analyzeActivity($this->log, $this->user);
    }
}
