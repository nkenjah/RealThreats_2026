import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    Play,
    Square,
    Lock,
    Unlock,
    CalendarCheck,
    FileSpreadsheet,
    GraduationCap,
    AlertTriangle,
    CheckCircle2,
    XCircle,
} from 'lucide-react';
import { router } from '@inertiajs/react';

interface Props {
    semester: {
        current_academic_year: string;
        current_semester: string;
        semester_status: string;
        grade_entry_open: string;
        exam_card_generation_open: string;
        semester_start_date: string | null;
        semester_end_date: string | null;
        exam_start_date: string | null;
        exam_end_date: string | null;
    };
}

function StatusBadge({ active }: { active: boolean }) {
    if (active) {
        return (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900 dark:text-green-300">
                <CheckCircle2 className="size-3" />
                Open
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900 dark:text-red-300">
            <XCircle className="size-3" />
            Closed
        </span>
    );
}

export default function SemesterIndex({ semester }: Props) {
    const isActive = semester.semester_status === 'active';
    const gradeOpen = semester.grade_entry_open === 'yes';
    const examCardOpen = semester.exam_card_generation_open === 'yes';

    return (
        <>
            <Head title="Semester Management" />
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Semester Management
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Control academic semester lifecycle
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {isActive ? (
                            <Button
                                variant="destructive"
                                onClick={() =>
                                    router.post('/admin/semester/close')
                                }
                            >
                                <Square className="mr-2 h-4 w-4" />
                                Close Semester
                            </Button>
                        ) : (
                            <Button
                                variant="default"
                                onClick={() =>
                                    router.post('/admin/semester/activate')
                                }
                            >
                                <Play className="mr-2 h-4 w-4" />
                                Activate Semester
                            </Button>
                        )}
                    </div>
                </div>

                {/* Status Overview Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-lg border bg-card p-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    ACADEMIC YEAR
                                </p>
                                <p className="mt-1 text-lg font-bold">
                                    {semester.current_academic_year}
                                </p>
                            </div>
                            <CalendarCheck className="size-5 text-muted-foreground" />
                        </div>
                    </div>
                    <div className="rounded-lg border bg-card p-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    CURRENT SEMESTER
                                </p>
                                <p className="mt-1 text-lg font-bold">
                                    {semester.current_semester}
                                </p>
                            </div>
                            <GraduationCap className="size-5 text-muted-foreground" />
                        </div>
                    </div>
                    <div className="rounded-lg border bg-card p-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    STATUS
                                </p>
                                <p className="mt-1">
                                    {isActive ? (
                                        <span className="inline-flex items-center gap-1 text-green-600">
                                            <CheckCircle2 className="size-4" />
                                            Active
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 text-red-600">
                                            <XCircle className="size-4" />
                                            Closed
                                        </span>
                                    )}
                                </p>
                            </div>
                            <AlertTriangle
                                className={
                                    isActive
                                        ? 'size-5 text-green-500'
                                        : 'size-5 text-red-500'
                                }
                            />
                        </div>
                    </div>
                    <div className="rounded-lg border bg-card p-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    ACTIONS THIS SEMESTER
                                </p>
                                <p className="mt-1 text-lg font-bold">
                                    {isActive ? 'Active' : 'Read-only'}
                                </p>
                            </div>
                            <FileSpreadsheet className="size-5 text-muted-foreground" />
                        </div>
                    </div>
                </div>

                {/* Feature Toggles */}
                <div className="rounded-lg border bg-card">
                    <div className="border-b px-6 py-3">
                        <h2 className="text-sm font-medium">
                            Feature Controls
                        </h2>
                    </div>
                    <div className="divide-y">
                        <div className="flex items-center justify-between px-6 py-4">
                            <div>
                                <p className="text-sm font-medium">
                                    Grade Entry
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Control whether lecturers can enter and
                                    submit grades
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <StatusBadge active={gradeOpen} />
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        router.post(
                                            '/admin/semester/toggle-grade-entry',
                                        )
                                    }
                                >
                                    {gradeOpen ? (
                                        <>
                                            <Lock className="mr-1.5 h-3.5 w-3.5" />{' '}
                                            Close
                                        </>
                                    ) : (
                                        <>
                                            <Unlock className="mr-1.5 h-3.5 w-3.5" />{' '}
                                            Open
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                        <div className="flex items-center justify-between px-6 py-4">
                            <div>
                                <p className="text-sm font-medium">
                                    Exam Card Generation
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Control whether students can generate and
                                    download exam cards
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <StatusBadge active={examCardOpen} />
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        router.post(
                                            '/admin/semester/toggle-exam-card',
                                        )
                                    }
                                >
                                    {examCardOpen ? (
                                        <>
                                            <Lock className="mr-1.5 h-3.5 w-3.5" />{' '}
                                            Close
                                        </>
                                    ) : (
                                        <>
                                            <Unlock className="mr-1.5 h-3.5 w-3.5" />{' '}
                                            Open
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Alert */}
                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900 dark:bg-yellow-950">
                    <div className="flex gap-3">
                        <AlertTriangle className="size-5 shrink-0 text-yellow-600 dark:text-yellow-400" />
                        <div className="text-sm text-yellow-800 dark:text-yellow-200">
                            <p className="font-medium">Important</p>
                            <p className="mt-1">
                                Closing a semester will lock grade entry and
                                exam card generation. Ensure all grades have
                                been submitted and approved before closing.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

SemesterIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'System Config', href: '/admin/system-config' },
        { title: 'Semester Management', href: '' },
    ],
};
