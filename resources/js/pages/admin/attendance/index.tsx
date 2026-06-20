import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Plus, LayoutGrid, Table2 } from 'lucide-react';
import { useState } from 'react';
import DataTable from '@/components/shared/DataTable';
import { AttendanceAnalytics } from '@/components/attendance/attendance-analytics';
import type { Attendance } from '@/types';

interface Props {
    attendances: any;
    filters: Record<string, string | undefined>;
    stats?: {
        present: number;
        absent: number;
        late: number;
        excused: number;
        total: number;
    };
}

export default function AttendanceIndex({
    attendances,
    filters,
    stats,
}: Props) {
    const [view, setView] = useState<'table' | 'dashboard'>('table');

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
                            <Link href="/admin/attendance/create">
                                <Plus className="mr-2 h-4 w-4" /> Create
                                Attendance
                            </Link>
                        </Button>
                    </div>
                </div>

                {view === 'dashboard' && stats ? (
                    <AttendanceAnalytics
                        present={stats.present}
                        absent={stats.absent}
                        late={stats.late}
                        excused={stats.excused}
                        total={stats.total}
                    />
                ) : (
                    <DataTable
                        data={attendances}
                        columns={columns}
                        filters={filters}
                        searchPlaceholder="Search by student name or notes..."
                    />
                )}
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
