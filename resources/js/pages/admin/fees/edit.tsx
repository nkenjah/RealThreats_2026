import { Head, Link } from '@inertiajs/react';
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
import { ArrowLeft } from 'lucide-react';
import { useForm } from '@inertiajs/react';

interface Fee {
    id: number;
    student_id: number;
    fee_type: string;
    amount: number;
    due_date: string;
    status: string;
}

interface Student {
    id: number;
    name: string;
    registration_number: string;
}

interface Props {
    fee: Fee;
    students: Student[];
}

export default function FeesEdit({ fee, students }: Props) {
    const { data, setData, patch, processing, errors } = useForm({
        student_id: String(fee.student_id),
        fee_type: fee.fee_type,
        amount: String(fee.amount),
        due_date: fee.due_date.slice(0, 10),
        status: fee.status,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(`/admin/fees/${fee.id}`);
    };

    return (
        <>
            <Head title="Edit Fee" />

            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/fees">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold">Edit Fee</h1>
                </div>

                <div className="max-w-lg rounded-lg border bg-card p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="student_id">Student</Label>
                            <Select
                                value={data.student_id}
                                onValueChange={(v) => setData('student_id', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select student" />
                                </SelectTrigger>
                                <SelectContent>
                                    {students.map((s) => (
                                        <SelectItem
                                            key={s.id}
                                            value={String(s.id)}
                                        >
                                            {s.name} ({s.registration_number})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.student_id && (
                                <p className="text-sm text-destructive">
                                    {errors.student_id}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="fee_type">Fee Type</Label>
                            <Input
                                id="fee_type"
                                value={data.fee_type}
                                onChange={(e) =>
                                    setData('fee_type', e.target.value)
                                }
                            />
                            {errors.fee_type && (
                                <p className="text-sm text-destructive">
                                    {errors.fee_type}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="amount">Amount</Label>
                            <Input
                                id="amount"
                                type="number"
                                min="0"
                                step="0.01"
                                value={data.amount}
                                onChange={(e) =>
                                    setData('amount', e.target.value)
                                }
                            />
                            {errors.amount && (
                                <p className="text-sm text-destructive">
                                    {errors.amount}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="due_date">Due Date</Label>
                            <Input
                                id="due_date"
                                type="date"
                                value={data.due_date}
                                onChange={(e) =>
                                    setData('due_date', e.target.value)
                                }
                            />
                            {errors.due_date && (
                                <p className="text-sm text-destructive">
                                    {errors.due_date}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="status">Status</Label>
                            <Select
                                value={data.status}
                                onValueChange={(v) => setData('status', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">
                                        Pending
                                    </SelectItem>
                                    <SelectItem value="paid">Paid</SelectItem>
                                    <SelectItem value="overdue">
                                        Overdue
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.status && (
                                <p className="text-sm text-destructive">
                                    {errors.status}
                                </p>
                            )}
                        </div>

                        <Button type="submit" disabled={processing}>
                            {processing ? 'Updating...' : 'Update Fee'}
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
}

FeesEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Fees', href: '/admin/fees' },
        { title: 'Edit', href: '' },
    ],
};
