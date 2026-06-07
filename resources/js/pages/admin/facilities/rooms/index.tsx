import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import DataTable from '@/components/shared/DataTable';

interface Room {
    id: number;
    name: string;
    code: string;
    capacity: number;
    building?: { id: number; name: string };
}

interface Props {
    rooms: any;
    filters: Record<string, string | undefined>;
}

export default function RoomsIndex({ rooms, filters }: Props) {
    const columns = [
        {
            key: 'name',
            label: 'Name',
            render: (r: Room) => (
                <Link
                    href={`/admin/rooms/${r.id}`}
                    className="font-medium hover:underline"
                >
                    {r.name}
                </Link>
            ),
        },
        {
            key: 'code',
            label: 'Code',
            render: (r: Room) => <span className="font-mono">{r.code}</span>,
        },
        {
            key: 'building',
            label: 'Building',
            render: (r: Room) =>
                r.building?.name ?? (
                    <span className="text-muted-foreground">N/A</span>
                ),
        },
        {
            key: 'capacity',
            label: 'Capacity',
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (r: Room) => (
                <div className="flex gap-1">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/rooms/${r.id}`}>View</Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/rooms/${r.id}/edit`}>Edit</Link>
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <>
            <Head title="Rooms" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Rooms</h1>
                    <Button asChild>
                        <Link href="/admin/rooms/create">
                            <Plus className="mr-2 h-4 w-4" /> Create Room
                        </Link>
                    </Button>
                </div>

                <DataTable
                    data={rooms}
                    columns={columns}
                    filters={filters}
                    searchPlaceholder="Search by name or code..."
                />
            </div>
        </>
    );
}

RoomsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Rooms', href: '/admin/rooms' },
    ],
};
