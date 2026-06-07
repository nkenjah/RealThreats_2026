import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import DataTable from '@/components/shared/DataTable';

interface FundSource {
    id: number;
    name: string;
}

interface Scholarship {
    id: number;
    student_id: number;
    award_amount: number;
    status: string;
    student?: { id: number; name: string; registration_number: string };
    fundSource?: FundSource;
}

interface Props {
    scholarshipAwards: any;
    filters: Record<string, string | undefined>;
}

export default function ScholarshipsIndex({
    scholarshipAwards,
    filters,
}: Props) {
    const columns = [
        {
            key: 'student',
            label: 'Student',
            render: (s: Scholarship) => (
                <Link
                    href={`/admin/scholarship-awards/${s.id}`}
                    className="font-medium hover:underline"
                >
                    {s.student?.name ?? 'N/A'}
                </Link>
            ),
        },
        {
            key: 'fundSource',
            label: 'Fund Source',
            render: (s: Scholarship) => s.fundSource?.name ?? 'N/A',
        },
        {
            key: 'award_amount',
            label: 'Award Amount',
            render: (s: Scholarship) =>
                new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'TZS',
                }).format(s.award_amount),
        },
        {
            key: 'status',
            label: 'Status',
            render: (s: Scholarship) => (
                <span className="capitalize">{s.status}</span>
            ),
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (s: Scholarship) => (
                <div className="flex gap-1">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/scholarship-awards/${s.id}`}>
                            View
                        </Link>
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <>
            <Head title="Scholarships" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Scholarships</h1>
                    <Button asChild>
                        <Link href="/admin/scholarship-awards/create">
                            <Plus className="mr-2 h-4 w-4" /> Create Scholarship
                        </Link>
                    </Button>
                </div>

                <DataTable
                    data={scholarshipAwards}
                    columns={columns}
                    filters={filters}
                    searchPlaceholder="Search by student or fund source..."
                />
            </div>
        </>
    );
}

ScholarshipsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Scholarships', href: '/admin/scholarship-awards' },
    ],
};
