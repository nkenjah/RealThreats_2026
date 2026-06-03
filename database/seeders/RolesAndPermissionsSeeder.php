<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        app(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();

        $permissions = [
            'view_threats', 'resolve_threats', 'manage_users', 'view_logs',
            'export_reports', 'manage_config', 'lock_accounts', 'view_dashboard',
            'view_risk_scores', 'manage_departments',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        $superadmin = Role::firstOrCreate(['name' => 'superadmin', 'guard_name' => 'web']);
        $admin = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $staff = Role::firstOrCreate(['name' => 'staff', 'guard_name' => 'web']);
        $student = Role::firstOrCreate(['name' => 'student', 'guard_name' => 'web']);

        $superadmin->syncPermissions($permissions);
        $admin->syncPermissions(array_values(array_diff($permissions, ['manage_config'])));
        $staff->syncPermissions(['view_logs', 'view_dashboard']);
        $student->syncPermissions(['view_dashboard']);
    }
}
