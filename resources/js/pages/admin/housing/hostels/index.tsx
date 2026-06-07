import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import DataTable from '@/components/shared/DataTable';

interface Hostel {
    id: number;
    name: string;
    capacity: number;
    type: string;
}

interface Props {
    hostels: any;
    filters: Record<string, string | undefined>;
}

export default function HostelsIndex({ hostels, filters }: Props) {
    const columns = [
        {
            key: 'name',
            label: 'Name',
            render: (h: Hostel) => (
                <Link
                    href={`/admin/housing/hostels/${h.id}`}
                    className="font-medium hover:underline"
                >
                    {h.name}
                </Link>
            ),
        },
        {
            key: 'type',
            label: 'Type',
            render: (h: Hostel) => <span className="capitalize">{h.type}</span>,
        },
        {
            key: 'capacity',
            label: 'Capacity',
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (h: Hostel) => (
                <div className="flex gap-1">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/housing/hostels/${h.id}`}>
                            View
                        </Link>
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <>
            <Head title="Hostels" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Hostels</h1>
                    <Button asChild>
                        <Link href="/admin/housing/hostels/create">
                            <Plus className="mr-2 h-4 w-4" /> Create Hostel
                        </Link>
                    </Button>
                </div>

                <DataTable
                    data={hostels}
                    columns={columns}
                    filters={filters}
                    searchPlaceholder="Search by name..."
                />
            </div>
        </>
    );
}

HostelsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Housing', href: '/admin/housing' },
        { title: 'Hostels', href: '/admin/housing/hostels' },
    ],
};
