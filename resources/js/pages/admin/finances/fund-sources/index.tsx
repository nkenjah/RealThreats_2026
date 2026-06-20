import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import DataTable from '@/components/shared/DataTable';

interface Props {
    fundSources: any;
    filters: Record<string, string | undefined>;
}

export default function FundSourcesIndex({ fundSources, filters }: Props) {
    const columns = [
        {
            key: 'id',
            label: 'ID',
            render: (item: any) => (
                <Link
                    href={`/admin/fund-sources/${item.id}`}
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
                        <Link href={`/admin/fund-sources/${item.id}`}>
                            View
                        </Link>
                    </Button>
                    {item.edit !== false && (
                        <Button variant="ghost" size="sm" asChild>
                            <Link href={`/admin/fund-sources/${item.id}/edit`}>
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
            <Head title="Fund Sources" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Fund Sources</h1>
                    <Button asChild>
                        <Link href="/admin/fund-sources/create">
                            <Plus className="mr-2 h-4 w-4" /> Create
                        </Link>
                    </Button>
                </div>

                <DataTable
                    data={fundSources}
                    columns={columns}
                    filters={filters}
                    searchPlaceholder="Search by name..."
                />
            </div>
        </>
    );
}

FundSourcesIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Finances', href: '/admin/finances' },
        { title: 'Fund Sources', href: '' },
    ],
};
