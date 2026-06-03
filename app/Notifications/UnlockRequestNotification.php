<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class UnlockRequestNotification extends Notification
{
    use Queueable;

    public function __construct(public ?string $email, public ?string $reason) {}

    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('KIUT Account Unlock Request')
            ->line('Unlock requested by: '.($this->email ?: 'unknown user'))
            ->line('Reason: '.($this->reason ?: 'No reason provided.'));
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'unlock_request',
            'email' => $this->email,
            'reason' => $this->reason,
        ];
    }
}
