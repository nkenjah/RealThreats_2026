import { useEffect, useState } from 'react';
import type { ThreatEvent } from '@/types';

export default function LiveThreatFeed() {
    const [threats, setThreats] = useState<ThreatEvent[]>([]);

    useEffect(() => {
        if (!window.Echo) return;

        const channel = window.Echo.channel('threats');

        channel.listen('ThreatDetectedEvent', (e: unknown) => {
            setThreats((prev) => [e as ThreatEvent, ...prev].slice(0, 20));
        });

        channel.listen('ThreatMitigatedEvent', (e: any) => {
            setThreats((prev) =>
                prev.map((t) =>
                    t.threat_id === e.threat_id
                        ? { ...t, severity: 'resolved' }
                        : t,
                ),
            );
        });

        return () => {
            window.Echo.leaveChannel('threats');
        };
    }, []);

    const severityColor = (sev: string) => {
        switch (sev) {
            case 'critical':
                return 'border-l-destructive bg-destructive/5';
            case 'high':
                return 'border-l-orange-500 bg-orange-500/5';
            case 'medium':
                return 'border-l-yellow-500 bg-yellow-500/5';
            case 'low':
                return 'border-l-blue-500 bg-blue-500/5';
            default:
                return 'border-l-muted-foreground bg-muted/30';
        }
    };

    return (
        <div className="space-y-2">
            {threats.length === 0 && (
                <div className="py-8 text-center text-sm text-muted-foreground">
                    No live threats. System is secure.
                </div>
            )}
            {threats.map((threat) => (
                <div
                    key={threat.threat_id}
                    className={`rounded border-l-4 p-3 text-sm transition-all ${severityColor(threat.severity)}`}
                >
                    <div className="flex items-center justify-between">
                        <span className="font-medium">{threat.user_name}</span>
                        <span className="text-xs text-muted-foreground">
                            {threat.timestamp}
                        </span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                        {threat.alert_type.replace(/_/g, ' ')}
                    </p>
                </div>
            ))}
        </div>
    );
}
