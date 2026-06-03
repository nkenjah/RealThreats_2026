<?php

namespace App\Traits;

use App\Events\AccountLockedEvent;
use App\Models\SystemConfiguration;
use App\Models\ThreatAlert;
use App\Models\User;
use App\Models\UserRiskScore;
use App\Models\UserSessionsTracker;
use App\Notifications\AccountLockedNotification;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;

trait HasRiskScore
{
    public function calculateRiskScore(): int
    {
        return (int) $this->activityLogs()
            ->where('created_at', '>=', now()->subDay())
            ->sum('risk_score_contribution');
    }

    public function isHighRisk(): bool
    {
        $threshold = (int) SystemConfiguration::getValue('risk_score_lock_threshold', 75);

        return (int) $this->riskScore?->current_score >= $threshold;
    }

    public function triggerKillSwitch(string $reason): void
    {
        $isProtected = $this->hasRole(['superadmin', 'admin']);

        if (! $isProtected) {
            $this->update([
                'is_locked' => true,
                'locked_at' => now(),
                'lock_reason' => $reason,
            ]);

            DB::table('sessions')->where('user_id', $this->id)->delete();

            $this->sessionTracker()
                ->where('is_active', true)
                ->update([
                    'is_active' => false,
                    'logout_at' => now(),
                    'was_force_terminated' => true,
                ]);
        }

        ThreatAlert::create([
            'user_id' => $this->id,
            'alert_type' => 'privilege_escalation',
            'severity' => $isProtected ? 'high' : 'critical',
            'status' => 'open',
            'auto_mitigated' => $isProtected,
            'mitigation_action' => $isProtected ? 'warning_only_superadmin' : 'account_locked_kill_switch',
            'notes' => $reason,
        ]);

        broadcast(new AccountLockedEvent($this, $reason));

        $admins = User::role(['admin', 'superadmin'])->get();
        Notification::send($admins->push($this)->unique('id'), new AccountLockedNotification($this, $reason));
    }

    public function riskScore(): HasOne
    {
        return $this->hasOne(UserRiskScore::class);
    }

    public function sessionTracker(): HasMany
    {
        return $this->hasMany(UserSessionsTracker::class);
    }
}
