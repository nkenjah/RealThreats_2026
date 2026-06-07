<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['user_id', 'ip_address', 'user_agent', 'login_at', 'logout_at', 'duration_minutes'])]
class SessionLog extends Model
{
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
