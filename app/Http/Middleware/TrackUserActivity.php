<?php

namespace App\Http\Middleware;

use App\Jobs\AnalyzeThreatJob;
use App\Models\ActivityLog;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TrackUserActivity
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if (! $request->user() || $this->shouldSkip($request)) {
            return $response;
        }

        $routeName = $request->route()?->getName() ?: $request->path();
        $module = str($routeName)->before('.')->value() ?: 'system';
        $action = $this->actionFor($routeName, $request);
        $risk = $this->riskFor($routeName, $action);

        $log = ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => $action,
            'module' => $module,
            'description' => "{$request->method()} {$request->path()}",
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'risk_score_contribution' => $risk,
            'alert_triggered' => false,
            'log_name' => 'security',
            'event' => $action,
            'properties' => ['route' => $routeName],
        ]);

        AnalyzeThreatJob::dispatch($log, $request->user());

        return $response;
    }

    private function shouldSkip(Request $request): bool
    {
        $path = $request->path();

        return str($path)->contains([
            'login',
            'logout',
            'two-factor',
            'passkey',
            'password',
            'verification',
            'sanctum',
            'reverb',
            '_debugbar',
            'broadcasting',
            'build',
        ]);
    }

    private function actionFor(string $routeName, Request $request): string
    {
        if (str_contains($routeName, 'export')) {
            return 'data_export';
        }

        return match ($request->method()) {
            'POST' => 'create',
            'PATCH', 'PUT' => 'update',
            'DELETE' => 'delete',
            default => 'page_visit',
        };
    }

    private function riskFor(string $routeName, string $action): int
    {
        if ($action === 'data_export') {
            return 30;
        }

        if (str_contains($routeName, 'activity-logs') || str_contains($routeName, 'reports')) {
            return 5;
        }

        return 0;
    }
}
