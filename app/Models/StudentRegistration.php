<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['student_id', 'academic_year', 'semester', 'registration_date', 'status'])]
class StudentRegistration extends Model
{
    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }
}
