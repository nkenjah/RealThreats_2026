import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import DataTable from '@/components/shared/DataTable';

interface Payment {
    id: number;
    financial_account_id: number;
    amount: number;
    payment_method: string;
    payment_date: string;
    status: string;
    financial_account?: {
        id: number;
        account_number: string;
        student?: { name: string };
    };
}

interface Props {
    payments: any;
    filters: Record<string, string | undefined>;
}

export default function PaymentsIndex({ payments, filters }: Props) {
    const columns = [
        {
            key: 'student',
            label: 'Student',
            render: (p: Payment) =>
                p.financial_account?.student?.name ?? (
                    <span className="text-muted-foreground">N/A</span>
                ),
        },
        {
            key: 'amount',
            label: 'Amount',
            render: (p: Payment) =>
                new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'TZS',
                }).format(p.amount),
        },
        {
            key: 'payment_method',
            label: 'Method',
            render: (p: Payment) => (
                <span className="capitalize">{p.payment_method}</span>
            ),
        },
        {
            key: 'payment_date',
            label: 'Payment Date',
            render: (p: Payment) =>
                new Date(p.payment_date).toLocaleDateString(),
        },
        {
            key: 'status',
            label: 'Status',
            render: (p: Payment) => (
                <span className="capitalize">{p.status}</span>
            ),
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (p: Payment) => (
                <div className="flex gap-1">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/payments/${p.id}`}>View</Link>
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <>
            <Head title="Payments" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Payments</h1>
                    <Button asChild>
                        <Link href="/admin/payments/create">
                            <Plus className="mr-2 h-4 w-4" /> Create Payment
                        </Link>
                    </Button>
                </div>

                <DataTable
                    data={payments}
                    columns={columns}
                    filters={filters}
                    searchPlaceholder="Search by student or method..."
                />
            </div>
        </>
    );
}

PaymentsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Payments', href: '/admin/payments' },
    ],
};
