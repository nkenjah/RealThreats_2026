import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit2, Trash2, Check, X } from 'lucide-react';
import { useState } from 'react';
import ConfirmModal from '@/components/shared/ConfirmModal';
import type { Application } from '@/types';

interface Props {
    application: Application & {
        application_requirements?: Array<{
            id: number;
            name: string;
            is_met: boolean;
            notes?: string;
        }>;
    };
}

export default function ApplicationsShow({ application }: Props) {
    const [showDelete, setShowDelete] = useState(false);

    return (
        <>
            <Head title={`Application #${application.id}`} />

            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/admissions/applications">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">
                            Application #{application.id}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {application.program?.name ?? 'N/A'}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                            <Link
                                href={`/admin/admissions/applications/${application.id}/edit`}
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
                            Application Details
                        </h2>
                        <dl className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Prospect
                                </dt>
                                <dd>
                                    {application.prospect?.first_name}{' '}
                                    {application.prospect?.last_name}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Program
                                </dt>
                                <dd>{application.program?.name ?? 'N/A'}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Status
                                </dt>
                                <dd className="capitalize">
                                    {application.status.replace(/_/g, ' ')}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Reviewer
                                </dt>
                                <dd>
                                    {application.reviewer?.name ?? 'Unassigned'}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Submission Date
                                </dt>
                                <dd>
                                    {application.submission_date
                                        ? new Date(
                                              application.submission_date,
                                          ).toLocaleDateString()
                                        : 'N/A'}
                                </dd>
                            </div>
                            {application.review_notes && (
                                <div className="flex justify-between">
                                    <dt className="text-muted-foreground">
                                        Review Notes
                                    </dt>
                                    <dd className="max-w-[200px] text-right">
                                        {application.review_notes}
                                    </dd>
                                </div>
                            )}
                        </dl>
                    </div>

                    <div className="rounded-lg border bg-card p-4">
                        <h2 className="mb-4 text-sm font-medium">
                            Requirements
                        </h2>
                        {application.application_requirements &&
                        application.application_requirements.length > 0 ? (
                            <div className="space-y-2">
                                {application.application_requirements.map(
                                    (req) => (
                                        <div
                                            key={req.id}
                                            className="flex items-center justify-between rounded-md border p-3 text-sm"
                                        >
                                            <div className="flex items-center gap-2">
                                                {req.is_met ? (
                                                    <Check className="h-4 w-4 text-green-500" />
                                                ) : (
                                                    <X className="h-4 w-4 text-destructive" />
                                                )}
                                                <span>{req.name}</span>
                                            </div>
                                            {req.notes && (
                                                <span className="text-xs text-muted-foreground">
                                                    {req.notes}
                                                </span>
                                            )}
                                        </div>
                                    ),
                                )}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                No requirements specified.
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <ConfirmModal
                open={showDelete}
                onClose={() => setShowDelete(false)}
                onConfirm={() => {
                    router.delete(
                        `/admin/admissions/applications/${application.id}`,
                    );
                    setShowDelete(false);
                }}
                title="Delete Application?"
                description="This will permanently delete this application record."
                confirmText="Delete"
                variant="destructive"
            />
        </>
    );
}

ApplicationsShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Admissions', href: '/admin/admissions' },
        { title: 'Applications', href: '/admin/admissions/applications' },
        { title: 'Application Details', href: '' },
    ],
};
