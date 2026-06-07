import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    description?: string;
    trend?: { value: number; positive: boolean };
    className?: string;
}

export function StatsCard({
    title,
    value,
    icon: Icon,
    description,
    trend,
    className,
}: StatsCardProps) {
    return (
        <div
            className={cn(
                'rounded-xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md',
                className,
            )}
        >
            <div className="flex items-start justify-between">
                <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                        {title}
                    </p>
                    <p className="text-2xl font-bold tracking-tight">{value}</p>
                    {description && (
                        <p className="text-xs text-muted-foreground">
                            {description}
                        </p>
                    )}
                    {trend && (
                        <div className="flex items-center gap-1 text-xs">
                            <span
                                className={
                                    trend.positive
                                        ? 'text-green-600'
                                        : 'text-red-600'
                                }
                            >
                                {trend.positive ? '+' : ''}
                                {trend.value}%
                            </span>
                            <span className="text-muted-foreground">
                                vs last month
                            </span>
                        </div>
                    )}
                </div>
                <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
                    <Icon className="size-5" />
                </div>
            </div>
        </div>
    );
}
