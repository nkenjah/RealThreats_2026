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

interface Attendance {
    id: number;
    student_id: number;
    lecture_id: number;
    status: string;
    lecture_date: string;
    notes: string | null;
}

interface Student {
    id: number;
    name: string;
    registration_number: string;
}

interface Lecture {
    id: number;
    topic: string;
}

interface Props {
    attendance: Attendance;
    students: Student[];
    lectures: Lecture[];
}

export default function AttendanceEdit({
    attendance,
    students,
    lectures,
}: Props) {
    const { data, setData, patch, processing, errors } = useForm({
        student_id: String(attendance.student_id),
        lecture_id: String(attendance.lecture_id),
        status: attendance.status,
        lecture_date: attendance.lecture_date.slice(0, 10),
        notes: attendance.notes ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(`/admin/attendance/${attendance.id}`);
    };

    return (
        <>
            <Head title="Edit Attendance" />

            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/attendance">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold">Edit Attendance</h1>
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
                            <Label htmlFor="lecture_id">Lecture</Label>
                            <Select
                                value={data.lecture_id}
                                onValueChange={(v) => setData('lecture_id', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select lecture" />
                                </SelectTrigger>
                                <SelectContent>
                                    {lectures.map((l) => (
                                        <SelectItem
                                            key={l.id}
                                            value={String(l.id)}
                                        >
                                            {l.topic}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.lecture_id && (
                                <p className="text-sm text-destructive">
                                    {errors.lecture_id}
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
                                    <SelectItem value="present">
                                        Present
                                    </SelectItem>
                                    <SelectItem value="absent">
                                        Absent
                                    </SelectItem>
                                    <SelectItem value="late">Late</SelectItem>
                                    <SelectItem value="excused">
                                        Excused
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.status && (
                                <p className="text-sm text-destructive">
                                    {errors.status}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="lecture_date">Date</Label>
                            <Input
                                id="lecture_date"
                                type="date"
                                value={data.lecture_date}
                                onChange={(e) =>
                                    setData('lecture_date', e.target.value)
                                }
                            />
                            {errors.lecture_date && (
                                <p className="text-sm text-destructive">
                                    {errors.lecture_date}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="notes">Notes</Label>
                            <Input
                                id="notes"
                                value={data.notes}
                                onChange={(e) =>
                                    setData('notes', e.target.value)
                                }
                                placeholder="Optional notes..."
                            />
                            {errors.notes && (
                                <p className="text-sm text-destructive">
                                    {errors.notes}
                                </p>
                            )}
                        </div>

                        <Button type="submit" disabled={processing}>
                            {processing ? 'Updating...' : 'Update Attendance'}
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
}

AttendanceEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Attendance', href: '/admin/attendance' },
        { title: 'Edit', href: '' },
    ],
};
