import { Badge } from '@/components/ui/badge';

export function ThreatStatusBadge({ status }: { status: string }) {
    const variants: Record<
        string,
        'default' | 'secondary' | 'outline' | 'destructive'
    > = {
        open: 'destructive',
        investigating: 'default',
        resolved: 'secondary',
        false_positive: 'outline',
    };

    return (
        <Badge variant={variants[status] ?? 'outline'}>
            {status.replace(/_/g, ' ')}
        </Badge>
    );
}

export function ThreatSeverityBadge({ severity }: { severity: string }) {
    const colors: Record<string, string> = {
        critical:
            'bg-destructive text-destructive-foreground hover:bg-destructive/80',
        high: 'bg-orange-500 text-white hover:bg-orange-500/80',
        medium: 'bg-yellow-500 text-black hover:bg-yellow-500/80',
        low: 'bg-blue-500 text-white hover:bg-blue-500/80',
    };

    return <Badge className={colors[severity] ?? ''}>{severity}</Badge>;
}
