import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit2, Trash2, Lock, Unlock } from 'lucide-react';
import { useState } from 'react';
import ConfirmModal from '@/components/shared/ConfirmModal';
import type { Exam } from '@/types';

interface Props {
    exam: Exam;
}

export default function ExamsShow({ exam }: Props) {
    const [showDelete, setShowDelete] = useState(false);

    return (
        <>
            <Head title={`Exam: ${exam.exam_type}`} />

            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/exams">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold capitalize">
                            {exam.exam_type}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {exam.course?.name}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant={exam.is_locked ? 'outline' : 'default'}
                            size="sm"
                            onClick={() =>
                                router.post(
                                    `/admin/exams/${exam.id}/toggle-lock`,
                                )
                            }
                        >
                            {exam.is_locked ? (
                                <>
                                    <Unlock className="mr-2 h-4 w-4" /> Unlock
                                </>
                            ) : (
                                <>
                                    <Lock className="mr-2 h-4 w-4" /> Lock
                                </>
                            )}
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/exams/${exam.id}/edit`}>
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
                            Exam Details
                        </h2>
                        <dl className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Course
                                </dt>
                                <dd>{exam.course?.name ?? 'N/A'}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">Type</dt>
                                <dd className="capitalize">{exam.exam_type}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Starts At
                                </dt>
                                <dd>
                                    {new Date(exam.starts_at).toLocaleString()}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Duration
                                </dt>
                                <dd>{exam.duration_minutes} minutes</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">Venue</dt>
                                <dd>{exam.venue}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Status
                                </dt>
                                <dd
                                    className={
                                        exam.is_locked
                                            ? 'text-green-500'
                                            : 'text-amber-500'
                                    }
                                >
                                    {exam.is_locked ? 'Locked' : 'Open'}
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
                    router.delete(`/admin/exams/${exam.id}`);
                    setShowDelete(false);
                }}
                title="Delete Exam?"
                description={`This will permanently delete this exam.`}
                confirmText="Delete"
                variant="destructive"
            />
        </>
    );
}

ExamsShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Exams', href: '/admin/exams' },
        { title: 'Exam Details', href: '' },
    ],
};
