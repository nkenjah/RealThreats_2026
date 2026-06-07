<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RolesAndPermissionsSeeder::class,
            DepartmentSeeder::class,
            SystemConfigSeeder::class,
            UniversityCoreSeeder::class,
            UserSeeder::class,
            UserRiskScoreSeeder::class,
            UserSessionsTrackerSeeder::class,
            ActivityLogSeeder::class,
            ThreatAlertSeeder::class,
            ComprehensiveUniversitySeeder::class,
        ]);
    }
}
