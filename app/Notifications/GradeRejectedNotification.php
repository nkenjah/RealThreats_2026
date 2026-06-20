<?php

namespace App\Notifications;

use App\Models\Grade;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

class GradeRejectedNotification extends Notification
{
    use Queueable;

    public function __construct(
        public Grade $grade,
        public string $reason,
    ) {}

    public function via(object $notifiable): array
    {
        return ['database', 'broadcast'];
    }

    public function toDatabase(object $notifiable): array
    {
        return [
            'type' => 'grade_rejected',
            'grade_id' => $this->grade->id,
            'student_name' => $this->grade->student?->name ?? 'Unknown',
            'course_name' => $this->grade->courseOffering?->course?->name ?? 'Unknown',
            'grade' => $this->grade->grade,
            'reason' => $this->reason,
            'rejected_by' => auth()->user()?->name ?? 'System',
            'message' => "Grade for {$this->grade->student?->name} was rejected. Reason: {$this->reason}",
        ];
    }

    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'type' => 'grade_rejected',
            'grade_id' => $this->grade->id,
            'message' => "Grade rejected: {$this->grade->student?->name}",
        ]);
    }
}
