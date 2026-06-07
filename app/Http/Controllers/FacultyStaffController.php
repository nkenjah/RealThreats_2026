<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\FacultyStaff;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FacultyStaffController extends Controller
{
    public function index(Request $request): Response
    {
        $facultyStaff = FacultyStaff::with(['user', 'department'])
            ->when($request->search, fn ($query, $search) => $query->where(fn ($inner) => $inner->where('staff_number', 'like', "%{$search}%")->orWhere('job_title', 'like', "%{$search}%")))
            ->when($request->department_id, fn ($query, $departmentId) => $query->where('department_id', $departmentId))
            ->when($request->contract_type, fn ($query, $type) => $query->where('contract_type', $type))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/academics/faculty-staff/index', [
            'facultyStaff' => $facultyStaff,
            'filters' => $request->only(['search', 'department_id', 'contract_type']),
            'departments' => Department::orderBy('name')->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/academics/faculty-staff/create', [
            'departments' => Department::orderBy('name')->get(),
            'users' => User::orderBy('name')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'user_id' => ['required', 'exists:users,id', 'unique:faculty_staff,user_id'],
            'staff_number' => ['required', 'string', 'max:50', 'unique:faculty_staff,staff_number'],
            'job_title' => ['required', 'string', 'max:255'],
            'department_id' => ['required', 'exists:departments,id'],
            'contract_type' => ['required', 'string', 'max:50'],
            'employment_date' => ['required', 'date'],
        ]);

        FacultyStaff::create($validated);

        return redirect()->route('admin.academics.faculty-staff.index')->with('success', 'Faculty staff created.');
    }

    public function show(FacultyStaff $facultyStaff): Response
    {
        return Inertia::render('admin/academics/faculty-staff/show', [
            'facultyStaff' => $facultyStaff->load(['user', 'department', 'academicRankHistories']),
        ]);
    }

    public function edit(FacultyStaff $facultyStaff): Response
    {
        return Inertia::render('admin/academics/faculty-staff/edit', [
            'facultyStaff' => $facultyStaff,
            'departments' => Department::orderBy('name')->get(),
            'users' => User::orderBy('name')->get(),
        ]);
    }

    public function update(Request $request, FacultyStaff $facultyStaff): RedirectResponse
    {
        $validated = $request->validate([
            'user_id' => ['required', 'exists:users,id', 'unique:faculty_staff,user_id,'.$facultyStaff->id],
            'staff_number' => ['required', 'string', 'max:50', 'unique:faculty_staff,staff_number,'.$facultyStaff->id],
            'job_title' => ['required', 'string', 'max:255'],
            'department_id' => ['required', 'exists:departments,id'],
            'contract_type' => ['required', 'string', 'max:50'],
            'employment_date' => ['required', 'date'],
        ]);

        $facultyStaff->update($validated);

        return back()->with('success', 'Faculty staff updated.');
    }

    public function destroy(FacultyStaff $facultyStaff): RedirectResponse
    {
        $facultyStaff->delete();

        return redirect()->route('admin.academics.faculty-staff.index')->with('success', 'Faculty staff deleted.');
    }
}
