<?php

namespace App\Services;

use App\Models\Student;
use Illuminate\Support\Collection;

class GraduationClearanceService
{
    /**
     * Process graduation clearance for a student across all departments.
     *
     * @return array{cleared: bool, departments: Collection, token: ?string}
     */
    public function processClearance(Student $student): array
    {
        $results = collect([
            'academic' => $this->checkAcademicClearance($student),
            'library' => $this->checkLibraryClearance($student),
            'finance' => $this->checkFinanceClearance($student),
            'sports' => $this->checkSportsClearance($student),
        ]);

        $allCleared = $results->every(fn ($r) => $r['status'] === 'approved');

        return [
            'cleared' => $allCleared,
            'departments' => $results,
            'token' => $allCleared ? $this->generateClearanceToken($student) : null,
        ];
    }

    /**
     * Academic clearance: all courses passed, no outstanding supp/retake.
     */
    public function checkAcademicClearance(Student $student): array
    {
        $failedCourses = $student->grades()
            ->whereIn('grade', ['E', 'F'])
            ->count();

        return [
            'status' => $failedCourses === 0 ? 'approved' : 'rejected',
            'reason' => $failedCourses > 0 ? "{$failedCourses} course(s) not passed" : null,
        ];
    }

    /**
     * Library clearance: no overdue books or unpaid fines.
     */
    public function checkLibraryClearance(Student $student): array
    {
        $overdue = $student->libraryBorrowings()
            ->whereNull('returned_at')
            ->where('due_at', '<', now())
            ->count();

        $unpaidFines = $student->libraryFines()
            ->where('is_paid', false)
            ->count();

        $issues = [];
        if ($overdue > 0) {
            $issues[] = "{$overdue} overdue book(s)";
        }
        if ($unpaidFines > 0) {
            $issues[] = "{$unpaidFines} unpaid fine(s)";
        }

        return [
            'status' => empty($issues) ? 'approved' : 'rejected',
            'reason' => ! empty($issues) ? implode(', ', $issues) : null,
        ];
    }

    /**
     * Finance clearance: no outstanding fees.
     */
    public function checkFinanceClearance(Student $student): array
    {
        $outstanding = $student->tuitionInvoices()
            ->where('status', 'awaiting_payment')
            ->sum('total_amount');

        return [
            'status' => $outstanding <= 0 ? 'approved' : 'rejected',
            'reason' => $outstanding > 0 ? 'Outstanding balance: TZS '.number_format($outstanding, 0) : null,
        ];
    }

    /**
     * Sports clearance placeholder.
     */
    public function checkSportsClearance(Student $student): array
    {
        return [
            'status' => 'approved',
            'reason' => null,
        ];
    }

    /**
     * Generate a cryptographically signed clearance token with QR data.
     */
    private function generateClearanceToken(Student $student): string
    {
        $payload = json_encode([
            'reg' => $student->registration_number,
            'name' => $student->name,
            'ts' => now()->toISOString(),
        ]);

        $hash = hash_hmac('sha256', $payload, config('app.key'));

        return base64_encode("{$payload}|{$hash}");
    }

    /**
     * Verify a clearance token.
     */
    public function verifyClearanceToken(string $token): ?array
    {
        $decoded = base64_decode($token);
        $parts = explode('|', $decoded, 2);

        if (count($parts) !== 2) {
            return null;
        }

        [$payload, $hash] = $parts;
        $expectedHash = hash_hmac('sha256', $payload, config('app.key'));

        if (! hash_equals($expectedHash, $hash)) {
            return null;
        }

        return json_decode($payload, true);
    }
}
