import type { ActivityLog } from '@/types';

interface UserActivityTimelineProps {
    activity: ActivityLog[];
}

export default function UserActivityTimeline({
    activity,
}: UserActivityTimelineProps) {
    return (
        <div className="space-y-3">
            {activity.map((entry) => (
                <div
                    key={entry.id}
                    className="flex gap-3 rounded-lg border p-3 text-sm"
                >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
                        {entry.risk_score_contribution}
                    </div>
                    <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                            <span className="font-medium capitalize">
                                {entry.action.replace(/_/g, ' ')}
                            </span>
                            <span className="text-xs text-muted-foreground">
                                {new Date(entry.created_at).toLocaleString()}
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {entry.description}
                        </p>
                        <div className="flex gap-3 text-[10px] text-muted-foreground/60">
                            <span>Module: {entry.module}</span>
                            <span>IP: {entry.ip_address}</span>
                        </div>
                    </div>
                </div>
            ))}
            {activity.length === 0 && (
                <div className="py-8 text-center text-sm text-muted-foreground">
                    No activity recorded
                </div>
            )}
        </div>
    );
}
