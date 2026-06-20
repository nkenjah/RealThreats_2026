import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import DataTable from '@/components/shared/DataTable';

interface Props {
    studentStatusLogs: any;
    filters: Record<string, string | undefined>;
}

export default function StudentStatusLogsIndex({
    studentStatusLogs,
    filters,
}: Props) {
    const columns = [
        {
            key: 'id',
            label: 'ID',
            render: (item: any) => (
                <Link
                    href={`/admin/student-status-logs/${item.id}`}
                    className="font-medium hover:underline"
                >
                    #{item.id}
                </Link>
            ),
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (item: any) => (
                <div className="flex gap-1">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/student-status-logs/${item.id}`}>
                            View
                        </Link>
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <>
            <Head title="Student Status Logs" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Student Status Logs</h1>
                </div>

                <DataTable
                    data={studentStatusLogs}
                    columns={columns}
                    filters={filters}
                />
            </div>
        </>
    );
}

StudentStatusLogsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Student Status Logs', href: '' },
    ],
};
