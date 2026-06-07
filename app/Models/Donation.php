<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['alumni_profile_id', 'amount', 'donation_date', 'purpose'])]
class Donation extends Model
{
    public function alumniProfile(): BelongsTo
    {
        return $this->belongsTo(AlumniProfile::class);
    }
}
