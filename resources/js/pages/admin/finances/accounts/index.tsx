import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import DataTable from '@/components/shared/DataTable';

interface FinancialAccount {
    id: number;
    account_number: string;
    student_id: number;
    current_balance: number;
    status: string;
    student?: { id: number; name: string; registration_number: string };
}

interface Props {
    financialAccounts: any;
    filters: Record<string, string | undefined>;
}

export default function AccountsIndex({ financialAccounts, filters }: Props) {
    const columns = [
        {
            key: 'account_number',
            label: 'Account Number',
            render: (a: FinancialAccount) => (
                <Link
                    href={`/admin/financial-accounts/${a.id}`}
                    className="font-mono font-medium hover:underline"
                >
                    {a.account_number}
                </Link>
            ),
        },
        {
            key: 'student',
            label: 'Student',
            render: (a: FinancialAccount) =>
                a.student?.name ?? (
                    <span className="text-muted-foreground">N/A</span>
                ),
        },
        {
            key: 'current_balance',
            label: 'Balance',
            render: (a: FinancialAccount) =>
                new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'TZS',
                }).format(a.current_balance),
        },
        {
            key: 'status',
            label: 'Status',
            render: (a: FinancialAccount) => (
                <span className="capitalize">{a.status}</span>
            ),
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (a: FinancialAccount) => (
                <div className="flex gap-1">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/financial-accounts/${a.id}`}>
                            View
                        </Link>
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <>
            <Head title="Financial Accounts" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Financial Accounts</h1>
                    <Button asChild>
                        <Link href="/admin/financial-accounts/create">
                            <Plus className="mr-2 h-4 w-4" /> Create Account
                        </Link>
                    </Button>
                </div>

                <DataTable
                    data={financialAccounts}
                    columns={columns}
                    filters={filters}
                    searchPlaceholder="Search by account number or student..."
                />
            </div>
        </>
    );
}

AccountsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Accounts', href: '/admin/financial-accounts' },
    ],
};
