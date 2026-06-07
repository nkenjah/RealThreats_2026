<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['student_id', 'graduation_year', 'current_company', 'job_title', 'industry', 'phone', 'address', 'linkedin_url'])]
class AlumniProfile extends Model
{
    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function careerPlacements(): HasMany
    {
        return $this->hasMany(CareerPlacement::class);
    }

    public function donations(): HasMany
    {
        return $this->hasMany(Donation::class);
    }
}
