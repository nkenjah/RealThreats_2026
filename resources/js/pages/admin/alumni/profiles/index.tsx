import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Plus, LayoutGrid, Table2 } from 'lucide-react';
import { useState } from 'react';
import DataTable from '@/components/shared/DataTable';
import { AlumniDashboard } from '@/components/alumni/alumni-dashboard';

interface Alumni {
    id: number;
    student_id: number;
    graduation_year: number;
    company: string | null;
    job_title: string | null;
    industry: string | null;
    student?: { id: number; name: string; registration_number: string };
}

interface Props {
    alumniProfiles: any;
    filters: Record<string, string | undefined>;
    stats?: {
        total_alumni: number;
        employed: number;
        industries_count: number;
        graduation_years_count: number;
        by_industry: { industry: string; count: number }[];
        by_graduation_year: { year: number; count: number }[];
    };
}

export default function AlumniIndex({ alumniProfiles, filters, stats }: Props) {
    const [view, setView] = useState<'table' | 'dashboard'>('table');

    const columns = [
        {
            key: 'student',
            label: 'Student',
            render: (a: Alumni) => (
                <Link
                    href={`/admin/alumni/${a.id}`}
                    className="font-medium hover:underline"
                >
                    {a.student?.name ?? 'N/A'}
                </Link>
            ),
        },
        {
            key: 'graduation_year',
            label: 'Graduation Year',
        },
        {
            key: 'company',
            label: 'Company',
            render: (a: Alumni) =>
                a.company ?? <span className="text-muted-foreground">-</span>,
        },
        {
            key: 'job_title',
            label: 'Job Title',
            render: (a: Alumni) =>
                a.job_title ?? <span className="text-muted-foreground">-</span>,
        },
        {
            key: 'industry',
            label: 'Industry',
            render: (a: Alumni) =>
                a.industry ?? <span className="text-muted-foreground">-</span>,
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (a: Alumni) => (
                <div className="flex gap-1">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/alumni/${a.id}`}>View</Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/alumni/${a.id}/edit`}>Edit</Link>
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <>
            <Head title="Alumni" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Alumni</h1>
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
                            <Link href="/admin/alumni/create">
                                <Plus className="mr-2 h-4 w-4" /> Create Alumni
                            </Link>
                        </Button>
                    </div>
                </div>

                {view === 'dashboard' && stats ? (
                    <AlumniDashboard
                        total_alumni={stats.total_alumni}
                        employed={stats.employed}
                        industries_count={stats.industries_count}
                        graduation_years_count={stats.graduation_years_count}
                        by_industry={stats.by_industry}
                        by_graduation_year={stats.by_graduation_year}
                    />
                ) : (
                    <DataTable
                        data={alumniProfiles}
                        columns={columns}
                        filters={filters}
                        searchPlaceholder="Search by name, company, or industry..."
                    />
                )}
            </div>
        </>
    );
}

AlumniIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Alumni', href: '/admin/alumni' },
    ],
};
