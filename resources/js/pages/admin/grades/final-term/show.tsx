import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import ConfirmModal from '@/components/shared/ConfirmModal';

interface FinalTermGrade {
    id: number;
    total_score: number;
    letter_grade: string;
    gpa_points: number | null;
    enrollment?: { id: number; student?: { id: number; name: string } };
    courseOffering?: {
        id: number;
        course?: { id: number; name: string; code: string };
    };
}

interface Props {
    finalTermGrade: FinalTermGrade;
}

export default function FinalTermShow({ finalTermGrade }: Props) {
    const [showDelete, setShowDelete] = useState(false);

    return (
        <>
            <Head title="Final Term Grade" />
            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/final-term-grades">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">Final Term Grade</h1>
                        <p className="text-sm text-muted-foreground">
                            {finalTermGrade.enrollment?.student?.name ?? 'N/A'}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                            <Link
                                href={`/admin/final-term-grades/${finalTermGrade.id}/edit`}
                            >
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
                            Grade Details
                        </h2>
                        <dl className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Student
                                </dt>
                                <dd>
                                    {finalTermGrade.enrollment?.student?.name ??
                                        'N/A'}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Course
                                </dt>
                                <dd>
                                    {finalTermGrade.courseOffering?.course
                                        ?.name ?? 'N/A'}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Total Score
                                </dt>
                                <dd>{finalTermGrade.total_score}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Letter Grade
                                </dt>
                                <dd>{finalTermGrade.letter_grade}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    GPA Points
                                </dt>
                                <dd>{finalTermGrade.gpa_points ?? 'N/A'}</dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>

            <ConfirmModal
                open={showDelete}
                onClose={() => setShowDelete(false)}
                onConfirm={() => {
                    router.delete(
                        `/admin/final-term-grades/${finalTermGrade.id}`,
                    );
                    setShowDelete(false);
                }}
                title="Delete Final Grade?"
                description="This will permanently delete this final term grade."
                confirmText="Delete"
                variant="destructive"
            />
        </>
    );
}

FinalTermShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Final Term Grades', href: '/admin/final-term-grades' },
        { title: 'Grade Details', href: '' },
    ],
};
