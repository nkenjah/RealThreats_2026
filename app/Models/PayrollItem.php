<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['payroll_period_id', 'faculty_staff_id', 'basic_salary', 'total_allowances', 'total_deductions', 'tax', 'net_pay', 'status', 'breakdown'])]
class PayrollItem extends Model
{
    protected function casts(): array
    {
        return [
            'basic_salary' => 'float',
            'total_allowances' => 'float',
            'total_deductions' => 'float',
            'tax' => 'float',
            'net_pay' => 'float',
            'breakdown' => 'array',
        ];
    }

    public function period(): BelongsTo
    {
        return $this->belongsTo(PayrollPeriod::class, 'payroll_period_id');
    }

    public function facultyStaff(): BelongsTo
    {
        return $this->belongsTo(FacultyStaff::class);
    }
}
