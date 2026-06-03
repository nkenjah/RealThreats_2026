import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import DataTable from '@/components/shared/DataTable';
import type { Lecture, Course } from '@/types';

interface Props {
    lectures: any;
    filters: Record<string, string | undefined>;
    courses: Course[];
}

export default function LecturesIndex({ lectures, filters, courses }: Props) {
    const columns = [
        {
            key: 'topic',
            label: 'Topic',
            render: (lecture: Lecture) => (
                <Link
                    href={`/admin/lectures/${lecture.id}`}
                    className="font-medium hover:underline"
                >
                    {lecture.topic}
                </Link>
            ),
        },
        {
            key: 'course',
            label: 'Course',
            render: (lecture: Lecture) =>
                lecture.course?.name ?? (
                    <span className="text-muted-foreground">N/A</span>
                ),
        },
        {
            key: 'lecturer',
            label: 'Lecturer',
            render: (lecture: Lecture) =>
                lecture.lecturer?.name ?? (
                    <span className="text-muted-foreground">N/A</span>
                ),
        },
        {
            key: 'scheduled_at',
            label: 'Scheduled At',
            render: (lecture: Lecture) =>
                new Date(lecture.scheduled_at).toLocaleString(),
        },
        {
            key: 'venue',
            label: 'Venue',
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (lecture: Lecture) => (
                <div className="flex gap-1">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/lectures/${lecture.id}`}>View</Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/lectures/${lecture.id}/edit`}>
                            Edit
                        </Link>
                    </Button>
                </div>
            ),
        },
    ];

    const filterFields = (
        <select
            name="course_id"
            defaultValue={filters.course_id ?? ''}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm"
            onChange={(e) => {
                const url = new URL(window.location.href);
                if (e.target.value)
                    url.searchParams.set('course_id', e.target.value);
                else url.searchParams.delete('course_id');
                url.searchParams.set('page', '1');
                window.location.href = url.toString();
            }}
        >
            <option value="">All Courses</option>
            {courses.map((c) => (
                <option key={c.id} value={c.id}>
                    {c.code} - {c.name}
                </option>
            ))}
        </select>
    );

    return (
        <>
            <Head title="Lectures" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Lectures</h1>
                    <Button asChild>
                        <Link href="/admin/lectures/create">
                            <Plus className="mr-2 h-4 w-4" /> Create Lecture
                        </Link>
                    </Button>
                </div>

                <DataTable
                    data={lectures}
                    columns={columns}
                    filters={filters}
                    searchPlaceholder="Search by topic or venue..."
                    filterFields={filterFields}
                />
            </div>
        </>
    );
}

LecturesIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Lectures', href: '/admin/lectures' },
    ],
};
