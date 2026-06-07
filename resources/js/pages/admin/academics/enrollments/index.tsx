import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import DataTable from '@/components/shared/DataTable';

interface Enrollment {
    id: number;
    enrollment_date: string;
    status: string | null;
    grade: string | null;
    student?: { id: number; name: string };
    courseOffering?: {
        id: number;
        course?: { id: number; name: string; code: string };
    };
}

interface Props {
    enrollments: any;
    filters: Record<string, string | undefined>;
}

export default function EnrollmentsIndex({ enrollments, filters }: Props) {
    const columns = [
        {
            key: 'student',
            label: 'Student',
            render: (e: Enrollment) => (
                <Link
                    href={`/admin/enrollments/${e.id}`}
                    className="font-medium hover:underline"
                >
                    {e.student?.name ?? 'N/A'}
                </Link>
            ),
        },
        {
            key: 'course',
            label: 'Course',
            render: (e: Enrollment) => e.courseOffering?.course?.name ?? 'N/A',
        },
        { key: 'enrollment_date', label: 'Enrollment Date' },
        {
            key: 'status',
            label: 'Status',
            render: (e: Enrollment) =>
                e.status ?? <span className="text-muted-foreground">-</span>,
        },
        {
            key: 'grade',
            label: 'Grade',
            render: (e: Enrollment) =>
                e.grade ?? <span className="text-muted-foreground">-</span>,
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (e: Enrollment) => (
                <div className="flex gap-1">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/enrollments/${e.id}`}>View</Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/enrollments/${e.id}/edit`}>
                            Edit
                        </Link>
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <>
            <Head title="Enrollments" />
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Enrollments</h1>
                    <Button asChild>
                        <Link href="/admin/enrollments/create">
                            <Plus className="mr-2 h-4 w-4" /> Create Enrollment
                        </Link>
                    </Button>
                </div>
                <DataTable
                    data={enrollments}
                    columns={columns}
                    filters={filters}
                    searchPlaceholder="Search by student name..."
                />
            </div>
        </>
    );
}

EnrollmentsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Enrollments', href: '/admin/enrollments' },
    ],
};
