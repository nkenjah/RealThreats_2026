<?php

namespace App\Http\Controllers;

use App\Models\SalaryGrade;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SalaryGradeController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/payroll/salary-grades/index', [
            'grades' => SalaryGrade::latest()->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'grade' => ['required', 'string', 'max:50', 'unique:salary_grades,grade'],
            'basic_salary' => ['required', 'numeric', 'min:0'],
            'allowances' => ['nullable', 'array'],
            'allowances.*.name' => ['required', 'string', 'max:100'],
            'allowances.*.amount' => ['required', 'numeric', 'min:0'],
            'description' => ['nullable', 'string', 'max:500'],
        ]);

        SalaryGrade::create($validated);

        return redirect()->route('admin.payroll.salary-grades.index')
            ->with('success', 'Salary grade created.');
    }

    public function update(Request $request, SalaryGrade $salaryGrade): RedirectResponse
    {
        $validated = $request->validate([
            'grade' => ['required', 'string', 'max:50', 'unique:salary_grades,grade,'.$salaryGrade->id],
            'basic_salary' => ['required', 'numeric', 'min:0'],
            'allowances' => ['nullable', 'array'],
            'allowances.*.name' => ['required', 'string', 'max:100'],
            'allowances.*.amount' => ['required', 'numeric', 'min:0'],
            'description' => ['nullable', 'string', 'max:500'],
        ]);

        $salaryGrade->update($validated);

        return redirect()->route('admin.payroll.salary-grades.index')
            ->with('success', 'Salary grade updated.');
    }

    public function destroy(SalaryGrade $salaryGrade): RedirectResponse
    {
        $salaryGrade->delete();

        return redirect()->route('admin.payroll.salary-grades.index')
            ->with('success', 'Salary grade deleted.');
    }
}
