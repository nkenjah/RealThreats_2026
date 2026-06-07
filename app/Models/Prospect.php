<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['first_name', 'last_name', 'email', 'phone', 'high_school', 'gpa', 'entry_term', 'status', 'notes'])]
class Prospect extends Model
{
    public function applications(): HasMany
    {
        return $this->hasMany(Application::class);
    }
}
