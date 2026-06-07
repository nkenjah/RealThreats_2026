<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['application_id', 'offer_date', 'decision_deadline', 'tuition_fee', 'status', 'responded_at'])]
class AdmissionOffer extends Model
{
    public function application(): BelongsTo
    {
        return $this->belongsTo(Application::class);
    }
}
