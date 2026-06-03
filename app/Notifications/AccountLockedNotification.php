<?php

namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AccountLockedNotification extends Notification
{
    use Queueable;

    public function __construct(public User $lockedUser, public string $reason) {}

    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('KIUT Account Locked')
            ->line("Account locked: {$this->lockedUser->name} ({$this->lockedUser->email})")
            ->line("Reason: {$this->reason}");
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'account_locked',
            'locked_user_id' => $this->lockedUser->id,
            'user_name' => $this->lockedUser->name,
            'reason' => $this->reason,
        ];
    }
}
