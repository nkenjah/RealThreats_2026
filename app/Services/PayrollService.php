<?php

namespace App\Services;

use App\Models\FacultyStaff;
use App\Models\PayrollItem;
use App\Models\PayrollPeriod;
use App\Models\StaffContract;

class PayrollService
{
    public function createPeriod(int $month, int $year): PayrollPeriod
    {
        return PayrollPeriod::create([
            'month' => $month,
            'year' => $year,
            'status' => 'draft',
        ]);
    }

    public function runPayroll(PayrollPeriod $period): int
    {
        $count = 0;

        $activeStaff = FacultyStaff::whereHas('contracts', fn ($q) => $q->active())
            ->with(['contracts' => fn ($q) => $q->active(), 'contracts.salaryGrade'])
            ->get();

        foreach ($activeStaff as $staff) {
            $contract = $staff->contracts->first();
            if (! $contract) {
                continue;
            }

            $basicSalary = $contract->basic_salary;
            $allowances = $this->calculateAllowances($contract);
            $totalAllowances = collect($allowances)->sum('amount');
            $grossPay = $basicSalary + $totalAllowances;
            $tax = $this->calculateTax($grossPay);
            $netPay = $grossPay - $tax;

            PayrollItem::create([
                'payroll_period_id' => $period->id,
                'faculty_staff_id' => $staff->id,
                'basic_salary' => $basicSalary,
                'total_allowances' => $totalAllowances,
                'total_deductions' => 0,
                'tax' => $tax,
                'net_pay' => $netPay,
                'breakdown' => [
                    'allowances' => $allowances,
                    'gross_pay' => $grossPay,
                ],
            ]);

            $count++;
        }

        $period->update([
            'processed_at' => now(),
            'processed_by' => auth()->id(),
        ]);

        return $count;
    }

    public function finalize(PayrollPeriod $period): void
    {
        $period->update(['status' => 'finalized']);
    }

    private function calculateAllowances(StaffContract $contract): array
    {
        $allowances = [];

        if ($contract->salaryGrade && $contract->salaryGrade->allowances) {
            foreach ($contract->salaryGrade->allowances as $a) {
                $allowances[] = [
                    'name' => $a['name'] ?? 'Allowance',
                    'amount' => (float) ($a['amount'] ?? 0),
                ];
            }
        }

        return $allowances;
    }

    private function calculateTax(float $grossPay): float
    {
        if ($grossPay <= 500000) {
            return 0;
        }
        if ($grossPay <= 1000000) {
            return ($grossPay - 500000) * 0.1;
        }
        if ($grossPay <= 2000000) {
            return 50000 + ($grossPay - 1000000) * 0.15;
        }
        if ($grossPay <= 5000000) {
            return 200000 + ($grossPay - 2000000) * 0.2;
        }

        return 800000 + ($grossPay - 5000000) * 0.25;
    }
}
