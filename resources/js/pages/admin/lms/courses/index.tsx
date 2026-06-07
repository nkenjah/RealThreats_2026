import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import DataTable from '@/components/shared/DataTable';

interface LMSCourse {
    id: number;
    name: string;
    course_offering_id: number;
    status: string;
    course_offering?: { id: number; course?: { name: string; code: string } };
}

interface Props {
    courses: any;
    filters: Record<string, string | undefined>;
}

export default function LMSCoursesIndex({ courses, filters }: Props) {
    const columns = [
        {
            key: 'name',
            label: 'Course Name',
            render: (c: LMSCourse) => (
                <Link
                    href={`/admin/lms/courses/${c.id}`}
                    className="font-medium hover:underline"
                >
                    {c.name}
                </Link>
            ),
        },
        {
            key: 'offering',
            label: 'Offering',
            render: (c: LMSCourse) =>
                c.course_offering?.course?.name ?? (
                    <span className="text-muted-foreground">N/A</span>
                ),
        },
        {
            key: 'status',
            label: 'Status',
            render: (c: LMSCourse) => (
                <span className="capitalize">{c.status}</span>
            ),
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (c: LMSCourse) => (
                <div className="flex gap-1">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/lms/courses/${c.id}`}>View</Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/lms/courses/${c.id}/edit`}>
                            Edit
                        </Link>
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <>
            <Head title="LMS Courses" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">LMS Courses</h1>
                    <Button asChild>
                        <Link href="/admin/lms/courses/create">
                            <Plus className="mr-2 h-4 w-4" /> Create Course
                        </Link>
                    </Button>
                </div>

                <DataTable
                    data={courses}
                    columns={columns}
                    filters={filters}
                    searchPlaceholder="Search by name..."
                />
            </div>
        </>
    );
}

LMSCoursesIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'LMS', href: '/admin/lms' },
        { title: 'Courses', href: '/admin/lms/courses' },
    ],
};
