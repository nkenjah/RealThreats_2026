import { Head, Link } from '@inertiajs/react';
import { ShieldCheck, XCircle, Search } from 'lucide-react';
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
    student: Student;
}

interface Props {
    clearances: {
        data: GraduationClearance[];
        current_page: number;
        last_page: number;
        total: number;
        from: number;
        to: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters: {
        search?: string;
        status?: string;
    };
    stats?: {
        total: number;
        cleared: number;
        blocked: number;
    };
}

export default function GraduationClearanceIndex({
    clearances,
    filters,
    stats,
}: Props) {
    return (
        <>
            <Head title="Graduation Clearance" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Graduation Clearance</h1>
                </div>

                {stats && (
                    <div className="grid gap-4 sm:grid-cols-3">
                        <div className="rounded-lg border bg-card p-4">
                            <p className="text-sm text-muted-foreground">
                                Total Processed
                            </p>
                            <p className="mt-1 text-2xl font-bold">
                                {stats.total}
                            </p>
                        </div>
                        <div className="rounded-lg border border-green-200 bg-green-50/50 p-4 dark:border-green-800 dark:bg-green-950/30">
                            <p className="text-sm text-green-600 dark:text-green-400">
                                Cleared
                            </p>
                            <p className="mt-1 text-2xl font-bold text-green-700 dark:text-green-300">
                                {stats.cleared}
                            </p>
                        </div>
                        <div className="rounded-lg border border-red-200 bg-red-50/50 p-4 dark:border-red-800 dark:bg-red-950/30">
                            <p className="text-sm text-red-600 dark:text-red-400">
                                Blocked
                            </p>
                            <p className="mt-1 text-2xl font-bold text-red-700 dark:text-red-300">
                                {stats.blocked}
                            </p>
                        </div>
                    </div>
                )}

                {/* Filters */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                            name="search"
                            defaultValue={filters.search}
                            placeholder="Search by student name or registration..."
                            className="h-9 w-full max-w-sm rounded-md border border-input bg-background pr-3 pl-9 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                            onChange={(e) => {
                                const url = new URL(window.location.href);
                                url.searchParams.set('search', e.target.value);
                                url.searchParams.set('page', '1');
                                window.location.href = url.toString();
                            }}
                        />
                    </div>
                    <select
                        name="status"
                        defaultValue={filters.status || ''}
                        className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                        onChange={(e) => {
                            const url = new URL(window.location.href);
                            if (e.target.value) {
                                url.searchParams.set('status', e.target.value);
                            } else {
                                url.searchParams.delete('status');
                            }
                            url.searchParams.set('page', '1');
                            window.location.href = url.toString();
                        }}
                    >
                        <option value="">All Statuses</option>
                        <option value="cleared">Cleared</option>
                        <option value="blocked">Not Cleared</option>
                    </select>
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-md border">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/50">
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                    Student
                                </th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                    Reg. Number
                                </th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                    Departments
                                </th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                    Last Processed
                                </th>
                                <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {clearances.data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-4 py-12 text-center text-muted-foreground"
                                    >
                                        No clearance records found.
                                    </td>
                                </tr>
                            ) : (
                                clearances.data.map((c) => {
                                    const depts = c.department_statuses
                                        ? Object.values(c.department_statuses)
                                        : [];
                                    const approved = depts.filter(
                                        (d) => d.status === 'approved',
                                    ).length;
                                    const total = depts.length;

                                    return (
                                        <tr
                                            key={c.id}
                                            className="border-b transition-colors last:border-0 hover:bg-muted/30"
                                        >
                                            <td className="px-4 py-3 font-medium">
                                                {c.student?.name ?? 'N/A'}
                                            </td>
                                            <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                                                {c.student
                                                    ?.registration_number ??
                                                    'N/A'}
                                            </td>
                                            <td className="px-4 py-3">
                                                {c.is_cleared ? (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900 dark:text-green-300">
                                                        <ShieldCheck className="size-3" />
                                                        Cleared
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900 dark:text-red-300">
                                                        <XCircle className="size-3" />
                                                        Blocked
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-xs text-muted-foreground">
                                                {approved}/{total} approved
                                            </td>
                                            <td className="px-4 py-3 text-xs text-muted-foreground">
                                                {c.created_at
                                                    ? new Date(
                                                          c.created_at,
                                                      ).toLocaleDateString()
                                                    : 'N/A'}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <Link
                                                    href={`/admin/students/${c.student_id}/clearance`}
                                                    className="text-sm font-medium text-primary hover:underline"
                                                >
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {clearances.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            Showing {clearances.from} to {clearances.to} of{' '}
                            {clearances.total}
                        </div>
                        <div className="flex items-center gap-1">
                            {clearances.links.map((link, i) => {
                                if (!link.url) {
                                    return (
                                        <span
                                            key={i}
                                            className="inline-flex h-8 w-8 items-center justify-center rounded text-sm text-muted-foreground"
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    );
                                }
                                return (
                                    <Link
                                        key={i}
                                        href={link.url}
                                        className={`inline-flex h-8 w-8 items-center justify-center rounded text-sm transition-colors ${
                                            link.active
                                                ? 'bg-primary text-primary-foreground'
                                                : 'text-muted-foreground hover:bg-muted'
                                        }`}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

GraduationClearanceIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Graduation Clearance', href: '' },
    ],
};
