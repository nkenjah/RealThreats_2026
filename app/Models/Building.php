<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['campus_id', 'name', 'code', 'floors'])]
class Building extends Model
{
    public function campus(): BelongsTo
    {
        return $this->belongsTo(Campus::class);
    }

    public function rooms(): HasMany
    {
        return $this->hasMany(Room::class);
    }
}
