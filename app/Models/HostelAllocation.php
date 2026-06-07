<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['hostel_id', 'student_id', 'room_number', 'allocated_at', 'vacated_at', 'status'])]
class HostelAllocation extends Model
{
    public function hostel(): BelongsTo
    {
        return $this->belongsTo(Hostel::class);
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }
}
