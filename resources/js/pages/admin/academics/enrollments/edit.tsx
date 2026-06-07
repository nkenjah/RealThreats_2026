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

interface Enrollment {
    id: number;
    student_id: number;
    course_offering_id: number;
    enrollment_date: string;
    status: string | null;
    grade: string | null;
}

interface Student {
    id: number;
    name: string;
}

interface CourseOffering {
    id: number;
    course?: { id: number; name: string; code: string };
}

interface Props {
    enrollment: Enrollment;
    students: Student[];
    courseOfferings: CourseOffering[];
}

export default function EnrollmentsEdit({
    enrollment,
    students,
    courseOfferings,
}: Props) {
    const { data, setData, patch, processing, errors } = useForm({
        student_id: String(enrollment.student_id),
        course_offering_id: String(enrollment.course_offering_id),
        enrollment_date: enrollment.enrollment_date,
        status: enrollment.status ?? '',
        grade: enrollment.grade ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(`/admin/enrollments/${enrollment.id}`);
    };

    return (
        <>
            <Head title="Edit Enrollment" />
            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/enrollments">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold">Edit Enrollment</h1>
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
                                            {s.name}
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
                            <Label htmlFor="course_offering_id">
                                Course Offering
                            </Label>
                            <Select
                                value={data.course_offering_id}
                                onValueChange={(v) =>
                                    setData('course_offering_id', v)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select course offering" />
                                </SelectTrigger>
                                <SelectContent>
                                    {courseOfferings.map((co) => (
                                        <SelectItem
                                            key={co.id}
                                            value={String(co.id)}
                                        >
                                            {co.course?.code} -{' '}
                                            {co.course?.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.course_offering_id && (
                                <p className="text-sm text-destructive">
                                    {errors.course_offering_id}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="enrollment_date">
                                Enrollment Date
                            </Label>
                            <Input
                                id="enrollment_date"
                                type="date"
                                value={data.enrollment_date}
                                onChange={(e) =>
                                    setData('enrollment_date', e.target.value)
                                }
                            />
                            {errors.enrollment_date && (
                                <p className="text-sm text-destructive">
                                    {errors.enrollment_date}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="status">Status</Label>
                            <Input
                                id="status"
                                value={data.status}
                                onChange={(e) =>
                                    setData('status', e.target.value)
                                }
                                placeholder="e.g. Active, Completed, Dropped"
                            />
                            {errors.status && (
                                <p className="text-sm text-destructive">
                                    {errors.status}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="grade">Grade</Label>
                            <Input
                                id="grade"
                                value={data.grade}
                                onChange={(e) =>
                                    setData('grade', e.target.value)
                                }
                                placeholder="e.g. A, B+, C"
                            />
                            {errors.grade && (
                                <p className="text-sm text-destructive">
                                    {errors.grade}
                                </p>
                            )}
                        </div>

                        <Button type="submit" disabled={processing}>
                            {processing ? 'Updating...' : 'Update Enrollment'}
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
}

EnrollmentsEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Enrollments', href: '/admin/enrollments' },
        { title: 'Edit', href: '' },
    ],
};
