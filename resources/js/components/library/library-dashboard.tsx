import {
    BookOpen,
    CheckCircle,
    Clock,
    AlertTriangle,
    BookMarked,
} from 'lucide-react';
import { StatsCard } from '@/components/shared/stats-card';

interface CategoryCount {
    category: string;
    count: number;
}

interface LibraryDashboardProps {
    total_books: number;
    available: number;
    borrowed: number;
    overdue: number;
    by_category: CategoryCount[];
}

export function LibraryDashboard({
    total_books,
    available,
    borrowed,
    overdue,
    by_category,
}: LibraryDashboardProps) {
    return (
        <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Books"
                    value={total_books}
                    icon={BookOpen}
                    trend={{ value: 8, positive: true }}
                />
                <StatsCard
                    title="Available"
                    value={available}
                    icon={CheckCircle}
                    description={`${total_books > 0 ? Math.round((available / total_books) * 100) : 0}% of collection`}
                />
                <StatsCard
                    title="Borrowed"
                    value={borrowed}
                    icon={Clock}
                    description="Currently checked out"
                />
                <StatsCard
                    title="Overdue"
                    value={overdue}
                    icon={AlertTriangle}
                    description="Past return date"
                />
            </div>

            <div className="rounded-xl border bg-card p-5 shadow-sm">
                <h3 className="mb-4 text-sm font-semibold">By Category</h3>
                {by_category.length === 0 && (
                    <p className="py-4 text-center text-sm text-muted-foreground">
                        No categories data available.
                    </p>
                )}
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {by_category.map((cat) => {
                        const pct =
                            total_books > 0
                                ? Math.round((cat.count / total_books) * 100)
                                : 0;
                        return (
                            <div
                                key={cat.category}
                                className="rounded-lg border bg-muted/20 p-3 transition-colors hover:bg-muted/40"
                            >
                                <div className="mb-2 flex items-center gap-2">
                                    <BookMarked className="size-4 text-primary" />
                                    <span className="truncate text-sm font-medium">
                                        {cat.category}
                                    </span>
                                </div>
                                <div className="flex items-baseline justify-between">
                                    <span className="text-lg font-bold">
                                        {cat.count}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {pct}%
                                    </span>
                                </div>
                                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                                    <div
                                        className="h-full rounded-full bg-primary transition-all"
                                        style={{ width: `${pct}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
