<?php

namespace App\Events;

use App\Models\User;
use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SuspiciousLoginEvent implements ShouldBroadcast
{
    use Dispatchable, SerializesModels;

    public function __construct(public User $user, public string $ipAddress, public string $reason) {}

    public function broadcastOn(): Channel
    {
        return new Channel('admin-alerts');
    }

    public function broadcastWith(): array
    {
        return [
            'user_id' => $this->user->id,
            'ip_address' => $this->ipAddress,
            'reason' => $this->reason,
            'timestamp' => now()->toIso8601String(),
        ];
    }
}
