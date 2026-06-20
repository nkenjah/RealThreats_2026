<?php

namespace App\Http\Controllers;

use App\Models\PayrollPeriod;
use App\Services\PayrollService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PayrollController extends Controller
{
    public function __construct(private readonly PayrollService $payrollService) {}

    public function index(): Response
    {
        $periods = PayrollPeriod::with('processedBy')
            ->latest('year')
            ->latest('month')
            ->paginate(15);

        return Inertia::render('admin/payroll/periods/index', [
            'periods' => $periods,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'month' => ['required', 'integer', 'between:1,12'],
            'year' => ['required', 'integer', 'min:2020', 'max:2099'],
        ]);

        $exists = PayrollPeriod::where('month', $validated['month'])
            ->where('year', $validated['year'])
            ->exists();

        if ($exists) {
            return back()->with('error', 'Payroll period already exists.');
        }

        $this->payrollService->createPeriod($validated['month'], $validated['year']);

        return redirect()->route('admin.payroll.periods.index')
            ->with('success', 'Payroll period created.');
    }

    public function show(PayrollPeriod $payrollPeriod): Response
    {
        $payrollPeriod->load(['items.facultyStaff.user', 'processedBy']);

        return Inertia::render('admin/payroll/periods/show', [
            'period' => $payrollPeriod,
        ]);
    }

    public function run(PayrollPeriod $payrollPeriod): RedirectResponse
    {
        if ($payrollPeriod->status !== 'draft') {
            return back()->with('error', 'Only draft periods can be processed.');
        }

        $count = $this->payrollService->runPayroll($payrollPeriod);

        return redirect()->route('admin.payroll.periods.show', $payrollPeriod)
            ->with('success', "Payroll processed for {$count} staff members.");
    }

    public function finalize(PayrollPeriod $payrollPeriod): RedirectResponse
    {
        if ($payrollPeriod->status !== 'draft') {
            return back()->with('error', 'Only processed periods can be finalized.');
        }

        $this->payrollService->finalize($payrollPeriod);

        return back()->with('success', 'Payroll period finalized.');
    }
}
