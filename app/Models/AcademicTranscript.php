<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

#[Fillable(['student_id', 'program_id', 'total_credits_earned', 'cumulative_gpa', 'generated_at', 'verification_hash', 'status'])]
class AcademicTranscript extends Model
{
    protected static function booted(): void
    {
        static::creating(function (self $transcript) {
            if (! $transcript->verification_hash) {
                $transcript->verification_hash = Str::random(32);
            }
            if (! $transcript->status) {
                $transcript->status = 'pending';
            }
        });
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function program(): BelongsTo
    {
        return $this->belongsTo(Program::class);
    }

    public function getVerificationUrl(): string
    {
        return route('verify.transcript', ['hash' => $this->verification_hash]);
    }
}
