import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import ConfirmModal from '@/components/shared/ConfirmModal';

interface Building {
    id: number;
    name: string;
    code: string;
    campus_id: number;
    campus?: { id: number; name: string };
}

interface Props {
    building: Building;
}

export default function BuildingsShow({ building }: Props) {
    const [showDelete, setShowDelete] = useState(false);

    return (
        <>
            <Head title={`Building: ${building.name}`} />

            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/buildings">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">{building.name}</h1>
                        <p className="text-sm text-muted-foreground">
                            {building.code}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/buildings/${building.id}/edit`}>
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
                            Building Details
                        </h2>
                        <dl className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">Name</dt>
                                <dd>{building.name}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">Code</dt>
                                <dd className="font-mono">{building.code}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Campus
                                </dt>
                                <dd>{building.campus?.name ?? 'N/A'}</dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>

            <ConfirmModal
                open={showDelete}
                onClose={() => setShowDelete(false)}
                onConfirm={() => {
                    router.delete(`/admin/buildings/${building.id}`);
                    setShowDelete(false);
                }}
                title="Delete Building?"
                description="This will permanently delete this building."
                confirmText="Delete"
                variant="destructive"
            />
        </>
    );
}

BuildingsShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Buildings', href: '/admin/buildings' },
        { title: 'Building Details', href: '' },
    ],
};
