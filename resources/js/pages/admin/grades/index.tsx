import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import DataTable from '@/components/shared/DataTable';

interface Grade {
    id: number;
    grade: string;
    grade_points: number | null;
    academic_year: string;
    semester: string;
    student?: { id: number; name: string };
    courseOffering?: {
        id: number;
        course?: { id: number; name: string; code: string };
    };
}

interface Props {
    grades: any;
    filters: Record<string, string | undefined>;
}

export default function GradesIndex({ grades, filters }: Props) {
    const columns = [
        {
            key: 'student',
            label: 'Student',
            render: (g: Grade) => (
                <Link
                    href={`/admin/grades/${g.id}`}
                    className="font-medium hover:underline"
                >
                    {g.student?.name ?? 'N/A'}
                </Link>
            ),
        },
        {
            key: 'course',
            label: 'Course',
            render: (g: Grade) => g.courseOffering?.course?.name ?? 'N/A',
        },
        { key: 'grade', label: 'Grade' },
        { key: 'grade_points', label: 'Grade Points' },
        { key: 'academic_year', label: 'Academic Year' },
        { key: 'semester', label: 'Semester' },
        {
            key: 'actions',
            label: 'Actions',
            render: (g: Grade) => (
                <div className="flex gap-1">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/grades/${g.id}`}>View</Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/grades/${g.id}/edit`}>Edit</Link>
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <>
            <Head title="Grades" />
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Grades</h1>
                    <Button asChild>
                        <Link href="/admin/grades/create">
                            <Plus className="mr-2 h-4 w-4" /> Create Grade
                        </Link>
                    </Button>
                </div>
                <DataTable
                    data={grades}
                    columns={columns}
                    filters={filters}
                    searchPlaceholder="Search by student name..."
                />
            </div>
        </>
    );
}

GradesIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Grades', href: '/admin/grades' },
    ],
};
