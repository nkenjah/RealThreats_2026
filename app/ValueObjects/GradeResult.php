<?php

namespace App\ValueObjects;

class GradeResult
{
    public function __construct(
        public readonly float $totalScore,
        public readonly string $gradeLetter,
        public readonly float $gpaPoints,
        public readonly string $status,
        public readonly ?float $suppScore = null,
    ) {}

    public function isPass(): bool
    {
        return $this->status === 'pass';
    }

    public function isSupplementary(): bool
    {
        return $this->status === 'supp';
    }

    public function isRetake(): bool
    {
        return $this->status === 'retake';
    }
}
