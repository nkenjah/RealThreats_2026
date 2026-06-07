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
    student?: { id: number; name: string };
}

interface CourseOffering {
    id: number;
    course?: { id: number; name: string; code: string };
}

interface Props {
    enrollments: Enrollment[];
    courseOfferings: CourseOffering[];
}

export default function FinalTermCreate({
    enrollments,
    courseOfferings,
}: Props) {
    const { data, setData, post, processing, errors } = useForm({
        enrollment_id: '',
        course_offering_id: '',
        total_score: '',
        letter_grade: '',
        gpa_points: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/final-term-grades');
    };

    return (
        <>
            <Head title="Create Final Grade" />
            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/final-term-grades">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold">
                        Create Final Term Grade
                    </h1>
                </div>

                <div className="max-w-lg rounded-lg border bg-card p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="enrollment_id">Enrollment</Label>
                            <Select
                                value={data.enrollment_id}
                                onValueChange={(v) =>
                                    setData('enrollment_id', v)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select enrollment" />
                                </SelectTrigger>
                                <SelectContent>
                                    {enrollments.map((e) => (
                                        <SelectItem
                                            key={e.id}
                                            value={String(e.id)}
                                        >
                                            {e.student?.name ?? 'N/A'}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.enrollment_id && (
                                <p className="text-sm text-destructive">
                                    {errors.enrollment_id}
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
                            <Label htmlFor="total_score">Total Score</Label>
                            <Input
                                id="total_score"
                                type="number"
                                step="0.01"
                                value={data.total_score}
                                onChange={(e) =>
                                    setData('total_score', e.target.value)
                                }
                                placeholder="e.g. 85.5"
                            />
                            {errors.total_score && (
                                <p className="text-sm text-destructive">
                                    {errors.total_score}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="letter_grade">Letter Grade</Label>
                            <Select
                                value={data.letter_grade}
                                onValueChange={(v) =>
                                    setData('letter_grade', v)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select grade" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="A">A</SelectItem>
                                    <SelectItem value="B">B</SelectItem>
                                    <SelectItem value="C">C</SelectItem>
                                    <SelectItem value="D">D</SelectItem>
                                    <SelectItem value="F">F</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.letter_grade && (
                                <p className="text-sm text-destructive">
                                    {errors.letter_grade}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="gpa_points">GPA Points</Label>
                            <Input
                                id="gpa_points"
                                type="number"
                                step="0.01"
                                value={data.gpa_points}
                                onChange={(e) =>
                                    setData('gpa_points', e.target.value)
                                }
                                placeholder="e.g. 4.0"
                            />
                            {errors.gpa_points && (
                                <p className="text-sm text-destructive">
                                    {errors.gpa_points}
                                </p>
                            )}
                        </div>

                        <Button type="submit" disabled={processing}>
                            {processing ? 'Creating...' : 'Create Final Grade'}
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
}

FinalTermCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Final Term Grades', href: '/admin/final-term-grades' },
        { title: 'Create', href: '' },
    ],
};
