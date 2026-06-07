import { useCallback, useState } from 'react';
import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';

interface Prospect {
    id: number;
    name: string;
    email: string;
    gpa: number;
    entry_term: string;
    high_school: string;
    status: ProspectStatus;
}

type ProspectStatus =
    | 'new'
    | 'contacted'
    | 'applied'
    | 'qualified'
    | 'disqualified';

const columns: { status: ProspectStatus; label: string }[] = [
    { status: 'new', label: 'New' },
    { status: 'contacted', label: 'Contacted' },
    { status: 'applied', label: 'Applied' },
    { status: 'qualified', label: 'Qualified' },
    { status: 'disqualified', label: 'Disqualified' },
];

const statusColors: Record<ProspectStatus, string> = {
    new: 'border-l-blue-500',
    contacted: 'border-l-yellow-500',
    applied: 'border-l-purple-500',
    qualified: 'border-l-green-500',
    disqualified: 'border-l-red-500',
};

interface ProspectsKanbanProps {
    prospects: Prospect[];
    onStatusChange?: (id: number, status: ProspectStatus) => void;
}

export function ProspectsKanban({
    prospects,
    onStatusChange,
}: ProspectsKanbanProps) {
    const [dragOver, setDragOver] = useState<ProspectStatus | null>(null);
    const [draggedId, setDraggedId] = useState<number | null>(null);

    const grouped = columns.reduce(
        (acc, col) => {
            acc[col.status] = prospects.filter((p) => p.status === col.status);
            return acc;
        },
        {} as Record<ProspectStatus, Prospect[]>,
    );

    const handleDragStart = useCallback(
        (e: React.DragEvent, prospect: Prospect) => {
            setDraggedId(prospect.id);
            e.dataTransfer.setData('text/plain', String(prospect.id));
            e.dataTransfer.effectAllowed = 'move';
        },
        [],
    );

    const handleDragOver = useCallback(
        (e: React.DragEvent, status: ProspectStatus) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            setDragOver(status);
        },
        [],
    );

    const handleDragLeave = useCallback(() => {
        setDragOver(null);
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent, status: ProspectStatus) => {
            e.preventDefault();
            setDragOver(null);
            setDraggedId(null);
            const id = Number(e.dataTransfer.getData('text/plain'));
            if (onStatusChange && id) {
                onStatusChange(id, status);
            }
        },
        [onStatusChange],
    );

    const handleDragEnd = useCallback(() => {
        setDraggedId(null);
        setDragOver(null);
    }, []);

    return (
        <div className="flex gap-4 overflow-x-auto pb-4">
            {columns.map((col) => {
                const items = grouped[col.status];
                const isOver = dragOver === col.status;
                return (
                    <div
                        key={col.status}
                        onDragOver={(e) => handleDragOver(e, col.status)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, col.status)}
                        className={cn(
                            'flex min-h-[400px] w-64 shrink-0 flex-col rounded-lg border bg-muted/30 p-3 transition-colors',
                            isOver && 'border-primary bg-primary/5',
                        )}
                    >
                        <div className="mb-3 flex items-center justify-between">
                            <h3 className="text-sm font-semibold">
                                {col.label}
                            </h3>
                            <span className="flex size-6 items-center justify-center rounded-full bg-muted text-xs font-medium">
                                {items.length}
                            </span>
                        </div>
                        <div className="flex flex-1 flex-col gap-2">
                            {items.length === 0 && (
                                <div className="flex flex-1 items-center justify-center rounded-lg border-2 border-dashed text-xs text-muted-foreground">
                                    Drop here
                                </div>
                            )}
                            {items.map((prospect) => (
                                <div
                                    key={prospect.id}
                                    draggable
                                    onDragStart={(e) =>
                                        handleDragStart(e, prospect)
                                    }
                                    onDragEnd={handleDragEnd}
                                    className={cn(
                                        'cursor-grab rounded-lg border border-l-4 bg-card p-3 shadow-sm transition-all hover:shadow-md active:cursor-grabbing',
                                        statusColors[prospect.status],
                                        draggedId === prospect.id &&
                                            'opacity-50',
                                    )}
                                >
                                    <Link
                                        href={`/admin/admissions/prospects/${prospect.id}`}
                                        className="block"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <p className="truncate text-sm font-medium">
                                            {prospect.name}
                                        </p>
                                        <p className="truncate text-xs text-muted-foreground">
                                            {prospect.email}
                                        </p>
                                        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                                            <span>GPA: {prospect.gpa}</span>
                                            <span>{prospect.entry_term}</span>
                                        </div>
                                        <p className="truncate text-[11px] text-muted-foreground">
                                            {prospect.high_school}
                                        </p>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
