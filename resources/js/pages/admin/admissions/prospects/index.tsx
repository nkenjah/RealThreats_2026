import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Plus, LayoutGrid, Table2 } from 'lucide-react';
import { useState } from 'react';
import DataTable from '@/components/shared/DataTable';
import { ProspectsKanban } from '@/components/admissions/prospects-kanban';
import type { Prospect } from '@/types';

interface Props {
    prospects: any;
    filters: Record<string, string | undefined>;
}

export default function ProspectsIndex({ prospects, filters }: Props) {
    const [view, setView] = useState<'table' | 'kanban'>('table');

    const columns = [
        {
            key: 'first_name',
            label: 'First Name',
            render: (p: Prospect) => (
                <Link
                    href={`/admin/admissions/prospects/${p.id}`}
                    className="font-medium hover:underline"
                >
                    {p.first_name}
                </Link>
            ),
        },
        { key: 'last_name', label: 'Last Name' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone' },
        {
            key: 'gpa',
            label: 'GPA',
            render: (p: Prospect) =>
                p.gpa != null ? (
                    p.gpa
                ) : (
                    <span className="text-muted-foreground">N/A</span>
                ),
        },
        {
            key: 'entry_term',
            label: 'Entry Term',
            render: (p: Prospect) =>
                p.entry_term ?? (
                    <span className="text-muted-foreground">N/A</span>
                ),
        },
        {
            key: 'status',
            label: 'Status',
            render: (p: Prospect) => (
                <span className="capitalize">{p.status}</span>
            ),
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (p: Prospect) => (
                <div className="flex gap-1">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/admissions/prospects/${p.id}`}>
                            View
                        </Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/admissions/prospects/${p.id}/edit`}>
                            Edit
                        </Link>
                    </Button>
                </div>
            ),
        },
    ];

    const filterFields = (
        <select
            name="status"
            defaultValue={filters.status ?? ''}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm"
            onChange={(e) => {
                const url = new URL(window.location.href);
                if (e.target.value)
                    url.searchParams.set('status', e.target.value);
                else url.searchParams.delete('status');
                url.searchParams.set('page', '1');
                window.location.href = url.toString();
            }}
        >
            <option value="">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="applied">Applied</option>
            <option value="qualified">Qualified</option>
            <option value="disqualified">Disqualified</option>
        </select>
    );

    return (
        <>
            <Head title="Prospects" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Prospects</h1>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center rounded-lg border p-0.5">
                            <Button
                                variant={
                                    view === 'kanban' ? 'secondary' : 'ghost'
                                }
                                size="sm"
                                onClick={() => setView('kanban')}
                                className="h-7 px-2"
                            >
                                <LayoutGrid className="size-4" />
                            </Button>
                            <Button
                                variant={
                                    view === 'table' ? 'secondary' : 'ghost'
                                }
                                size="sm"
                                onClick={() => setView('table')}
                                className="h-7 px-2"
                            >
                                <Table2 className="size-4" />
                            </Button>
                        </div>
                        <Button asChild>
                            <Link href="/admin/admissions/prospects/create">
                                <Plus className="mr-2 h-4 w-4" /> Create
                                Prospect
                            </Link>
                        </Button>
                    </div>
                </div>
                {view === 'kanban' ? (
                    <ProspectsKanban
                        prospects={(prospects.data || []).map(
                            (p: Prospect) => ({
                                id: p.id,
                                name: `${p.first_name} ${p.last_name}`,
                                email: p.email,
                                gpa: p.gpa ?? 0,
                                entry_term: p.entry_term ?? '',
                                high_school: p.high_school ?? '',
                                status: p.status as
                                    | 'new'
                                    | 'contacted'
                                    | 'applied'
                                    | 'qualified'
                                    | 'disqualified',
                            }),
                        )}
                    />
                ) : (
                    <DataTable
                        data={prospects}
                        columns={columns}
                        filters={filters}
                        searchPlaceholder="Search by name, email, or phone..."
                        filterFields={filterFields}
                    />
                )}
            </div>
        </>
    );
}

ProspectsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Admissions', href: '/admin/admissions/prospects' },
        { title: 'Prospects', href: '/admin/admissions/prospects' },
    ],
};
