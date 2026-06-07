import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import DataTable from '@/components/shared/DataTable';

interface Dormitory {
    id: number;
    name: string;
    capacity: number;
    type: string;
}

interface Props {
    dormitories: any;
    filters: Record<string, string | undefined>;
}

export default function DormitoriesIndex({ dormitories, filters }: Props) {
    const columns = [
        {
            key: 'name',
            label: 'Name',
            render: (d: Dormitory) => (
                <Link
                    href={`/admin/housing/dormitories/${d.id}`}
                    className="font-medium hover:underline"
                >
                    {d.name}
                </Link>
            ),
        },
        {
            key: 'type',
            label: 'Type',
            render: (d: Dormitory) => (
                <span className="capitalize">{d.type}</span>
            ),
        },
        {
            key: 'capacity',
            label: 'Capacity',
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (d: Dormitory) => (
                <div className="flex gap-1">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/housing/dormitories/${d.id}`}>
                            View
                        </Link>
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <>
            <Head title="Dormitories" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Dormitories</h1>
                    <Button asChild>
                        <Link href="/admin/housing/dormitories/create">
                            <Plus className="mr-2 h-4 w-4" /> Create Dormitory
                        </Link>
                    </Button>
                </div>

                <DataTable
                    data={dormitories}
                    columns={columns}
                    filters={filters}
                    searchPlaceholder="Search by name..."
                />
            </div>
        </>
    );
}

DormitoriesIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Housing', href: '/admin/housing' },
        { title: 'Dormitories', href: '/admin/housing/dormitories' },
    ],
};
