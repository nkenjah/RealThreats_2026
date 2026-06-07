import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import DataTable from '@/components/shared/DataTable';

interface Program {
    id: number;
    name: string;
    code: string;
    duration_years: number;
    total_credits: number;
}

interface Props {
    programs: any;
    filters: Record<string, string | undefined>;
}

export default function ProgramsIndex({ programs, filters }: Props) {
    const columns = [
        {
            key: 'name',
            label: 'Name',
            render: (p: Program) => (
                <Link
                    href={`/admin/programs/${p.id}`}
                    className="font-medium hover:underline"
                >
                    {p.name}
                </Link>
            ),
        },
        { key: 'code', label: 'Code' },
        { key: 'duration_years', label: 'Duration (Years)' },
        { key: 'total_credits', label: 'Total Credits' },
        {
            key: 'actions',
            label: 'Actions',
            render: (p: Program) => (
                <div className="flex gap-1">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/programs/${p.id}`}>View</Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/programs/${p.id}/edit`}>Edit</Link>
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <>
            <Head title="Programs" />
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Programs</h1>
                    <Button asChild>
                        <Link href="/admin/programs/create">
                            <Plus className="mr-2 h-4 w-4" /> Create Program
                        </Link>
                    </Button>
                </div>
                <DataTable
                    data={programs}
                    columns={columns}
                    filters={filters}
                    searchPlaceholder="Search by name or code..."
                />
            </div>
        </>
    );
}

ProgramsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Programs', href: '/admin/programs' },
    ],
};
