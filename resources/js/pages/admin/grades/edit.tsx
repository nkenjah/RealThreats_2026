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

interface Grade {
    id: number;
    student_id: number;
    course_offering_id: number;
    grade: string;
    grade_points: number | null;
    academic_year: string;
    semester: string;
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
    grade: Grade;
    students: Student[];
    courseOfferings: CourseOffering[];
}

export default function GradesEdit({
    grade,
    students,
    courseOfferings,
}: Props) {
    const { data, setData, patch, processing, errors } = useForm({
        student_id: String(grade.student_id),
        course_offering_id: String(grade.course_offering_id),
        grade: grade.grade,
        grade_points: String(grade.grade_points ?? ''),
        academic_year: grade.academic_year,
        semester: grade.semester,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(`/admin/grades/${grade.id}`);
    };

    return (
        <>
            <Head title="Edit Grade" />
            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/grades">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold">Edit Grade</h1>
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
                            <Label htmlFor="grade">Grade</Label>
                            <Input
                                id="grade"
                                value={data.grade}
                                onChange={(e) =>
                                    setData('grade', e.target.value)
                                }
                            />
                            {errors.grade && (
                                <p className="text-sm text-destructive">
                                    {errors.grade}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="grade_points">Grade Points</Label>
                            <Input
                                id="grade_points"
                                type="number"
                                step="0.01"
                                value={data.grade_points}
                                onChange={(e) =>
                                    setData('grade_points', e.target.value)
                                }
                            />
                            {errors.grade_points && (
                                <p className="text-sm text-destructive">
                                    {errors.grade_points}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="academic_year">Academic Year</Label>
                            <Input
                                id="academic_year"
                                value={data.academic_year}
                                onChange={(e) =>
                                    setData('academic_year', e.target.value)
                                }
                            />
                            {errors.academic_year && (
                                <p className="text-sm text-destructive">
                                    {errors.academic_year}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="semester">Semester</Label>
                            <Select
                                value={data.semester}
                                onValueChange={(v) => setData('semester', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select semester" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">
                                        Semester 1
                                    </SelectItem>
                                    <SelectItem value="2">
                                        Semester 2
                                    </SelectItem>
                                    <SelectItem value="3">
                                        Semester 3
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.semester && (
                                <p className="text-sm text-destructive">
                                    {errors.semester}
                                </p>
                            )}
                        </div>

                        <Button type="submit" disabled={processing}>
                            {processing ? 'Updating...' : 'Update Grade'}
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
}

GradesEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Grades', href: '/admin/grades' },
        { title: 'Edit', href: '' },
    ],
};
