<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['building_id', 'room_number', 'room_type', 'capacity', 'is_lab'])]
class Room extends Model
{
    protected function casts(): array
    {
        return ['is_lab' => 'boolean'];
    }

    public function building(): BelongsTo
    {
        return $this->belongsTo(Building::class);
    }

    public function roomInventory(): HasMany
    {
        return $this->hasMany(RoomInventory::class);
    }
}
