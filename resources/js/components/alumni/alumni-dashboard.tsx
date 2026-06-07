import { Users, Briefcase, Building2, GraduationCap } from 'lucide-react';
import { StatsCard } from '@/components/shared/stats-card';

interface IndustryCount {
    industry: string;
    count: number;
}

interface GradYearCount {
    year: number;
    count: number;
}

interface AlumniDashboardProps {
    total_alumni: number;
    employed: number;
    industries_count: number;
    graduation_years_count: number;
    by_industry: IndustryCount[];
    by_graduation_year: GradYearCount[];
}

export function AlumniDashboard({
    total_alumni,
    employed,
    industries_count,
    graduation_years_count,
    by_industry,
    by_graduation_year,
}: AlumniDashboardProps) {
    const maxIndustry = Math.max(...by_industry.map((i) => i.count), 1);
    const maxYear = Math.max(...by_graduation_year.map((y) => y.count), 1);

    return (
        <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Alumni"
                    value={total_alumni}
                    icon={Users}
                    trend={{ value: 15, positive: true }}
                />
                <StatsCard
                    title="Employed"
                    value={employed}
                    icon={Briefcase}
                    description={`${total_alumni > 0 ? Math.round((employed / total_alumni) * 100) : 0}% employed`}
                />
                <StatsCard
                    title="Industries"
                    value={industries_count}
                    icon={Building2}
                />
                <StatsCard
                    title="Grad Years"
                    value={graduation_years_count}
                    icon={GraduationCap}
                />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-xl border bg-card p-5 shadow-sm">
                    <h3 className="mb-4 text-sm font-semibold">By Industry</h3>
                    {by_industry.length === 0 && (
                        <p className="py-4 text-center text-sm text-muted-foreground">
                            No industry data.
                        </p>
                    )}
                    <div className="space-y-3">
                        {by_industry.map((ind) => (
                            <div key={ind.industry}>
                                <div className="mb-1 flex justify-between text-xs">
                                    <span className="font-medium">
                                        {ind.industry}
                                    </span>
                                    <span className="text-muted-foreground">
                                        {ind.count}
                                    </span>
                                </div>
                                <div className="h-2 overflow-hidden rounded-full bg-muted">
                                    <div
                                        className="h-full rounded-full bg-blue-500 transition-all"
                                        style={{
                                            width: `${(ind.count / maxIndustry) * 100}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-xl border bg-card p-5 shadow-sm">
                    <h3 className="mb-4 text-sm font-semibold">
                        By Graduation Year
                    </h3>
                    {by_graduation_year.length === 0 && (
                        <p className="py-4 text-center text-sm text-muted-foreground">
                            No graduation year data.
                        </p>
                    )}
                    <div className="space-y-3">
                        {by_graduation_year.map((y) => (
                            <div key={y.year}>
                                <div className="mb-1 flex justify-between text-xs">
                                    <span className="font-medium">
                                        {y.year}
                                    </span>
                                    <span className="text-muted-foreground">
                                        {y.count}
                                    </span>
                                </div>
                                <div className="h-2 overflow-hidden rounded-full bg-muted">
                                    <div
                                        className="h-full rounded-full bg-emerald-500 transition-all"
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
