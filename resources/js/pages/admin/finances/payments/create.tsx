import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { useForm } from '@inertiajs/react';

interface FinancialAccount {
    id: number;
    account_number: string;
    student?: { name: string; registration_number: string };
}

interface Props {
    financialAccounts: FinancialAccount[];
}

export default function PaymentsCreate({ financialAccounts }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        financial_account_id: '',
        amount: '',
        payment_method: '',
        payment_date: '',
        status: 'completed',
        reference_number: '',
        notes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/payments');
    };

    return (
        <>
            <Head title="Create Payment" />

            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/payments">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold">Create Payment</h1>
                </div>

                <div className="max-w-lg rounded-lg border bg-card p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="financial_account_id">
                                Account
                            </Label>
                            <Select
                                value={data.financial_account_id}
                                onValueChange={(v) =>
                                    setData('financial_account_id', v)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select financial account" />
                                </SelectTrigger>
                                <SelectContent>
                                    {financialAccounts.map((fa) => (
                                        <SelectItem
                                            key={fa.id}
                                            value={String(fa.id)}
                                        >
                                            {fa.account_number} -{' '}
                                            {fa.student?.name ?? 'N/A'}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.financial_account_id && (
                                <p className="text-sm text-destructive">
                                    {errors.financial_account_id}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="amount">Amount</Label>
                            <Input
                                id="amount"
                                type="number"
                                min="0"
                                step="0.01"
                                value={data.amount}
                                onChange={(e) =>
                                    setData('amount', e.target.value)
                                }
                            />
                            {errors.amount && (
                                <p className="text-sm text-destructive">
                                    {errors.amount}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="payment_method">
                                Payment Method
                            </Label>
                            <Select
                                value={data.payment_method}
                                onValueChange={(v) =>
                                    setData('payment_method', v)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select method" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="cash">Cash</SelectItem>
                                    <SelectItem value="bank_transfer">
                                        Bank Transfer
                                    </SelectItem>
                                    <SelectItem value="mobile_money">
                                        Mobile Money
                                    </SelectItem>
                                    <SelectItem value="cheque">
                                        Cheque
                                    </SelectItem>
                                    <SelectItem value="card">Card</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.payment_method && (
                                <p className="text-sm text-destructive">
                                    {errors.payment_method}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="payment_date">Payment Date</Label>
                            <Input
                                id="payment_date"
                                type="date"
                                value={data.payment_date}
                                onChange={(e) =>
                                    setData('payment_date', e.target.value)
                                }
                            />
                            {errors.payment_date && (
                                <p className="text-sm text-destructive">
                                    {errors.payment_date}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="status">Status</Label>
                            <Select
                                value={data.status}
                                onValueChange={(v) => setData('status', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="completed">
                                        Completed
                                    </SelectItem>
                                    <SelectItem value="pending">
                                        Pending
                                    </SelectItem>
                                    <SelectItem value="failed">
                                        Failed
                                    </SelectItem>
                                    <SelectItem value="refunded">
                                        Refunded
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.status && (
                                <p className="text-sm text-destructive">
                                    {errors.status}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="reference_number">
                                Reference Number
                            </Label>
                            <Input
                                id="reference_number"
                                value={data.reference_number}
                                onChange={(e) =>
                                    setData('reference_number', e.target.value)
                                }
                                placeholder="Optional reference number"
                            />
                            {errors.reference_number && (
                                <p className="text-sm text-destructive">
                                    {errors.reference_number}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="notes">Notes</Label>
                            <Input
                                id="notes"
                                value={data.notes}
                                onChange={(e) =>
                                    setData('notes', e.target.value)
                                }
                                placeholder="Optional notes..."
                            />
                            {errors.notes && (
                                <p className="text-sm text-destructive">
                                    {errors.notes}
                                </p>
                            )}
                        </div>

                        <Button type="submit" disabled={processing}>
                            {processing ? 'Creating...' : 'Create Payment'}
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
}

PaymentsCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Payments', href: '/admin/payments' },
        { title: 'Create', href: '' },
    ],
};
