<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckUserLockStatus
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user?->is_locked) {
            if ($user->hasRole(['superadmin', 'admin'])) {
                return $next($request);
            }

            $reason = $user->lock_reason ?: 'Your account has been suspended.';
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect()->route('account.locked')->with('lock_reason', $reason);
        }

        return $next($request);
    }
}
