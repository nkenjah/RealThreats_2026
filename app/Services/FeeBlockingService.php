<?php

namespace App\Services;

use App\Models\Payment;
use App\Models\Student;
use App\Models\TuitionInvoice;

class FeeBlockingService
{
    /**
     * Check if student is blocked from exam card generation.
     *
     * @return array{blocked: bool, reason: ?string, payment_percentage: float, total_fee: float, total_paid: float}
     */
    public function checkExamCardStatus(Student $student, ?string $academicYear = null): array
    {
        $academicYear ??= $this->getCurrentAcademicYear();

        $totalFee = TuitionInvoice::whereIn('financial_account_id', function ($q) use ($student) {
            $q->select('id')->from('financial_accounts')->where('student_id', $student->id);
        })->sum('total_amount');

        $totalPaid = Payment::whereIn('financial_account_id', function ($q) use ($student) {
            $q->select('id')->from('financial_accounts')->where('student_id', $student->id);
        })->where('status', 'completed')->sum('amount');

        $percentage = $totalFee > 0 ? round(($totalPaid / $totalFee) * 100, 2) : 0;
        $minPercent = config('gepg.exam_card_min_payment_percent', 50);

        return [
            'blocked' => $percentage < $minPercent,
            'reason' => $percentage < $minPercent
                ? "Payment at {$percentage}% — minimum {$minPercent}% required for exam card"
                : null,
            'payment_percentage' => $percentage,
            'total_fee' => $totalFee,
            'total_paid' => $totalPaid,
        ];
    }

    /**
     * Attempt to unblock student when payment threshold is met.
     */
    public function attemptUnblock(Student $student): bool
    {
        $status = $this->checkExamCardStatus($student);

        return ! $status['blocked'];
    }

    private function getCurrentAcademicYear(): string
    {
        $year = now()->year;
        $month = now()->month;
        $startYear = $month >= 9 ? $year : $year - 1;
        $endYear = $startYear + 1;

        return "{$startYear}/{$endYear}";
    }
}
