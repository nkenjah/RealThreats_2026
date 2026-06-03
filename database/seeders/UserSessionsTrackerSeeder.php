<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\UserSessionsTracker;
use Illuminate\Database\Seeder;

class UserSessionsTrackerSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();

        foreach ($users as $user) {
            $count = rand(1, 4);
            for ($i = 0; $i < $count; $i++) {
                $loginAt = now()->subDays(rand(0, 14))->subHours(rand(0, 23));
                $isOffHours = $loginAt->hour >= 22 || $loginAt->hour <= 4;
                $duration = rand(10, 480);

                UserSessionsTracker::create([
                    'user_id' => $user->id,
                    'session_id' => bin2hex(random_bytes(16)),
                    'ip_address' => long2ip(rand(16777216, 33445532)),
                    'user_agent' => 'Mozilla/5.0 ('.['X11; Linux x86_64', 'Macintosh; Intel Mac OS X 10_15_7', 'Windows NT 10.0; Win64; x64'][array_rand(['X11; Linux x86_64', 'Macintosh; Intel Mac OS X 10_15_7', 'Windows NT 10.0; Win64; x64'])].')',
                    'location' => ['Dar es Salaam', 'Mwanza', 'Arusha', 'Dodoma', 'Mbeya', 'Zanzibar'][array_rand(['Dar es Salaam', 'Mwanza', 'Arusha', 'Dodoma', 'Mbeya', 'Zanzibar'])],
                    'login_at' => $loginAt,
                    'logout_at' => $isOffHours ? null : $loginAt->copy()->addMinutes($duration),
                    'is_active' => $i === 0,
                    'was_force_terminated' => $isOffHours && rand(0, 3) === 0,
                ]);
            }
        }
    }
}
