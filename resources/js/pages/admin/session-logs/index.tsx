import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import DataTable from '@/components/shared/DataTable';

interface Props {
    sessionLogs: any;
    filters: Record<string, string | undefined>;
}

export default function SessionLogsIndex({ sessionLogs, filters }: Props) {
    const columns = [
        {
            key: 'id',
            label: 'ID',
            render: (item: any) => (
                <Link
                    href={`/admin/session-logs/${item.id}`}
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
                        <Link href={`/admin/session-logs/${item.id}`}>
                            View
                        </Link>
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <>
            <Head title="Session Logs" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Session Logs</h1>
                </div>

                <DataTable
                    data={sessionLogs}
                    columns={columns}
                    filters={filters}
                    searchPlaceholder="Search by user..."
                />
            </div>
        </>
    );
}

SessionLogsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Session Logs', href: '' },
    ],
};
