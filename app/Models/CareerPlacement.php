<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['alumni_profile_id', 'company_name', 'position', 'start_date', 'end_date', 'is_current'])]
class CareerPlacement extends Model
{
    protected function casts(): array
    {
        return ['is_current' => 'boolean'];
    }

    public function alumniProfile(): BelongsTo
    {
        return $this->belongsTo(AlumniProfile::class);
    }
}
