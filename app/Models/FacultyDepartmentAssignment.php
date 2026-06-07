<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['faculty_staff_id', 'department_id', 'is_primary', 'assigned_at'])]
class FacultyDepartmentAssignment extends Model
{
    protected function casts(): array
    {
        return ['is_primary' => 'boolean'];
    }

    public function facultyStaff(): BelongsTo
    {
        return $this->belongsTo(FacultyStaff::class);
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }
}
