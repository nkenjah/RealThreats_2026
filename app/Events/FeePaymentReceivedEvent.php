<?php

namespace App\Events;

use App\Models\Payment;
use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class FeePaymentReceivedEvent implements ShouldBroadcast
{
    use Dispatchable, SerializesModels;

    public function __construct(public Payment $payment) {}

    public function broadcastOn(): Channel
    {
        return new Channel('admin-alerts');
    }

    public function broadcastWith(): array
    {
        $this->payment->loadMissing('student');

        return [
            'payment_id' => $this->payment->id,
            'student_name' => $this->payment->student?->name,
            'amount' => $this->payment->amount,
            'payment_method' => $this->payment->payment_method,
            'timestamp' => now()->toIso8601String(),
        ];
    }
}
