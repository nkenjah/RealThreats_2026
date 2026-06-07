<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['name', 'code', 'address', 'city', 'is_active'])]
class Campus extends Model
{
    protected function casts(): array
    {
        return ['is_active' => 'boolean'];
    }

    public function buildings(): HasMany
    {
        return $this->hasMany(Building::class);
    }
}
