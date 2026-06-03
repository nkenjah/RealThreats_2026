import {
    ThreatStatusBadge,
    ThreatSeverityBadge,
} from '@/components/threats/ThreatStatusBadge';
import type { ThreatAlert } from '@/types';
import DataTable from '@/components/shared/DataTable';
import { Link } from '@inertiajs/react';

interface ThreatTableProps {
    alerts: any;
    filters?: Record<string, string | undefined>;
}

export default function ThreatTable({
    alerts,
    filters = {},
}: ThreatTableProps) {
    const columns = [
        {
            key: 'id',
            label: 'ID',
            render: (alert: ThreatAlert) => (
                <Link
                    href={`/admin/threat-alerts/${alert.id}`}
                    className="font-medium hover:underline"
                >
                    #{alert.id}
                </Link>
            ),
        },
        {
            key: 'user',
            label: 'User',
            render: (alert: ThreatAlert) => (
                <Link
                    href={`/admin/users/${alert.user_id}`}
                    className="hover:underline"
                >
                    {alert.user?.name ?? 'Unknown'}
                </Link>
            ),
        },
        {
            key: 'alert_type',
            label: 'Type',
            render: (alert: ThreatAlert) => (
                <span className="capitalize">
                    {alert.alert_type.replace(/_/g, ' ')}
                </span>
            ),
        },
        {
            key: 'severity',
            label: 'Severity',
            render: (alert: ThreatAlert) => (
                <ThreatSeverityBadge severity={alert.severity} />
            ),
        },
        {
            key: 'status',
            label: 'Status',
            render: (alert: ThreatAlert) => (
                <ThreatStatusBadge status={alert.status} />
            ),
        },
        {
            key: 'auto_mitigated',
            label: 'Auto',
            render: (alert: ThreatAlert) =>
                alert.auto_mitigated ? 'Yes' : 'No',
        },
        {
            key: 'created_at',
            label: 'Created',
            render: (alert: ThreatAlert) =>
                new Date(alert.created_at).toLocaleDateString(),
        },
    ];

    const filterFields = (
        <>
            <select
                name="severity"
                defaultValue={filters.severity ?? ''}
                className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm"
                onChange={(e) => {
                    const url = new URL(window.location.href);
                    if (e.target.value)
                        url.searchParams.set('severity', e.target.value);
                    else url.searchParams.delete('severity');
                    url.searchParams.set('page', '1');
                    window.location.href = url.toString();
                }}
            >
                <option value="">All Severities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
            </select>
            <select
                name="status"
                defaultValue={filters.status ?? ''}
                className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm"
                onChange={(e) => {
                    const url = new URL(window.location.href);
                    if (e.target.value)
                        url.searchParams.set('status', e.target.value);
                    else url.searchParams.delete('status');
                    url.searchParams.set('page', '1');
                    window.location.href = url.toString();
                }}
            >
                <option value="">All Statuses</option>
                <option value="open">Open</option>
                <option value="investigating">Investigating</option>
                <option value="resolved">Resolved</option>
                <option value="false_positive">False Positive</option>
            </select>
        </>
    );

    return (
        <DataTable
            data={alerts}
            columns={columns}
            filters={filters}
            searchPlaceholder="Search by user name or email..."
            filterFields={filterFields}
        />
    );
}
