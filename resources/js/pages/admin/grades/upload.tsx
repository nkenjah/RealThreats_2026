import { Head, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    ArrowLeft,
    Upload,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    FileSpreadsheet,
    Loader2,
} from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface PreviewRow {
    row: number;
    registration_number: string;
    student_name: string;
    grade: string;
    grade_points: number | null;
    existing: string;
    errors: string[];
    valid: boolean;
}

interface CourseOfferingOption {
    id: number;
    label: string;
}

interface Props {
    courseOfferings: CourseOfferingOption[];
}

interface PageFlash {
    upload_preview?: {
        course_offering_id: number;
        rows: PreviewRow[];
    };
}

export default function GradeUpload({ courseOfferings }: Props) {
    const [courseOfferingId, setCourseOfferingId] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<PreviewRow[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [confirming, setConfirming] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);
    const { errors: validationErrors } = usePage().props;

    const handleUpload = useCallback(async () => {
        if (!courseOfferingId || !file) return;
        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('course_offering_id', courseOfferingId);
        formData.append('file', file);

        try {
            const res = await fetch('/admin/grades/upload/preview', {
                method: 'POST',
                headers: { 'X-CSRF-TOKEN': (window as any).csrfToken ?? '' },
                body: formData,
            });
            if (!res.ok) {
                const text = await res.text();
                setError(text || 'Upload failed. Check file format.');
                return;
            }
            const data = await res.json();
            if (data.preview) {
                setPreview(data.preview);
            } else {
                setError('Invalid response from server.');
            }
        } catch (e: any) {
            setError(e.message || 'Network error');
        } finally {
            setLoading(false);
        }
    }, [courseOfferingId, file]);

    const handleConfirm = useCallback(() => {
        setConfirming(true);
        router.post(
            '/admin/grades/upload/confirm',
            {},
            {
                onFinish: () => setConfirming(false),
                onError: () => setConfirming(false),
            },
        );
    }, []);

    const reset = useCallback(() => {
        setPreview(null);
        setFile(null);
        setError(null);
        if (fileRef.current) fileRef.current.value = '';
    }, []);

    const validCount = preview?.filter((r) => r.valid).length ?? 0;
    const invalidCount = preview ? preview.length - validCount : 0;

    const downloadSample = () => {
        const csv =
            'registration_number,grade,grade_points\nKIUT/2023/001,A,5.0\nKIUT/2023/002,B+,4.5';
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'grade-upload-sample.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <>
            <Head title="Bulk Grade Upload" />
            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <a href="/admin/grades">
                            <ArrowLeft className="h-4 w-4" />
                        </a>
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">
                            Bulk Grade Upload
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Upload grades via CSV for an entire course offering
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={downloadSample}
                    >
                        <FileSpreadsheet className="mr-2 h-4 w-4" />
                        Download Sample CSV
                    </Button>
                </div>

                {!preview ? (
                    <div className="rounded-lg border bg-card p-6">
                        <div className="space-y-4">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium">
                                    Course Offering
                                </label>
                                <select
                                    value={courseOfferingId}
                                    onChange={(e) =>
                                        setCourseOfferingId(e.target.value)
                                    }
                                    className="h-10 w-full max-w-md rounded-md border border-input bg-background px-3 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                                >
                                    <option value="">
                                        Select course offering...
                                    </option>
                                    {courseOfferings.map((co) => (
                                        <option key={co.id} value={co.id}>
                                            {co.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium">
                                    CSV File
                                </label>
                                <input
                                    ref={fileRef}
                                    type="file"
                                    accept=".csv,.txt"
                                    onChange={(e) =>
                                        setFile(e.target.files?.[0] ?? null)
                                    }
                                    className="block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary/90"
                                />
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Columns: registration_number, grade,
                                    grade_points (optional). Max 2MB.
                                </p>
                            </div>
                            {error && (
                                <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
                                    <AlertTriangle className="size-4 shrink-0" />
                                    {error}
                                </div>
                            )}
                            {validationErrors?.file && (
                                <p className="text-sm text-red-500">
                                    {validationErrors.file}
                                </p>
                            )}
                            <div className="flex gap-2">
                                <Button
                                    onClick={handleUpload}
                                    disabled={
                                        !courseOfferingId || !file || loading
                                    }
                                >
                                    {loading ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Upload className="mr-2 h-4 w-4" />
                                    )}
                                    {loading
                                        ? 'Processing...'
                                        : 'Preview Upload'}
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Summary */}
                        <div className="flex items-center gap-4 rounded-lg border bg-card p-4">
                            <div className="flex items-center gap-2 text-sm text-green-600">
                                <CheckCircle2 className="size-4" />
                                <span className="font-medium">
                                    {validCount} valid
                                </span>
                            </div>
                            {invalidCount > 0 && (
                                <div className="flex items-center gap-2 text-sm text-red-600">
                                    <XCircle className="size-4" />
                                    <span className="font-medium">
                                        {invalidCount} invalid
                                    </span>
                                </div>
                            )}
                            <div className="text-sm text-muted-foreground">
                                {preview.length} total rows
                            </div>
                            <div className="ml-auto flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={reset}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={handleConfirm}
                                    disabled={validCount === 0 || confirming}
                                >
                                    {confirming ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Upload className="mr-2 h-4 w-4" />
                                    )}
                                    {confirming
                                        ? 'Importing...'
                                        : `Import ${validCount} Grades`}
                                </Button>
                            </div>
                        </div>

                        {/* Preview Table */}
                        <div className="overflow-x-auto rounded-md border">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-muted/50">
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                            #
                                        </th>
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                            Reg No
                                        </th>
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                            Student
                                        </th>
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                            Grade
                                        </th>
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                            Points
                                        </th>
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                            Existing
                                        </th>
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {preview.map((row, i) => (
                                        <tr
                                            key={i}
                                            className={cn(
                                                'border-b transition-colors last:border-0',
                                                row.valid
                                                    ? 'hover:bg-muted/30'
                                                    : 'bg-red-50/50 hover:bg-red-50/80 dark:bg-red-950/20',
                                            )}
                                        >
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {row.row}
                                            </td>
                                            <td className="px-4 py-3 font-mono text-xs">
                                                {row.registration_number}
                                            </td>
                                            <td className="px-4 py-3">
                                                {row.student_name}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={cn(
                                                        'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
                                                        row.valid
                                                            ? 'bg-blue-100 text-blue-700'
                                                            : 'bg-red-100 text-red-700',
                                                    )}
                                                >
                                                    {row.grade}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                {row.grade_points ?? '—'}
                                            </td>
                                            <td className="px-4 py-3 text-xs text-muted-foreground">
                                                {row.existing}
                                            </td>
                                            <td className="px-4 py-3">
                                                {row.valid ? (
                                                    <CheckCircle2 className="size-4 text-green-500" />
                                                ) : (
                                                    <div className="flex items-center gap-1">
                                                        <XCircle className="size-4 shrink-0 text-red-500" />
                                                        <span className="text-xs text-red-600">
                                                            {row.errors.join(
                                                                ', ',
                                                            )}
                                                        </span>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

GradeUpload.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Grades', href: '/admin/grades' },
        { title: 'Bulk Upload', href: '' },
    ],
};
