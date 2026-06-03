<?php

namespace Database\Seeders;

use App\Models\ActivityLog;
use App\Models\ThreatAlert;
use App\Models\User;
use Illuminate\Database\Seeder;

class ThreatAlertSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();
        $types = ['failed_login', 'unauthorized_access', 'off_hours_access', 'data_exfiltration', 'privilege_escalation', 'simultaneous_login'];
        $severities = ['low', 'medium', 'high', 'critical'];
        $statuses = ['open', 'investigating', 'resolved', 'false_positive'];

        $alertData = [
            ['type' => 'failed_login', 'sev' => 'high', 'status' => 'open', 'notes' => 'Multiple failed login attempts detected from unknown IP.'],
            ['type' => 'failed_login', 'sev' => 'critical', 'status' => 'open', 'notes' => 'Account lock triggered after 5 consecutive failed logins.'],
            ['type' => 'failed_login', 'sev' => 'medium', 'status' => 'resolved', 'notes' => 'Failed login from unrecognized device, user confirmed.'],
            ['type' => 'unauthorized_access', 'sev' => 'high', 'status' => 'investigating', 'notes' => 'Attempted access to restricted system configuration module.'],
            ['type' => 'unauthorized_access', 'sev' => 'medium', 'status' => 'false_positive', 'notes' => 'Staff member accidentally clicked admin link.'],
            ['type' => 'unauthorized_access', 'sev' => 'critical', 'status' => 'open', 'notes' => 'Privilege escalation attempt detected via URL manipulation.'],
            ['type' => 'off_hours_access', 'sev' => 'medium', 'status' => 'open', 'notes' => 'User authenticated at 2:30 AM from off-campus location.'],
            ['type' => 'off_hours_access', 'sev' => 'low', 'status' => 'resolved', 'notes' => 'Scheduled maintenance window, access was authorized.'],
            ['type' => 'off_hours_access', 'sev' => 'high', 'status' => 'investigating', 'notes' => 'Multiple off-hours logins over 3 consecutive nights.'],
            ['type' => 'data_exfiltration', 'sev' => 'critical', 'status' => 'open', 'notes' => 'Bulk export of 250+ student records in under 5 minutes.'],
            ['type' => 'data_exfiltration', 'sev' => 'high', 'status' => 'investigating', 'notes' => 'Unusual download pattern detected on exam database.'],
            ['type' => 'data_exfiltration', 'sev' => 'medium', 'status' => 'open', 'notes' => 'Large CSV export triggered alert threshold.'],
            ['type' => 'data_exfiltration', 'sev' => 'critical', 'status' => 'resolved', 'notes' => 'Confirmed data scraping attempt, IP blocked.'],
            ['type' => 'privilege_escalation', 'sev' => 'critical', 'status' => 'open', 'notes' => 'User attempted to modify role assignments directly via API.'],
            ['type' => 'privilege_escalation', 'sev' => 'high', 'status' => 'investigating', 'notes' => 'Suspicious admin-level API call from non-admin account.'],
            ['type' => 'privilege_escalation', 'sev' => 'critical', 'status' => 'open', 'notes' => 'Kill switch activated — auto lockdown triggered by risk score.'],
            ['type' => 'simultaneous_login', 'sev' => 'high', 'status' => 'open', 'notes' => 'User session detected from two different IP addresses simultaneously.'],
            ['type' => 'simultaneous_login', 'sev' => 'medium', 'status' => 'resolved', 'notes' => 'VPN IP change caused false positive for simultaneous login.'],
            ['type' => 'simultaneous_login', 'sev' => 'critical', 'status' => 'open', 'notes' => 'Active sessions detected from 4 different geographic locations.'],
            ['type' => 'failed_login', 'sev' => 'low', 'status' => 'false_positive', 'notes' => 'User forgot password, reset successfully completed.'],
            ['type' => 'off_hours_access', 'sev' => 'medium', 'status' => 'open', 'notes' => 'Access at 11:15 PM from library workstation.'],
            ['type' => 'data_exfiltration', 'sev' => 'high', 'status' => 'open', 'notes' => 'Financial data export detected during non-business hours.'],
            ['type' => 'unauthorized_access', 'sev' => 'low', 'status' => 'resolved', 'notes' => 'Attempted old URL that was moved, harmless.'],
            ['type' => 'failed_login', 'sev' => 'medium', 'status' => 'open', 'notes' => 'Failed login from international IP address (Nigeria).'],
            ['type' => 'privilege_escalation', 'sev' => 'high', 'status' => 'open', 'notes' => 'Unauthorized access to exam grading module detected.'],
        ];

        $logs = ActivityLog::whereIn('action', ['failed_login', 'unauthorized_access', 'off_hours_access', 'data_export', 'bulk_download'])->get();

        foreach ($alertData as $i => $data) {
            $user = $users->random();
            $log = $logs->where('user_id', $user->id)->first() ?? $logs->first();

            ThreatAlert::create([
                'user_id' => $user->id,
                'log_id' => $log?->id,
                'alert_type' => $data['type'],
                'severity' => $data['sev'],
                'status' => $data['status'],
                'auto_mitigated' => $data['sev'] === 'critical' && rand(0, 1) === 0,
                'mitigation_action' => $data['sev'] === 'critical' ? 'account_locked_kill_switch' : null,
                'resolved_by' => in_array($data['status'], ['resolved', 'false_positive']) ? $users->where('id', '!=', $user->id)->first()?->id : null,
                'resolved_at' => in_array($data['status'], ['resolved', 'false_positive']) ? now()->subHours(rand(1, 72)) : null,
                'notes' => $data['notes'],
                'created_at' => now()->subDays(rand(0, 30))->subHours(rand(0, 23)),
                'updated_at' => now()->subDays(rand(0, 30))->subHours(rand(0, 23)),
            ]);
        }
    }
}
