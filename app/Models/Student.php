<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphOne;

#[Fillable(['department_id', 'registration_number', 'name', 'email', 'program', 'year_of_study', 'is_active'])]
class Student extends Model
{
    protected function casts(): array
    {
        return ['is_active' => 'boolean'];
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function grades(): HasMany
    {
        return $this->hasMany(Grade::class);
    }

    public function enrollments(): HasMany
    {
        return $this->hasMany(Enrollment::class);
    }

    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class);
    }

    public function libraryBorrowings(): HasMany
    {
        return $this->hasMany(LibraryBorrowing::class);
    }

    public function libraryFines(): HasManyThrough
    {
        return $this->hasManyThrough(LibraryFine::class, LibraryBorrowing::class);
    }

    public function financialAccount(): HasOne
    {
        return $this->hasOne(FinancialAccount::class);
    }

    public function tuitionInvoices(): HasManyThrough
    {
        return $this->hasManyThrough(TuitionInvoice::class, FinancialAccount::class);
    }

    public function payments(): HasManyThrough
    {
        return $this->hasManyThrough(Payment::class, FinancialAccount::class);
    }

    public function wallet(): MorphOne
    {
        return $this->morphOne(Wallet::class, 'walletable');
    }
}
