<?php

namespace App\Notifications;

use App\Models\Grade;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

class GradeSubmittedNotification extends Notification
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
            'type' => 'grade_submitted',
            'grade_id' => $this->grade->id,
            'student_name' => $this->grade->student?->name ?? 'Unknown',
            'course_name' => $this->grade->courseOffering?->course?->name ?? 'Unknown',
            'grade' => $this->grade->grade,
            'submitted_by' => auth()->user()?->name ?? 'System',
            'message' => "Grade {$this->grade->grade} for {$this->grade->student?->name} in {$this->grade->courseOffering?->course?->name} submitted for approval.",
        ];
    }

    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'type' => 'grade_submitted',
            'grade_id' => $this->grade->id,
            'message' => "New grade submitted for approval: {$this->grade->student?->name}",
        ]);
    }
}
