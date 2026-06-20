import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    ArrowLeft,
    Edit2,
    Trash2,
    CreditCard,
    AlertCircle,
    CheckCircle,
    User,
    ShieldCheck,
    ExternalLink,
    DollarSign,
    Download,
    FileText,
    IdCard,
} from 'lucide-react';
import { useState } from 'react';
import ConfirmModal from '@/components/shared/ConfirmModal';
import { Tabs } from '@/components/ui/tabs';
import type { Student } from '@/types';

interface ExamCardStatus {
    blocked: boolean;
    reason: string | null;
    payment_percentage: number;
    total_fee: number;
    total_paid: number;
}

interface Props {
    student: Student;
    exam_card_status: ExamCardStatus;
}

export default function StudentsShow({ student, exam_card_status }: Props) {
    const [showDelete, setShowDelete] = useState(false);

    const detailsTab = (
        <div className="rounded-lg border bg-card p-4">
            <h2 className="mb-4 text-sm font-medium">Student Details</h2>
            <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                    <dt className="text-muted-foreground">
                        Registration Number
                    </dt>
                    <dd className="font-mono">{student.registration_number}</dd>
                </div>
                <div className="flex justify-between">
                    <dt className="text-muted-foreground">Email</dt>
                    <dd>{student.email}</dd>
                </div>
                <div className="flex justify-between">
                    <dt className="text-muted-foreground">Department</dt>
                    <dd>{student.department?.name ?? 'N/A'}</dd>
                </div>
                <div className="flex justify-between">
                    <dt className="text-muted-foreground">Program</dt>
                    <dd>{student.program}</dd>
                </div>
                <div className="flex justify-between">
                    <dt className="text-muted-foreground">Year of Study</dt>
                    <dd>{student.year_of_study}</dd>
                </div>
                <div className="flex justify-between">
                    <dt className="text-muted-foreground">Status</dt>
                    <dd
                        className={
                            student.is_active
                                ? 'text-green-500'
                                : 'text-muted-foreground'
                        }
                    >
                        {student.is_active ? 'Active' : 'Inactive'}
                    </dd>
                </div>
            </dl>
            <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="outline" size="sm" asChild>
                    <Link
                        href={`/admin/students/${student.id}/result-slip`}
                        preserveScroll
                    >
                        <FileText className="mr-2 h-4 w-4" />
                        Result Slip
                    </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                    <Link
                        href={`/admin/students/${student.id}/id-card`}
                        preserveScroll
                    >
                        <IdCard className="mr-2 h-4 w-4" />
                        ID Card
                    </Link>
                </Button>
            </div>
        </div>
    );

    const financeTab = (
        <div className="rounded-lg border bg-card p-4">
            <div className="mb-4 flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <h2 className="text-sm font-medium">Exam Card Status</h2>
            </div>
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    {exam_card_status.blocked ? (
                        <>
                            <AlertCircle className="h-5 w-5 text-red-500" />
                            <span className="text-sm font-medium text-red-600">
                                Blocked
                            </span>
                        </>
                    ) : (
                        <>
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <span className="text-sm font-medium text-green-600">
                                Eligible
                            </span>
                        </>
                    )}
                </div>
                {exam_card_status.reason && (
                    <p className="text-xs text-muted-foreground">
                        {exam_card_status.reason}
                    </p>
                )}
                <div>
                    <div className="mb-1 flex justify-between text-xs">
                        <span className="text-muted-foreground">
                            Payment Progress
                        </span>
                        <span className="font-medium">
                            {exam_card_status.payment_percentage}%
                        </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div
                            className={`h-full rounded-full transition-all ${
                                exam_card_status.blocked
                                    ? 'bg-red-500'
                                    : 'bg-green-500'
                            }`}
                            style={{
                                width: `${Math.min(exam_card_status.payment_percentage, 100)}%`,
                            }}
                        />
                    </div>
                </div>
                <dl className="space-y-2 text-xs">
                    <div className="flex justify-between">
                        <dt className="text-muted-foreground">Total Fee</dt>
                        <dd className="font-mono">
                            TZS {exam_card_status.total_fee.toLocaleString()}
                        </dd>
                    </div>
                    <div className="flex justify-between">
                        <dt className="text-muted-foreground">Total Paid</dt>
                        <dd className="font-mono">
                            TZS {exam_card_status.total_paid.toLocaleString()}
                        </dd>
                    </div>
                </dl>

                {!exam_card_status.blocked && (
                    <Button className="mt-4 w-full" size="sm" asChild>
                        <Link
                            href={`/admin/students/${student.id}/exam-card`}
                            preserveScroll
                        >
                            <Download className="mr-2 h-4 w-4" />
                            Download Exam Card
                        </Link>
                    </Button>
                )}
            </div>
        </div>
    );

    const clearanceTab = (
        <div className="rounded-lg border bg-card p-6 text-center">
            <ShieldCheck className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
            <h3 className="mb-1 text-sm font-medium">Graduation Clearance</h3>
            <p className="mb-4 text-sm text-muted-foreground">
                Process multi-department clearance for this student.
            </p>
            <Button asChild>
                <Link href={`/admin/students/${student.id}/clearance`}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open Clearance Page
                </Link>
            </Button>
        </div>
    );

    return (
        <>
            <Head title={`Student: ${student.name}`} />

            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/students">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">{student.name}</h1>
                        <p className="text-sm text-muted-foreground">
                            {student.registration_number}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/students/${student.id}/edit`}>
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

                <Tabs
                    tabs={[
                        {
                            id: 'details',
                            label: 'Details',
                            icon: <User className="size-4" />,
                            content: detailsTab,
                        },
                        {
                            id: 'finance',
                            label: 'Finance',
                            icon: <DollarSign className="size-4" />,
                            content: financeTab,
                        },
                        {
                            id: 'clearance',
                            label: 'Clearance',
                            icon: <ShieldCheck className="size-4" />,
                            content: clearanceTab,
                        },
                    ]}
                />
            </div>

            <ConfirmModal
                open={showDelete}
                onClose={() => setShowDelete(false)}
                onConfirm={() => {
                    router.delete(`/admin/students/${student.id}`);
                    setShowDelete(false);
                }}
                title="Delete Student?"
                description={`This will permanently delete ${student.name}'s record.`}
                confirmText="Delete"
                variant="destructive"
            />
        </>
    );
}

StudentsShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Students', href: '/admin/students' },
        { title: 'Student Details', href: '' },
    ],
};
