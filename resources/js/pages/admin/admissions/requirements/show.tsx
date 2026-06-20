import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trash2, Check, X } from 'lucide-react';
import { useState } from 'react';
import ConfirmModal from '@/components/shared/ConfirmModal';
import type { ApplicationRequirement, Application, Prospect } from '@/types';

interface Props {
    applicationRequirement: ApplicationRequirement & {
        application: Application & { prospect?: Prospect };
    };
}

export default function ApplicationRequirementsShow({
    applicationRequirement,
}: Props) {
    const [showDelete, setShowDelete] = useState(false);

    return (
        <>
            <Head title={`Requirement: ${applicationRequirement.name}`} />

            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/admissions/application-requirements">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">
                            {applicationRequirement.name}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {
                                applicationRequirement.application?.prospect
                                    ?.first_name
                            }{' '}
                            {
                                applicationRequirement.application?.prospect
                                    ?.last_name
                            }
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
                            <dd>{applicationRequirement.id}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">Name</dt>
                            <dd>{applicationRequirement.name}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">Met</dt>
                            <dd>
                                {applicationRequirement.is_met ? (
                                    <Check className="h-4 w-4 text-green-500" />
                                ) : (
                                    <X className="h-4 w-4 text-destructive" />
                                )}
                            </dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">Notes</dt>
                            <dd>{applicationRequirement.notes ?? 'N/A'}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">
                                Application
                            </dt>
                            <dd>#{applicationRequirement.application_id}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">
                                Created At
                            </dt>
                            <dd>
                                {new Date(
                                    applicationRequirement.created_at,
                                ).toLocaleDateString()}
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
                        `/admin/admissions/application-requirements/${applicationRequirement.id}`,
                    );
                    setShowDelete(false);
                }}
                title="Delete Requirement?"
                description="This will permanently delete this application requirement."
                confirmText="Delete"
                variant="destructive"
            />
        </>
    );
}

ApplicationRequirementsShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Admissions', href: '/admin/admissions' },
        {
            title: 'Requirements',
            href: '/admin/admissions/application-requirements',
        },
        { title: 'Requirement Details', href: '' },
    ],
};
