import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import DataTable from '@/components/shared/DataTable';
import type { Exam, Course } from '@/types';

interface Props {
    exams: any;
    filters: Record<string, string | undefined>;
    courses: Course[];
}

export default function ExamsIndex({ exams, filters, courses }: Props) {
    const columns = [
        {
            key: 'exam_type',
            label: 'Type',
            render: (exam: Exam) => (
                <Link
                    href={`/admin/exams/${exam.id}`}
                    className="font-medium capitalize hover:underline"
                >
                    {exam.exam_type}
                </Link>
            ),
        },
        {
            key: 'course',
            label: 'Course',
            render: (exam: Exam) =>
                exam.course?.name ?? (
                    <span className="text-muted-foreground">N/A</span>
                ),
        },
        {
            key: 'starts_at',
            label: 'Starts At',
            render: (exam: Exam) => new Date(exam.starts_at).toLocaleString(),
        },
        {
            key: 'duration_minutes',
            label: 'Duration',
            render: (exam: Exam) => `${exam.duration_minutes} min`,
        },
        {
            key: 'venue',
            label: 'Venue',
        },
        {
            key: 'is_locked',
            label: 'Status',
            render: (exam: Exam) =>
                exam.is_locked ? (
                    <span className="font-medium text-green-500">Locked</span>
                ) : (
                    <span className="text-amber-500">Open</span>
                ),
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (exam: Exam) => (
                <div className="flex gap-1">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/exams/${exam.id}`}>View</Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/exams/${exam.id}/edit`}>Edit</Link>
                    </Button>
                </div>
            ),
        },
    ];

    const filterFields = (
        <>
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
            <select
                name="locked"
                defaultValue={filters.locked ?? ''}
                className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm"
                onChange={(e) => {
                    const url = new URL(window.location.href);
                    if (e.target.value !== '')
                        url.searchParams.set('locked', e.target.value);
                    else url.searchParams.delete('locked');
                    url.searchParams.set('page', '1');
                    window.location.href = url.toString();
                }}
            >
                <option value="">All Status</option>
                <option value="1">Locked</option>
                <option value="0">Open</option>
            </select>
        </>
    );

    return (
        <>
            <Head title="Exams" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Exams</h1>
                    <Button asChild>
                        <Link href="/admin/exams/create">
                            <Plus className="mr-2 h-4 w-4" /> Create Exam
                        </Link>
                    </Button>
                </div>

                <DataTable
                    data={exams}
                    columns={columns}
                    filters={filters}
                    searchPlaceholder="Search by type or venue..."
                    filterFields={filterFields}
                />
            </div>
        </>
    );
}

ExamsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Exams', href: '/admin/exams' },
    ],
};
