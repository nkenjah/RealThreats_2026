<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SemesterStatusChangedEvent implements ShouldBroadcast
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public string $status,
        public string $semester,
        public string $academicYear,
    ) {}

    public function broadcastOn(): Channel
    {
        return new Channel('admin-alerts');
    }

    public function broadcastWith(): array
    {
        return [
            'status' => $this->status,
            'semester' => $this->semester,
            'academic_year' => $this->academicYear,
            'timestamp' => now()->toIso8601String(),
        ];
    }
}
