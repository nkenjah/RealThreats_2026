<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable(['user_id', 'log_id', 'alert_type', 'severity', 'status', 'auto_mitigated', 'mitigation_action', 'resolved_by', 'resolved_at', 'notes'])]
class ThreatAlert extends Model
{
    use SoftDeletes;

    protected function casts(): array
    {
        return [
            'auto_mitigated' => 'boolean',
            'resolved_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function activityLog(): BelongsTo
    {
        return $this->belongsTo(ActivityLog::class, 'log_id');
    }

    public function resolver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'resolved_by');
    }
}
