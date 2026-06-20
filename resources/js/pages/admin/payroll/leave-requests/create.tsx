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
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';

interface Staff {
    id: number;
    staff_number: string;
    user: { id: number; name: string } | null;
}

interface Props {
    staff: Staff[];
}

export default function LeaveRequestsCreate({ staff }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        faculty_staff_id: '',
        type: 'annual',
        start_date: '',
        end_date: '',
        reason: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/payroll/leave-requests');
    };

    return (
        <>
            <Head title="New Leave Request" />
            <div className="mx-auto max-w-2xl">
                <div className="mb-6 flex items-center gap-4">
                    <Link href="/admin/payroll/leave-requests">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="size-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">
                            New Leave Request
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Submit a leave application for staff
                        </p>
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 rounded-lg border p-6"
                >
                    <div>
                        <Label>Staff Member</Label>
                        <Select
                            value={data.faculty_staff_id}
                            onValueChange={(v) =>
                                setData('faculty_staff_id', v)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select staff..." />
                            </SelectTrigger>
                            <SelectContent>
                                {staff.map((s) => (
                                    <SelectItem key={s.id} value={String(s.id)}>
                                        {s.user?.name ?? 'N/A'} (
                                        {s.staff_number})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.faculty_staff_id && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.faculty_staff_id}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label>Leave Type</Label>
                        <Select
                            value={data.type}
                            onValueChange={(v) => setData('type', v)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="annual">Annual</SelectItem>
                                <SelectItem value="sick">Sick</SelectItem>
                                <SelectItem value="study">Study</SelectItem>
                                <SelectItem value="compassionate">
                                    Compassionate
                                </SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Start Date</Label>
                            <Input
                                type="date"
                                value={data.start_date}
                                onChange={(e) =>
                                    setData('start_date', e.target.value)
                                }
                            />
                            {errors.start_date && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.start_date}
                                </p>
                            )}
                        </div>
                        <div>
                            <Label>End Date</Label>
                            <Input
                                type="date"
                                value={data.end_date}
                                onChange={(e) =>
                                    setData('end_date', e.target.value)
                                }
                            />
                            {errors.end_date && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.end_date}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <Label>Reason (optional)</Label>
                        <Textarea
                            value={data.reason}
                            onChange={(e) => setData('reason', e.target.value)}
                            rows={3}
                        />
                    </div>

                    <div className="flex justify-end gap-3">
                        <Link href="/admin/payroll/leave-requests">
                            <Button variant="outline" type="button">
                                Cancel
                            </Button>
                        </Link>
                        <Button disabled={processing}>Submit Request</Button>
                    </div>
                </form>
            </div>
        </>
    );
}
