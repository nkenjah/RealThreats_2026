import { Head } from '@inertiajs/react';
import {
    Activity,
    AlertTriangle,
    Users,
    ShieldAlert,
    GraduationCap,
    BookOpen,
    TrendingUp,
    DollarSign,
} from 'lucide-react';
import StatsCard from '@/components/dashboard/StatsCard';
import RiskLeaderboard from '@/components/dashboard/RiskLeaderboard';
import AlertTrendChart from '@/components/dashboard/AlertTrendChart';
import SeverityDonutChart from '@/components/dashboard/SeverityDonutChart';
import LiveThreatFeed from '@/components/dashboard/LiveThreatFeed';
import type { DashboardStats, User } from '@/types';

interface AcademicStats {
    total_students: number;
    active_enrollments: number;
    avg_gpa: number;
    collection_rate: number;
}

interface DashboardProps {
    stats: DashboardStats;
    riskLeaderboard: User[];
    alertTrend: Array<{ date: string; count: number }>;
    severityDistribution: Record<string, number>;
    academicStats: AcademicStats;
}

export default function DashboardIndex({
    stats,
    riskLeaderboard,
    alertTrend,
    severityDistribution,
    academicStats,
}: DashboardProps) {
    return (
        <>
            <Head title="Dashboard" />

            <div className="space-y-6 p-6">
                <h1 className="text-2xl font-bold">Security Dashboard</h1>

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

                <h2 className="text-xl font-bold">Academic Overview</h2>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatsCard
                        title="Total Students"
                        value={academicStats.total_students}
                        icon={GraduationCap}
                        variant="default"
                    />
                    <StatsCard
                        title="Active Enrollments"
                        value={academicStats.active_enrollments}
                        icon={BookOpen}
                        variant="default"
                    />
                    <StatsCard
                        title="Average GPA"
                        value={academicStats.avg_gpa.toFixed(2)}
                        icon={TrendingUp}
                        variant="default"
                    />
                    <StatsCard
                        title="Revenue Collected"
                        value={`TZS ${(academicStats.collection_rate / 1_000_000).toFixed(1)}M`}
                        icon={DollarSign}
                        variant="default"
                    />
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-lg border bg-card p-4">
                        <h2 className="mb-4 text-sm font-medium">
                            Alert Trend (7 days)
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
                            Live Threat Feed
                        </h2>
                        <LiveThreatFeed />
                    </div>
                </div>
            </div>
        </>
    );
}

DashboardIndex.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: '/dashboard' }],
};
