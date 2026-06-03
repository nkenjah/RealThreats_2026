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
import type { Lecture, Course, User } from '@/types';

interface Props {
    lecture: Lecture;
    courses: Course[];
    lecturers: User[];
}

export default function LecturesEdit({ lecture, courses, lecturers }: Props) {
    const { data, setData, patch, processing, errors } = useForm({
        course_id: String(lecture.course_id),
        lecturer_id: String(lecture.lecturer_id ?? ''),
        topic: lecture.topic,
        scheduled_at: lecture.scheduled_at.slice(0, 16),
        venue: lecture.venue,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(`/admin/lectures/${lecture.id}`);
    };

    return (
        <>
            <Head title={`Edit: ${lecture.topic}`} />

            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/lectures">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold">Edit Lecture</h1>
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
                            <Label htmlFor="lecturer_id">Lecturer</Label>
                            <Select
                                value={data.lecturer_id}
                                onValueChange={(v) => setData('lecturer_id', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select lecturer" />
                                </SelectTrigger>
                                <SelectContent>
                                    {lecturers.map((l) => (
                                        <SelectItem
                                            key={l.id}
                                            value={String(l.id)}
                                        >
                                            {l.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="topic">Topic</Label>
                            <Input
                                id="topic"
                                value={data.topic}
                                onChange={(e) =>
                                    setData('topic', e.target.value)
                                }
                            />
                            {errors.topic && (
                                <p className="text-sm text-destructive">
                                    {errors.topic}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="scheduled_at">Scheduled At</Label>
                            <Input
                                id="scheduled_at"
                                type="datetime-local"
                                value={data.scheduled_at}
                                onChange={(e) =>
                                    setData('scheduled_at', e.target.value)
                                }
                            />
                            {errors.scheduled_at && (
                                <p className="text-sm text-destructive">
                                    {errors.scheduled_at}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="venue">Venue</Label>
                            <Input
                                id="venue"
                                value={data.venue}
                                onChange={(e) =>
                                    setData('venue', e.target.value)
                                }
                            />
                            {errors.venue && (
                                <p className="text-sm text-destructive">
                                    {errors.venue}
                                </p>
                            )}
                        </div>

                        <Button type="submit" disabled={processing}>
                            {processing ? 'Updating...' : 'Update Lecture'}
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
}

LecturesEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Lectures', href: '/admin/lectures' },
        { title: 'Edit', href: '' },
    ],
};
