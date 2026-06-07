<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['room_id', 'item_name', 'quantity', 'condition'])]
class RoomInventory extends Model
{
    protected $table = 'room_inventory';

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }
}
