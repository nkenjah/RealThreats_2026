<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['grade', 'basic_salary', 'allowances', 'description'])]
class SalaryGrade extends Model
{
    protected function casts(): array
    {
        return [
            'basic_salary' => 'float',
            'allowances' => 'array',
        ];
    }

    public function contracts(): HasMany
    {
        return $this->hasMany(StaffContract::class);
    }

    public function getAllowanceTotal(): float
    {
        return collect($this->allowances ?? [])->sum('amount');
    }
}
