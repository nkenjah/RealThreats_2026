import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import DataTable from '@/components/shared/DataTable';

interface FinalGrade {
    id: number;
    student_id: number;
    course_offering_id: number;
    total_score: number;
    letter_grade: string;
    student?: { id: number; name: string; registration_number: string };
    course_offering?: { id: number; course?: { name: string } };
}

interface Props {
    finalTermGrades: any;
    filters: Record<string, string | undefined>;
}

export default function FinalGradesIndex({ finalTermGrades, filters }: Props) {
    const columns = [
        {
            key: 'student',
            label: 'Student',
            render: (g: FinalGrade) =>
                g.student?.name ?? (
                    <span className="text-muted-foreground">N/A</span>
                ),
        },
        {
            key: 'course_offering',
            label: 'Course Offering',
            render: (g: FinalGrade) =>
                g.course_offering?.course?.name ?? (
                    <span className="text-muted-foreground">N/A</span>
                ),
        },
        {
            key: 'total_score',
            label: 'Total Score',
        },
        {
            key: 'letter_grade',
            label: 'Letter Grade',
            render: (g: FinalGrade) => (
                <span className="font-mono font-medium">{g.letter_grade}</span>
            ),
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (g: FinalGrade) => (
                <div className="flex gap-1">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/final-term-grades/${g.id}/edit`}>
                            Edit
                        </Link>
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <>
            <Head title="Final Grades" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Final Grades</h1>
                    <Button asChild>
                        <Link href="/admin/final-term-grades/create">
                            <Plus className="mr-2 h-4 w-4" /> Add Final Grade
                        </Link>
                    </Button>
                </div>

                <DataTable
                    data={finalTermGrades}
                    columns={columns}
                    filters={filters}
                    searchPlaceholder="Search by student or course..."
                />
            </div>
        </>
    );
}

FinalGradesIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Final Grades', href: '/admin/final-term-grades' },
    ],
};
