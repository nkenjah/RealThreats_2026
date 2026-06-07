import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import DataTable from '@/components/shared/DataTable';

interface Attendance {
    id: number;
    student_id: number;
    lecture_id: number;
    status: string;
    lecture_date: string;
    notes: string | null;
    student?: { id: number; name: string; registration_number: string };
    lecture?: { id: number; topic: string };
}

interface Props {
    attendance: any;
    filters: Record<string, string | undefined>;
}

export default function AttendanceIndex({ attendance, filters }: Props) {
    const columns = [
        {
            key: 'student',
            label: 'Student',
            render: (a: Attendance) =>
                a.student?.name ?? (
                    <span className="text-muted-foreground">N/A</span>
                ),
        },
        {
            key: 'lecture',
            label: 'Lecture Topic',
            render: (a: Attendance) => (
                <Link
                    href={`/admin/attendance/${a.id}`}
                    className="font-medium hover:underline"
                >
                    {a.lecture?.topic ?? `Lecture #${a.lecture_id}`}
                </Link>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            render: (a: Attendance) => (
                <span className="capitalize">{a.status}</span>
            ),
        },
        {
            key: 'lecture_date',
            label: 'Date',
            render: (a: Attendance) =>
                new Date(a.lecture_date).toLocaleDateString(),
        },
        {
            key: 'notes',
            label: 'Notes',
            render: (a: Attendance) =>
                a.notes ?? <span className="text-muted-foreground">-</span>,
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (a: Attendance) => (
                <div className="flex gap-1">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/attendance/${a.id}`}>View</Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/attendance/${a.id}/edit`}>
                            Edit
                        </Link>
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <>
            <Head title="Attendance" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Attendance</h1>
                    <Button asChild>
                        <Link href="/admin/attendance/create">
                            <Plus className="mr-2 h-4 w-4" /> Create Attendance
                        </Link>
                    </Button>
                </div>

                <DataTable
                    data={attendance}
                    columns={columns}
                    filters={filters}
                    searchPlaceholder="Search by student name or notes..."
                />
            </div>
        </>
    );
}

AttendanceIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Attendance', href: '/admin/attendance' },
    ],
};
