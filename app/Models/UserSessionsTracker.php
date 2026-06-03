<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['user_id', 'session_id', 'ip_address', 'user_agent', 'location', 'login_at', 'logout_at', 'is_active', 'was_force_terminated'])]
class UserSessionsTracker extends Model
{
    protected $table = 'user_sessions_tracker';

    protected function casts(): array
    {
        return [
            'login_at' => 'datetime',
            'logout_at' => 'datetime',
            'is_active' => 'boolean',
            'was_force_terminated' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
