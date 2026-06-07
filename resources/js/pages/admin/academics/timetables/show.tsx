import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import ConfirmModal from '@/components/shared/ConfirmModal';

interface Timetable {
    id: number;
    day_of_week: string;
    start_time: string;
    end_time: string;
    venue: string;
    semester: string;
    course_offering?: { id: number; course?: { name: string; code: string } };
    lecturer?: { id: number; user?: { name: string } };
}

interface Props {
    timetable: Timetable;
}

export default function TimetablesShow({ timetable }: Props) {
    const [showDelete, setShowDelete] = useState(false);

    return (
        <>
            <Head title="Timetable Details" />
            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/timetables">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold capitalize">
                            {timetable.day_of_week}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {timetable.venue}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                            <Link
                                href={`/admin/timetables/${timetable.id}/edit`}
                            >
                                <Edit2 className="mr-2 h-4 w-4" /> Edit
                            </Link>
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setShowDelete(true)}
                        >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-lg border bg-card p-4">
                        <h2 className="mb-4 text-sm font-medium">
                            Timetable Details
                        </h2>
                        <dl className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Course
                                </dt>
                                <dd>
                                    {timetable.course_offering?.course?.name ??
                                        'N/A'}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">Day</dt>
                                <dd className="capitalize">
                                    {timetable.day_of_week}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Start Time
                                </dt>
                                <dd>{timetable.start_time}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    End Time
                                </dt>
                                <dd>{timetable.end_time}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">Venue</dt>
                                <dd>{timetable.venue}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Semester
                                </dt>
                                <dd>{timetable.semester}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Lecturer
                                </dt>
                                <dd>
                                    {timetable.lecturer?.user?.name ?? 'N/A'}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>

            <ConfirmModal
                open={showDelete}
                onClose={() => setShowDelete(false)}
                onConfirm={() => {
                    router.delete(`/admin/timetables/${timetable.id}`);
                    setShowDelete(false);
                }}
                title="Delete Timetable Entry?"
                description="This will permanently delete this timetable entry."
                confirmText="Delete"
                variant="destructive"
            />
        </>
    );
}

TimetablesShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Timetables', href: '/admin/timetables' },
        { title: 'Timetable Details', href: '' },
    ],
};
