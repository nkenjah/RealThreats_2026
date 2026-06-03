<?php

namespace App\Events;

use App\Models\ThreatAlert;
use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ThreatDetectedEvent implements ShouldBroadcast
{
    use Dispatchable, SerializesModels;

    public function __construct(public ThreatAlert $threat) {}

    public function broadcastOn(): Channel
    {
        return new Channel('threats');
    }

    public function broadcastWith(): array
    {
        $this->threat->loadMissing('user');

        return [
            'threat_id' => $this->threat->id,
            'user_name' => $this->threat->user?->name,
            'alert_type' => $this->threat->alert_type,
            'severity' => $this->threat->severity,
            'timestamp' => $this->threat->created_at?->toIso8601String(),
        ];
    }
}
