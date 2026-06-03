import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import {
    ThreatStatusBadge,
    ThreatSeverityBadge,
} from '@/components/threats/ThreatStatusBadge';
import MitigationPanel from '@/components/threats/MitigationPanel';
import ThreatTimeline from '@/components/threats/ThreatTimeline';
import type { ThreatAlert, ActivityLog } from '@/types';

interface Props {
    alert: ThreatAlert;
    timeline: ActivityLog[];
}

export default function ThreatAlertsShow({ alert, timeline }: Props) {
    return (
        <>
            <Head title={`Threat Alert #${alert.id}`} />

            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/threat-alerts">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">
                            Threat Alert #{alert.id}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Created{' '}
                            {new Date(alert.created_at).toLocaleString()}
                        </p>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="space-y-4 lg:col-span-2">
                        <div className="rounded-lg border bg-card p-4">
                            <h2 className="mb-4 text-sm font-medium">
                                Alert Details
                            </h2>
                            <dl className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <dt className="text-muted-foreground">
                                        User
                                    </dt>
                                    <dd>
                                        <Link
                                            href={`/admin/users/${alert.user_id}`}
                                            className="font-medium hover:underline"
                                        >
                                            {alert.user?.name} (
                                            {alert.user?.email})
                                        </Link>
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-muted-foreground">
                                        Department
                                    </dt>
                                    <dd>
                                        {alert.user?.department?.name ?? 'N/A'}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-muted-foreground">
                                        Alert Type
                                    </dt>
                                    <dd className="font-medium capitalize">
                                        {alert.alert_type.replace(/_/g, ' ')}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-muted-foreground">
                                        Auto Mitigated
                                    </dt>
                                    <dd>
                                        {alert.auto_mitigated ? 'Yes' : 'No'}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-muted-foreground">
                                        Severity
                                    </dt>
                                    <dd>
                                        <ThreatSeverityBadge
                                            severity={alert.severity}
                                        />
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-muted-foreground">
                                        Status
                                    </dt>
                                    <dd>
                                        <ThreatStatusBadge
                                            status={alert.status}
                                        />
                                    </dd>
                                </div>
                                {alert.mitigation_action && (
                                    <div className="col-span-2">
                                        <dt className="text-muted-foreground">
                                            Mitigation Action
                                        </dt>
                                        <dd className="font-mono text-xs">
                                            {alert.mitigation_action}
                                        </dd>
                                    </div>
                                )}
                                {alert.notes && (
                                    <div className="col-span-2">
                                        <dt className="text-muted-foreground">
                                            Notes
                                        </dt>
                                        <dd>{alert.notes}</dd>
                                    </div>
                                )}
                                {alert.resolver && (
                                    <div className="col-span-2">
                                        <dt className="text-muted-foreground">
                                            Resolved By
                                        </dt>
                                        <dd>
                                            {alert.resolver.name} on{' '}
                                            {alert.resolved_at
                                                ? new Date(
                                                      alert.resolved_at,
                                                  ).toLocaleString()
                                                : 'N/A'}
                                        </dd>
                                    </div>
                                )}
                            </dl>
                        </div>

                        <div className="rounded-lg border bg-card p-4">
                            <h2 className="mb-4 text-sm font-medium">
                                User Activity Timeline
                            </h2>
                            <ThreatTimeline timeline={timeline} />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="rounded-lg border bg-card p-4">
                            <MitigationPanel
                                alertId={alert.id}
                                currentStatus={alert.status}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

ThreatAlertsShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Threat Alerts', href: '/admin/threat-alerts' },
        { title: 'Alert Details', href: '' },
    ],
};
