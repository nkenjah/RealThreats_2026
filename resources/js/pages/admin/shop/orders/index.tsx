import { Head, Link } from '@inertiajs/react';
import DataTable from '@/components/shared/DataTable';

interface Order {
    id: number;
    total_amount: number;
    status: string;
    paid_at: string | null;
    created_at: string;
    student: { id: number; name: string; registration_number: string } | null;
}

interface Props {
    orders: any;
    filters: Record<string, string | undefined>;
}

export default function ShopOrdersIndex({ orders, filters }: Props) {
    const statusColors: Record<string, string> = {
        pending: 'text-yellow-600 bg-yellow-50',
        paid: 'text-blue-600 bg-blue-50',
        processing: 'text-indigo-600 bg-indigo-50',
        shipped: 'text-purple-600 bg-purple-50',
        delivered: 'text-green-600 bg-green-50',
        cancelled: 'text-red-600 bg-red-50',
    };

    const columns = [
        {
            key: 'id',
            label: 'Order #',
            render: (o: Order) => (
                <Link
                    href={`/admin/shop/orders/${o.id}`}
                    className="font-mono font-medium hover:underline"
                >
                    #{o.id}
                </Link>
            ),
        },
        {
            key: 'student',
            label: 'Student',
            render: (o: Order) => o.student?.name ?? '—',
        },
        {
            key: 'total_amount',
            label: 'Total',
            render: (o: Order) =>
                new Intl.NumberFormat('en-TZ', {
                    style: 'currency',
                    currency: 'TZS',
                }).format(o.total_amount),
        },
        {
            key: 'status',
            label: 'Status',
            render: (o: Order) => (
                <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[o.status] || ''}`}
                >
                    {o.status}
                </span>
            ),
        },
        {
            key: 'created_at',
            label: 'Date',
            render: (o: Order) => new Date(o.created_at).toLocaleDateString(),
        },
    ];

    return (
        <>
            <Head title="Shop Orders" />
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Shop Orders</h1>
                <p className="text-sm text-muted-foreground">
                    Manage e-shop orders and fulfillment
                </p>
            </div>
            <DataTable
                columns={columns}
                data={orders}
                filters={filters}
                filterKeys={['search', 'status']}
                searchPlaceholder="Search by student name..."
            />
        </>
    );
}
