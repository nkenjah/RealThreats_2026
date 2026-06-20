import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import DataTable from '@/components/shared/DataTable';

interface ScratchCard {
    id: number;
    pin: string;
    serial_number: string;
    value: number;
    currency: string;
    status: string;
    expires_at: string | null;
    used_at: string | null;
    created_at: string;
    issuer?: { id: number; name: string };
    redeemer?: { id: number; name: string };
}

interface Props {
    cards: any;
    filters: Record<string, string | undefined>;
}

export default function ScratchCardsIndex({ cards, filters }: Props) {
    const columns = [
        {
            key: 'serial_number',
            label: 'Serial No',
            render: (c: ScratchCard) => (
                <Link
                    href={`/admin/scratch-cards/${c.id}`}
                    className="font-medium hover:underline"
                >
                    {c.serial_number}
                </Link>
            ),
        },
        { key: 'pin', label: 'PIN' },
        {
            key: 'value',
            label: 'Value',
            render: (c: ScratchCard) =>
                new Intl.NumberFormat('en-TZ', {
                    style: 'currency',
                    currency: c.currency,
                }).format(c.value),
        },
        {
            key: 'status',
            label: 'Status',
            render: (c: ScratchCard) => {
                const colors: Record<string, string> = {
                    active: 'text-green-600 bg-green-50',
                    used: 'text-gray-600 bg-gray-100',
                    expired: 'text-red-600 bg-red-50',
                    revoked: 'text-yellow-600 bg-yellow-50',
                };
                return (
                    <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${colors[c.status] || ''}`}
                    >
                        {c.status}
                    </span>
                );
            },
        },
        {
            key: 'issuer',
            label: 'Issued By',
            render: (c: ScratchCard) => c.issuer?.name ?? '—',
        },
        {
            key: 'created_at',
            label: 'Issued',
            render: (c: ScratchCard) =>
                new Date(c.created_at).toLocaleDateString(),
        },
    ];

    return (
        <>
            <Head title="Scratch Cards" />
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Scratch Cards</h1>
                    <p className="text-sm text-muted-foreground">
                        Generate and manage payment scratch cards
                    </p>
                </div>
                <Link href="/admin/scratch-cards/create">
                    <Button>
                        <Plus className="mr-2 size-4" /> Generate Cards
                    </Button>
                </Link>
            </div>
            <DataTable
                columns={columns}
                data={cards}
                filters={filters}
                filterKeys={['search', 'status']}
            />
        </>
    );
}
