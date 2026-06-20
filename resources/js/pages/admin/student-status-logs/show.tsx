import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useState } from 'react';
import ConfirmModal from '@/components/shared/ConfirmModal';
import type { StudentStatusLog, Student } from '@/types';

interface Props {
    studentStatusLog: StudentStatusLog & {
        student: Student;
    };
}

export default function StudentStatusLogsShow({ studentStatusLog }: Props) {
    const [showDelete, setShowDelete] = useState(false);

    return (
        <>
            <Head title="Status Log Details" />

            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/student-status-logs">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">
                            Student Status Log
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {studentStatusLog.student?.name ?? 'N/A'}
                        </p>
                    </div>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setShowDelete(true)}
                    >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                </div>

                <div className="rounded-lg border bg-card p-4">
                    <h2 className="mb-4 text-sm font-medium">Details</h2>
                    <dl className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">ID</dt>
                            <dd>{studentStatusLog.id}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">Student</dt>
                            <dd>{studentStatusLog.student?.name ?? 'N/A'}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">
                                Previous Status
                            </dt>
                            <dd className="capitalize">
                                {studentStatusLog.previous_status.replace(
                                    /_/g,
                                    ' ',
                                )}
                            </dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">
                                New Status
                            </dt>
                            <dd className="capitalize">
                                {studentStatusLog.new_status.replace(/_/g, ' ')}
                            </dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">Reason</dt>
                            <dd>{studentStatusLog.reason ?? 'N/A'}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">
                                Changed By
                            </dt>
                            <dd>{studentStatusLog.changed_by ?? 'N/A'}</dd>
                        </div>
                    </dl>
                </div>
            </div>

            <ConfirmModal
                open={showDelete}
                onClose={() => setShowDelete(false)}
                onConfirm={() => {
                    router.delete(
                        `/admin/student-status-logs/${studentStatusLog.id}`,
                    );
                    setShowDelete(false);
                }}
                title="Delete Status Log?"
                description="This will permanently delete this status log entry."
                confirmText="Delete"
                variant="destructive"
            />
        </>
    );
}

StudentStatusLogsShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Student Status Logs', href: '/admin/student-status-logs' },
        { title: 'Status Log Details', href: '' },
    ],
};
