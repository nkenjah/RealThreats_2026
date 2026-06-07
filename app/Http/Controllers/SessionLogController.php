<?php

namespace App\Http\Controllers;

use App\Models\SessionLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SessionLogController extends Controller
{
    public function index(Request $request): Response
    {
        $sessionLogs = SessionLog::with('user')
            ->when($request->search, fn ($query, $search) => $query->whereHas('user', fn ($q) => $q->where('name', 'like', "%{$search}%")))
            ->when($request->date_from, fn ($query, $date) => $query->whereDate('login_at', '>=', $date))
            ->when($request->date_to, fn ($query, $date) => $query->whereDate('login_at', '<=', $date))
            ->latest('login_at')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/session-logs/index', [
            'sessionLogs' => $sessionLogs,
            'filters' => $request->only(['search', 'date_from', 'date_to']),
        ]);
    }

    public function show(SessionLog $sessionLog): Response
    {
        return Inertia::render('admin/session-logs/show', [
            'sessionLog' => $sessionLog->load('user'),
        ]);
    }
}
