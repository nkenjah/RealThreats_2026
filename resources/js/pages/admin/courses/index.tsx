import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import DataTable from '@/components/shared/DataTable';
import type { Course, Department } from '@/types';

interface Props {
    courses: any;
    filters: Record<string, string | undefined>;
    departments: Department[];
}

export default function CoursesIndex({ courses, filters, departments }: Props) {
    const columns = [
        {
            key: 'code',
            label: 'Code',
            render: (course: Course) => (
                <Link
                    href={`/admin/courses/${course.id}`}
                    className="font-mono font-medium hover:underline"
                >
                    {course.code}
                </Link>
            ),
        },
        {
            key: 'name',
            label: 'Name',
            render: (course: Course) => course.name,
        },
        {
            key: 'department',
            label: 'Department',
            render: (course: Course) =>
                course.department?.name ?? (
                    <span className="text-muted-foreground">N/A</span>
                ),
        },
        {
            key: 'credit_hours',
            label: 'Credit Hours',
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (course: Course) => (
                <div className="flex gap-1">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/courses/${course.id}`}>View</Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/courses/${course.id}/edit`}>
                            Edit
                        </Link>
                    </Button>
                </div>
            ),
        },
    ];

    const filterFields = (
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
    );

    return (
        <>
            <Head title="Courses" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Courses</h1>
                    <Button asChild>
                        <Link href="/admin/courses/create">
                            <Plus className="mr-2 h-4 w-4" /> Create Course
                        </Link>
                    </Button>
                </div>

                <DataTable
                    data={courses}
                    columns={columns}
                    filters={filters}
                    searchPlaceholder="Search by name or code..."
                    filterFields={filterFields}
                />
            </div>
        </>
    );
}

CoursesIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Courses', href: '/admin/courses' },
    ],
};
