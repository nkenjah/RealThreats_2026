import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import DataTable from '@/components/shared/DataTable';

interface Building {
    id: number;
    name: string;
    code: string;
    campus?: { id: number; name: string };
}

interface Campus {
    id: number;
    name: string;
}

interface Props {
    buildings: any;
    filters: Record<string, string | undefined>;
    campuses: Campus[];
}

export default function BuildingsIndex({
    buildings,
    filters,
    campuses,
}: Props) {
    const columns = [
        {
            key: 'name',
            label: 'Name',
            render: (b: Building) => (
                <Link
                    href={`/admin/buildings/${b.id}`}
                    className="font-medium hover:underline"
                >
                    {b.name}
                </Link>
            ),
        },
        {
            key: 'code',
            label: 'Code',
            render: (b: Building) => (
                <span className="font-mono">{b.code}</span>
            ),
        },
        {
            key: 'campus',
            label: 'Campus',
            render: (b: Building) =>
                b.campus?.name ?? (
                    <span className="text-muted-foreground">N/A</span>
                ),
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (b: Building) => (
                <div className="flex gap-1">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/buildings/${b.id}`}>View</Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/buildings/${b.id}/edit`}>Edit</Link>
                    </Button>
                </div>
            ),
        },
    ];

    const filterFields = (
        <select
            name="campus_id"
            defaultValue={filters.campus_id ?? ''}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm"
            onChange={(e) => {
                const url = new URL(window.location.href);
                if (e.target.value)
                    url.searchParams.set('campus_id', e.target.value);
                else url.searchParams.delete('campus_id');
                url.searchParams.set('page', '1');
                window.location.href = url.toString();
            }}
        >
            <option value="">All Campuses</option>
            {campuses.map((c) => (
                <option key={c.id} value={c.id}>
                    {c.name}
                </option>
            ))}
        </select>
    );

    return (
        <>
            <Head title="Buildings" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Buildings</h1>
                    <Button asChild>
                        <Link href="/admin/buildings/create">
                            <Plus className="mr-2 h-4 w-4" /> Create Building
                        </Link>
                    </Button>
                </div>

                <DataTable
                    data={buildings}
                    columns={columns}
                    filters={filters}
                    searchPlaceholder="Search by name or code..."
                    filterFields={filterFields}
                />
            </div>
        </>
    );
}

BuildingsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Buildings', href: '/admin/buildings' },
    ],
};
