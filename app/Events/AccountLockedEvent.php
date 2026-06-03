<?php

namespace App\Events;

use App\Models\User;
use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AccountLockedEvent implements ShouldBroadcast
{
    use Dispatchable, SerializesModels;

    public function __construct(public User $user, public string $reason) {}

    public function broadcastOn(): Channel
    {
        return new Channel('admin-alerts');
    }

    public function broadcastWith(): array
    {
        return [
            'user_id' => $this->user->id,
            'user_name' => $this->user->name,
            'user_email' => $this->user->email,
            'reason' => $this->reason,
            'locked_at' => $this->user->locked_at?->toIso8601String() ?? now()->toIso8601String(),
        ];
    }
}
