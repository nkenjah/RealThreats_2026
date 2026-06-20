import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useState } from 'react';
import ConfirmModal from '@/components/shared/ConfirmModal';
import type { Donation, AlumniProfile, Student } from '@/types';

interface Props {
    donation: Donation & {
        alumni_profile: AlumniProfile & { student?: Student };
    };
}

export default function DonationsShow({ donation }: Props) {
    const [showDelete, setShowDelete] = useState(false);

    return (
        <>
            <Head title="Donation Details" />

            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/donations">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">Donation</h1>
                        <p className="text-sm text-muted-foreground">
                            {donation.alumni_profile?.student?.name ?? 'N/A'}
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
                            <dd>{donation.id}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">Amount</dt>
                            <dd>
                                {new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: 'TZS',
                                }).format(donation.amount)}
                            </dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">
                                Donation Date
                            </dt>
                            <dd>
                                {new Date(
                                    donation.donation_date,
                                ).toLocaleDateString()}
                            </dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">Purpose</dt>
                            <dd>{donation.purpose ?? 'N/A'}</dd>
                        </div>
                    </dl>
                </div>
            </div>

            <ConfirmModal
                open={showDelete}
                onClose={() => setShowDelete(false)}
                onConfirm={() => {
                    router.delete(`/admin/donations/${donation.id}`);
                    setShowDelete(false);
                }}
                title="Delete Donation?"
                description="This will permanently delete this donation record."
                confirmText="Delete"
                variant="destructive"
            />
        </>
    );
}

DonationsShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Alumni', href: '/admin/alumni' },
        { title: 'Donations', href: '/admin/donations' },
        { title: 'Donation Details', href: '' },
    ],
};
