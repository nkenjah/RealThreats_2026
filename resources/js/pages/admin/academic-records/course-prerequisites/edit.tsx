import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
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

interface CoursePrerequisite {
    id: number;
    course_id: number;
    prerequisite_course_id: number;
}

interface Course {
    id: number;
    name: string;
    code: string;
}

interface Props {
    coursePrerequisite: CoursePrerequisite;
    courses: Course[];
}

export default function CoursePrerequisitesEdit({
    coursePrerequisite,
    courses,
}: Props) {
    const { data, setData, patch, processing, errors } = useForm({
        course_id: String(coursePrerequisite.course_id),
        prerequisite_course_id: String(
            coursePrerequisite.prerequisite_course_id,
        ),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(
            `/admin/curriculum/course-prerequisites/${coursePrerequisite.id}`,
        );
    };

    return (
        <>
            <Head title="Edit Prerequisite" />
            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/curriculum/course-prerequisites">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold">
                        Edit Course Prerequisite
                    </h1>
                </div>

                <div className="max-w-lg rounded-lg border bg-card p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="course_id">Course</Label>
                            <Select
                                value={data.course_id}
                                onValueChange={(v) => setData('course_id', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select course" />
                                </SelectTrigger>
                                <SelectContent>
                                    {courses.map((c) => (
                                        <SelectItem
                                            key={c.id}
                                            value={String(c.id)}
                                        >
                                            {c.code} - {c.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.course_id && (
                                <p className="text-sm text-destructive">
                                    {errors.course_id}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="prerequisite_course_id">
                                Prerequisite Course
                            </Label>
                            <Select
                                value={data.prerequisite_course_id}
                                onValueChange={(v) =>
                                    setData('prerequisite_course_id', v)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select prerequisite" />
                                </SelectTrigger>
                                <SelectContent>
                                    {courses.map((c) => (
                                        <SelectItem
                                            key={c.id}
                                            value={String(c.id)}
                                        >
                                            {c.code} - {c.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.prerequisite_course_id && (
                                <p className="text-sm text-destructive">
                                    {errors.prerequisite_course_id}
                                </p>
                            )}
                        </div>

                        <Button type="submit" disabled={processing}>
                            {processing ? 'Updating...' : 'Update Prerequisite'}
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
}

CoursePrerequisitesEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        {
            title: 'Course Prerequisites',
            href: '/admin/curriculum/course-prerequisites',
        },
        { title: 'Edit', href: '' },
    ],
};
