import { Badge } from '@/components/ui/badge';

interface UserRiskBadgeProps {
    score: number;
}

export default function UserRiskBadge({ score }: UserRiskBadgeProps) {
    const color = (s: number) => {
        if (s >= 76) return 'bg-destructive text-destructive-foreground';
        if (s >= 61) return 'bg-orange-500 text-white';
        if (s >= 31) return 'bg-yellow-500 text-black';
        return 'bg-green-500 text-white';
    };

    return <Badge className={color(score)}>{score}/100</Badge>;
}
