import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    ArrowLeft,
    CheckCircle,
    XCircle,
    ShieldCheck,
    RefreshCw,
} from 'lucide-react';
import type { Student } from '@/types';

interface DepartmentStatus {
    status: string;
    reason: string | null;
}

interface GraduationClearance {
    id: number;
    student_id: number;
    department_statuses: Record<string, DepartmentStatus>;
    is_cleared: boolean;
    clearance_token: string | null;
    created_at: string;
}

interface Props {
    student: Student;
    clearance: GraduationClearance | null;
}

export default function StudentClearance({ student, clearance }: Props) {
    const handleProcess = () => {
        router.post(`/admin/students/${student.id}/clearance/process`);
    };

    const departments = clearance?.department_statuses ?? null;

    return (
        <>
            <Head title={`Clearance: ${student.name}`} />

            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/students/${student.id}`}>
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">
                            Graduation Clearance
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {student.name} ({student.registration_number})
                        </p>
                    </div>
                    <Button onClick={handleProcess}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        {clearance ? 'Re-run Clearance' : 'Run Clearance'}
                    </Button>
                </div>

                {clearance && departments ? (
                    <div className="space-y-6">
                        {/* Overall Status */}
                        <div
                            className={`rounded-lg border p-4 ${
                                clearance.is_cleared
                                    ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950'
                                    : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                {clearance.is_cleared ? (
                                    <ShieldCheck className="h-8 w-8 text-green-600" />
                                ) : (
                                    <XCircle className="h-8 w-8 text-red-600" />
                                )}
                                <div>
                                    <p
                                        className={`text-lg font-semibold ${
                                            clearance.is_cleared
                                                ? 'text-green-700'
                                                : 'text-red-700'
                                        }`}
                                    >
                                        {clearance.is_cleared
                                            ? 'Cleared for Graduation'
                                            : 'Clearance Incomplete'}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {clearance.is_cleared
                                            ? 'All departments have approved this student for graduation.'
                                            : 'One or more departments have not cleared this student.'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Department Statuses */}
                        <div className="rounded-lg border bg-card">
                            <div className="border-b px-4 py-3">
                                <h3 className="text-sm font-medium">
                                    Department Clearance Status
                                </h3>
                            </div>
                            <div className="divide-y">
                                {Object.entries(departments).map(
                                    ([dept, status]) => (
                                        <div
                                            key={dept}
                                            className="flex items-center justify-between px-4 py-3"
                                        >
                                            <div className="flex items-center gap-3">
                                                {status.status ===
                                                'approved' ? (
                                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                                ) : (
                                                    <XCircle className="h-5 w-5 text-red-500" />
                                                )}
                                                <div>
                                                    <p className="text-sm font-medium capitalize">
                                                        {dept}
                                                    </p>
                                                    {status.reason && (
                                                        <p className="text-xs text-muted-foreground">
                                                            {status.reason}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <span
                                                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                                    status.status === 'approved'
                                                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                                        : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                                                }`}
                                            >
                                                {status.status === 'approved'
                                                    ? 'Approved'
                                                    : 'Rejected'}
                                            </span>
                                        </div>
                                    ),
                                )}
                            </div>
                        </div>

                        {/* Clearance Token */}
                        {clearance.clearance_token && (
                            <div className="rounded-lg border bg-card p-4">
                                <h3 className="mb-2 text-sm font-medium">
                                    Clearance Token
                                </h3>
                                <p className="mb-2 font-mono text-xs break-all text-muted-foreground">
                                    {clearance.clearance_token}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Generated at{' '}
                                    {new Date(
                                        clearance.created_at,
                                    ).toLocaleString()}
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="rounded-lg border bg-card p-8 text-center">
                        <ShieldCheck className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
                        <h3 className="mb-1 text-sm font-medium">
                            No Clearance Record
                        </h3>
                        <p className="mb-4 text-sm text-muted-foreground">
                            This student has not been processed for graduation
                            clearance yet.
                        </p>
                        <Button onClick={handleProcess}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Run Clearance Now
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
}

StudentClearance.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Students', href: '/admin/students' },
        { title: 'Clearance', href: '' },
    ],
};
