import { Users, GraduationCap, Building2, Activity } from 'lucide-react';
import { StatsCard } from '@/components/shared/stats-card';

interface DepartmentCount {
    name: string;
    count: number;
}

interface YearCount {
    year: number;
    count: number;
}

interface StudentDashboardProps {
    total_students: number;
    active_students: number;
    departments_count: number;
    by_department: DepartmentCount[];
    by_year: YearCount[];
}

export function StudentDashboard({
    total_students,
    active_students,
    departments_count,
    by_department,
    by_year,
}: StudentDashboardProps) {
    const maxDept = Math.max(...by_department.map((d) => d.count), 1);
    const maxYear = Math.max(...by_year.map((y) => y.count), 1);

    return (
        <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Students"
                    value={total_students}
                    icon={Users}
                    trend={{ value: 12, positive: true }}
                />
                <StatsCard
                    title="Active Students"
                    value={active_students}
                    icon={Activity}
                    description="Currently enrolled"
                />
                <StatsCard
                    title="Departments"
                    value={departments_count}
                    icon={Building2}
                />
                <StatsCard
                    title="Graduation Rate"
                    value="87%"
                    icon={GraduationCap}
                    trend={{ value: 3, positive: true }}
                />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-xl border bg-card p-5 shadow-sm">
                    <h3 className="mb-4 text-sm font-semibold">
                        By Department
                    </h3>
                    <div className="space-y-3">
                        {by_department.map((dept) => (
                            <div key={dept.name}>
                                <div className="mb-1 flex justify-between text-xs">
                                    <span className="font-medium">
                                        {dept.name}
                                    </span>
                                    <span className="text-muted-foreground">
                                        {dept.count}
                                    </span>
                                </div>
                                <div className="h-2 overflow-hidden rounded-full bg-muted">
                                    <div
                                        className="h-full rounded-full bg-primary transition-all"
                                        style={{
                                            width: `${(dept.count / maxDept) * 100}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-xl border bg-card p-5 shadow-sm">
                    <h3 className="mb-4 text-sm font-semibold">
                        By Year of Study
                    </h3>
                    <div className="space-y-3">
                        {by_year.map((y) => (
                            <div key={y.year}>
                                <div className="mb-1 flex justify-between text-xs">
                                    <span className="font-medium">
                                        Year {y.year}
                                    </span>
                                    <span className="text-muted-foreground">
                                        {y.count}
                                    </span>
                                </div>
                                <div className="h-2 overflow-hidden rounded-full bg-muted">
                                    <div
                                        className="h-full rounded-full bg-green-500 transition-all"
                                        style={{
                                            width: `${(y.count / maxYear) * 100}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
