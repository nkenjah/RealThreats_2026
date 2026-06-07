import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Plus, LayoutGrid, Table2 } from 'lucide-react';
import { useState } from 'react';
import DataTable from '@/components/shared/DataTable';
import { WeeklyGrid } from '@/components/timetables/weekly-grid';

interface Timetable {
    id: number;
    course_offering_id: number;
    day_of_week: string;
    start_time: string;
    end_time: string;
    venue: string;
    semester: string;
    course_offering?: { id: number; course?: { name: string } };
}

interface Props {
    timetables: any;
    filters: Record<string, string | undefined>;
}

export default function TimetablesIndex({ timetables, filters }: Props) {
    const [view, setView] = useState<'table' | 'grid'>('table');

    const columns = [
        {
            key: 'course',
            label: 'Course',
            render: (tt: Timetable) => (
                <Link
                    href={`/admin/timetables/${tt.id}`}
                    className="font-medium hover:underline"
                >
                    {tt.course_offering?.course?.name ??
                        `Offering #${tt.course_offering_id}`}
                </Link>
            ),
        },
        {
            key: 'day_of_week',
            label: 'Day',
            render: (tt: Timetable) => (
                <span className="capitalize">{tt.day_of_week}</span>
            ),
        },
        { key: 'start_time', label: 'Start Time' },
        { key: 'end_time', label: 'End Time' },
        { key: 'venue', label: 'Venue' },
        { key: 'semester', label: 'Semester' },
        {
            key: 'actions',
            label: 'Actions',
            render: (tt: Timetable) => (
                <div className="flex gap-1">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/timetables/${tt.id}`}>View</Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/timetables/${tt.id}/edit`}>
                            Edit
                        </Link>
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <>
            <Head title="Timetables" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Timetables</h1>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center rounded-lg border p-0.5">
                            <Button
                                variant={
                                    view === 'grid' ? 'secondary' : 'ghost'
                                }
                                size="sm"
                                onClick={() => setView('grid')}
                                className="h-7 px-2"
                            >
                                <LayoutGrid className="size-4" />
                            </Button>
                            <Button
                                variant={
                                    view === 'table' ? 'secondary' : 'ghost'
                                }
                                size="sm"
                                onClick={() => setView('table')}
                                className="h-7 px-2"
                            >
                                <Table2 className="size-4" />
                            </Button>
                        </div>
                        <Button asChild>
                            <Link href="/admin/timetables/create">
                                <Plus className="mr-2 h-4 w-4" /> Create Entry
                            </Link>
                        </Button>
                    </div>
                </div>
                {view === 'grid' ? (
                    <WeeklyGrid
                        blocks={(timetables.data || []).map((tt: any) => ({
                            id: tt.id,
                            course_code: tt.course_offering?.course?.code ?? '',
                            course_name: tt.course_offering?.course?.name ?? '',
                            venue: tt.venue,
                            day: [
                                'Mon',
                                'Tue',
                                'Wed',
                                'Thu',
                                'Fri',
                                'Sat',
                            ].indexOf(tt.day_of_week),
                            start_time: tt.start_time,
                            end_time: tt.end_time,
                        }))}
                    />
                ) : (
                    <DataTable
                        data={timetables}
                        columns={columns}
                        filters={filters}
                        searchPlaceholder="Search by venue or course..."
                    />
                )}
            </div>
        </>
    );
}

TimetablesIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Timetables', href: '/admin/timetables' },
    ],
};
