<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $accounts = [
            ['KIUT Super Admin', 'superadmin@kiut.ac.tz', 'superadmin', 'ICT'],
            ['ICT Director', 'ict.director@kiut.ac.tz', 'admin', 'ICT'],
            ['Network Admin', 'network.admin@kiut.ac.tz', 'admin', 'ICT'],
            ['Finance Staff', 'finance.staff@kiut.ac.tz', 'staff', 'Finance'],
            ['Registry Staff', 'registry.staff@kiut.ac.tz', 'staff', 'Registry'],
            ['Academic Staff', 'academic.staff@kiut.ac.tz', 'staff', 'Academic Affairs'],
            ['Library Staff', 'library.staff@kiut.ac.tz', 'staff', 'Library'],
            ['Finance Staff Two', 'finance.staff2@kiut.ac.tz', 'staff', 'Finance'],
            ['Student 001', 'student001@kiut.ac.tz', 'student', null],
            ['Student 002', 'student002@kiut.ac.tz', 'student', null],
            ['Student 003', 'student003@kiut.ac.tz', 'student', null],
        ];

        foreach ($accounts as [$name, $email, $role, $department]) {
            $user = User::updateOrCreate(['email' => $email], [
                'name' => $name,
                'password' => 'password',
                'department_id' => $department ? Department::where('name', $department)->value('id') : null,
                'email_verified_at' => now(),
                'is_active' => true,
                'is_locked' => false,
            ]);
            $user->syncRoles([$role]);
        }
    }
}
