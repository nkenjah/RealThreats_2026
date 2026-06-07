<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['isbn', 'title', 'author', 'publisher', 'category', 'total_copies', 'available_copies', 'shelf_location'])]
class LibraryBook extends Model
{
    public function libraryBorrowings(): HasMany
    {
        return $this->hasMany(LibraryBorrowing::class);
    }
}
