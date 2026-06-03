<?php

namespace App\Services;

use App\Events\SuspiciousLoginEvent;
use App\Models\User;
use App\Models\UserSessionsTracker;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class SessionTrackerService
{
    public function registerLogin(User $user, Request $request): void
    {
        UserSessionsTracker::create([
            'user_id' => $user->id,
            'session_id' => $request->session()->getId(),
            'ip_address' => $request->ip() ?: '0.0.0.0',
            'user_agent' => $request->userAgent() ?: 'Unknown',
            'location' => 'Tanzania',
            'login_at' => now(),
            'is_active' => true,
        ]);
    }

    public function registerLogout(User $user): void
    {
        $user->sessionTracker()
            ->where('session_id', session()->getId())
            ->where('is_active', true)
            ->update(['is_active' => false, 'logout_at' => now()]);
    }

    public function terminateAllSessions(User $user, string $reason): void
    {
        DB::table('sessions')->where('user_id', $user->id)->delete();

        $user->sessionTracker()->where('is_active', true)->update([
            'is_active' => false,
            'logout_at' => now(),
            'was_force_terminated' => true,
        ]);

        $user->logSecurityActivity('force_logout', $reason, 'users', 10);
    }

    public function getActiveSessions(User $user): Collection
    {
        return $user->sessionTracker()->where('is_active', true)->latest('login_at')->get();
    }

    public function detectSimultaneousSessions(User $user, string $newIp): bool
    {
        $hasMultiple = $this->getActiveSessions($user)->pluck('ip_address')->unique()->count() > 1;

        if ($hasMultiple) {
            broadcast(new SuspiciousLoginEvent($user, $newIp, 'Simultaneous sessions from multiple IP addresses.'));
            app(ThreatDetectionService::class)->detectSimultaneousLogin($user, $newIp);
        }

        return $hasMultiple;
    }
}
