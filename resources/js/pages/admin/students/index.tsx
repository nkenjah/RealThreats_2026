import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Plus, LayoutGrid, Table2 } from 'lucide-react';
import { useState } from 'react';
import DataTable from '@/components/shared/DataTable';
import { StudentDashboard } from '@/components/students/student-dashboard';
import type { Student, Department } from '@/types';

interface Props {
    students: any;
    filters: Record<string, string | undefined>;
    departments: Department[];
    programs: string[];
    stats?: {
        total: number;
        active: number;
        by_department: { name: string; count: number }[];
        by_year: { year: number; count: number }[];
    };
}

export default function StudentsIndex({
    students,
    filters,
    departments,
    programs,
    stats,
}: Props) {
    const [view, setView] = useState<'table' | 'dashboard'>('table');

    const columns = [
        {
            key: 'registration_number',
            label: 'Reg. Number',
            render: (student: Student) => (
                <Link
                    href={`/admin/students/${student.id}`}
                    className="font-mono font-medium hover:underline"
                >
                    {student.registration_number}
                </Link>
            ),
        },
        { key: 'name', label: 'Name' },
        {
            key: 'department',
            label: 'Department',
            render: (student: Student) =>
                student.department?.name ?? (
                    <span className="text-muted-foreground">N/A</span>
                ),
        },
        { key: 'program', label: 'Program' },
        { key: 'year_of_study', label: 'Year' },
        {
            key: 'is_active',
            label: 'Status',
            render: (student: Student) =>
                student.is_active ? (
                    <span className="text-green-500">Active</span>
                ) : (
                    <span className="text-muted-foreground">Inactive</span>
                ),
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (student: Student) => (
                <div className="flex gap-1">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/students/${student.id}`}>View</Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/students/${student.id}/edit`}>
                            Edit
                        </Link>
                    </Button>
                </div>
            ),
        },
    ];

    const filterFields = (
        <>
            <select
                name="department_id"
                defaultValue={filters.department_id ?? ''}
                className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm"
                onChange={(e) => {
                    const url = new URL(window.location.href);
                    if (e.target.value)
                        url.searchParams.set('department_id', e.target.value);
                    else url.searchParams.delete('department_id');
                    url.searchParams.set('page', '1');
                    window.location.href = url.toString();
                }}
            >
                <option value="">All Departments</option>
                {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                        {d.name}
                    </option>
                ))}
            </select>
            <select
                name="program"
                defaultValue={filters.program ?? ''}
                className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm"
                onChange={(e) => {
                    const url = new URL(window.location.href);
                    if (e.target.value)
                        url.searchParams.set('program', e.target.value);
                    else url.searchParams.delete('program');
                    url.searchParams.set('page', '1');
                    window.location.href = url.toString();
                }}
            >
                <option value="">All Programs</option>
                {programs.map((p) => (
                    <option key={p} value={p}>
                        {p}
                    </option>
                ))}
            </select>
        </>
    );

    return (
        <>
            <Head title="Students" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Students</h1>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center rounded-lg border p-0.5">
                            <Button
                                variant={
                                    view === 'dashboard' ? 'secondary' : 'ghost'
                                }
                                size="sm"
                                onClick={() => setView('dashboard')}
                                className="h-7 px-2"
                            >
                                <LayoutGrid className="size-4" />
                            </Button>
                            <Button
                                variant={
                                    view === 'table' ? 'secondary' : 'ghost'
                                }
                                size="sm"
                                onClick={() => setView('table')}
                                className="h-7 px-2"
                            >
                                <Table2 className="size-4" />
                            </Button>
                        </div>
                        <Button asChild>
                            <Link href="/admin/students/create">
                                <Plus className="mr-2 h-4 w-4" /> Create Student
                            </Link>
                        </Button>
                    </div>
                </div>
                {view === 'dashboard' && stats ? (
                    <StudentDashboard
                        total_students={stats.total}
                        active_students={stats.active}
                        departments_count={stats.by_department.length}
                        by_department={stats.by_department}
                        by_year={stats.by_year}
                    />
                ) : (
                    <DataTable
                        data={students}
                        columns={columns}
                        filters={filters}
                        searchPlaceholder="Search by name, reg number, or email..."
                        filterFields={filterFields}
                    />
                )}
            </div>
        </>
    );
}

StudentsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Students', href: '/admin/students' },
    ],
};
