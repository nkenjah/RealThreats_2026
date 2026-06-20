<?php

namespace App\Http\Controllers;

use App\Models\GraduationClearance;
use App\Models\Student;
use App\Services\GraduationClearanceService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GraduationClearanceController extends Controller
{
    public function __construct(
        private readonly GraduationClearanceService $clearanceService,
    ) {}

    public function index(Request $request): Response
    {
        $clearances = GraduationClearance::with('student.department')
            ->whereHas('student', fn ($q) => $q
                ->when($request->search, fn ($query, $search) => $query
                    ->where('name', 'like', "%{$search}%")
                    ->orWhere('registration_number', 'like', "%{$search}%")
                )
            )
            ->when($request->status, fn ($query, $status) => $query->where('is_cleared', $status === 'cleared'))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        $stats = [
            'total' => GraduationClearance::count(),
            'cleared' => GraduationClearance::where('is_cleared', true)->count(),
            'blocked' => GraduationClearance::where('is_cleared', false)->count(),
        ];

        return Inertia::render('admin/graduation-clearance/index', [
            'clearances' => $clearances,
            'filters' => $request->only(['search', 'status']),
            'stats' => $stats,
        ]);
    }

    public function show(Student $student): Response
    {
        $clearance = GraduationClearance::where('student_id', $student->id)->latest()->first();

        return Inertia::render('admin/students/clearance', [
            'student' => $student->load('department'),
            'clearance' => $clearance,
        ]);
    }

    public function process(Student $student): RedirectResponse
    {
        $result = $this->clearanceService->processClearance($student);

        GraduationClearance::create([
            'student_id' => $student->id,
            'department_statuses' => $result['departments'],
            'is_cleared' => $result['cleared'],
            'clearance_token' => $result['token'],
        ]);

        $message = $result['cleared']
            ? 'Student cleared for graduation.'
            : 'Clearance incomplete. Check department statuses below.';

        return back()->with('success', $message);
    }
}
