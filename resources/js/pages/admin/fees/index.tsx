import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import DataTable from '@/components/shared/DataTable';

interface Fee {
    id: number;
    student_id: number;
    fee_type: string;
    amount: number;
    due_date: string;
    status: string;
    student?: { id: number; name: string; registration_number: string };
}

interface Props {
    fees: any;
    filters: Record<string, string | undefined>;
}

export default function FeesIndex({ fees, filters }: Props) {
    const columns = [
        {
            key: 'fee_type',
            label: 'Fee Type',
            render: (fee: Fee) => (
                <Link
                    href={`/admin/fees/${fee.id}`}
                    className="font-medium hover:underline"
                >
                    {fee.fee_type}
                </Link>
            ),
        },
        {
            key: 'student',
            label: 'Student',
            render: (fee: Fee) =>
                fee.student?.name ?? (
                    <span className="text-muted-foreground">N/A</span>
                ),
        },
        {
            key: 'amount',
            label: 'Amount',
            render: (fee: Fee) =>
                new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'TZS',
                }).format(fee.amount),
        },
        {
            key: 'due_date',
            label: 'Due Date',
            render: (fee: Fee) => new Date(fee.due_date).toLocaleDateString(),
        },
        {
            key: 'status',
            label: 'Status',
            render: (fee: Fee) => (
                <span className="capitalize">{fee.status}</span>
            ),
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (fee: Fee) => (
                <div className="flex gap-1">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/fees/${fee.id}`}>View</Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/fees/${fee.id}/edit`}>Edit</Link>
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <>
            <Head title="Fees" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Fees</h1>
                    <Button asChild>
                        <Link href="/admin/fees/create">
                            <Plus className="mr-2 h-4 w-4" /> Create Fee
                        </Link>
                    </Button>
                </div>

                <DataTable
                    data={fees}
                    columns={columns}
                    filters={filters}
                    searchPlaceholder="Search by fee type or student..."
                />
            </div>
        </>
    );
}

FeesIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Fees', href: '/admin/fees' },
    ],
};
