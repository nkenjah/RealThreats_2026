import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import LogTable from '@/components/activity-logs/LogTable';

interface Props {
    logs: any;
    filters: Record<string, string | undefined>;
}

export default function ActivityLogsIndex({ logs, filters }: Props) {
    return (
        <>
            <Head title="Activity Logs" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Activity Logs</h1>
                    <Button variant="outline" size="sm" asChild>
                        <a href="/admin/reports/export">Export CSV</a>
                    </Button>
                </div>

                <LogTable logs={logs} filters={filters} />
            </div>
        </>
    );
}

ActivityLogsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Activity Logs', href: '/admin/activity-logs' },
    ],
};
