<?php

namespace App\Notifications;

use App\Models\Grade;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

class GradeApprovedNotification extends Notification
{
    use Queueable;

    public function __construct(
        public Grade $grade,
    ) {}

    public function via(object $notifiable): array
    {
        return ['database', 'broadcast'];
    }

    public function toDatabase(object $notifiable): array
    {
        return [
            'type' => 'grade_approved',
            'grade_id' => $this->grade->id,
            'student_name' => $this->grade->student?->name ?? 'Unknown',
            'course_name' => $this->grade->courseOffering?->course?->name ?? 'Unknown',
            'grade' => $this->grade->grade,
            'approved_by' => auth()->user()?->name ?? 'System',
            'message' => "Grade {$this->grade->grade} for {$this->grade->student?->name} has been approved.",
        ];
    }

    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'type' => 'grade_approved',
            'grade_id' => $this->grade->id,
            'message' => "Grade approved: {$this->grade->student?->name} - {$this->grade->grade}",
        ]);
    }
}
