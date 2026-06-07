import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import ConfirmModal from '@/components/shared/ConfirmModal';

interface ProgramRequirement {
    id: number;
    name: string;
    type: string;
    credits_required: number;
    program?: { id: number; name: string };
}

interface Props {
    programRequirement: ProgramRequirement;
}

export default function ProgramRequirementsShow({ programRequirement }: Props) {
    const [showDelete, setShowDelete] = useState(false);

    return (
        <>
            <Head title="Program Requirement Details" />
            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/curriculum/program-requirements">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">
                            {programRequirement.name}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {programRequirement.program?.name ?? 'N/A'}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                            <Link
                                href={`/admin/curriculum/program-requirements/${programRequirement.id}/edit`}
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
                            Requirement Details
                        </h2>
                        <dl className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">Name</dt>
                                <dd>{programRequirement.name}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Program
                                </dt>
                                <dd>
                                    {programRequirement.program?.name ?? 'N/A'}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">Type</dt>
                                <dd>{programRequirement.type}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Credits Required
                                </dt>
                                <dd>{programRequirement.credits_required}</dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>

            <ConfirmModal
                open={showDelete}
                onClose={() => setShowDelete(false)}
                onConfirm={() => {
                    router.delete(
                        `/admin/curriculum/program-requirements/${programRequirement.id}`,
                    );
                    setShowDelete(false);
                }}
                title="Delete Requirement?"
                description="This will permanently delete this program requirement."
                confirmText="Delete"
                variant="destructive"
            />
        </>
    );
}

ProgramRequirementsShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        {
            title: 'Program Requirements',
            href: '/admin/curriculum/program-requirements',
        },
        { title: 'Requirement Details', href: '' },
    ],
};
