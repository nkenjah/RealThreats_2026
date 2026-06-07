import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import DataTable from '@/components/shared/DataTable';

interface DegreeAudit {
    id: number;
    student_id: number;
    status: string;
    student?: { id: number; name: string; registration_number: string };
}

interface Props {
    degreeAudits: any;
    filters: Record<string, string | undefined>;
}

export default function DegreeAuditsIndex({ degreeAudits, filters }: Props) {
    const columns = [
        {
            key: 'student',
            label: 'Student',
            render: (a: DegreeAudit) =>
                a.student?.name ?? (
                    <span className="text-muted-foreground">N/A</span>
                ),
        },
        {
            key: 'status',
            label: 'Status',
            render: (a: DegreeAudit) => (
                <span className="capitalize">{a.status}</span>
            ),
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (a: DegreeAudit) => (
                <div className="flex gap-1">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/academics/degree-audits/${a.id}`}>
                            View
                        </Link>
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <>
            <Head title="Degree Audits" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Degree Audits</h1>
                    <Button asChild>
                        <Link href="/admin/academics/degree-audits/create">
                            <Plus className="mr-2 h-4 w-4" /> Create Audit
                        </Link>
                    </Button>
                </div>

                <DataTable
                    data={degreeAudits}
                    columns={columns}
                    filters={filters}
                    searchPlaceholder="Search by student..."
                />
            </div>
        </>
    );
}

DegreeAuditsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Academics', href: '/admin/academics' },
        { title: 'Degree Audits', href: '/admin/academics/degree-audits' },
    ],
};
