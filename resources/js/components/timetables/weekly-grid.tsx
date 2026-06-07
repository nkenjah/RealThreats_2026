import { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface CourseBlock {
    id: number;
    course_code: string;
    course_name: string;
    venue: string;
    day: number;
    start_time: string;
    end_time: string;
    color?: string;
}

interface WeeklyGridProps {
    blocks: CourseBlock[];
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const HOURS = Array.from({ length: 12 }, (_, i) => i + 7);

const durationColor = (hours: number): string => {
    if (hours <= 1)
        return 'bg-green-100 border-green-300 text-green-800 dark:bg-green-900/30 dark:border-green-700 dark:text-green-300';
    if (hours <= 2)
        return 'bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-300';
    return 'bg-purple-100 border-purple-300 text-purple-800 dark:bg-purple-900/30 dark:border-purple-700 dark:text-purple-300';
};

function timeToMinutes(time: string): number {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + (m ?? 0);
}

export function WeeklyGrid({ blocks }: WeeklyGridProps) {
    const grid = useMemo(() => {
        const cols: Record<number, CourseBlock[]> = {};
        for (let d = 1; d <= 6; d++) cols[d] = [];
        for (const block of blocks) {
            if (block.day >= 1 && block.day <= 6) {
                cols[block.day].push(block);
            }
        }
        return cols;
    }, [blocks]);

    const timelineStart = 7 * 60;
    const timelineEnd = 18 * 60;
    const totalMinutes = timelineEnd - timelineStart;

    const topOffset = (time: string): number => {
        const mins = timeToMinutes(time) - timelineStart;
        return (mins / totalMinutes) * 100;
    };

    const heightPct = (start: string, end: string): number => {
        const s = timeToMinutes(start);
        const e = timeToMinutes(end);
        return ((e - s) / totalMinutes) * 100;
    };

    return (
        <div className="overflow-x-auto">
            <div className="min-w-[720px]">
                <div className="grid grid-cols-[60px_repeat(6,1fr)] gap-px bg-border">
                    <div className="bg-card p-2 text-center text-xs font-medium text-muted-foreground">
                        Time
                    </div>
                    {DAYS.map((day) => (
                        <div
                            key={day}
                            className="bg-card p-2 text-center text-xs font-semibold"
                        >
                            {day}
                        </div>
                    ))}
                    {HOURS.map((hour) => (
                        <>
                            <div
                                key={`time-${hour}`}
                                className="bg-card p-1 text-right text-[10px] text-muted-foreground"
                                style={{ height: `${100 / HOURS.length}%` }}
                            >
                                {hour.toString().padStart(2, '0')}:00
                            </div>
                            {DAYS.map((_, di) => (
                                <div
                                    key={`cell-${hour}-${di}`}
                                    className="bg-card/50"
                                    style={{ height: `${100 / HOURS.length}%` }}
                                />
                            ))}
                        </>
                    ))}
                </div>

                <div
                    className="relative"
                    style={{ height: `${HOURS.length * 60}px` }}
                >
                    <div
                        className="grid grid-cols-[60px_repeat(6,1fr)] gap-px bg-border"
                        style={{ height: '100%' }}
                    >
                        <div className="bg-card" />
                        {DAYS.map((day, di) => (
                            <div key={day} className="relative bg-card">
                                {(grid[di + 1] ?? []).map((block) => {
                                    const top = topOffset(block.start_time);
                                    const height = heightPct(
                                        block.start_time,
                                        block.end_time,
                                    );
                                    const hours =
                                        (timeToMinutes(block.end_time) -
                                            timeToMinutes(block.start_time)) /
                                        60;
                                    return (
                                        <div
                                            key={block.id}
                                            className={cn(
                                                'absolute right-0.5 left-0.5 z-10 overflow-hidden rounded border px-1.5 py-1 text-[10px] leading-tight transition-opacity hover:opacity-90',
                                                durationColor(hours),
                                            )}
                                            style={{
                                                top: `${top}%`,
                                                height: `${height}%`,
                                                minHeight: '24px',
                                            }}
                                            title={`${block.course_name}\n${block.venue}\n${block.start_time} - ${block.end_time}`}
                                        >
                                            <p className="truncate font-semibold">
                                                {block.course_code}
                                            </p>
                                            <p className="truncate opacity-75">
                                                {block.venue}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
