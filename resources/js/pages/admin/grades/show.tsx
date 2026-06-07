import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import ConfirmModal from '@/components/shared/ConfirmModal';

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
    grade: Grade;
}

export default function GradesShow({ grade }: Props) {
    const [showDelete, setShowDelete] = useState(false);

    return (
        <>
            <Head title="Grade Details" />
            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/grades">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">Grade Details</h1>
                        <p className="text-sm text-muted-foreground">
                            {grade.student?.name ?? 'N/A'}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/grades/${grade.id}/edit`}>
                                <Edit2 className="mr-2 h-4 w-4" /> Edit
                            </Link>
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setShowDelete(true)}
                        >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-lg border bg-card p-4">
                        <h2 className="mb-4 text-sm font-medium">
                            Grade Information
                        </h2>
                        <dl className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Student
                                </dt>
                                <dd>{grade.student?.name ?? 'N/A'}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Course
                                </dt>
                                <dd>
                                    {grade.courseOffering?.course?.name ??
                                        'N/A'}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">Grade</dt>
                                <dd>{grade.grade}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Grade Points
                                </dt>
                                <dd>{grade.grade_points ?? 'N/A'}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Academic Year
                                </dt>
                                <dd>{grade.academic_year}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Semester
                                </dt>
                                <dd>{grade.semester}</dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>

            <ConfirmModal
                open={showDelete}
                onClose={() => setShowDelete(false)}
                onConfirm={() => {
                    router.delete(`/admin/grades/${grade.id}`);
                    setShowDelete(false);
                }}
                title="Delete Grade?"
                description="This will permanently delete this grade record."
                confirmText="Delete"
                variant="destructive"
            />
        </>
    );
}

GradesShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Grades', href: '/admin/grades' },
        { title: 'Grade Details', href: '' },
    ],
};
