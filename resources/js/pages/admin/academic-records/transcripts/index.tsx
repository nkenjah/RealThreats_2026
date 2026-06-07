import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import DataTable from '@/components/shared/DataTable';

interface Transcript {
    id: number;
    student_id: number;
    total_credits: number;
    gpa: number | null;
    student?: { id: number; name: string; registration_number: string };
}

interface Props {
    academicTranscripts: any;
    filters: Record<string, string | undefined>;
}

export default function TranscriptsIndex({
    academicTranscripts,
    filters,
}: Props) {
    const columns = [
        {
            key: 'student',
            label: 'Student',
            render: (t: Transcript) =>
                t.student?.name ?? (
                    <span className="text-muted-foreground">N/A</span>
                ),
        },
        {
            key: 'total_credits',
            label: 'Total Credits',
        },
        {
            key: 'gpa',
            label: 'GPA',
            render: (t: Transcript) =>
                t.gpa !== null ? (
                    t.gpa.toFixed(2)
                ) : (
                    <span className="text-muted-foreground">-</span>
                ),
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (t: Transcript) => (
                <div className="flex gap-1">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/academics/transcripts/${t.id}`}>
                            View
                        </Link>
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <>
            <Head title="Transcripts" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Transcripts</h1>
                    <Button asChild>
                        <Link href="/admin/academics/transcripts/create">
                            <Plus className="mr-2 h-4 w-4" /> Create Transcript
                        </Link>
                    </Button>
                </div>

                <DataTable
                    data={academicTranscripts}
                    columns={columns}
                    filters={filters}
                    searchPlaceholder="Search by student..."
                />
            </div>
        </>
    );
}

TranscriptsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Academics', href: '/admin/academics' },
        { title: 'Transcripts', href: '/admin/academics/transcripts' },
    ],
};
