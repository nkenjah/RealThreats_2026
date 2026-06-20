import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import DataTable from '@/components/shared/DataTable';

interface HESLBAllocation {
    id: number;
    heslb_ref_number: string;
    academic_year: string;
    tuition_amount: number;
    meals_amount: number;
    accommodation_amount: number;
    books_amount: number;
    total_amount: number;
    disbursement_status: string;
    student?: { id: number; name: string; registration_number: string };
}

interface Props {
    allocations: any;
    filters: Record<string, string | undefined>;
    stats?: {
        total_allocated: number;
        total_disbursed: number;
        pending_disbursements: number;
        total_students: number;
    };
}

const formatTZS = (amount: number) =>
    new Intl.NumberFormat('en-TZ', {
        style: 'currency',
        currency: 'TZS',
        minimumFractionDigits: 0,
    }).format(amount);

export default function HESLBAllocationsIndex({
    allocations,
    filters,
    stats,
}: Props) {
    const columns = [
        {
            key: 'student',
            label: 'Student',
            render: (a: HESLBAllocation) => (
                <Link
                    href={`/admin/heslb-allocations/${a.id}`}
                    className="font-medium hover:underline"
                >
                    {a.student?.name ?? 'N/A'}
                </Link>
            ),
        },
        { key: 'heslb_ref_number', label: 'HESLB Ref' },
        { key: 'academic_year', label: 'Year' },
        {
            key: 'total_amount',
            label: 'Total',
            render: (a: HESLBAllocation) => formatTZS(a.total_amount),
        },
        {
            key: 'disbursement_status',
            label: 'Status',
            render: (a: HESLBAllocation) => (
                <span className="capitalize">{a.disbursement_status}</span>
            ),
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (a: HESLBAllocation) => (
                <div className="flex gap-1">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/heslb-allocations/${a.id}`}>
                            View
                        </Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/heslb-allocations/${a.id}/edit`}>
                            Edit
                        </Link>
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <>
            <Head title="HESLB Allocations" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">HESLB Allocations</h1>
                    <Button asChild>
                        <Link href="/admin/heslb-allocations/create">
                            <Plus className="mr-2 h-4 w-4" /> Create Allocation
                        </Link>
                    </Button>
                </div>

                {stats && (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-xl border bg-card p-4 shadow-sm">
                            <p className="text-xs text-muted-foreground">
                                Total Allocated
                            </p>
                            <p className="text-2xl font-bold">
                                {formatTZS(stats.total_allocated)}
                            </p>
                        </div>
                        <div className="rounded-xl border bg-card p-4 shadow-sm">
                            <p className="text-xs text-muted-foreground">
                                Total Disbursed
                            </p>
                            <p className="text-2xl font-bold">
                                {formatTZS(stats.total_disbursed)}
                            </p>
                        </div>
                        <div className="rounded-xl border bg-card p-4 shadow-sm">
                            <p className="text-xs text-muted-foreground">
                                Pending
                            </p>
                            <p className="text-2xl font-bold">
                                {stats.pending_disbursements}
                            </p>
                        </div>
                        <div className="rounded-xl border bg-card p-4 shadow-sm">
                            <p className="text-xs text-muted-foreground">
                                Students
                            </p>
                            <p className="text-2xl font-bold">
                                {stats.total_students}
                            </p>
                        </div>
                    </div>
                )}

                <DataTable
                    data={allocations}
                    columns={columns}
                    filters={filters}
                    searchPlaceholder="Search by student name..."
                />
            </div>
        </>
    );
}

HESLBAllocationsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'HESLB', href: '/admin/heslb-allocations' },
    ],
};
