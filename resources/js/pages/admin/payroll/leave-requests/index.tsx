import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import DataTable from '@/components/shared/DataTable';
import { CheckCircle, XCircle } from 'lucide-react';

interface LeaveRequestType {
    id: number;
    type: string;
    start_date: string;
    end_date: string;
    days: number;
    reason: string | null;
    status: string;
    created_at: string;
    rejection_reason: string | null;
    faculty_staff: {
        id: number;
        staff_number: string;
        user: { id: number; name: string } | null;
    } | null;
    approver: { id: number; name: string } | null;
}

interface Props {
    requests: any;
    filters: Record<string, string | undefined>;
}

export default function LeaveRequestsIndex({ requests, filters }: Props) {
    const statusColors: Record<string, string> = {
        pending: 'text-yellow-600 bg-yellow-50',
        approved: 'text-green-600 bg-green-50',
        rejected: 'text-red-600 bg-red-50',
    };

    const columns = [
        {
            key: 'staff',
            label: 'Staff',
            render: (r: LeaveRequestType) => r.faculty_staff?.user?.name ?? '—',
        },
        { key: 'type', label: 'Type' },
        {
            key: 'dates',
            label: 'Dates',
            render: (r: LeaveRequestType) => `${r.start_date} — ${r.end_date}`,
        },
        { key: 'days', label: 'Days' },
        {
            key: 'status',
            label: 'Status',
            render: (r: LeaveRequestType) => (
                <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[r.status] || ''}`}
                >
                    {r.status}
                </span>
            ),
        },
        {
            key: 'actions',
            label: '',
            render: (r: LeaveRequestType) =>
                r.status === 'pending' ? (
                    <div className="flex gap-1">
                        <form
                            method="POST"
                            action={`/admin/payroll/leave-requests/${r.id}/status`}
                        >
                            <input
                                type="hidden"
                                name="_token"
                                value={
                                    document
                                        .querySelector('meta[name=csrf-token]')
                                        ?.getAttribute('content') ?? ''
                                }
                            />
                            <input
                                type="hidden"
                                name="action"
                                value="approve"
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                type="submit"
                                className="text-green-600"
                            >
                                <CheckCircle className="size-4" />
                            </Button>
                        </form>
                        <form
                            method="POST"
                            action={`/admin/payroll/leave-requests/${r.id}/status`}
                        >
                            <input
                                type="hidden"
                                name="_token"
                                value={
                                    document
                                        .querySelector('meta[name=csrf-token]')
                                        ?.getAttribute('content') ?? ''
                                }
                            />
                            <input type="hidden" name="action" value="reject" />
                            <input
                                type="hidden"
                                name="rejection_reason"
                                value="Declined"
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                type="submit"
                                className="text-red-600"
                            >
                                <XCircle className="size-4" />
                            </Button>
                        </form>
                    </div>
                ) : null,
        },
    ];

    return (
        <>
            <Head title="Leave Requests" />
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Leave Requests</h1>
                    <p className="text-sm text-muted-foreground">
                        Manage staff leave applications
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <Link href="/admin/payroll/leave-balances">
                            Balances
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link href="/admin/payroll/leave-requests/create">
                            New Request
                        </Link>
                    </Button>
                </div>
            </div>
            <DataTable
                columns={columns}
                data={requests}
                filters={filters}
                filterKeys={['search', 'status', 'type']}
                searchPlaceholder="Search by staff name..."
            />
        </>
    );
}
