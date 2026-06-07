import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import ConfirmModal from '@/components/shared/ConfirmModal';

interface CoursePrerequisite {
    id: number;
    course?: { id: number; name: string; code: string };
    prerequisiteCourse?: { id: number; name: string; code: string };
}

interface Props {
    coursePrerequisite: CoursePrerequisite;
}

export default function CoursePrerequisitesShow({ coursePrerequisite }: Props) {
    const [showDelete, setShowDelete] = useState(false);

    return (
        <>
            <Head title="Prerequisite Details" />
            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/curriculum/course-prerequisites">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">
                            Course Prerequisite
                        </h1>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                            <Link
                                href={`/admin/curriculum/course-prerequisites/${coursePrerequisite.id}/edit`}
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
                            Prerequisite Details
                        </h2>
                        <dl className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Course
                                </dt>
                                <dd>
                                    {coursePrerequisite.course?.name ?? 'N/A'} (
                                    {coursePrerequisite.course?.code ?? 'N/A'})
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Prerequisite
                                </dt>
                                <dd>
                                    {coursePrerequisite.prerequisiteCourse
                                        ?.name ?? 'N/A'}{' '}
                                    (
                                    {coursePrerequisite.prerequisiteCourse
                                        ?.code ?? 'N/A'}
                                    )
                                </dd>
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
                        `/admin/curriculum/course-prerequisites/${coursePrerequisite.id}`,
                    );
                    setShowDelete(false);
                }}
                title="Delete Prerequisite?"
                description="This will permanently delete this course prerequisite."
                confirmText="Delete"
                variant="destructive"
            />
        </>
    );
}

CoursePrerequisitesShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        {
            title: 'Course Prerequisites',
            href: '/admin/curriculum/course-prerequisites',
        },
        { title: 'Prerequisite Details', href: '' },
    ],
};
