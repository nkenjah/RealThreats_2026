import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import DataTable from '@/components/shared/DataTable';

interface CourseOffering {
    id: number;
    academic_year: string;
    semester: string;
    section: string | null;
    course?: { id: number; name: string; code: string };
    program?: { id: number; name: string };
}

interface Props {
    courseOfferings: any;
    filters: Record<string, string | undefined>;
}

export default function OfferingsIndex({ courseOfferings, filters }: Props) {
    const columns = [
        {
            key: 'course',
            label: 'Course',
            render: (o: CourseOffering) => (
                <Link
                    href={`/admin/offerings/${o.id}`}
                    className="font-medium hover:underline"
                >
                    {o.course?.name ?? 'N/A'}
                </Link>
            ),
        },
        {
            key: 'program',
            label: 'Program',
            render: (o: CourseOffering) =>
                o.program?.name ?? (
                    <span className="text-muted-foreground">N/A</span>
                ),
        },
        { key: 'academic_year', label: 'Academic Year' },
        { key: 'semester', label: 'Semester' },
        {
            key: 'section',
            label: 'Section',
            render: (o: CourseOffering) =>
                o.section ?? <span className="text-muted-foreground">-</span>,
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (o: CourseOffering) => (
                <div className="flex gap-1">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/offerings/${o.id}`}>View</Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/offerings/${o.id}/edit`}>Edit</Link>
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <>
            <Head title="Course Offerings" />
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Course Offerings</h1>
                    <Button asChild>
                        <Link href="/admin/offerings/create">
                            <Plus className="mr-2 h-4 w-4" /> Create Offering
                        </Link>
                    </Button>
                </div>
                <DataTable
                    data={courseOfferings}
                    columns={columns}
                    filters={filters}
                    searchPlaceholder="Search by course or program..."
                />
            </div>
        </>
    );
}

OfferingsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Offerings', href: '/admin/offerings' },
    ],
};
