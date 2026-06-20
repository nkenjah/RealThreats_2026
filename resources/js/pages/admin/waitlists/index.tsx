import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import DataTable from '@/components/shared/DataTable';

interface Props {
    waitlists: any;
    filters: Record<string, string | undefined>;
}

export default function WaitlistsIndex({ waitlists, filters }: Props) {
    const columns = [
        {
            key: 'id',
            label: 'ID',
            render: (item: any) => (
                <Link
                    href={`/admin/waitlists/${item.id}`}
                    className="font-medium hover:underline"
                >
                    #{item.id}
                </Link>
            ),
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (item: any) => (
                <div className="flex gap-1">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/waitlists/${item.id}`}>View</Link>
                    </Button>
                    {item.edit !== false && (
                        <Button variant="ghost" size="sm" asChild>
                            <Link href={`/admin/waitlists/${item.id}/edit`}>
                                Edit
                            </Link>
                        </Button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <>
            <Head title="Waitlists" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Waitlists</h1>
                    <Button asChild>
                        <Link href="/admin/waitlists/create">
                            <Plus className="mr-2 h-4 w-4" /> Create
                        </Link>
                    </Button>
                </div>

                <DataTable
                    data={waitlists}
                    columns={columns}
                    filters={filters}
                    searchPlaceholder="Search by student..."
                />
            </div>
        </>
    );
}

WaitlistsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Waitlists', href: '' },
    ],
};
