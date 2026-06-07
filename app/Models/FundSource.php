<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['name', 'description', 'total_fund', 'remaining_balance', 'is_active'])]
class FundSource extends Model
{
    protected function casts(): array
    {
        return ['is_active' => 'boolean'];
    }

    public function scholarshipAwards(): HasMany
    {
        return $this->hasMany(ScholarshipAward::class);
    }
}
