import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import ConfirmModal from '@/components/shared/ConfirmModal';

interface Attendance {
    id: number;
    student_id: number;
    lecture_id: number;
    status: string;
    lecture_date: string;
    notes: string | null;
    student?: { id: number; name: string; registration_number: string };
    lecture?: { id: number; topic: string; course?: { name: string } };
}

interface Props {
    attendance: Attendance;
}

export default function AttendanceShow({ attendance }: Props) {
    const [showDelete, setShowDelete] = useState(false);

    return (
        <>
            <Head title="Attendance Record" />

            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/attendance">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">
                            Attendance Record
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {attendance.student?.name} -{' '}
                            {attendance.lecture?.topic}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                            <Link
                                href={`/admin/attendance/${attendance.id}/edit`}
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
                            Attendance Details
                        </h2>
                        <dl className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Student
                                </dt>
                                <dd>{attendance.student?.name ?? 'N/A'}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Lecture
                                </dt>
                                <dd>{attendance.lecture?.topic ?? 'N/A'}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Status
                                </dt>
                                <dd className="capitalize">
                                    {attendance.status}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">Date</dt>
                                <dd>
                                    {new Date(
                                        attendance.lecture_date,
                                    ).toLocaleDateString()}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">Notes</dt>
                                <dd>{attendance.notes ?? 'N/A'}</dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>

            <ConfirmModal
                open={showDelete}
                onClose={() => setShowDelete(false)}
                onConfirm={() => {
                    router.delete(`/admin/attendance/${attendance.id}`);
                    setShowDelete(false);
                }}
                title="Delete Attendance Record?"
                description="This will permanently delete this attendance record."
                confirmText="Delete"
                variant="destructive"
            />
        </>
    );
}

AttendanceShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Attendance', href: '/admin/attendance' },
        { title: 'Attendance Record', href: '' },
    ],
};
