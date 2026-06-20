<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Student;
use App\Services\FeeBlockingService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StudentController extends Controller
{
    public function __construct(
        private readonly FeeBlockingService $feeBlockingService,
    ) {}

    public function index(Request $request): Response
    {
        $students = Student::with('department')
            ->when($request->search, fn ($query, $search) => $query->where(fn ($inner) => $inner->where('name', 'like', "%{$search}%")->orWhere('registration_number', 'like', "%{$search}%")->orWhere('email', 'like', "%{$search}%")))
            ->when($request->department_id, fn ($query, $departmentId) => $query->where('department_id', $departmentId))
            ->when($request->program, fn ($query, $program) => $query->where('program', $program))
            ->when($request->active !== null && $request->active !== '', fn ($query) => $query->where('is_active', request()->boolean('active')))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        $stats = [
            'total' => Student::count(),
            'active' => Student::where('is_active', true)->count(),
            'by_department' => Department::withCount('students')
                ->get()
                ->map(fn ($d) => ['name' => $d->name, 'count' => $d->students_count]),
            'by_year' => Student::selectRaw('year_of_study as year, count(*) as count')
                ->groupBy('year_of_study')
                ->orderBy('year_of_study')
                ->get()
                ->toArray(),
        ];

        return Inertia::render('admin/students/index', [
            'students' => $students,
            'filters' => $request->only(['search', 'department_id', 'program', 'active']),
            'departments' => Department::orderBy('name')->get(),
            'programs' => Student::distinct()->orderBy('program')->pluck('program'),
            'stats' => $stats,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/students/create', [
            'departments' => Department::orderBy('name')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'department_id' => ['nullable', 'exists:departments,id'],
            'registration_number' => ['required', 'string', 'max:50', 'unique:students,registration_number'],
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:students,email'],
            'program' => ['required', 'string', 'max:255'],
            'year_of_study' => ['required', 'integer', 'min:1', 'max:10'],
            'is_active' => ['boolean'],
        ]);

        Student::create($validated);

        return redirect()->route('admin.students.index')->with('success', 'Student created.');
    }

    public function show(Student $student): Response
    {
        $examCardStatus = $this->feeBlockingService->checkExamCardStatus($student);

        return Inertia::render('admin/students/show', [
            'student' => $student->load('department'),
            'exam_card_status' => $examCardStatus,
        ]);
    }

    public function edit(Student $student): Response
    {
        return Inertia::render('admin/students/edit', [
            'student' => $student,
            'departments' => Department::orderBy('name')->get(),
        ]);
    }

    public function update(Request $request, Student $student): RedirectResponse
    {
        $validated = $request->validate([
            'department_id' => ['nullable', 'exists:departments,id'],
            'registration_number' => ['required', 'string', 'max:50', 'unique:students,registration_number,'.$student->id],
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:students,email,'.$student->id],
            'program' => ['required', 'string', 'max:255'],
            'year_of_study' => ['required', 'integer', 'min:1', 'max:10'],
            'is_active' => ['boolean'],
        ]);

        $student->update($validated);

        return back()->with('success', 'Student updated.');
    }

    public function destroy(Student $student): RedirectResponse
    {
        $student->delete();

        return redirect()->route('admin.students.index')->with('success', 'Student deleted.');
    }
}
