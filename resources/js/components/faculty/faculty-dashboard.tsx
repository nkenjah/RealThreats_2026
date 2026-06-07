import { Users, Building2, Briefcase, FileText } from 'lucide-react';
import { StatsCard } from '@/components/shared/stats-card';

interface FacultyDashboardProps {
    total_faculty: number;
    departments_count: number;
    by_department: { name: string; count: number }[];
    by_rank: { rank: string; count: number }[];
    by_contract: { contract: string; count: number }[];
}

export function FacultyDashboard({
    total_faculty,
    departments_count,
    by_department,
    by_rank,
    by_contract,
}: FacultyDashboardProps) {
    return (
        <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Faculty"
                    value={total_faculty}
                    icon={Users}
                    trend={{ value: 5, positive: true }}
                />
                <StatsCard
                    title="Departments"
                    value={departments_count}
                    icon={Building2}
                />
                <StatsCard
                    title="Rank Types"
                    value={by_rank.length}
                    icon={Briefcase}
                />
                <StatsCard
                    title="Contract Types"
                    value={by_contract.length}
                    icon={FileText}
                />
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="rounded-xl border bg-card p-5 shadow-sm">
                    <h3 className="mb-3 text-sm font-semibold">
                        By Department
                    </h3>
                    <ul className="space-y-2">
                        {by_department.map((d) => (
                            <li
                                key={d.name}
                                className="flex items-center justify-between text-sm"
                            >
                                <span className="text-muted-foreground">
                                    {d.name}
                                </span>
                                <span className="font-medium">{d.count}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="rounded-xl border bg-card p-5 shadow-sm">
                    <h3 className="mb-3 text-sm font-semibold">By Rank</h3>
                    <ul className="space-y-2">
                        {by_rank.map((r) => (
                            <li
                                key={r.rank}
                                className="flex items-center justify-between text-sm"
                            >
                                <span className="text-muted-foreground">
                                    {r.rank}
                                </span>
                                <span className="font-medium">{r.count}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="rounded-xl border bg-card p-5 shadow-sm">
                    <h3 className="mb-3 text-sm font-semibold">By Contract</h3>
                    <ul className="space-y-2">
                        {by_contract.map((c) => (
                            <li
                                key={c.contract}
                                className="flex items-center justify-between text-sm"
                            >
                                <span className="text-muted-foreground">
                                    {c.contract}
                                </span>
                                <span className="font-medium">{c.count}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
