import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import ConfirmModal from '@/components/shared/ConfirmModal';

interface Module {
    id: number;
    title: string;
    order: number;
}

interface Submission {
    id: number;
    student?: { name: string };
    grade: number | null;
    submitted_at: string;
}

interface LMSCourse {
    id: number;
    name: string;
    course_offering_id: number;
    status: string;
    description: string | null;
    course_offering?: { id: number; course?: { name: string; code: string } };
    modules?: Module[];
    submissions?: Submission[];
}

interface Props {
    course: LMSCourse;
}

export default function LMSCoursesShow({ course }: Props) {
    const [showDelete, setShowDelete] = useState(false);

    return (
        <>
            <Head title={`LMS Course: ${course.name}`} />

            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/lms/courses">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">{course.name}</h1>
                        <p className="text-sm text-muted-foreground">
                            {course.course_offering?.course?.name ?? 'N/A'}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/lms/courses/${course.id}/edit`}>
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
                            Course Details
                        </h2>
                        <dl className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">Name</dt>
                                <dd>{course.name}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Offering
                                </dt>
                                <dd>
                                    {course.course_offering?.course?.name ??
                                        'N/A'}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Status
                                </dt>
                                <dd className="capitalize">{course.status}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Description
                                </dt>
                                <dd>{course.description ?? 'N/A'}</dd>
                            </div>
                        </dl>
                    </div>
                </div>

                <div className="rounded-lg border bg-card p-4">
                    <h2 className="mb-4 text-sm font-medium">Modules</h2>
                    {course.modules && course.modules.length > 0 ? (
                        <div className="space-y-2">
                            {course.modules
                                .sort((a, b) => a.order - b.order)
                                .map((m) => (
                                    <div
                                        key={m.id}
                                        className="rounded-md border p-3 text-sm"
                                    >
                                        <span className="font-medium">
                                            Module {m.order}:
                                        </span>{' '}
                                        {m.title}
                                    </div>
                                ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            No modules found.
                        </p>
                    )}
                </div>

                <div className="rounded-lg border bg-card p-4">
                    <h2 className="mb-4 text-sm font-medium">Submissions</h2>
                    {course.submissions && course.submissions.length > 0 ? (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">
                                        Student
                                    </th>
                                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">
                                        Grade
                                    </th>
                                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">
                                        Submitted
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {course.submissions.map((s) => (
                                    <tr
                                        key={s.id}
                                        className="border-b last:border-0"
                                    >
                                        <td className="px-3 py-2">
                                            {s.student?.name ?? 'N/A'}
                                        </td>
                                        <td className="px-3 py-2">
                                            {s.grade ?? 'Not graded'}
                                        </td>
                                        <td className="px-3 py-2">
                                            {new Date(
                                                s.submitted_at,
                                            ).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            No submissions found.
                        </p>
                    )}
                </div>
            </div>

            <ConfirmModal
                open={showDelete}
                onClose={() => setShowDelete(false)}
                onConfirm={() => {
                    router.delete(`/admin/lms/courses/${course.id}`);
                    setShowDelete(false);
                }}
                title="Delete LMS Course?"
                description="This will permanently delete this LMS course and all associated content."
                confirmText="Delete"
                variant="destructive"
            />
        </>
    );
}

LMSCoursesShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'LMS', href: '/admin/lms' },
        { title: 'Courses', href: '/admin/lms/courses' },
        { title: 'Course Details', href: '' },
    ],
};
