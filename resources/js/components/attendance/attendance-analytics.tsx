import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { StatsCard } from '@/components/shared/stats-card';

interface AttendanceAnalyticsProps {
    present: number;
    absent: number;
    late: number;
    excused: number;
    total: number;
}

export function AttendanceAnalytics({
    present,
    absent,
    late,
    excused,
    total,
}: AttendanceAnalyticsProps) {
    const rate = total > 0 ? Math.round((present / total) * 100) : 0;
    const segments = [
        { label: 'Present', value: present, color: '#22c55e', offset: 0 },
        { label: 'Late', value: late, color: '#eab308', offset: 0 },
        { label: 'Excused', value: excused, color: '#3b82f6', offset: 0 },
        { label: 'Absent', value: absent, color: '#ef4444', offset: 0 },
    ];

    const totalSegments = segments.reduce((s, seg) => s + seg.value, 0) || 1;
    let cumulative = 0;
    const arcs = segments.map((seg) => {
        const startAngle = (cumulative / totalSegments) * 360;
        cumulative += seg.value;
        const endAngle = (cumulative / totalSegments) * 360;
        return { ...seg, startAngle, endAngle };
    });

    const polarToCartesian = (
        cx: number,
        cy: number,
        r: number,
        angleDeg: number,
    ) => {
        const rad = ((angleDeg - 90) * Math.PI) / 180;
        return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
    };

    const describeArc = (startAngle: number, endAngle: number) => {
        const cx = 60,
            cy = 60,
            r = 50;
        const start = polarToCartesian(cx, cy, r, endAngle);
        const end = polarToCartesian(cx, cy, r, startAngle);
        const largeArc = endAngle - startAngle > 180 ? 1 : 0;
        return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
    };

    return (
        <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Present"
                    value={present}
                    icon={CheckCircle}
                    description={`${total > 0 ? Math.round((present / total) * 100) : 0}% of total`}
                />
                <StatsCard
                    title="Absent"
                    value={absent}
                    icon={XCircle}
                    description={`${total > 0 ? Math.round((absent / total) * 100) : 0}% of total`}
                />
                <StatsCard
                    title="Late"
                    value={late}
                    icon={Clock}
                    description={`${total > 0 ? Math.round((late / total) * 100) : 0}% of total`}
                />
                <StatsCard
                    title="Excused"
                    value={excused}
                    icon={AlertCircle}
                    description={`${total > 0 ? Math.round((excused / total) * 100) : 0}% of total`}
                />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-xl border bg-card p-5 shadow-sm">
                    <h3 className="mb-4 text-sm font-semibold">
                        Attendance Rate
                    </h3>
                    <div className="flex items-center justify-center">
                        <div className="relative size-[200px]">
                            <svg
                                viewBox="0 0 120 120"
                                className="size-full -rotate-90"
                            >
                                {arcs.map((arc) => {
                                    if (arc.value === 0) return null;
                                    const pathD = describeArc(
                                        arc.startAngle,
                                        arc.endAngle,
                                    );
                                    return (
                                        <path
                                            key={arc.label}
                                            d={pathD}
                                            fill={arc.color}
                                            opacity="0.85"
                                        />
                                    );
                                })}
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <span className="text-3xl font-bold">
                                        {rate}%
                                    </span>
                                    <p className="text-xs text-muted-foreground">
                                        Attendance
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border bg-card p-5 shadow-sm">
                    <h3 className="mb-4 text-sm font-semibold">Legend</h3>
                    <div className="space-y-3">
                        {segments.map((seg) => (
                            <div
                                key={seg.label}
                                className="flex items-center justify-between text-sm"
                            >
                                <div className="flex items-center gap-2">
                                    <span
                                        className="size-3 rounded-sm"
                                        style={{ backgroundColor: seg.color }}
                                    />
                                    <span className="text-muted-foreground">
                                        {seg.label}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="font-medium">
                                        {seg.value}
                                    </span>
                                    <span className="w-12 text-right text-xs text-muted-foreground">
                                        {total > 0
                                            ? Math.round(
                                                  (seg.value / total) * 100,
                                              )
                                            : 0}
                                        %
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
