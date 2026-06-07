import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import DataTable from '@/components/shared/DataTable';

interface CoursePrerequisite {
    id: number;
    course_id: number;
    prerequisite_course_id: number;
    course?: { id: number; name: string; code: string };
    prerequisite_course?: { id: number; name: string; code: string };
}

interface Props {
    coursePrerequisites: any;
    filters: Record<string, string | undefined>;
}

export default function CoursePrerequisitesIndex({
    coursePrerequisites,
    filters,
}: Props) {
    const columns = [
        {
            key: 'course',
            label: 'Course',
            render: (p: CoursePrerequisite) =>
                p.course?.name ?? (
                    <span className="text-muted-foreground">N/A</span>
                ),
        },
        {
            key: 'prerequisite',
            label: 'Prerequisite',
            render: (p: CoursePrerequisite) =>
                p.prerequisite_course?.name ?? (
                    <span className="text-muted-foreground">N/A</span>
                ),
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (p: CoursePrerequisite) => (
                <div className="flex gap-1">
                    <Button variant="ghost" size="sm">
                        Remove
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <>
            <Head title="Course Prerequisites" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Course Prerequisites</h1>
                    <Button asChild>
                        <Link href="/admin/curriculum/course-prerequisites/create">
                            <Plus className="mr-2 h-4 w-4" /> Add Prerequisite
                        </Link>
                    </Button>
                </div>

                <DataTable
                    data={coursePrerequisites}
                    columns={columns}
                    filters={filters}
                    searchPlaceholder="Search by course..."
                />
            </div>
        </>
    );
}

CoursePrerequisitesIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Curriculum', href: '/admin/curriculum' },
        {
            title: 'Course Prerequisites',
            href: '/admin/curriculum/course-prerequisites',
        },
    ],
};
