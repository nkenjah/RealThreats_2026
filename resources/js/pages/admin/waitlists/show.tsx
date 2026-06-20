import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useState } from 'react';
import ConfirmModal from '@/components/shared/ConfirmModal';
import type { Waitlist, CourseOffering, Course, Student } from '@/types';

interface Props {
    waitlist: Waitlist & {
        course_offering: CourseOffering & { course?: Course };
        student: Student;
    };
}

export default function WaitlistsShow({ waitlist }: Props) {
    const [showDelete, setShowDelete] = useState(false);

    return (
        <>
            <Head title={`Waitlist #${waitlist.id}`} />

            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/waitlists">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">
                            {waitlist.course_offering?.course?.name ??
                                `Waitlist #${waitlist.id}`}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {waitlist.student?.name ?? 'N/A'}
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
                            <dd>{waitlist.id}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">Position</dt>
                            <dd>{waitlist.position}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">Status</dt>
                            <dd className="capitalize">
                                {waitlist.status.replace(/_/g, ' ')}
                            </dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">
                                Course Offering
                            </dt>
                            <dd>
                                {waitlist.course_offering?.course?.name ??
                                    `#${waitlist.course_offering_id}`}
                            </dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">Student</dt>
                            <dd>{waitlist.student?.name ?? 'N/A'}</dd>
                        </div>
                    </dl>
                </div>
            </div>

            <ConfirmModal
                open={showDelete}
                onClose={() => setShowDelete(false)}
                onConfirm={() => {
                    router.delete(`/admin/waitlists/${waitlist.id}`);
                    setShowDelete(false);
                }}
                title="Delete Waitlist Entry?"
                description="This will permanently delete this waitlist entry."
                confirmText="Delete"
                variant="destructive"
            />
        </>
    );
}

WaitlistsShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Waitlists', href: '/admin/waitlists' },
        { title: 'Waitlist Details', href: '' },
    ],
};
