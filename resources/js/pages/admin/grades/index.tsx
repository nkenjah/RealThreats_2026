import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Plus,
    LayoutGrid,
    Table2,
    CheckCircle,
    XCircle,
    Upload,
    ShieldCheck,
    FileSpreadsheet,
} from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import DataTable from '@/components/shared/DataTable';
import { GradeAnalytics } from '@/components/gradebook/grade-analytics';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface Grade {
    id: number;
    grade: string;
    grade_points: number | null;
    status: string;
    academic_year: string;
    semester: string;
    student?: { id: number; name: string };
    courseOffering?: {
        id: number;
        course?: { id: number; name: string; code: string };
    };
}

interface Props {
    grades: any;
    filters: Record<string, string | undefined>;
    stats?: {
        total_grades: number;
        passed: number;
        failed: number;
        supps: number;
        retakes: number;
        pending_approval: number;
        by_grade: { grade: string; count: number }[];
    };
}

const GRADE_BADGE: Record<string, string> = {
    A: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'B+': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
    B: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    C: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    D: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    E: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    F: 'bg-red-200 text-red-900 dark:bg-red-950 dark:text-red-300',
};

const STATUS_BADGE: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    submitted: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
    approved:
        'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300',
    rejected: 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300',
};

export default function GradesIndex({ grades, filters, stats }: Props) {
    const [view, setView] = useState<'table' | 'dashboard'>('table');
    const [selected, setSelected] = useState<Set<number>>(new Set());
    const [rejectTarget, setRejectTarget] = useState<Grade | null>(null);
    const [rejectReason, setRejectReason] = useState('');
    const [rejecting, setRejecting] = useState(false);
    const [bulkProcessing, setBulkProcessing] = useState(false);

    const gradeList: Grade[] = grades?.data ?? grades ?? [];

    const handleSubmit = (id: number) => {
        router.post(`/admin/grades/${id}/submit`);
    };

    const handleApprove = (id: number) => {
        router.post(`/admin/grades/${id}/approve`);
    };

    const openReject = (g: Grade) => {
        setRejectTarget(g);
        setRejectReason('');
    };

    const handleReject = () => {
        if (!rejectTarget || !rejectReason.trim()) return;
        setRejecting(true);
        router.post(
            `/admin/grades/${rejectTarget.id}/reject`,
            { reason: rejectReason.trim() },
            {
                onFinish: () => {
                    setRejecting(false);
                    setRejectTarget(null);
                    setRejectReason('');
                },
            },
        );
    };

    const toggleAll = useCallback(() => {
        if (selected.size === gradeList.length) {
            setSelected(new Set());
        } else {
            setSelected(new Set(gradeList.map((g) => g.id)));
        }
    }, [selected, gradeList]);

    const toggleOne = useCallback((id: number) => {
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    }, []);

    const selectedGrades = useMemo(
        () => gradeList.filter((g) => selected.has(g.id)),
        [gradeList, selected],
    );

    const canSubmit =
        selectedGrades.length > 0 &&
        selectedGrades.every((g) => g.status === 'draft');
    const canApprove =
        selectedGrades.length > 0 &&
        selectedGrades.every((g) => g.status === 'submitted');

    const handleBulkSubmit = () => {
        if (!canSubmit || bulkProcessing) return;
        setBulkProcessing(true);
        router.post(
            '/admin/grades/bulk/submit',
            { ids: Array.from(selected) },
            {
                onFinish: () => {
                    setBulkProcessing(false);
                    setSelected(new Set());
                },
            },
        );
    };

    const handleBulkApprove = () => {
        if (!canApprove || bulkProcessing) return;
        setBulkProcessing(true);
        router.post(
            '/admin/grades/bulk/approve',
            { ids: Array.from(selected) },
            {
                onFinish: () => {
                    setBulkProcessing(false);
                    setSelected(new Set());
                },
            },
        );
    };

    const selectAllChecked =
        gradeList.length > 0 && selected.size === gradeList.length;

    const columns = [
        {
            key: 'select',
            label: ' ',
            render: (g: Grade) => (
                <Checkbox
                    checked={selected.has(g.id)}
                    onCheckedChange={() => toggleOne(g.id)}
                    aria-label={`Select ${g.student?.name ?? 'grade'}`}
                />
            ),
        },
        {
            key: 'student',
            label: 'Student',
            render: (g: Grade) => (
                <Link
                    href={`/admin/grades/${g.id}`}
                    className="font-medium hover:underline"
                >
                    {g.student?.name ?? 'N/A'}
                </Link>
            ),
        },
        {
            key: 'course',
            label: 'Course',
            render: (g: Grade) => g.courseOffering?.course?.name ?? 'N/A',
        },
        {
            key: 'grade',
            label: 'Grade',
            render: (g: Grade) => (
                <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${GRADE_BADGE[g.grade] || ''}`}
                >
                    {g.grade}
                </span>
            ),
        },
        { key: 'grade_points', label: 'Points' },
        { key: 'academic_year', label: 'Year' },
        { key: 'semester', label: 'Sem' },
        {
            key: 'status',
            label: 'Status',
            render: (g: Grade) => (
                <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_BADGE[g.status] || ''}`}
                >
                    {g.status === 'approved' && (
                        <CheckCircle className="size-3" />
                    )}
                    {g.status === 'rejected' && <XCircle className="size-3" />}
                    {g.status || 'draft'}
                </span>
            ),
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (g: Grade) => (
                <div className="flex gap-1">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/grades/${g.id}`}>View</Link>
                    </Button>
                    {g.status === 'draft' && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSubmit(g.id)}
                        >
                            Submit
                        </Button>
                    )}
                    {g.status === 'submitted' && (
                        <>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleApprove(g.id)}
                            >
                                Approve
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openReject(g)}
                            >
                                Reject
                            </Button>
                        </>
                    )}
                    {(g.status === 'draft' || g.status === 'rejected') && (
                        <Button variant="ghost" size="sm" asChild>
                            <Link href={`/admin/grades/${g.id}/edit`}>
                                Edit
                            </Link>
                        </Button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <>
            <Head title="Grades" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Grades</h1>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center rounded-lg border p-0.5">
                            <Button
                                variant={
                                    view === 'dashboard' ? 'secondary' : 'ghost'
                                }
                                size="sm"
                                onClick={() => setView('dashboard')}
                                className="h-7 px-2"
                            >
                                <LayoutGrid className="size-4" />
                            </Button>
                            <Button
                                variant={
                                    view === 'table' ? 'secondary' : 'ghost'
                                }
                                size="sm"
                                onClick={() => setView('table')}
                                className="h-7 px-2"
                            >
                                <Table2 className="size-4" />
                            </Button>
                        </div>
                        <Button asChild>
                            <Link href="/admin/grades/create">
                                <Plus className="mr-2 h-4 w-4" /> Create Grade
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/admin/grades/upload">
                                <FileSpreadsheet className="mr-2 h-4 w-4" />{' '}
                                Bulk Upload
                            </Link>
                        </Button>
                    </div>
                </div>

                {view === 'dashboard' && stats ? (
                    <GradeAnalytics
                        total_grades={stats.total_grades}
                        passed={stats.passed}
                        failed={stats.failed}
                        supps={stats.supps}
                        retakes={stats.retakes}
                        pending_approval={stats.pending_approval}
                        by_grade={stats.by_grade}
                    />
                ) : (
                    <>
                        {selected.size > 0 && (
                            <div className="flex items-center gap-3 rounded-lg border bg-muted/50 px-4 py-2">
                                <Checkbox
                                    checked={selectAllChecked}
                                    onCheckedChange={toggleAll}
                                    aria-label="Select all"
                                />
                                <span className="text-sm text-muted-foreground">
                                    {selected.size} selected
                                </span>
                                <div className="ml-auto flex gap-2">
                                    {canSubmit && (
                                        <Button
                                            variant="default"
                                            size="sm"
                                            onClick={handleBulkSubmit}
                                            disabled={bulkProcessing}
                                        >
                                            <Upload className="mr-1.5 h-3.5 w-3.5" />
                                            {bulkProcessing
                                                ? 'Submitting...'
                                                : 'Submit Selected'}
                                        </Button>
                                    )}
                                    {canApprove && (
                                        <Button
                                            variant="default"
                                            size="sm"
                                            onClick={handleBulkApprove}
                                            disabled={bulkProcessing}
                                        >
                                            <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
                                            {bulkProcessing
                                                ? 'Approving...'
                                                : 'Approve Selected'}
                                        </Button>
                                    )}
                                    {!canSubmit && !canApprove && (
                                        <span className="text-xs text-muted-foreground">
                                            Selection must be all{' '}
                                            <strong>draft</strong> to submit or
                                            all <strong>submitted</strong> to
                                            approve
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                        <DataTable
                            data={grades}
                            columns={columns}
                            filters={filters}
                            searchPlaceholder="Search by student name..."
                            filterFields={
                                <select
                                    name="status"
                                    defaultValue={filters.status || ''}
                                    className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                                    onChange={(e) => {
                                        const url = new URL(
                                            window.location.href,
                                        );
                                        if (e.target.value) {
                                            url.searchParams.set(
                                                'status',
                                                e.target.value,
                                            );
                                        } else {
                                            url.searchParams.delete('status');
                                        }
                                        url.searchParams.set('page', '1');
                                        window.location.href = url.toString();
                                    }}
                                >
                                    <option value="">All Statuses</option>
                                    <option value="draft">Draft</option>
                                    <option value="submitted">Submitted</option>
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            }
                        />
                    </>
                )}
            </div>

            <Dialog
                open={!!rejectTarget}
                onOpenChange={(open) => !open && setRejectTarget(null)}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Reject Grade</DialogTitle>
                        <DialogDescription>
                            Rejecting grade for{' '}
                            {rejectTarget?.student?.name ?? 'this student'}.
                            Provide a reason for the lecturer.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Enter rejection reason..."
                            rows={4}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setRejectTarget(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleReject}
                            disabled={!rejectReason.trim() || rejecting}
                        >
                            {rejecting ? 'Rejecting...' : 'Reject Grade'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

GradesIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Grades', href: '/admin/grades' },
    ],
};
