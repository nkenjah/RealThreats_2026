import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import ConfirmModal from '@/components/shared/ConfirmModal';

interface CourseOffering {
    id: number;
    academic_year: string;
    semester: string;
    section: string | null;
    course?: { id: number; name: string; code: string };
    program?: { id: number; name: string };
}

interface Props {
    courseOffering: CourseOffering;
}

export default function OfferingsShow({ courseOffering }: Props) {
    const [showDelete, setShowDelete] = useState(false);

    return (
        <>
            <Head title="Course Offering Details" />
            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/offerings">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">
                            {courseOffering.course?.name ?? 'N/A'}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {courseOffering.academic_year} - Semester{' '}
                            {courseOffering.semester}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                            <Link
                                href={`/admin/offerings/${courseOffering.id}/edit`}
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
                            Offering Details
                        </h2>
                        <dl className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Course
                                </dt>
                                <dd>
                                    {courseOffering.course?.name ?? 'N/A'} (
                                    {courseOffering.course?.code ?? 'N/A'})
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Program
                                </dt>
                                <dd>{courseOffering.program?.name ?? 'N/A'}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Academic Year
                                </dt>
                                <dd>{courseOffering.academic_year}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Semester
                                </dt>
                                <dd>{courseOffering.semester}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Section
                                </dt>
                                <dd>{courseOffering.section ?? 'N/A'}</dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>

            <ConfirmModal
                open={showDelete}
                onClose={() => setShowDelete(false)}
                onConfirm={() => {
                    router.delete(`/admin/offerings/${courseOffering.id}`);
                    setShowDelete(false);
                }}
                title="Delete Offering?"
                description="This will permanently delete this course offering."
                confirmText="Delete"
                variant="destructive"
            />
        </>
    );
}

OfferingsShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Offerings', href: '/admin/offerings' },
        { title: 'Offering Details', href: '' },
    ],
};
