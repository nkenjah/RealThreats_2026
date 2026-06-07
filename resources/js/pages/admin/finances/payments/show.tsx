import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useState } from 'react';
import ConfirmModal from '@/components/shared/ConfirmModal';

interface Payment {
    id: number;
    financial_account_id: number;
    amount: number;
    payment_method: string;
    payment_date: string;
    status: string;
    reference_number: string | null;
    notes: string | null;
    financial_account?: {
        id: number;
        account_number: string;
        student?: { name: string; registration_number: string };
    };
}

interface Props {
    payment: Payment;
}

export default function PaymentsShow({ payment }: Props) {
    const [showDelete, setShowDelete] = useState(false);

    return (
        <>
            <Head title="Payment Details" />

            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/payments">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">Payment</h1>
                        <p className="text-sm text-muted-foreground">
                            {payment.financial_account?.student?.name ?? 'N/A'}
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
                            Payment Details
                        </h2>
                        <dl className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Amount
                                </dt>
                                <dd>
                                    {new Intl.NumberFormat('en-US', {
                                        style: 'currency',
                                        currency: 'TZS',
                                    }).format(payment.amount)}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Method
                                </dt>
                                <dd className="capitalize">
                                    {payment.payment_method}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">Date</dt>
                                <dd>
                                    {new Date(
                                        payment.payment_date,
                                    ).toLocaleDateString()}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Status
                                </dt>
                                <dd className="capitalize">{payment.status}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Reference Number
                                </dt>
                                <dd>{payment.reference_number ?? 'N/A'}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">Notes</dt>
                                <dd>{payment.notes ?? 'N/A'}</dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>

            <ConfirmModal
                open={showDelete}
                onClose={() => setShowDelete(false)}
                onConfirm={() => {
                    router.delete(`/admin/payments/${payment.id}`);
                    setShowDelete(false);
                }}
                title="Delete Payment?"
                description="This will permanently delete this payment record."
                confirmText="Delete"
                variant="destructive"
            />
        </>
    );
}

PaymentsShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Payments', href: '/admin/payments' },
        { title: 'Payment Details', href: '' },
    ],
};
