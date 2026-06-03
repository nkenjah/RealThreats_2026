<?php

namespace Database\Seeders;

use App\Models\SystemConfiguration;
use Illuminate\Database\Seeder;

class SystemConfigSeeder extends Seeder
{
    public function run(): void
    {
        $configs = [
            ['max_failed_logins', '5', 'security', 'Failed login attempts before account lock.'],
            ['off_hours_start', '20', 'security', 'Start hour for off-hours access detection.'],
            ['off_hours_end', '6', 'security', 'End hour for off-hours access detection.'],
            ['risk_score_lock_threshold', '75', 'security', 'Risk score threshold for kill switch.'],
            ['max_simultaneous_sessions', '1', 'security', 'Allowed concurrent active sessions.'],
            ['bulk_download_threshold', '10', 'security', 'Bulk access threshold per hour.'],
            ['alert_email_enabled', 'true', 'notifications', 'Send email for high severity alerts.'],
            ['system_name', 'KIUT Threat Monitor', 'general', 'Displayed system name.'],
        ];

        foreach ($configs as [$key, $value, $group, $description]) {
            SystemConfiguration::updateOrCreate(['config_key' => $key], [
                'config_value' => $value,
                'config_group' => $group,
                'description' => $description,
            ]);
        }
    }
}
