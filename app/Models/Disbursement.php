<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['scholarship_award_id', 'amount', 'disbursement_date', 'notes'])]
class Disbursement extends Model
{
    public function scholarshipAward(): BelongsTo
    {
        return $this->belongsTo(ScholarshipAward::class);
    }
}
