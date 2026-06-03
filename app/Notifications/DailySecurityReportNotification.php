<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class DailySecurityReportNotification extends Notification
{
    use Queueable;

    public function __construct(public array $stats) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('KIUT Daily Security Report')
            ->line('Active threats: '.$this->stats['active_threats_count'])
            ->line('Locked users: '.$this->stats['locked_users_count'])
            ->line('Today alerts: '.$this->stats['todays_alerts_count'])
            ->line('High risk users: '.$this->stats['high_risk_users_count']);
    }
}
