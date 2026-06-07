import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Plus, LayoutGrid, Table2 } from 'lucide-react';
import { useState } from 'react';
import DataTable from '@/components/shared/DataTable';
import { FacultyDashboard } from '@/components/faculty/faculty-dashboard';
import type { Department } from '@/types';

interface Faculty {
    id: number;
    staff_number: string;
    job_title: string;
    contract_type: string;
    user?: { id: number; name: string; email: string };
    department?: Department;
}

interface Props {
    facultyStaff: any;
    filters: Record<string, string | undefined>;
    departments: Department[];
    stats?: {
        total: number;
        by_department: { name: string; count: number }[];
        by_rank: { rank: string; count: number }[];
        by_contract: { type: string; count: number }[];
    };
}

export default function FacultyIndex({
    facultyStaff,
    filters,
    departments,
    stats,
}: Props) {
    const [view, setView] = useState<'table' | 'dashboard'>('table');

    const columns = [
        {
            key: 'staff_number',
            label: 'Staff Number',
            render: (f: Faculty) => (
                <Link
                    href={`/admin/faculty/${f.id}`}
                    className="font-mono font-medium hover:underline"
                >
                    {f.staff_number}
                </Link>
            ),
        },
        {
            key: 'name',
            label: 'Name',
            render: (f: Faculty) =>
                f.user?.name ?? (
                    <span className="text-muted-foreground">N/A</span>
                ),
        },
        {
            key: 'department',
            label: 'Department',
            render: (f: Faculty) =>
                f.department?.name ?? (
                    <span className="text-muted-foreground">N/A</span>
                ),
        },
        { key: 'job_title', label: 'Job Title' },
        {
            key: 'contract_type',
            label: 'Contract Type',
            render: (f: Faculty) => (
                <span className="capitalize">{f.contract_type}</span>
            ),
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (f: Faculty) => (
                <div className="flex gap-1">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/faculty/${f.id}`}>View</Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/faculty/${f.id}/edit`}>Edit</Link>
                    </Button>
                </div>
            ),
        },
    ];

    const filterFields = (
        <select
            name="department_id"
            defaultValue={filters.department_id ?? ''}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm"
            onChange={(e) => {
                const url = new URL(window.location.href);
                if (e.target.value)
                    url.searchParams.set('department_id', e.target.value);
                else url.searchParams.delete('department_id');
                url.searchParams.set('page', '1');
                window.location.href = url.toString();
            }}
        >
            <option value="">All Departments</option>
            {departments.map((d) => (
                <option key={d.id} value={d.id}>
                    {d.name}
                </option>
            ))}
        </select>
    );

    return (
        <>
            <Head title="Faculty" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Faculty & Staff</h1>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center rounded-lg border p-0.5">
                            <Button
                                variant={
                                    view === 'dashboard' ? 'secondary' : 'ghost'
                                }
                                size="sm"
                                onClick={() => setView('dashboard')}
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
                            <Link href="/admin/faculty/create">
                                <Plus className="mr-2 h-4 w-4" /> Add Faculty
                            </Link>
                        </Button>
                    </div>
                </div>
                {view === 'dashboard' && stats ? (
                    <FacultyDashboard
                        total_faculty={stats.total}
                        departments_count={stats.by_department.length}
                        by_department={stats.by_department}
                        by_rank={stats.by_rank}
                        by_contract={stats.by_contract.map((c) => ({
                            contract: c.type,
                            count: c.count,
                        }))}
                    />
                ) : (
                    <DataTable
                        data={facultyStaff}
                        columns={columns}
                        filters={filters}
                        searchPlaceholder="Search by name or staff number..."
                        filterFields={filterFields}
                    />
                )}
            </div>
        </>
    );
}
