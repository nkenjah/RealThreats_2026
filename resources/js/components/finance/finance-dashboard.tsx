import { DollarSign, Banknote, TrendingUp, Receipt } from 'lucide-react';
import { StatsCard } from '@/components/shared/stats-card';

interface MethodBreakdown {
    payment_method: string;
    count: number;
    total: number;
}

interface MonthlyCollection {
    month: string;
    total: number;
}

interface FinanceDashboardProps {
    total_collected: number;
    pending_payments: number;
    pending_amount: number;
    total_transactions: number;
    by_method: MethodBreakdown[];
    monthly_collections: MonthlyCollection[];
}

const formatTZS = (amount: number) =>
    new Intl.NumberFormat('en-TZ', {
        style: 'currency',
        currency: 'TZS',
        minimumFractionDigits: 0,
    }).format(amount);

export function FinanceDashboard({
    total_collected,
    pending_payments,
    pending_amount,
    total_transactions,
    by_method,
    monthly_collections,
}: FinanceDashboardProps) {
    const maxMonthly = Math.max(...monthly_collections.map((m) => m.total), 1);

    return (
        <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Collected"
                    value={formatTZS(total_collected)}
                    icon={DollarSign}
                    trend={{ value: 12, positive: true }}
                />
                <StatsCard
                    title="Pending Payments"
                    value={pending_payments}
                    icon={Receipt}
                    description={`${formatTZS(pending_amount)} outstanding`}
                />
                <StatsCard
                    title="Total Transactions"
                    value={total_transactions}
                    icon={TrendingUp}
                />
                <StatsCard
                    title="Collection Rate"
                    value={total_collected > 0 ? '85%' : '0%'}
                    icon={Banknote}
                />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-xl border bg-card p-5 shadow-sm">
                    <h3 className="mb-4 text-sm font-semibold">
                        Collections by Method
                    </h3>
                    {by_method.length === 0 ? (
                        <p className="py-4 text-center text-sm text-muted-foreground">
                            No data.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {by_method.map((m) => {
                                const pct =
                                    total_collected > 0
                                        ? (m.total / total_collected) * 100
                                        : 0;
                                return (
                                    <div key={m.payment_method}>
                                        <div className="mb-1 flex justify-between text-xs">
                                            <span className="font-medium capitalize">
                                                {m.payment_method}
                                            </span>
                                            <span className="text-muted-foreground">
                                                {formatTZS(m.total)} (
                                                {Math.round(pct)}%)
                                            </span>
                                        </div>
                                        <div className="h-2 overflow-hidden rounded-full bg-muted">
                                            <div
                                                className="h-full rounded-full bg-green-500 transition-all"
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="rounded-xl border bg-card p-5 shadow-sm">
                    <h3 className="mb-4 text-sm font-semibold">
                        Monthly Collections (12mo)
                    </h3>
                    {monthly_collections.length === 0 ? (
                        <p className="py-4 text-center text-sm text-muted-foreground">
                            No data.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {monthly_collections.map((m) => (
                                <div key={m.month}>
                                    <div className="mb-1 flex justify-between text-xs">
                                        <span className="font-medium">
                                            {m.month}
                                        </span>
                                        <span className="text-muted-foreground">
                                            {formatTZS(m.total)}
                                        </span>
                                    </div>
                                    <div className="h-3 overflow-hidden rounded-full bg-muted">
                                        <div
                                            className="h-full rounded-full bg-blue-500 transition-all"
                                            style={{
                                                width: `${(m.total / maxMonthly) * 100}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
