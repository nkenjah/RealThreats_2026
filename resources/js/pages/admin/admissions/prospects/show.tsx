import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit2, Trash2, Plus } from 'lucide-react';
import { useState } from 'react';
import ConfirmModal from '@/components/shared/ConfirmModal';
import type { Prospect, Application } from '@/types';

interface Props {
    prospect: Prospect & { applications?: Application[] };
}

export default function ProspectsShow({ prospect }: Props) {
    const [showDelete, setShowDelete] = useState(false);

    return (
        <>
            <Head title={`${prospect.first_name} ${prospect.last_name}`} />

            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/admissions/prospects">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">
                            {prospect.first_name} {prospect.last_name}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {prospect.email}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                            <Link
                                href={`/admin/admissions/prospects/${prospect.id}/edit`}
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
                            Prospect Details
                        </h2>
                        <dl className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    First Name
                                </dt>
                                <dd>{prospect.first_name}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Last Name
                                </dt>
                                <dd>{prospect.last_name}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">Email</dt>
                                <dd>{prospect.email}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">Phone</dt>
                                <dd>{prospect.phone ?? 'N/A'}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    High School
                                </dt>
                                <dd>{prospect.high_school ?? 'N/A'}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">GPA</dt>
                                <dd>{prospect.gpa ?? 'N/A'}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Entry Term
                                </dt>
                                <dd>{prospect.entry_term ?? 'N/A'}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Status
                                </dt>
                                <dd className="capitalize">
                                    {prospect.status}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">Notes</dt>
                                <dd className="text-right">
                                    {prospect.notes ?? 'N/A'}
                                </dd>
                            </div>
                        </dl>
                    </div>

                    <div className="rounded-lg border bg-card p-4">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-sm font-medium">
                                Linked Applications
                            </h2>
                            <Button size="sm" variant="outline" asChild>
                                <Link
                                    href={`/admin/admissions/applications/create?prospect_id=${prospect.id}`}
                                >
                                    <Plus className="mr-1 h-3 w-3" /> Create
                                    Application
                                </Link>
                            </Button>
                        </div>
                        {prospect.applications &&
                        prospect.applications.length > 0 ? (
                            <div className="space-y-2">
                                {prospect.applications.map((app) => (
                                    <div
                                        key={app.id}
                                        className="flex items-center justify-between rounded-md border p-3 text-sm"
                                    >
                                        <div>
                                            <p className="font-medium">
                                                {app.program?.name ??
                                                    `Application #${app.id}`}
                                            </p>
                                            <p className="text-xs text-muted-foreground capitalize">
                                                {app.status.replace(/_/g, ' ')}
                                            </p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            asChild
                                        >
                                            <Link
                                                href={`/admin/admissions/applications/${app.id}`}
                                            >
                                                View
                                            </Link>
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                No linked applications.
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <ConfirmModal
                open={showDelete}
                onClose={() => setShowDelete(false)}
                onConfirm={() => {
                    router.delete(`/admin/admissions/prospects/${prospect.id}`);
                    setShowDelete(false);
                }}
                title="Delete Prospect?"
                description={`This will permanently delete ${prospect.first_name} ${prospect.last_name}'s record.`}
                confirmText="Delete"
                variant="destructive"
            />
        </>
    );
}

ProspectsShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Admissions', href: '/admin/admissions' },
        { title: 'Prospects', href: '/admin/admissions/prospects' },
        { title: 'Prospect Details', href: '' },
    ],
};
