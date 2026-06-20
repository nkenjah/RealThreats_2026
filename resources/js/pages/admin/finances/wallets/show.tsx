import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import DataTable from '@/components/shared/DataTable';
import { ArrowLeft, Plus } from 'lucide-react';
import { useState } from 'react';

interface Wallet {
    id: number;
    balance: number;
    currency: string;
    status: string;
    created_at: string;
    walletable: {
        id: number;
        name: string;
        registration_number?: string;
    } | null;
}

interface Transaction {
    id: number;
    type: string;
    category: string;
    amount: number;
    balance_before: number;
    balance_after: number;
    description: string | null;
    reference_type: string | null;
    reference_id: number | null;
    created_at: string;
}

interface Props {
    wallet: Wallet;
    transactions: any;
}

export default function WalletsShow({ wallet, transactions }: Props) {
    const [showTopUp, setShowTopUp] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        amount: '',
        description: '',
    });

    const handleTopUp = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/wallets/${wallet.id}/top-up`, {
            onSuccess: () => {
                setShowTopUp(false);
                setData({ amount: '', description: '' });
            },
        });
    };

    const statusColors: Record<string, string> = {
        active: 'text-green-700 bg-green-50 border-green-200',
        frozen: 'text-blue-700 bg-blue-50 border-blue-200',
        closed: 'text-red-700 bg-red-50 border-red-200',
    };

    const transactionColumns = [
        {
            key: 'created_at',
            label: 'Date',
            render: (t: Transaction) => new Date(t.created_at).toLocaleString(),
        },
        {
            key: 'type',
            label: 'Type',
            render: (t: Transaction) => {
                const colors: Record<string, string> = {
                    credit: 'text-green-600 bg-green-50',
                    debit: 'text-red-600 bg-red-50',
                };
                return (
                    <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${colors[t.type] || ''}`}
                    >
                        {t.type}
                    </span>
                );
            },
        },
        { key: 'category', label: 'Category' },
        {
            key: 'amount',
            label: 'Amount',
            render: (t: Transaction) =>
                new Intl.NumberFormat('en-TZ', {
                    style: 'currency',
                    currency: wallet.currency,
                }).format(t.amount),
        },
        {
            key: 'balance_after',
            label: 'Balance After',
            render: (t: Transaction) =>
                new Intl.NumberFormat('en-TZ', {
                    style: 'currency',
                    currency: wallet.currency,
                }).format(t.balance_after),
        },
        {
            key: 'description',
            label: 'Description',
            render: (t: Transaction) => t.description ?? '—',
        },
    ];

    return (
        <>
            <Head title={`Wallet - ${wallet.walletable?.name ?? 'Unknown'}`} />
            <div className="mx-auto max-w-4xl">
                <div className="mb-6 flex items-center gap-4">
                    <Link href="/admin/wallets">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="size-4" />
                        </Button>
                    </Link>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">Student Wallet</h1>
                        <p className="text-sm text-muted-foreground">
                            {wallet.walletable?.name} —{' '}
                            {wallet.walletable?.registration_number ?? ''}
                        </p>
                    </div>
                    <Button onClick={() => setShowTopUp(!showTopUp)}>
                        <Plus className="mr-2 size-4" /> Top Up
                    </Button>
                </div>

                {showTopUp && (
                    <form
                        onSubmit={handleTopUp}
                        className="mb-6 rounded-lg border p-4"
                    >
                        <div className="mb-4 grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="amount">
                                    Amount ({wallet.currency})
                                </Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    min="100"
                                    step="100"
                                    value={data.amount}
                                    onChange={(e) =>
                                        setData('amount', e.target.value)
                                    }
                                />
                                {errors.amount && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.amount}
                                    </p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="description">
                                    Description (optional)
                                </Label>
                                <Input
                                    id="description"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                />
                                {errors.description && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.description}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="flex justify-end gap-3">
                            <Button
                                variant="outline"
                                type="button"
                                onClick={() => setShowTopUp(false)}
                            >
                                Cancel
                            </Button>
                            <Button disabled={processing}>Add Funds</Button>
                        </div>
                    </form>
                )}

                <div className="mb-6 grid grid-cols-3 gap-4">
                    <div className="rounded-lg border p-4">
                        <p className="text-xs text-muted-foreground">
                            Current Balance
                        </p>
                        <p className="text-2xl font-bold">
                            {new Intl.NumberFormat('en-TZ', {
                                style: 'currency',
                                currency: wallet.currency,
                            }).format(wallet.balance)}
                        </p>
                    </div>
                    <div className="rounded-lg border p-4">
                        <p className="text-xs text-muted-foreground">Status</p>
                        <span
                            className={`inline-block rounded-full border px-3 py-1 text-sm font-medium ${statusColors[wallet.status]}`}
                        >
                            {wallet.status.toUpperCase()}
                        </span>
                    </div>
                    <div className="rounded-lg border p-4">
                        <p className="text-xs text-muted-foreground">
                            Currency
                        </p>
                        <p className="text-xl font-bold">{wallet.currency}</p>
                    </div>
                </div>

                <div>
                    <h2 className="mb-4 text-lg font-semibold">
                        Transaction History
                    </h2>
                    <DataTable
                        columns={transactionColumns}
                        data={transactions}
                        filters={{}}
                    />
                </div>
            </div>
        </>
    );
}
