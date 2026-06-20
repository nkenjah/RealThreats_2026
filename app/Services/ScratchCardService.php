<?php

namespace App\Services;

use App\Models\ScratchCard;
use Illuminate\Support\Str;

class ScratchCardService
{
    public function generate(int $count, float $value, ?string $expiresAt = null): array
    {
        $cards = [];
        for ($i = 0; $i < $count; $i++) {
            $cards[] = ScratchCard::create([
                'pin' => $this->generatePin(),
                'serial_number' => $this->generateSerial(),
                'value' => $value,
                'issued_by' => auth()->id(),
                'expires_at' => $expiresAt,
            ]);
        }

        return $cards;
    }

    public function redeem(string $pin, int $userId): ?ScratchCard
    {
        $card = ScratchCard::where('pin', $pin)->active()->first();
        if (! $card) {
            return null;
        }

        $card->update([
            'status' => 'used',
            'used_by' => $userId,
            'used_at' => now(),
        ]);

        return $card;
    }

    public function revoke(ScratchCard $card): void
    {
        $card->update(['status' => 'revoked']);
    }

    private function generatePin(): string
    {
        do {
            $pin = strtoupper(Str::random(4)).'-'.strtoupper(Str::random(4)).'-'.strtoupper(Str::random(4));
        } while (ScratchCard::where('pin', $pin)->exists());

        return $pin;
    }

    private function generateSerial(): string
    {
        return 'SCR-'.now()->format('Ymd').'-'.strtoupper(Str::random(8));
    }
}
