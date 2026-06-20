<?php

namespace App\Events;

use App\Models\Grade;
use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class GradeSubmittedEvent implements ShouldBroadcast
{
    use Dispatchable, SerializesModels;

    public function __construct(public Grade $grade) {}

    public function broadcastOn(): Channel
    {
        return new Channel('admin-alerts');
    }

    public function broadcastWith(): array
    {
        $this->grade->loadMissing(['student', 'courseOffering.course']);

        return [
            'grade_id' => $this->grade->id,
            'student_name' => $this->grade->student?->name,
            'course_name' => $this->grade->courseOffering?->course?->name,
            'grade' => $this->grade->grade,
            'status' => 'submitted',
            'timestamp' => now()->toIso8601String(),
        ];
    }
}
