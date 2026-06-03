import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import ConfirmModal from '@/components/shared/ConfirmModal';

interface MitigationPanelProps {
    alertId: number;
    currentStatus: string;
}

export default function MitigationPanel({
    alertId,
    currentStatus,
}: MitigationPanelProps) {
    const [status, setStatus] = useState(currentStatus);
    const [notes, setNotes] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);
    const [pendingAction, setPendingAction] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const statuses = [
        { value: 'open', label: 'Open' },
        { value: 'investigating', label: 'Investigating' },
        { value: 'resolved', label: 'Resolved' },
        { value: 'false_positive', label: 'False Positive' },
    ];

    const handleStatusClick = (newStatus: string) => {
        setPendingAction(newStatus);
        setShowConfirm(true);
    };

    const confirmUpdate = () => {
        if (!pendingAction) return;
        setLoading(true);
        router.patch(
            `/admin/threat-alerts/${alertId}`,
            { status: pendingAction, notes },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setStatus(pendingAction);
                    setShowConfirm(false);
                    setPendingAction(null);
                    setLoading(false);
                },
                onError: () => setLoading(false),
            },
        );
    };

    return (
        <div className="space-y-4">
            <h3 className="text-sm font-medium">Update Status</h3>
            <div className="flex flex-wrap gap-2">
                {statuses.map((s) => (
                    <Button
                        key={s.value}
                        variant={status === s.value ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleStatusClick(s.value)}
                        disabled={status === s.value}
                    >
                        {s.label}
                    </Button>
                ))}
            </div>
            <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about this action..."
                className="w-full rounded-md border border-input bg-background p-3 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                rows={3}
            />
            <ConfirmModal
                open={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={confirmUpdate}
                title={`Change status to "${pendingAction?.replace(/_/g, ' ')}"?`}
                description="This action will be logged and broadcast to administrators."
                confirmText="Confirm"
                variant={
                    pendingAction === 'resolved' ? 'default' : 'destructive'
                }
                loading={loading}
            />
        </div>
    );
}
