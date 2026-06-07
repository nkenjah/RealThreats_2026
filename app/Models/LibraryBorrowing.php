<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

#[Fillable(['library_book_id', 'student_id', 'borrowed_at', 'due_at', 'returned_at', 'status'])]
class LibraryBorrowing extends Model
{
    public function libraryBook(): BelongsTo
    {
        return $this->belongsTo(LibraryBook::class);
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function libraryFine(): HasOne
    {
        return $this->hasOne(LibraryFine::class);
    }
}
