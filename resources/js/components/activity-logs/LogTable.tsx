import DataTable from '@/components/shared/DataTable';
import type { ActivityLog } from '@/types';
import { Link } from '@inertiajs/react';

interface LogTableProps {
    logs: any;
    filters?: Record<string, string | undefined>;
}

export default function LogTable({ logs, filters = {} }: LogTableProps) {
    const columns = [
        {
            key: 'id',
            label: 'ID',
            render: (log: ActivityLog) => (
                <Link
                    href={`/admin/activity-logs/${log.id}`}
                    className="font-medium hover:underline"
                >
                    #{log.id}
                </Link>
            ),
        },
        {
            key: 'user',
            label: 'User',
            render: (log: ActivityLog) => (
                <Link
                    href={`/admin/users/${log.user_id}`}
                    className="hover:underline"
                >
                    {log.user?.name ?? 'System'}
                </Link>
            ),
        },
        {
            key: 'action',
            label: 'Action',
            render: (log: ActivityLog) => (
                <span className="capitalize">
                    {log.action.replace(/_/g, ' ')}
                </span>
            ),
        },
        {
            key: 'module',
            label: 'Module',
        },
        {
            key: 'risk_score_contribution',
            label: 'Risk',
            render: (log: ActivityLog) => (
                <span
                    className={
                        log.risk_score_contribution > 0
                            ? 'font-medium text-destructive'
                            : ''
                    }
                >
                    +{log.risk_score_contribution}
                </span>
            ),
        },
        {
            key: 'ip_address',
            label: 'IP',
        },
        {
            key: 'created_at',
            label: 'Time',
            render: (log: ActivityLog) =>
                new Date(log.created_at).toLocaleString(),
        },
    ];

    const filterFields = (
        <>
            <select
                name="module"
                defaultValue={filters.module ?? ''}
                className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm"
                onChange={(e) => {
                    const url = new URL(window.location.href);
                    if (e.target.value)
                        url.searchParams.set('module', e.target.value);
                    else url.searchParams.delete('module');
                    url.searchParams.set('page', '1');
                    window.location.href = url.toString();
                }}
            >
                <option value="">All Modules</option>
                <option value="dashboard">Dashboard</option>
                <option value="users">Users</option>
                <option value="threats">Threats</option>
                <option value="reports">Reports</option>
                <option value="auth">Auth</option>
            </select>
        </>
    );

    return (
        <DataTable
            data={logs}
            columns={columns}
            filters={filters}
            searchPlaceholder="Search description or user..."
            filterFields={filterFields}
        />
    );
}
