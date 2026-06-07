<?php

namespace App\Http\Controllers;

use App\Models\StudentStatusLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StudentStatusLogController extends Controller
{
    public function index(Request $request): Response
    {
        $studentStatusLogs = StudentStatusLog::with('student')
            ->when($request->search, fn ($query, $search) => $query->whereHas('student', fn ($q) => $q->where('name', 'like', "%{$search}%")))
            ->when($request->previous_status, fn ($query, $status) => $query->where('previous_status', $status))
            ->when($request->new_status, fn ($query, $status) => $query->where('new_status', $status))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/student-status-logs/index', [
            'studentStatusLogs' => $studentStatusLogs,
            'filters' => $request->only(['search', 'previous_status', 'new_status']),
        ]);
    }

    public function show(StudentStatusLog $studentStatusLog): Response
    {
        return Inertia::render('admin/student-status-logs/show', [
            'studentStatusLog' => $studentStatusLog->load('student'),
        ]);
    }
}
