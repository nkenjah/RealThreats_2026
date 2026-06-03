import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatsCardProps {
    title: string;
    value: number | string;
    icon: LucideIcon;
    variant?: 'default' | 'destructive' | 'warning' | 'success';
}

export default function StatsCard({
    title,
    value,
    icon: Icon,
    variant = 'default',
}: StatsCardProps) {
    const variantStyles = {
        default: 'text-foreground',
        destructive: 'text-destructive',
        warning: 'text-orange-500',
        success: 'text-green-500',
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className={`h-4 w-4 ${variantStyles[variant]}`} />
            </CardHeader>
            <CardContent>
                <div className={`text-2xl font-bold ${variantStyles[variant]}`}>
                    {value}
                </div>
            </CardContent>
        </Card>
    );
}
