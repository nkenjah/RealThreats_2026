<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['application_id', 'name', 'is_met', 'notes'])]
class ApplicationRequirement extends Model
{
    protected function casts(): array
    {
        return ['is_met' => 'boolean'];
    }

    public function application(): BelongsTo
    {
        return $this->belongsTo(Application::class);
    }
}
