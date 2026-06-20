<?php

namespace App\Http\Controllers;

use App\Models\CourseOffering;
use App\Models\Grade;
use App\Models\Student;
use App\Services\GradingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GradeController extends Controller
{
    public function __construct(
        private readonly GradingService $gradingService,
    ) {}

    public function index(Request $request): Response
    {
        $grades = Grade::with(['student', 'courseOffering.course'])
            ->when($request->search, fn ($query, $search) => $query->whereHas('student', fn ($q) => $q->where('name', 'like', "%{$search}%")))
            ->when($request->academic_year, fn ($query, $year) => $query->where('academic_year', $year))
            ->when($request->semester, fn ($query, $semester) => $query->where('semester', $semester))
            ->when($request->status, fn ($query, $status) => $query->where('status', $status))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        $baseQuery = Grade::query()
            ->when($request->academic_year, fn ($q, $year) => $q->where('academic_year', $year))
            ->when($request->semester, fn ($q, $sem) => $q->where('semester', $sem));

        $stats = [
            'total_grades' => (clone $baseQuery)->count(),
            'passed' => (clone $baseQuery)->whereNotIn('grade', ['E', 'F'])->count(),
            'failed' => (clone $baseQuery)->whereIn('grade', ['E', 'F'])->count(),
            'supps' => (clone $baseQuery)->where('grade', 'E')->count(),
            'retakes' => (clone $baseQuery)->where('grade', 'F')->count(),
            'pending_approval' => (clone $baseQuery)->where('status', 'submitted')->count(),
            'by_grade' => (clone $baseQuery)
                ->selectRaw('grade, count(*) as count')
                ->groupBy('grade')
                ->orderBy('grade')
                ->get()
                ->toArray(),
        ];

        return Inertia::render('admin/grades/index', [
            'grades' => $grades,
            'filters' => $request->only(['search', 'academic_year', 'semester', 'status']),
            'stats' => $stats,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/grades/create', [
            'students' => Student::orderBy('name')->get(),
            'courseOfferings' => CourseOffering::with('course')->orderBy('id')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'student_id' => ['required', 'exists:students,id'],
            'course_offering_id' => ['required', 'exists:course_offerings,id'],
            'grade' => ['required', 'string', 'max:10'],
            'grade_points' => ['nullable', 'numeric', 'min:0'],
            'academic_year' => ['required', 'string', 'max:20'],
            'semester' => ['required', 'string', 'max:20'],
        ]);

        Grade::create($validated);

        return redirect()->route('admin.grades.index')->with('success', 'Grade created.');
    }

    public function show(Grade $grade): Response
    {
        return Inertia::render('admin/grades/show', [
            'grade' => $grade->load(['student', 'courseOffering.course']),
        ]);
    }

    public function edit(Grade $grade): Response
    {
        return Inertia::render('admin/grades/edit', [
            'grade' => $grade,
            'students' => Student::orderBy('name')->get(),
            'courseOfferings' => CourseOffering::with('course')->orderBy('id')->get(),
        ]);
    }

    public function update(Request $request, Grade $grade): RedirectResponse
    {
        $validated = $request->validate([
            'student_id' => ['required', 'exists:students,id'],
            'course_offering_id' => ['required', 'exists:course_offerings,id'],
            'grade' => ['required', 'string', 'max:10'],
            'grade_points' => ['nullable', 'numeric', 'min:0'],
            'academic_year' => ['required', 'string', 'max:20'],
            'semester' => ['required', 'string', 'max:20'],
        ]);

        $grade->update($validated);

        return back()->with('success', 'Grade updated.');
    }

    public function destroy(Grade $grade): RedirectResponse
    {
        $grade->delete();

        return redirect()->route('admin.grades.index')->with('success', 'Grade deleted.');
    }

    public function bulkSubmit(Request $request): RedirectResponse|JsonResponse
    {
        $validated = $request->validate([
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['integer', 'exists:grades,id'],
        ]);

        $grades = Grade::whereIn('id', $validated['ids'])->get();
        $invalid = $grades->filter(fn ($g) => $g->status !== 'draft');

        if ($invalid->isNotEmpty()) {
            return back()->with('error', count($invalid).' grade(s) are not in draft status and were skipped.');
        }

        $now = now();
        $userId = auth()->id();

        $grades->each(function ($grade) use ($now, $userId) {
            $grade->update([
                'status' => 'submitted',
                'submitted_by' => $userId,
                'submitted_at' => $now,
            ]);

            activity()
                ->performedOn($grade)
                ->withProperties(['grade' => $grade->grade])
                ->log('Grade bulk-submitted for approval');
        });

        return back()->with('success', count($grades).' grade(s) submitted for HOD approval.');
    }

    public function bulkApprove(Request $request): RedirectResponse|JsonResponse
    {
        $validated = $request->validate([
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['integer', 'exists:grades,id'],
        ]);

        $grades = Grade::whereIn('id', $validated['ids'])->get();
        $invalid = $grades->filter(fn ($g) => $g->status !== 'submitted');

        if ($invalid->isNotEmpty()) {
            return back()->with('error', count($invalid).' grade(s) are not in submitted status and were skipped.');
        }

        $now = now();
        $userId = auth()->id();

        $grades->each(function ($grade) use ($now, $userId) {
            $grade->update([
                'status' => 'approved',
                'approved_by' => $userId,
                'approved_at' => $now,
            ]);

            activity()
                ->performedOn($grade)
                ->causedBy(auth()->user())
                ->withProperties(['grade' => $grade->grade])
                ->log('Grade bulk-approved');
        });

        return back()->with('success', count($grades).' grade(s) approved.');
    }

    public function submit(Grade $grade): RedirectResponse
    {
        if ($grade->status !== 'draft') {
            return back()->with('error', 'Only draft grades can be submitted.');
        }

        $grade->update([
            'status' => 'submitted',
            'submitted_by' => auth()->id(),
            'submitted_at' => now(),
        ]);

        activity()
            ->performedOn($grade)
            ->withProperties(['grade' => $grade->grade, 'grade_points' => $grade->grade_points])
            ->log('Grade submitted for approval');

        broadcast(new GradeSubmittedEvent($grade));

        Notification::send(
            User::role(['admin', 'superadmin', 'hod'])->get(),
            new GradeSubmittedNotification($grade),
        );

        return back()->with('success', 'Grade submitted for HOD approval.');
    }

    public function approve(Grade $grade): RedirectResponse
    {
        if ($grade->status !== 'submitted') {
            return back()->with('error', 'Only submitted grades can be approved.');
        }

        $grade->update([
            'status' => 'approved',
            'approved_by' => auth()->id(),
            'approved_at' => now(),
        ]);

        activity()
            ->performedOn($grade)
            ->causedBy(auth()->user())
            ->withProperties(['grade' => $grade->grade])
            ->log('Grade approved');

        broadcast(new GradeApprovedEvent($grade));

        if ($grade->submitted_by) {
            Notification::send(
                User::where('id', $grade->submitted_by)->get(),
                new GradeApprovedNotification($grade),
            );
        }

        return back()->with('success', 'Grade approved.');
    }

    public function reject(Request $request, Grade $grade): RedirectResponse
    {
        if ($grade->status !== 'submitted') {
            return back()->with('error', 'Only submitted grades can be rejected.');
        }

        $validated = $request->validate(['reason' => ['required', 'string', 'max:1000']]);

        $grade->update([
            'status' => 'draft',
            'submitted_by' => null,
            'submitted_at' => null,
            'rejection_reason' => $validated['reason'],
        ]);

        activity()
            ->performedOn($grade)
            ->causedBy(auth()->user())
            ->withProperties(['reason' => $validated['reason']])
            ->log('Grade rejected, returned to lecturer');

        if ($grade->submitted_by) {
            Notification::send(
                User::where('id', $grade->submitted_by)->get(),
                new GradeRejectedNotification($grade, $validated['reason']),
            );
        }

        return back()->with('success', 'Grade rejected and returned to lecturer.');
    }
}
