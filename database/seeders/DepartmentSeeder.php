<?php

namespace Database\Seeders;

use App\Models\Department;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    public function run(): void
    {
        foreach ([
            ['ICT', 'high'],
            ['Finance', 'high'],
            ['Registry', 'medium'],
            ['Academic Affairs', 'medium'],
            ['Library', 'low'],
        ] as [$name, $level]) {
            Department::updateOrCreate(['name' => $name], ['risk_policy_level' => $level]);
        }
    }
}
