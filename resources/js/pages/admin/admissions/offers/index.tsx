import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import DataTable from '@/components/shared/DataTable';
import type { AdmissionOffer } from '@/types';

interface Props {
    offers: any;
    filters: Record<string, string | undefined>;
}

export default function OffersIndex({ offers, filters }: Props) {
    const columns = [
        {
            key: 'prospect_name',
            label: 'Prospect',
            render: (o: AdmissionOffer) => (
                <Link
                    href={`/admin/admissions/offers/${o.id}`}
                    className="font-medium hover:underline"
                >
                    {o.application?.prospect?.first_name}{' '}
                    {o.application?.prospect?.last_name}
                </Link>
            ),
        },
        {
            key: 'program_name',
            label: 'Program',
            render: (o: AdmissionOffer) =>
                o.application?.program?.name ?? (
                    <span className="text-muted-foreground">N/A</span>
                ),
        },
        {
            key: 'offer_date',
            label: 'Offer Date',
            render: (o: AdmissionOffer) =>
                o.offer_date
                    ? new Date(o.offer_date).toLocaleDateString()
                    : 'N/A',
        },
        {
            key: 'decision_deadline',
            label: 'Decision Deadline',
            render: (o: AdmissionOffer) =>
                o.decision_deadline
                    ? new Date(o.decision_deadline).toLocaleDateString()
                    : 'N/A',
        },
        {
            key: 'tuition_fee',
            label: 'Tuition Fee',
            render: (o: AdmissionOffer) =>
                o.tuition_fee
                    ? `$${Number(o.tuition_fee).toLocaleString()}`
                    : 'N/A',
        },
        {
            key: 'status',
            label: 'Status',
            render: (o: AdmissionOffer) => (
                <span className="capitalize">{o.status}</span>
            ),
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (o: AdmissionOffer) => (
                <div className="flex gap-1">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/admissions/offers/${o.id}`}>
                            View
                        </Link>
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <>
            <Head title="Offers" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Offers</h1>
                    <Button asChild>
                        <Link href="/admin/admissions/offers/create">
                            <Plus className="mr-2 h-4 w-4" /> Create Offer
                        </Link>
                    </Button>
                </div>

                <DataTable
                    data={offers}
                    columns={columns}
                    filters={filters}
                    searchPlaceholder="Search offers..."
                />
            </div>
        </>
    );
}

OffersIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Admissions', href: '/admin/admissions' },
        { title: 'Offers', href: '/admin/admissions/offers' },
    ],
};
