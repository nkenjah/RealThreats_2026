<?php

namespace App\Services;

use App\Models\FacultyStaff;
use App\Models\LeaveBalance;
use App\Models\LeaveRequest;
use Illuminate\Support\Facades\DB;

class LeaveService
{
    public function getOrCreateBalance(FacultyStaff $staff, int $year): LeaveBalance
    {
        return LeaveBalance::firstOrCreate(
            ['faculty_staff_id' => $staff->id, 'year' => $year],
            ['annual_entitled' => 28, 'sick_entitled' => 14, 'study_entitled' => 10],
        );
    }

    public function requestLeave(FacultyStaff $staff, string $type, string $startDate, string $endDate, int $days, ?string $reason = null): LeaveRequest
    {
        $leaveRequest = LeaveRequest::create([
            'faculty_staff_id' => $staff->id,
            'type' => $type,
            'start_date' => $startDate,
            'end_date' => $endDate,
            'days' => $days,
            'reason' => $reason,
            'status' => 'pending',
        ]);

        return $leaveRequest;
    }

    public function approve(LeaveRequest $leaveRequest): LeaveRequest
    {
        return DB::transaction(function () use ($leaveRequest) {
            $leaveRequest->update([
                'status' => 'approved',
                'approved_by' => auth()->id(),
                'approved_at' => now(),
            ]);

            $balance = $this->getOrCreateBalance(
                $leaveRequest->facultyStaff,
                $leaveRequest->start_date->year,
            );

            $field = match ($leaveRequest->type) {
                'annual' => 'annual_taken',
                'sick' => 'sick_taken',
                'study' => 'study_taken',
                'compassionate' => 'compassionate_taken',
                default => 'annual_taken',
            };

            $balance->increment($field, $leaveRequest->days);

            return $leaveRequest->fresh();
        });
    }

    public function reject(LeaveRequest $leaveRequest, string $reason): LeaveRequest
    {
        $leaveRequest->update([
            'status' => 'rejected',
            'approved_by' => auth()->id(),
            'approved_at' => now(),
            'rejection_reason' => $reason,
        ]);

        return $leaveRequest->fresh();
    }
}
