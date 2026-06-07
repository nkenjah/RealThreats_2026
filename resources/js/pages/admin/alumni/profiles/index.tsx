import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import DataTable from '@/components/shared/DataTable';

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
}

export default function AlumniIndex({ alumniProfiles, filters }: Props) {
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
                    <Button asChild>
                        <Link href="/admin/alumni/create">
                            <Plus className="mr-2 h-4 w-4" /> Create Alumni
                        </Link>
                    </Button>
                </div>

                <DataTable
                    data={alumniProfiles}
                    columns={columns}
                    filters={filters}
                    searchPlaceholder="Search by name, company, or industry..."
                />
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
