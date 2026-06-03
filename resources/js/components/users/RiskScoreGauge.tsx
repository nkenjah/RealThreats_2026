import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';

interface RiskScoreGaugeProps {
    score: number;
}

export default function RiskScoreGauge({ score }: RiskScoreGaugeProps) {
    const color =
        score >= 76
            ? '#ef4444'
            : score >= 61
              ? '#f97316'
              : score >= 31
                ? '#eab308'
                : '#22c55e';

    const data = [
        { name: 'Risk', value: score, fill: color },
        { name: 'Remaining', value: 100 - score, fill: 'var(--muted)' },
    ];

    return (
        <div className="flex flex-col items-center">
            <div className="h-[150px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                        cx="50%"
                        cy="50%"
                        innerRadius="60%"
                        outerRadius="100%"
                        barSize={15}
                        data={data}
                        startAngle={180}
                        endAngle={0}
                    >
                        <RadialBar dataKey="value" cornerRadius={10} />
                    </RadialBarChart>
                </ResponsiveContainer>
            </div>
            <div className="-mt-8 text-center">
                <span className="text-3xl font-bold" style={{ color }}>
                    {score}
                </span>
                <span className="text-sm text-muted-foreground">/100</span>
                <p className="text-xs text-muted-foreground">
                    {score >= 76
                        ? 'Critical'
                        : score >= 61
                          ? 'High Risk'
                          : score >= 31
                            ? 'Medium Risk'
                            : 'Low Risk'}
                </p>
            </div>
        </div>
    );
}
