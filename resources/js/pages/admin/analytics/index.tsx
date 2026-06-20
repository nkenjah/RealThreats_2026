import { Head } from '@inertiajs/react';
import {
    Activity,
    Users,
    DollarSign,
    TrendingUp,
    GraduationCap,
    AlertTriangle,
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
} from 'recharts';
import StatsCard from '@/components/dashboard/StatsCard';

interface Props {
    stats: {
        total_students: number;
        active_enrollments: number;
        avg_gpa: number;
        total_collected: number;
        attendance_rate: number | null;
    };
    gradeDistribution: Array<{ grade: string; count: number }>;
    enrollmentTrends: {
        trends: Array<{ year: string; enrollments: number; active: number }>;
        projection: number | null;
    };
    atRiskStudents: Array<{
        student: {
            id: number;
            name: string;
            registration_number: string;
            program: string;
        };
        risk_score: number;
        risk_level: string;
        factors: string[];
        current_gpa: number | null;
    }>;
}

function formatCurrency(amount: number): string {
    return 'TZS ' + (amount / 1000000).toFixed(1) + 'M';
}

export default function AnalyticsIndex({
    stats,
    gradeDistribution,
    enrollmentTrends,
    atRiskStudents,
}: Props) {
    const chartColors = {
        bar: 'var(--primary)',
        line: 'var(--primary)',
        grid: 'var(--border)',
        text: 'var(--muted-foreground)',
    };

    return (
        <>
            <Head title="Analytics" />

            <div className="space-y-6 p-6">
                <h1 className="text-2xl font-bold">Analytics Dashboard</h1>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    <StatsCard
                        title="Total Students"
                        value={stats.total_students}
                        icon={Users}
                        variant="default"
                    />
                    <StatsCard
                        title="Active Enrollments"
                        value={stats.active_enrollments}
                        icon={GraduationCap}
                        variant="success"
                    />
                    <StatsCard
                        title="Average GPA"
                        value={stats.avg_gpa}
                        icon={Activity}
                        variant={stats.avg_gpa >= 3.0 ? 'success' : 'warning'}
                    />
                    <StatsCard
                        title="Revenue Collected"
                        value={formatCurrency(stats.total_collected)}
                        icon={DollarSign}
                        variant="default"
                    />
                    <StatsCard
                        title="Attendance Rate"
                        value={
                            stats.attendance_rate !== null
                                ? stats.attendance_rate + '%'
                                : 'N/A'
                        }
                        icon={TrendingUp}
                        variant={
                            stats.attendance_rate !== null &&
                            stats.attendance_rate >= 75
                                ? 'success'
                                : 'warning'
                        }
                    />
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-lg border bg-card p-4">
                        <h2 className="mb-4 text-sm font-medium">
                            Grade Distribution
                        </h2>
                        {gradeDistribution.length > 0 ? (
                            <div className="h-[300px] w-full min-w-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={gradeDistribution}>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            className="stroke-border"
                                        />
                                        <XAxis
                                            dataKey="grade"
                                            className="text-xs text-muted-foreground"
                                            tick={{ fontSize: 11 }}
                                        />
                                        <YAxis
                                            className="text-xs text-muted-foreground"
                                            tick={{ fontSize: 11 }}
                                            allowDecimals={false}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor:
                                                    'var(--background)',
                                                border: '1px solid var(--border)',
                                                borderRadius: 'var(--radius)',
                                            }}
                                        />
                                        <Bar
                                            dataKey="count"
                                            fill="var(--primary)"
                                            radius={[4, 4, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <p className="py-8 text-center text-sm text-muted-foreground">
                                No grade data available.
                            </p>
                        )}
                    </div>

                    <div className="rounded-lg border bg-card p-4">
                        <h2 className="mb-4 text-sm font-medium">
                            Enrollment Trends
                        </h2>
                        {enrollmentTrends.trends.length > 0 ? (
                            <div className="h-[300px] w-full min-w-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={enrollmentTrends.trends}>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            className="stroke-border"
                                        />
                                        <XAxis
                                            dataKey="year"
                                            className="text-xs text-muted-foreground"
                                            tick={{ fontSize: 11 }}
                                        />
                                        <YAxis
                                            className="text-xs text-muted-foreground"
                                            tick={{ fontSize: 11 }}
                                            allowDecimals={false}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor:
                                                    'var(--background)',
                                                border: '1px solid var(--border)',
                                                borderRadius: 'var(--radius)',
                                            }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="enrollments"
                                            stroke="var(--primary)"
                                            strokeWidth={2}
                                            dot={{ r: 3 }}
                                            name="Total"
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="active"
                                            stroke="#22c55e"
                                            strokeWidth={2}
                                            dot={{ r: 3 }}
                                            name="Active"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <p className="py-8 text-center text-sm text-muted-foreground">
                                No enrollment data available.
                            </p>
                        )}
                        {enrollmentTrends.projection !== null && (
                            <p className="mt-2 text-xs text-muted-foreground">
                                Next year projection:{' '}
                                <span className="font-medium text-foreground">
                                    {enrollmentTrends.projection}
                                </span>{' '}
                                enrollments
                            </p>
                        )}
                    </div>
                </div>

                <div className="rounded-lg border bg-card p-4">
                    <h2 className="mb-4 flex items-center gap-2 text-sm font-medium">
                        <AlertTriangle className="size-4 text-destructive" />
                        At-Risk Students
                    </h2>
                    {atRiskStudents.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b text-left text-xs text-muted-foreground">
                                        <th className="pb-2 font-medium">
                                            Name
                                        </th>
                                        <th className="pb-2 font-medium">
                                            Reg No
                                        </th>
                                        <th className="pb-2 font-medium">
                                            Program
                                        </th>
                                        <th className="pb-2 font-medium">
                                            GPA
                                        </th>
                                        <th className="pb-2 font-medium">
                                            Risk Score
                                        </th>
                                        <th className="pb-2 font-medium">
                                            Risk Level
                                        </th>
                                        <th className="pb-2 font-medium">
                                            Factors
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {atRiskStudents.map((s) => (
                                        <tr
                                            key={s.student.id}
                                            className="border-b last:border-0"
                                        >
                                            <td className="py-2 font-medium">
                                                {s.student.name}
                                            </td>
                                            <td className="py-2">
                                                {s.student.registration_number}
                                            </td>
                                            <td className="py-2">
                                                {s.student.program}
                                            </td>
                                            <td className="py-2">
                                                {s.current_gpa ?? 'N/A'}
                                            </td>
                                            <td className="py-2">
                                                <span
                                                    className={`font-medium ${
                                                        s.risk_score >= 70
                                                            ? 'text-destructive'
                                                            : s.risk_score >= 50
                                                              ? 'text-orange-500'
                                                              : s.risk_score >=
                                                                  30
                                                                ? 'text-yellow-500'
                                                                : 'text-green-500'
                                                    }`}
                                                >
                                                    {s.risk_score}
                                                </span>
                                            </td>
                                            <td className="py-2">
                                                <span
                                                    className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
                                                        s.risk_level ===
                                                        'critical'
                                                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                            : s.risk_level ===
                                                                'high'
                                                              ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                                                              : s.risk_level ===
                                                                  'medium'
                                                                ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                                : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                    }`}
                                                >
                                                    {s.risk_level}
                                                </span>
                                            </td>
                                            <td className="py-2">
                                                <div className="flex flex-wrap gap-1">
                                                    {s.factors.map((f, i) => (
                                                        <span
                                                            key={i}
                                                            className="inline-block rounded bg-muted px-1.5 py-0.5 text-xs"
                                                        >
                                                            {f}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="py-4 text-center text-sm text-muted-foreground">
                            No at-risk students found.
                        </p>
                    )}
                </div>
            </div>
        </>
    );
}

AnalyticsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Analytics', href: '/admin/analytics' },
    ],
};
