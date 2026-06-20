import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import DataTable from '@/components/shared/DataTable';
import type { Application, Program } from '@/types';

interface Props {
    applications: any;
    filters: Record<string, string | undefined>;
    programs: Program[];
}

export default function ApplicationsIndex({
    applications,
    filters,
    programs,
}: Props) {
    const columns = [
        {
            key: 'prospect_name',
            label: 'Prospect',
            render: (app: Application) => (
                <Link
                    href={`/admin/admissions/applications/${app.id}`}
                    className="font-medium hover:underline"
                >
                    {app.prospect?.first_name} {app.prospect?.last_name}
                </Link>
            ),
        },
        {
            key: 'program_name',
            label: 'Program',
            render: (app: Application) =>
                app.program?.name ?? (
                    <span className="text-muted-foreground">N/A</span>
                ),
        },
        {
            key: 'submission_date',
            label: 'Submission Date',
            render: (app: Application) =>
                app.submission_date
                    ? new Date(app.submission_date).toLocaleDateString()
                    : 'N/A',
        },
        {
            key: 'status',
            label: 'Status',
            render: (app: Application) => (
                <span className="capitalize">
                    {app.status.replace(/_/g, ' ')}
                </span>
            ),
        },
        {
            key: 'assigned_reviewer',
            label: 'Reviewer',
            render: (app: Application) =>
                app.assigned_reviewer?.name ?? (
                    <span className="text-muted-foreground">Unassigned</span>
                ),
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (app: Application) => (
                <div className="flex gap-1">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/admissions/applications/${app.id}`}>
                            View
                        </Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                        <Link
                            href={`/admin/admissions/applications/${app.id}/edit`}
                        >
                            Edit
                        </Link>
                    </Button>
                </div>
            ),
        },
    ];

    const filterFields = (
        <>
            <select
                name="program_id"
                defaultValue={filters.program_id ?? ''}
                className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm"
                onChange={(e) => {
                    const url = new URL(window.location.href);
                    if (e.target.value)
                        url.searchParams.set('program_id', e.target.value);
                    else url.searchParams.delete('program_id');
                    url.searchParams.set('page', '1');
                    window.location.href = url.toString();
                }}
            >
                <option value="">All Programs</option>
                {programs.map((p) => (
                    <option key={p.id} value={p.id}>
                        {p.name}
                    </option>
                ))}
            </select>
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
                <option value="">All Statuses</option>
                <option value="submitted">Submitted</option>
                <option value="under_review">Under Review</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="waitlisted">Waitlisted</option>
            </select>
        </>
    );

    return (
        <>
            <Head title="Applications" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Applications</h1>
                    <Button asChild>
                        <Link href="/admin/admissions/applications/create">
                            <Plus className="mr-2 h-4 w-4" /> Create Application
                        </Link>
                    </Button>
                </div>

                <DataTable
                    data={applications}
                    columns={columns}
                    filters={filters}
                    searchPlaceholder="Search applications..."
                    filterFields={filterFields}
                />
            </div>
        </>
    );
}

ApplicationsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Admissions', href: '/admin/admissions' },
        { title: 'Applications', href: '/admin/admissions/applications' },
    ],
};
