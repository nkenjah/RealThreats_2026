import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';

interface OrderItem {
    id: number;
    quantity: number;
    unit_price: number;
    subtotal: number;
    product: { id: number; name: string } | null;
}

interface Order {
    id: number;
    total_amount: number;
    status: string;
    notes: string | null;
    paid_at: string | null;
    created_at: string;
    student: { id: number; name: string; registration_number: string } | null;
    items: OrderItem[];
}

interface Props {
    order: Order;
}

export default function ShopOrdersShow({ order }: Props) {
    const { data, setData, post, processing } = useForm({
        status: order.status,
    });

    const handleStatusUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/shop/orders/${order.id}/status`);
    };

    const statusColors: Record<string, string> = {
        pending: 'text-yellow-700 bg-yellow-50 border-yellow-200',
        paid: 'text-blue-700 bg-blue-50 border-blue-200',
        processing: 'text-indigo-700 bg-indigo-50 border-indigo-200',
        shipped: 'text-purple-700 bg-purple-50 border-purple-200',
        delivered: 'text-green-700 bg-green-50 border-green-200',
        cancelled: 'text-red-700 bg-red-50 border-red-200',
    };

    return (
        <>
            <Head title={`Order #${order.id}`} />
            <div className="mx-auto max-w-4xl">
                <div className="mb-6 flex items-center gap-4">
                    <Link href="/admin/shop/orders">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="size-4" />
                        </Button>
                    </Link>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">
                            Order #{order.id}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {order.student?.name} — {order.created_at}
                        </p>
                    </div>
                    <span
                        className={`inline-block rounded-full border px-3 py-1 text-sm font-medium ${statusColors[order.status]}`}
                    >
                        {order.status.toUpperCase()}
                    </span>
                </div>

                <div className="mb-6 grid grid-cols-3 gap-4">
                    <div className="rounded-lg border p-4">
                        <p className="text-xs text-muted-foreground">Student</p>
                        <p className="mt-1 font-medium">
                            {order.student?.name ?? '—'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {order.student?.registration_number}
                        </p>
                    </div>
                    <div className="rounded-lg border p-4">
                        <p className="text-xs text-muted-foreground">
                            Total Amount
                        </p>
                        <p className="mt-1 text-xl font-bold">
                            {new Intl.NumberFormat('en-TZ', {
                                style: 'currency',
                                currency: 'TZS',
                            }).format(order.total_amount)}
                        </p>
                    </div>
                    <div className="rounded-lg border p-4">
                        <p className="text-xs text-muted-foreground">Paid At</p>
                        <p className="mt-1 font-medium">
                            {order.paid_at
                                ? new Date(order.paid_at).toLocaleString()
                                : '—'}
                        </p>
                    </div>
                </div>

                {order.notes && (
                    <div className="mb-6 rounded-lg border p-4">
                        <p className="text-xs text-muted-foreground">Notes</p>
                        <p className="mt-1 text-sm">{order.notes}</p>
                    </div>
                )}

                <div className="mb-6 rounded-lg border">
                    <div className="border-b bg-muted/50 px-4 py-2">
                        <h2 className="text-sm font-medium">Order Items</h2>
                    </div>
                    <div className="p-4">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left text-muted-foreground">
                                    <th className="pb-2 font-medium">
                                        Product
                                    </th>
                                    <th className="pb-2 font-medium">Qty</th>
                                    <th className="pb-2 font-medium">
                                        Unit Price
                                    </th>
                                    <th className="pb-2 text-right font-medium">
                                        Subtotal
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="border-b last:border-0"
                                    >
                                        <td className="py-2">
                                            {item.product?.name ??
                                                'Deleted Product'}
                                        </td>
                                        <td className="py-2">
                                            {item.quantity}
                                        </td>
                                        <td className="py-2">
                                            {new Intl.NumberFormat('en-TZ', {
                                                style: 'currency',
                                                currency: 'TZS',
                                            }).format(item.unit_price)}
                                        </td>
                                        <td className="py-2 text-right">
                                            {new Intl.NumberFormat('en-TZ', {
                                                style: 'currency',
                                                currency: 'TZS',
                                            }).format(item.subtotal)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="font-medium">
                                    <td colSpan={3} className="pt-3 text-right">
                                        Total
                                    </td>
                                    <td className="pt-3 text-right">
                                        {new Intl.NumberFormat('en-TZ', {
                                            style: 'currency',
                                            currency: 'TZS',
                                        }).format(order.total_amount)}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                <form
                    onSubmit={handleStatusUpdate}
                    className="flex items-end gap-4 rounded-lg border p-4"
                >
                    <div className="flex-1">
                        <label className="mb-1 block text-xs font-medium text-muted-foreground">
                            Update Status
                        </label>
                        <Select
                            value={data.status}
                            onValueChange={(v) => setData('status', v)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="paid">Paid</SelectItem>
                                <SelectItem value="processing">
                                    Processing
                                </SelectItem>
                                <SelectItem value="shipped">Shipped</SelectItem>
                                <SelectItem value="delivered">
                                    Delivered
                                </SelectItem>
                                <SelectItem value="cancelled">
                                    Cancelled
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button
                        disabled={processing || data.status === order.status}
                    >
                        Update Status
                    </Button>
                </form>
            </div>
        </>
    );
}
