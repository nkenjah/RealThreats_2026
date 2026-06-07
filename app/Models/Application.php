<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

#[Fillable(['prospect_id', 'program_id', 'submission_date', 'status', 'assigned_reviewer_id', 'reviewed_at', 'review_notes'])]
class Application extends Model
{
    public function prospect(): BelongsTo
    {
        return $this->belongsTo(Prospect::class);
    }

    public function program(): BelongsTo
    {
        return $this->belongsTo(Program::class);
    }

    public function assignedReviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_reviewer_id');
    }

    public function applicationRequirements(): HasMany
    {
        return $this->hasMany(ApplicationRequirement::class);
    }

    public function admissionOffer(): HasOne
    {
        return $this->hasOne(AdmissionOffer::class);
    }
}
