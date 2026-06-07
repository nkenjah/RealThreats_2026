import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import DataTable from '@/components/shared/DataTable';

interface Campus {
    id: number;
    name: string;
    code: string;
    address: string | null;
}

interface Props {
    campuses: any;
    filters: Record<string, string | undefined>;
}

export default function CampusesIndex({ campuses, filters }: Props) {
    const columns = [
        {
            key: 'name',
            label: 'Name',
            render: (c: Campus) => (
                <Link
                    href={`/admin/campuses/${c.id}`}
                    className="font-medium hover:underline"
                >
                    {c.name}
                </Link>
            ),
        },
        {
            key: 'code',
            label: 'Code',
            render: (c: Campus) => <span className="font-mono">{c.code}</span>,
        },
        {
            key: 'address',
            label: 'Address',
            render: (c: Campus) =>
                c.address ?? <span className="text-muted-foreground">N/A</span>,
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (c: Campus) => (
                <div className="flex gap-1">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/campuses/${c.id}`}>View</Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/campuses/${c.id}/edit`}>Edit</Link>
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <>
            <Head title="Campuses" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Campuses</h1>
                    <Button asChild>
                        <Link href="/admin/campuses/create">
                            <Plus className="mr-2 h-4 w-4" /> Create Campus
                        </Link>
                    </Button>
                </div>

                <DataTable
                    data={campuses}
                    columns={columns}
                    filters={filters}
                    searchPlaceholder="Search by name or code..."
                />
            </div>
        </>
    );
}

CampusesIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Campuses', href: '/admin/campuses' },
    ],
};
