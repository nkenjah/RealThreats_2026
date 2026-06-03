<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ActivityLogController extends Controller
{
    public function index(Request $request): Response
    {
        $logs = ActivityLog::with('user.department')
            ->when($request->search, fn ($query, $search) => $query->where('description', 'like', "%{$search}%")->orWhereHas('user', fn ($userQuery) => $userQuery->where('name', 'like', "%{$search}%")))
            ->when($request->module, fn ($query, $module) => $query->where('module', $module))
            ->when($request->action, fn ($query, $action) => $query->where('action', $action))
            ->when($request->user_id, fn ($query, $userId) => $query->where('user_id', $userId))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/activity-logs/index', [
            'logs' => $logs,
            'filters' => $request->only(['search', 'module', 'action', 'user_id']),
        ]);
    }

    public function show(ActivityLog $activityLog): Response
    {
        return Inertia::render('admin/activity-logs/show', [
            'log' => $activityLog->load(['user.department', 'threatAlert']),
        ]);
    }
}
