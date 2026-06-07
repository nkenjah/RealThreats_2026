import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import DataTable from '@/components/shared/DataTable';

interface GradebookComponent {
    id: number;
    name: string;
    course_offering_id: number;
    max_score: number;
    weight: number;
    course_offering?: { id: number; course?: { name: string } };
}

interface Props {
    gradebookComponents: any;
    filters: Record<string, string | undefined>;
}

export default function GradebookComponentsIndex({
    gradebookComponents,
    filters,
}: Props) {
    const columns = [
        {
            key: 'name',
            label: 'Name',
            render: (c: GradebookComponent) => (
                <Link
                    href={`/admin/gradebook-components/${c.id}`}
                    className="font-medium hover:underline"
                >
                    {c.name}
                </Link>
            ),
        },
        {
            key: 'course_offering',
            label: 'Course Offering',
            render: (c: GradebookComponent) =>
                c.course_offering?.course?.name ?? (
                    <span className="text-muted-foreground">N/A</span>
                ),
        },
        {
            key: 'max_score',
            label: 'Max Score',
        },
        {
            key: 'weight',
            label: 'Weight',
            render: (c: GradebookComponent) => `${c.weight}%`,
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (c: GradebookComponent) => (
                <div className="flex gap-1">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/gradebook-components/${c.id}/edit`}>
                            Edit
                        </Link>
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <>
            <Head title="Gradebook Components" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Gradebook Components</h1>
                    <Button asChild>
                        <Link href="/admin/gradebook-components/create">
                            <Plus className="mr-2 h-4 w-4" /> Create Component
                        </Link>
                    </Button>
                </div>

                <DataTable
                    data={gradebookComponents}
                    columns={columns}
                    filters={filters}
                    searchPlaceholder="Search by name..."
                />
            </div>
        </>
    );
}

GradebookComponentsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Components', href: '/admin/gradebook-components' },
    ],
};
