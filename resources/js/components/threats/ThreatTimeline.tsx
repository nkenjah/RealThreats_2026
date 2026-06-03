import type { ActivityLog } from '@/types';

interface ThreatTimelineProps {
    timeline: ActivityLog[];
}

export default function ThreatTimeline({ timeline }: ThreatTimelineProps) {
    const actionColor = (action: string) => {
        switch (action) {
            case 'failed_login':
                return 'border-l-destructive';
            case 'unauthorized_access':
            case 'privilege_escalation':
                return 'border-l-orange-500';
            case 'off_hours_access':
                return 'border-l-yellow-500';
            case 'data_export':
            case 'bulk_download':
                return 'border-l-red-500';
            default:
                return 'border-l-muted-foreground';
        }
    };

    return (
        <div className="space-y-3">
            {timeline.map((entry) => (
                <div
                    key={entry.id}
                    className={`rounded-lg border-l-4 bg-card p-3 text-sm shadow-sm ${actionColor(entry.action)}`}
                >
                    <div className="flex items-center justify-between">
                        <span className="font-medium capitalize">
                            {entry.action.replace(/_/g, ' ')}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            {new Date(entry.created_at).toLocaleString()}
                        </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                        {entry.description}
                    </p>
                    <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                        <span>Module: {entry.module}</span>
                        <span>Risk: +{entry.risk_score_contribution}</span>
                        <span>IP: {entry.ip_address}</span>
                    </div>
                </div>
            ))}
            {timeline.length === 0 && (
                <div className="py-8 text-center text-sm text-muted-foreground">
                    No activity recorded
                </div>
            )}
        </div>
    );
}
