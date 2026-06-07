import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import ConfirmModal from '@/components/shared/ConfirmModal';

interface GradebookComponent {
    id: number;
    name: string;
    type: string;
    max_score: number;
    weight: number;
    courseOffering?: {
        id: number;
        course?: { id: number; name: string; code: string };
    };
}

interface Props {
    gradebookComponent: GradebookComponent;
}

export default function ComponentsShow({ gradebookComponent }: Props) {
    const [showDelete, setShowDelete] = useState(false);

    return (
        <>
            <Head title="Component Details" />
            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/gradebook-components">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">
                            {gradebookComponent.name}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {gradebookComponent.type}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                            <Link
                                href={`/admin/gradebook-components/${gradebookComponent.id}/edit`}
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
                            Component Details
                        </h2>
                        <dl className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">Name</dt>
                                <dd>{gradebookComponent.name}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">Type</dt>
                                <dd>{gradebookComponent.type}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Max Score
                                </dt>
                                <dd>{gradebookComponent.max_score}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Weight (%)
                                </dt>
                                <dd>{gradebookComponent.weight}%</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Course Offering
                                </dt>
                                <dd>
                                    {gradebookComponent.courseOffering?.course
                                        ?.name ?? 'N/A'}
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
                    router.delete(
                        `/admin/gradebook-components/${gradebookComponent.id}`,
                    );
                    setShowDelete(false);
                }}
                title="Delete Component?"
                description="This will permanently delete this gradebook component."
                confirmText="Delete"
                variant="destructive"
            />
        </>
    );
}

ComponentsShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Gradebook Components', href: '/admin/gradebook-components' },
        { title: 'Component Details', href: '' },
    ],
};
