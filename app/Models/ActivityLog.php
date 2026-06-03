<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

#[Fillable(['log_name', 'description', 'subject_type', 'subject_id', 'event', 'causer_type', 'causer_id', 'attribute_changes', 'properties', 'user_id', 'action', 'module', 'ip_address', 'user_agent', 'risk_score_contribution', 'alert_triggered'])]
class ActivityLog extends Model
{
    protected $table = 'activity_log';

    protected function casts(): array
    {
        return [
            'attribute_changes' => 'array',
            'properties' => 'array',
            'alert_triggered' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function threatAlert(): HasOne
    {
        return $this->hasOne(ThreatAlert::class, 'log_id');
    }
}
