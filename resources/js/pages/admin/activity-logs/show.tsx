import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ThreatSeverityBadge } from '@/components/threats/ThreatStatusBadge';
import type { ActivityLog } from '@/types';

interface Props {
    log: ActivityLog;
}

export default function ActivityLogsShow({ log }: Props) {
    return (
        <>
            <Head title={`Activity Log #${log.id}`} />

            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/activity-logs">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">
                            Activity Log #{log.id}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {new Date(log.created_at).toLocaleString()}
                        </p>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-lg border bg-card p-4">
                        <h2 className="mb-4 text-sm font-medium">
                            Log Details
                        </h2>
                        <dl className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <dt className="text-muted-foreground">User</dt>
                                <dd>
                                    <Link
                                        href={`/admin/users/${log.user_id}`}
                                        className="font-medium hover:underline"
                                    >
                                        {log.user?.name}
                                    </Link>
                                </dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">
                                    Action
                                </dt>
                                <dd className="font-medium capitalize">
                                    {log.action.replace(/_/g, ' ')}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">
                                    Module
                                </dt>
                                <dd>{log.module}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">
                                    Risk Contribution
                                </dt>
                                <dd
                                    className={
                                        log.risk_score_contribution > 0
                                            ? 'font-medium text-destructive'
                                            : ''
                                    }
                                >
                                    +{log.risk_score_contribution}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">
                                    IP Address
                                </dt>
                                <dd className="font-mono text-xs">
                                    {log.ip_address}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">
                                    Alert Triggered
                                </dt>
                                <dd>{log.alert_triggered ? 'Yes' : 'No'}</dd>
                            </div>
                            <div className="col-span-2">
                                <dt className="text-muted-foreground">
                                    Description
                                </dt>
                                <dd>{log.description}</dd>
                            </div>
                            <div className="col-span-2">
                                <dt className="text-muted-foreground">
                                    User Agent
                                </dt>
                                <dd className="font-mono text-xs break-all">
                                    {log.user_agent}
                                </dd>
                            </div>
                        </dl>
                    </div>

                    {log.threatAlert && (
                        <div className="rounded-lg border bg-card p-4">
                            <h2 className="mb-4 text-sm font-medium">
                                Triggered Threat Alert
                            </h2>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Link
                                        href={`/admin/threat-alerts/${log.threatAlert.id}`}
                                        className="font-medium text-primary hover:underline"
                                    >
                                        Alert #{log.threatAlert.id}
                                    </Link>
                                    <ThreatSeverityBadge
                                        severity={log.threatAlert.severity}
                                    />
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {log.threatAlert.notes}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

ActivityLogsShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Activity Logs', href: '/admin/activity-logs' },
        { title: 'Log Details', href: '' },
    ],
};
