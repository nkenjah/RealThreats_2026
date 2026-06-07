import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import ConfirmModal from '@/components/shared/ConfirmModal';

interface Transaction {
    id: number;
    type: string;
    amount: number;
    description: string;
    created_at: string;
}

interface FinancialAccount {
    id: number;
    account_number: string;
    student_id: number;
    current_balance: number;
    status: string;
    student?: { id: number; name: string; registration_number: string };
    transactions?: Transaction[];
}

interface Props {
    financialAccount: FinancialAccount;
}

export default function AccountsShow({ financialAccount }: Props) {
    const [showDelete, setShowDelete] = useState(false);

    return (
        <>
            <Head title={`Account: ${financialAccount.account_number}`} />

            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/finance/accounts">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div className="flex-1">
                        <h1 className="font-mono text-2xl font-bold">
                            {financialAccount.account_number}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {financialAccount.student?.name ?? 'N/A'}
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
                            Account Details
                        </h2>
                        <dl className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Account Number
                                </dt>
                                <dd className="font-mono">
                                    {financialAccount.account_number}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Student
                                </dt>
                                <dd>
                                    {financialAccount.student?.name ?? 'N/A'}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Balance
                                </dt>
                                <dd>
                                    {new Intl.NumberFormat('en-US', {
                                        style: 'currency',
                                        currency: 'TZS',
                                    }).format(financialAccount.current_balance)}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Status
                                </dt>
                                <dd className="capitalize">
                                    {financialAccount.status}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>

                <div className="rounded-lg border bg-card p-4">
                    <h2 className="mb-4 text-sm font-medium">
                        Transaction History
                    </h2>
                    {financialAccount.transactions &&
                    financialAccount.transactions.length > 0 ? (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">
                                        Type
                                    </th>
                                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">
                                        Amount
                                    </th>
                                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">
                                        Description
                                    </th>
                                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">
                                        Date
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {financialAccount.transactions.map((t) => (
                                    <tr
                                        key={t.id}
                                        className="border-b last:border-0"
                                    >
                                        <td className="px-3 py-2 capitalize">
                                            {t.type}
                                        </td>
                                        <td className="px-3 py-2">
                                            {new Intl.NumberFormat('en-US', {
                                                style: 'currency',
                                                currency: 'TZS',
                                            }).format(t.amount)}
                                        </td>
                                        <td className="px-3 py-2">
                                            {t.description}
                                        </td>
                                        <td className="px-3 py-2">
                                            {new Date(
                                                t.created_at,
                                            ).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            No transactions found.
                        </p>
                    )}
                </div>
            </div>

            <ConfirmModal
                open={showDelete}
                onClose={() => setShowDelete(false)}
                onConfirm={() => {
                    router.delete(
                        `/admin/finance/accounts/${financialAccount.id}`,
                    );
                    setShowDelete(false);
                }}
                title="Delete Account?"
                description="This will permanently delete this financial account and all associated transactions."
                confirmText="Delete"
                variant="destructive"
            />
        </>
    );
}

AccountsShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Finance', href: '/admin/finance' },
        { title: 'Accounts', href: '/admin/finance/accounts' },
        { title: 'Account Details', href: '' },
    ],
};
