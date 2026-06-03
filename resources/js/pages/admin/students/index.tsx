import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import DataTable from '@/components/shared/DataTable';
import type { Student, Department } from '@/types';

interface Props {
    students: any;
    filters: Record<string, string | undefined>;
    departments: Department[];
    programs: string[];
}

export default function StudentsIndex({
    students,
    filters,
    departments,
    programs,
}: Props) {
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
        {
            key: 'name',
            label: 'Name',
        },
        {
            key: 'department',
            label: 'Department',
            render: (student: Student) =>
                student.department?.name ?? (
                    <span className="text-muted-foreground">N/A</span>
                ),
        },
        {
            key: 'program',
            label: 'Program',
        },
        {
            key: 'year_of_study',
            label: 'Year',
        },
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
            <select
                name="active"
                defaultValue={filters.active ?? ''}
                className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm"
                onChange={(e) => {
                    const url = new URL(window.location.href);
                    if (e.target.value !== '')
                        url.searchParams.set('active', e.target.value);
                    else url.searchParams.delete('active');
                    url.searchParams.set('page', '1');
                    window.location.href = url.toString();
                }}
            >
                <option value="">All Status</option>
                <option value="1">Active</option>
                <option value="0">Inactive</option>
            </select>
        </>
    );

    return (
        <>
            <Head title="Students" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Students</h1>
                    <Button asChild>
                        <Link href="/admin/students/create">
                            <Plus className="mr-2 h-4 w-4" /> Create Student
                        </Link>
                    </Button>
                </div>

                <DataTable
                    data={students}
                    columns={columns}
                    filters={filters}
                    searchPlaceholder="Search by name, reg number, or email..."
                    filterFields={filterFields}
                />
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
