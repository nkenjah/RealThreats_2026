import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import ConfirmModal from '@/components/shared/ConfirmModal';

interface Enrollment {
    id: number;
    enrollment_date: string;
    status: string | null;
    grade: string | null;
    student?: { id: number; name: string };
    courseOffering?: {
        id: number;
        course?: { id: number; name: string; code: string };
    };
    finalTermGrade?: { id: number; total_score: number; letter_grade: string };
}

interface Props {
    enrollment: Enrollment;
}

export default function EnrollmentsShow({ enrollment }: Props) {
    const [showDelete, setShowDelete] = useState(false);

    return (
        <>
            <Head title="Enrollment Details" />
            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/enrollments">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">
                            {enrollment.student?.name ?? 'N/A'}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {enrollment.courseOffering?.course?.name ?? 'N/A'}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                            <Link
                                href={`/admin/enrollments/${enrollment.id}/edit`}
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
                            Enrollment Details
                        </h2>
                        <dl className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Student
                                </dt>
                                <dd>{enrollment.student?.name ?? 'N/A'}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Course Offering
                                </dt>
                                <dd>
                                    {enrollment.courseOffering?.course?.name ??
                                        'N/A'}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Enrollment Date
                                </dt>
                                <dd>{enrollment.enrollment_date}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Status
                                </dt>
                                <dd>{enrollment.status ?? 'N/A'}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">Grade</dt>
                                <dd>{enrollment.grade ?? 'N/A'}</dd>
                            </div>
                            {enrollment.finalTermGrade && (
                                <>
                                    <div className="flex justify-between">
                                        <dt className="text-muted-foreground">
                                            Final Score
                                        </dt>
                                        <dd>
                                            {
                                                enrollment.finalTermGrade
                                                    .total_score
                                            }
                                        </dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-muted-foreground">
                                            Letter Grade
                                        </dt>
                                        <dd>
                                            {
                                                enrollment.finalTermGrade
                                                    .letter_grade
                                            }
                                        </dd>
                                    </div>
                                </>
                            )}
                        </dl>
                    </div>
                </div>
            </div>

            <ConfirmModal
                open={showDelete}
                onClose={() => setShowDelete(false)}
                onConfirm={() => {
                    router.delete(`/admin/enrollments/${enrollment.id}`);
                    setShowDelete(false);
                }}
                title="Delete Enrollment?"
                description="This will permanently delete this enrollment."
                confirmText="Delete"
                variant="destructive"
            />
        </>
    );
}

EnrollmentsShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Enrollments', href: '/admin/enrollments' },
        { title: 'Enrollment Details', href: '' },
    ],
};
