import { Head, Link } from '@inertiajs/react';
import ThreatTable from '@/components/threats/ThreatTable';

interface Props {
    alerts: any;
    filters: Record<string, string | undefined>;
}

export default function ThreatAlertsIndex({ alerts, filters }: Props) {
    return (
        <>
            <Head title="Threat Alerts" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Threat Alerts</h1>
                </div>

                <ThreatTable alerts={alerts} filters={filters} />
            </div>
        </>
    );
}

ThreatAlertsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Threat Alerts', href: '/admin/threat-alerts' },
    ],
};
