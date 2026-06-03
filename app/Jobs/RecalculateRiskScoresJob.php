<?php

namespace App\Jobs;

use App\Models\User;
use App\Services\ThreatDetectionService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class RecalculateRiskScoresJob implements ShouldQueue
{
    use Queueable;

    public function handle(ThreatDetectionService $service): void
    {
        User::where('is_active', true)
            ->where('is_locked', false)
            ->each(fn (User $user) => $service->calculateDynamicRiskScore($user));
    }
}
