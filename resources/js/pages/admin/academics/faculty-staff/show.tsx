import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import ConfirmModal from '@/components/shared/ConfirmModal';
import type { Department } from '@/types';

interface Faculty {
    id: number;
    staff_number: string;
    job_title: string;
    contract_type: string;
    user?: { id: number; name: string; email: string };
    department?: Department;
}

interface Props {
    facultyStaff: Faculty;
}

export default function FacultyShow({ facultyStaff }: Props) {
    const [showDelete, setShowDelete] = useState(false);

    return (
        <>
            <Head
                title={`Faculty: ${facultyStaff.user?.name ?? facultyStaff.staff_number}`}
            />
            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/faculty">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">
                            {facultyStaff.user?.name ?? 'N/A'}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {facultyStaff.staff_number}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                            <Link
                                href={`/admin/faculty/${facultyStaff.id}/edit`}
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
                            Faculty Details
                        </h2>
                        <dl className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Staff Number
                                </dt>
                                <dd className="font-mono">
                                    {facultyStaff.staff_number}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">Name</dt>
                                <dd>{facultyStaff.user?.name ?? 'N/A'}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">Email</dt>
                                <dd>{facultyStaff.user?.email ?? 'N/A'}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Department
                                </dt>
                                <dd>
                                    {facultyStaff.department?.name ?? 'N/A'}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Job Title
                                </dt>
                                <dd>{facultyStaff.job_title}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Contract Type
                                </dt>
                                <dd className="capitalize">
                                    {facultyStaff.contract_type}
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
                    router.delete(`/admin/faculty/${facultyStaff.id}`);
                    setShowDelete(false);
                }}
                title="Delete Faculty?"
                description={`This will permanently delete ${facultyStaff.user?.name ?? 'this faculty member'}.`}
                confirmText="Delete"
                variant="destructive"
            />
        </>
    );
}

FacultyShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Faculty', href: '/admin/faculty' },
        { title: 'Faculty Details', href: '' },
    ],
};
