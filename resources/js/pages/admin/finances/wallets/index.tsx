import { Head, Link } from '@inertiajs/react';
import DataTable from '@/components/shared/DataTable';

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

interface Props {
    wallets: any;
    filters: Record<string, string | undefined>;
}

export default function WalletsIndex({ wallets, filters }: Props) {
    const columns = [
        {
            key: 'owner',
            label: 'Owner',
            render: (w: Wallet) => (
                <Link
                    href={`/admin/wallets/${w.id}`}
                    className="font-medium hover:underline"
                >
                    {w.walletable?.name ?? '—'}
                </Link>
            ),
        },
        {
            key: 'registration_number',
            label: 'Reg No',
            render: (w: Wallet) => w.walletable?.registration_number ?? '—',
        },
        {
            key: 'balance',
            label: 'Balance',
            render: (w: Wallet) =>
                new Intl.NumberFormat('en-TZ', {
                    style: 'currency',
                    currency: w.currency,
                }).format(w.balance),
        },
        {
            key: 'status',
            label: 'Status',
            render: (w: Wallet) => {
                const colors: Record<string, string> = {
                    active: 'text-green-600 bg-green-50',
                    frozen: 'text-blue-600 bg-blue-50',
                    closed: 'text-red-600 bg-red-50',
                };
                return (
                    <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${colors[w.status] || ''}`}
                    >
                        {w.status}
                    </span>
                );
            },
        },
        {
            key: 'created_at',
            label: 'Created',
            render: (w: Wallet) => new Date(w.created_at).toLocaleDateString(),
        },
    ];

    return (
        <>
            <Head title="Student Wallets" />
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Student Wallets</h1>
                <p className="text-sm text-muted-foreground">
                    Manage student e-wallets and transactions
                </p>
            </div>
            <DataTable
                columns={columns}
                data={wallets}
                filters={filters}
                filterKeys={['search', 'status']}
            />
        </>
    );
}
