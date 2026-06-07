import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useState } from 'react';
import ConfirmModal from '@/components/shared/ConfirmModal';
import type { AdmissionOffer } from '@/types';

interface Props {
    offer: AdmissionOffer;
}

export default function OffersShow({ offer }: Props) {
    const [showDelete, setShowDelete] = useState(false);

    const handleStatusUpdate = (status: string) => {
        router.patch(`/admin/admissions/offers/${offer.id}`, { status });
    };

    return (
        <>
            <Head title={`Offer #${offer.id}`} />

            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/admissions/offers">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">
                            Offer #{offer.id}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {offer.application?.prospect?.first_name}{' '}
                            {offer.application?.prospect?.last_name} -{' '}
                            {offer.application?.program?.name}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {offer.status === 'pending' && (
                            <>
                                <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() =>
                                        handleStatusUpdate('accepted')
                                    }
                                >
                                    Accept
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        handleStatusUpdate('declined')
                                    }
                                >
                                    Decline
                                </Button>
                            </>
                        )}
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
                            Offer Details
                        </h2>
                        <dl className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Prospect
                                </dt>
                                <dd>
                                    {offer.application?.prospect?.first_name}{' '}
                                    {offer.application?.prospect?.last_name}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Program
                                </dt>
                                <dd>
                                    {offer.application?.program?.name ?? 'N/A'}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Offer Date
                                </dt>
                                <dd>
                                    {offer.offer_date
                                        ? new Date(
                                              offer.offer_date,
                                          ).toLocaleDateString()
                                        : 'N/A'}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Decision Deadline
                                </dt>
                                <dd>
                                    {offer.decision_deadline
                                        ? new Date(
                                              offer.decision_deadline,
                                          ).toLocaleDateString()
                                        : 'N/A'}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Tuition Fee
                                </dt>
                                <dd>
                                    {offer.tuition_fee
                                        ? `$${Number(offer.tuition_fee).toLocaleString()}`
                                        : 'N/A'}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Status
                                </dt>
                                <dd className="capitalize">{offer.status}</dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>

            <ConfirmModal
                open={showDelete}
                onClose={() => setShowDelete(false)}
                onConfirm={() => {
                    router.delete(`/admin/admissions/offers/${offer.id}`);
                    setShowDelete(false);
                }}
                title="Delete Offer?"
                description="This will permanently delete this offer record."
                confirmText="Delete"
                variant="destructive"
            />
        </>
    );
}

OffersShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Admissions', href: '/admin/admissions' },
        { title: 'Offers', href: '/admin/admissions/offers' },
        { title: 'Offer Details', href: '' },
    ],
};
