<?php

namespace App\Notifications;

use App\Models\ThreatAlert;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ThreatAlertNotification extends Notification
{
    use Queueable;

    public function __construct(public ThreatAlert $alert) {}

    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $this->alert->loadMissing('user');

        return (new MailMessage)
            ->subject('KIUT Threat Alert: '.strtoupper($this->alert->severity))
            ->view('mail.threat-alert', ['alert' => $this->alert]);
    }

    public function toArray(object $notifiable): array
    {
        $this->alert->loadMissing('user');

        return [
            'type' => 'threat_alert',
            'threat_id' => $this->alert->id,
            'severity' => $this->alert->severity,
            'user_name' => $this->alert->user?->name,
            'alert_type' => $this->alert->alert_type,
        ];
    }
}
