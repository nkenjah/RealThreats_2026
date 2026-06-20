<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['faculty_staff_id', 'salary_grade_id', 'basic_salary', 'start_date', 'end_date', 'status'])]
class StaffContract extends Model
{
    protected function casts(): array
    {
        return [
            'basic_salary' => 'float',
            'start_date' => 'date',
            'end_date' => 'date',
        ];
    }

    public function facultyStaff(): BelongsTo
    {
        return $this->belongsTo(FacultyStaff::class);
    }

    public function salaryGrade(): BelongsTo
    {
        return $this->belongsTo(SalaryGrade::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
}
