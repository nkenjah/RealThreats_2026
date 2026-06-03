<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\UserRiskScore;
use Illuminate\Database\Seeder;

class UserRiskScoreSeeder extends Seeder
{
    public function run(): void
    {
        $scores = [
            'superadmin@kiut.ac.tz' => 3,
            'ict.director@kiut.ac.tz' => 9,
            'network.admin@kiut.ac.tz' => 14,
            'finance.staff@kiut.ac.tz' => 22,
            'registry.staff@kiut.ac.tz' => 38,
            'academic.staff@kiut.ac.tz' => 62,
            'library.staff@kiut.ac.tz' => 44,
            'finance.staff2@kiut.ac.tz' => 78,
            'student001@kiut.ac.tz' => 8,
            'student002@kiut.ac.tz' => 18,
            'student003@kiut.ac.tz' => 28,
        ];

        foreach ($scores as $email => $score) {
            $user = User::where('email', $email)->first();
            UserRiskScore::updateOrCreate(['user_id' => $user->id], [
                'current_score' => $score,
                'score_history' => [
                    ['score' => max(0, $score - 12), 'timestamp' => now()->subHours(8)->toIso8601String()],
                    ['score' => $score, 'timestamp' => now()->toIso8601String()],
                ],
                'last_calculated_at' => now(),
            ]);

            if ($score >= 75) {
                $user->update(['is_locked' => true, 'locked_at' => now(), 'lock_reason' => 'Seeded critical risk profile for demonstration.']);
            }
        }
    }
}
