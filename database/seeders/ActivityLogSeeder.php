<?php

namespace Database\Seeders;

use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Database\Seeder;

class ActivityLogSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();
        $templates = [
            ['action' => 'page_visit', 'risk' => 0, 'module' => 'dashboard', 'desc' => 'View dashboard page'],
            ['action' => 'page_visit', 'risk' => 0, 'module' => 'users', 'desc' => 'View users list'],
            ['action' => 'page_visit', 'risk' => 0, 'module' => 'threats', 'desc' => 'View threat alerts'],
            ['action' => 'page_visit', 'risk' => 0, 'module' => 'reports', 'desc' => 'View reports page'],
            ['action' => 'page_visit', 'risk' => 0, 'module' => 'activity-logs', 'desc' => 'View activity logs'],
            ['action' => 'create', 'risk' => 2, 'module' => 'users', 'desc' => 'Created new user record'],
            ['action' => 'update', 'risk' => 2, 'module' => 'users', 'desc' => 'Updated user profile'],
            ['action' => 'data_export', 'risk' => 30, 'module' => 'reports', 'desc' => 'Exported CSV threat report'],
            ['action' => 'unauthorized_access', 'risk' => 20, 'module' => 'admin', 'desc' => 'Attempted unauthorized route access'],
            ['action' => 'unauthorized_access', 'risk' => 20, 'module' => 'system-config', 'desc' => 'Attempted to access system configuration'],
            ['action' => 'off_hours_access', 'risk' => 10, 'module' => 'auth', 'desc' => 'Authenticated during off-hours (2:30 AM)'],
            ['action' => 'off_hours_access', 'risk' => 10, 'module' => 'auth', 'desc' => 'Authenticated during off-hours (11:45 PM)'],
            ['action' => 'bulk_download', 'risk' => 30, 'module' => 'reports', 'desc' => 'Downloaded bulk student records'],
            ['action' => 'bulk_download', 'risk' => 30, 'module' => 'exams', 'desc' => 'Bulk exam data export detected'],
            ['action' => 'failed_login', 'risk' => 15, 'module' => 'auth', 'desc' => 'Failed login attempt'],
        ];

        foreach ($users as $user) {
            $count = rand(2, 8);
            for ($i = 0; $i < $count; $i++) {
                $template = $templates[array_rand($templates)];
                $hoursAgo = rand(0, 168);

                ActivityLog::create([
                    'log_name' => 'security',
                    'user_id' => $user->id,
                    'action' => $template['action'],
                    'module' => $template['module'],
                    'description' => $template['desc'],
                    'ip_address' => long2ip(rand(16777216, 33445532)),
                    'user_agent' => 'Mozilla/5.0 (X11; Linux x86_64)',
                    'risk_score_contribution' => $template['risk'],
                    'alert_triggered' => false,
                    'event' => $template['action'],
                    'created_at' => now()->subHours($hoursAgo),
                    'updated_at' => now()->subHours($hoursAgo),
                ]);
            }
        }
    }
}
