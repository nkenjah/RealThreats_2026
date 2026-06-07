import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useState } from 'react';
import ConfirmModal from '@/components/shared/ConfirmModal';

interface Hostel {
    id: number;
    name: string;
    capacity: number;
    type: string;
    description: string | null;
}

interface Props {
    hostel: Hostel;
}

export default function HostelsShow({ hostel }: Props) {
    const [showDelete, setShowDelete] = useState(false);

    return (
        <>
            <Head title={`Hostel: ${hostel.name}`} />

            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/housing/hostels">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">{hostel.name}</h1>
                        <p className="text-sm text-muted-foreground capitalize">
                            {hostel.type}
                        </p>
                    </div>
                    <div className="flex gap-2">
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
                            Hostel Details
                        </h2>
                        <dl className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">Name</dt>
                                <dd>{hostel.name}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">Type</dt>
                                <dd className="capitalize">{hostel.type}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Capacity
                                </dt>
                                <dd>{hostel.capacity}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Description
                                </dt>
                                <dd>{hostel.description ?? 'N/A'}</dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>

            <ConfirmModal
                open={showDelete}
                onClose={() => setShowDelete(false)}
                onConfirm={() => {
                    router.delete(`/admin/housing/hostels/${hostel.id}`);
                    setShowDelete(false);
                }}
                title="Delete Hostel?"
                description="This will permanently delete this hostel."
                confirmText="Delete"
                variant="destructive"
            />
        </>
    );
}

HostelsShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Housing', href: '/admin/housing' },
        { title: 'Hostels', href: '/admin/housing/hostels' },
        { title: 'Hostel Details', href: '' },
    ],
};
