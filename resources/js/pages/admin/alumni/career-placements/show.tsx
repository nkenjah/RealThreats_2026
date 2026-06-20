import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useState } from 'react';
import ConfirmModal from '@/components/shared/ConfirmModal';
import type { CareerPlacement, AlumniProfile, Student } from '@/types';

interface Props {
    careerPlacement: CareerPlacement & {
        notes?: string | null;
        alumni_profile: AlumniProfile & { student?: Student };
    };
}

export default function CareerPlacementsShow({ careerPlacement }: Props) {
    const [showDelete, setShowDelete] = useState(false);

    return (
        <>
            <Head title={`Placement: ${careerPlacement.company_name}`} />

            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/career-placements">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">
                            {careerPlacement.company_name}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {careerPlacement.alumni_profile?.student?.name ??
                                'N/A'}
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
                            <dd>{careerPlacement.id}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">Company</dt>
                            <dd>{careerPlacement.company_name}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">Position</dt>
                            <dd>{careerPlacement.position}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">
                                Start Date
                            </dt>
                            <dd>
                                {new Date(
                                    careerPlacement.start_date,
                                ).toLocaleDateString()}
                            </dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">End Date</dt>
                            <dd>
                                {careerPlacement.end_date
                                    ? new Date(
                                          careerPlacement.end_date,
                                      ).toLocaleDateString()
                                    : 'N/A'}
                            </dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">Current</dt>
                            <dd>{careerPlacement.is_current ? 'Yes' : 'No'}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">Notes</dt>
                            <dd>{careerPlacement.notes ?? 'N/A'}</dd>
                        </div>
                    </dl>
                </div>
            </div>

            <ConfirmModal
                open={showDelete}
                onClose={() => setShowDelete(false)}
                onConfirm={() => {
                    router.delete(
                        `/admin/career-placements/${careerPlacement.id}`,
                    );
                    setShowDelete(false);
                }}
                title="Delete Placement?"
                description="This will permanently delete this career placement record."
                confirmText="Delete"
                variant="destructive"
            />
        </>
    );
}

CareerPlacementsShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Alumni', href: '/admin/alumni' },
        { title: 'Career Placements', href: '/admin/career-placements' },
        { title: 'Placement Details', href: '' },
    ],
};
