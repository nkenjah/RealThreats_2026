import { Head } from '@inertiajs/react';
import { Activity, AlertTriangle, Users, ShieldAlert } from 'lucide-react';
import StatsCard from '@/components/dashboard/StatsCard';
import RiskLeaderboard from '@/components/dashboard/RiskLeaderboard';
import AlertTrendChart from '@/components/dashboard/AlertTrendChart';
import SeverityDonutChart from '@/components/dashboard/SeverityDonutChart';
import ExportButton from '@/components/shared/ExportButton';
import type { DashboardStats, User, ThreatAlert } from '@/types';

interface Props {
    stats: DashboardStats;
    riskLeaderboard: User[];
    alertTrend: Array<{ date: string; count: number }>;
    severityDistribution: Record<string, number>;
    recentAlerts: ThreatAlert[];
}

export default function ReportsDashboard({
    stats,
    riskLeaderboard,
    alertTrend,
    severityDistribution,
    recentAlerts,
}: Props) {
    return (
        <>
            <Head title="Reports" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Security Reports</h1>
                    <ExportButton href="/admin/reports/export" />
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatsCard
                        title="Active Threats"
                        value={stats.active_threats_count}
                        icon={ShieldAlert}
                        variant="destructive"
                    />
                    <StatsCard
                        title="Locked Accounts"
                        value={stats.locked_users_count}
                        icon={Users}
                        variant="warning"
                    />
                    <StatsCard
                        title="Today's Alerts"
                        value={stats.todays_alerts_count}
                        icon={AlertTriangle}
                        variant={
                            stats.todays_alerts_count > 0
                                ? 'warning'
                                : 'default'
                        }
                    />
                    <StatsCard
                        title="High Risk Users"
                        value={stats.high_risk_users_count}
                        icon={Activity}
                        variant={
                            stats.high_risk_users_count > 0
                                ? 'destructive'
                                : 'default'
                        }
                    />
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-lg border bg-card p-4">
                        <h2 className="mb-4 text-sm font-medium">
                            Alert Trend (30 days)
                        </h2>
                        <AlertTrendChart data={alertTrend} />
                    </div>
                    <div className="rounded-lg border bg-card p-4">
                        <h2 className="mb-4 text-sm font-medium">
                            Severity Distribution
                        </h2>
                        <SeverityDonutChart data={severityDistribution} />
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-lg border bg-card p-4">
                        <h2 className="mb-4 text-sm font-medium">
                            Risk Leaderboard
                        </h2>
                        <RiskLeaderboard users={riskLeaderboard} />
                    </div>
                    <div className="rounded-lg border bg-card p-4">
                        <h2 className="mb-4 text-sm font-medium">
                            Recent Alerts
                        </h2>
                        <div className="space-y-2">
                            {recentAlerts.map((alert) => (
                                <div
                                    key={alert.id}
                                    className="flex items-center justify-between rounded border p-2 text-sm"
                                >
                                    <div>
                                        <span className="font-medium">
                                            {alert.user?.name}
                                        </span>
                                        <span className="ml-2 text-xs text-muted-foreground capitalize">
                                            {alert.alert_type.replace(
                                                /_/g,
                                                ' ',
                                            )}
                                        </span>
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                        {new Date(
                                            alert.created_at,
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

ReportsDashboard.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Reports', href: '/admin/reports' },
    ],
};
