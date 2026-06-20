import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useState } from 'react';
import ConfirmModal from '@/components/shared/ConfirmModal';
import type { GraduationApplication, Student } from '@/types';

interface Props {
    graduationApplication: GraduationApplication & {
        student: Student;
    };
}

export default function GraduationApplicationsShow({
    graduationApplication,
}: Props) {
    const [showDelete, setShowDelete] = useState(false);

    return (
        <>
            <Head title="Graduation Application Details" />

            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/academics/graduation-applications">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">
                            Graduation Application
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {graduationApplication.student?.name ?? 'N/A'}
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
                            <dd>{graduationApplication.id}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">Student</dt>
                            <dd>
                                {graduationApplication.student?.name ?? 'N/A'}
                            </dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">
                                Application Date
                            </dt>
                            <dd>
                                {new Date(
                                    graduationApplication.application_date,
                                ).toLocaleDateString()}
                            </dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">Status</dt>
                            <dd className="capitalize">
                                {graduationApplication.status.replace(
                                    /_/g,
                                    ' ',
                                )}
                            </dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">
                                Approved At
                            </dt>
                            <dd>
                                {graduationApplication.approved_at
                                    ? new Date(
                                          graduationApplication.approved_at,
                                      ).toLocaleDateString()
                                    : 'N/A'}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>

            <ConfirmModal
                open={showDelete}
                onClose={() => setShowDelete(false)}
                onConfirm={() => {
                    router.delete(
                        `/admin/academics/graduation-applications/${graduationApplication.id}`,
                    );
                    setShowDelete(false);
                }}
                title="Delete Application?"
                description="This will permanently delete this graduation application."
                confirmText="Delete"
                variant="destructive"
            />
        </>
    );
}

GraduationApplicationsShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Academic Records', href: '/admin/academic-records' },
        {
            title: 'Graduation Applications',
            href: '/admin/academics/graduation-applications',
        },
        { title: 'Application Details', href: '' },
    ],
};
