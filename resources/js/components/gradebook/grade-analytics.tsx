import {
    CheckCircle,
    XCircle,
    AlertCircle,
    Clock,
    BarChart3,
} from 'lucide-react';
import { StatsCard } from '@/components/shared/stats-card';

interface GradeDistribution {
    grade: string;
    count: number;
}

interface GradeAnalyticsProps {
    total_grades: number;
    passed: number;
    failed: number;
    supps: number;
    retakes: number;
    pending_approval: number;
    by_grade: GradeDistribution[];
}

const GRADE_COLORS: Record<string, string> = {
    A: 'bg-green-500',
    'B+': 'bg-emerald-500',
    B: 'bg-blue-500',
    C: 'bg-yellow-500',
    D: 'bg-orange-500',
    E: 'bg-red-400',
    F: 'bg-red-700',
};

export function GradeAnalytics({
    total_grades,
    passed,
    failed,
    supps,
    retakes,
    pending_approval,
    by_grade,
}: GradeAnalyticsProps) {
    const passRate =
        total_grades > 0 ? Math.round((passed / total_grades) * 100) : 0;

    return (
        <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Pass Rate"
                    value={`${passRate}%`}
                    icon={CheckCircle}
                    description={`${passed}/${total_grades} students passed`}
                />
                <StatsCard
                    title="Failed"
                    value={failed}
                    icon={XCircle}
                    description={`${supps} supps, ${retakes} retakes`}
                />
                <StatsCard
                    title="Supplementary"
                    value={supps}
                    icon={AlertCircle}
                    description="Eligible for supp exam"
                />
                <StatsCard
                    title="Pending Approval"
                    value={pending_approval}
                    icon={Clock}
                    description="Awaiting HOD review"
                />
            </div>

            <div className="rounded-xl border bg-card p-5 shadow-sm">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold">
                    <BarChart3 className="size-4" />
                    Grade Distribution
                </h3>
                {by_grade.length === 0 ? (
                    <p className="py-4 text-center text-sm text-muted-foreground">
                        No grade data available.
                    </p>
                ) : (
                    <div className="space-y-3">
                        {by_grade.map((g) => {
                            const pct =
                                total_grades > 0
                                    ? (g.count / total_grades) * 100
                                    : 0;
                            return (
                                <div key={g.grade}>
                                    <div className="mb-1 flex justify-between text-xs">
                                        <span className="font-medium">
                                            {g.grade || 'No Grade'}
                                        </span>
                                        <span className="text-muted-foreground">
                                            {g.count} ({Math.round(pct)}%)
                                        </span>
                                    </div>
                                    <div className="h-3 overflow-hidden rounded-full bg-muted">
                                        <div
                                            className={`h-full rounded-full transition-all ${GRADE_COLORS[g.grade] || 'bg-gray-400'}`}
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
