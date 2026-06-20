import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useState } from 'react';
import ConfirmModal from '@/components/shared/ConfirmModal';
import type { StudentRegistration, Student } from '@/types';

interface Props {
    studentRegistration: StudentRegistration & {
        student: Student;
    };
}

export default function StudentRegistrationsShow({
    studentRegistration,
}: Props) {
    const [showDelete, setShowDelete] = useState(false);

    return (
        <>
            <Head title="Registration Details" />

            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/student-registrations">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">
                            Student Registration
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {studentRegistration.student?.name ?? 'N/A'}
                        </p>
                    </div>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setShowDelete(true)}
                    >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                </div>

                <div className="rounded-lg border bg-card p-4">
                    <h2 className="mb-4 text-sm font-medium">Details</h2>
                    <dl className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">ID</dt>
                            <dd>{studentRegistration.id}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">Student</dt>
                            <dd>
                                {studentRegistration.student?.name ?? 'N/A'}
                            </dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">
                                Academic Year
                            </dt>
                            <dd>{studentRegistration.academic_year}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">Semester</dt>
                            <dd className="capitalize">
                                {studentRegistration.semester}
                            </dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">
                                Registration Date
                            </dt>
                            <dd>
                                {new Date(
                                    studentRegistration.registration_date,
                                ).toLocaleDateString()}
                            </dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">Status</dt>
                            <dd className="capitalize">
                                {studentRegistration.status.replace(/_/g, ' ')}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>

            <ConfirmModal
                open={showDelete}
                onClose={() => setShowDelete(false)}
                onConfirm={() => {
                    router.delete(
                        `/admin/student-registrations/${studentRegistration.id}`,
                    );
                    setShowDelete(false);
                }}
                title="Delete Registration?"
                description="This will permanently delete this student registration."
                confirmText="Delete"
                variant="destructive"
            />
        </>
    );
}

StudentRegistrationsShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Registrations', href: '/admin/student-registrations' },
        { title: 'Registration Details', href: '' },
    ],
};
