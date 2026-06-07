import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import DataTable from '@/components/shared/DataTable';

interface ProgramRequirement {
    id: number;
    program_id: number;
    course_id: number;
    min_grade: string | null;
    credits: number;
    program?: { id: number; name: string };
    course?: { id: number; name: string; code: string };
}

interface Props {
    programRequirements: any;
    filters: Record<string, string | undefined>;
}

export default function ProgramRequirementsIndex({
    programRequirements,
    filters,
}: Props) {
    const columns = [
        {
            key: 'program',
            label: 'Program',
            render: (r: ProgramRequirement) =>
                r.program?.name ?? (
                    <span className="text-muted-foreground">N/A</span>
                ),
        },
        {
            key: 'course',
            label: 'Course',
            render: (r: ProgramRequirement) =>
                r.course?.name ?? (
                    <span className="text-muted-foreground">N/A</span>
                ),
        },
        {
            key: 'min_grade',
            label: 'Min Grade',
            render: (r: ProgramRequirement) =>
                r.min_grade ?? <span className="text-muted-foreground">-</span>,
        },
        {
            key: 'credits',
            label: 'Credits',
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (r: ProgramRequirement) => (
                <div className="flex gap-1">
                    <Button variant="ghost" size="sm">
                        Edit
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <>
            <Head title="Program Requirements" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Program Requirements</h1>
                    <Button asChild>
                        <Link href="/admin/curriculum/program-requirements/create">
                            <Plus className="mr-2 h-4 w-4" /> Add Requirement
                        </Link>
                    </Button>
                </div>

                <DataTable
                    data={programRequirements}
                    columns={columns}
                    filters={filters}
                    searchPlaceholder="Search by program or course..."
                />
            </div>
        </>
    );
}

ProgramRequirementsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Curriculum', href: '/admin/curriculum' },
        {
            title: 'Program Requirements',
            href: '/admin/curriculum/program-requirements',
        },
    ],
};
