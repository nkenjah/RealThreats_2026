import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

interface AlertTrendChartProps {
    data: Array<{ date: string; count: number }>;
}

export default function AlertTrendChart({ data }: AlertTrendChartProps) {
    return (
        <div className="h-[250px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid
                        strokeDasharray="3 3"
                        className="stroke-border"
                    />
                    <XAxis
                        dataKey="date"
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
                            backgroundColor: 'var(--background)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius)',
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="count"
                        stroke="var(--primary)"
                        strokeWidth={2}
                        dot={{ r: 3, fill: 'var(--primary)' }}
                        activeDot={{ r: 5 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
