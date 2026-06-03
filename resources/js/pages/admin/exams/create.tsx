import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { useForm } from '@inertiajs/react';
import type { Course } from '@/types';

interface Props {
    courses: Course[];
}

export default function ExamsCreate({ courses }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        course_id: '',
        exam_type: '',
        starts_at: '',
        duration_minutes: '120',
        venue: '',
        is_locked: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/exams');
    };

    return (
        <>
            <Head title="Create Exam" />

            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/exams">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold">Create Exam</h1>
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
                            <Label htmlFor="exam_type">Exam Type</Label>
                            <Select
                                value={data.exam_type}
                                onValueChange={(v) => setData('exam_type', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="midterm">
                                        Midterm
                                    </SelectItem>
                                    <SelectItem value="final">Final</SelectItem>
                                    <SelectItem value="quiz">Quiz</SelectItem>
                                    <SelectItem value="practical">
                                        Practical
                                    </SelectItem>
                                    <SelectItem value="assignment">
                                        Assignment
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.exam_type && (
                                <p className="text-sm text-destructive">
                                    {errors.exam_type}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="starts_at">Starts At</Label>
                            <Input
                                id="starts_at"
                                type="datetime-local"
                                value={data.starts_at}
                                onChange={(e) =>
                                    setData('starts_at', e.target.value)
                                }
                            />
                            {errors.starts_at && (
                                <p className="text-sm text-destructive">
                                    {errors.starts_at}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="duration_minutes">
                                Duration (minutes)
                            </Label>
                            <Input
                                id="duration_minutes"
                                type="number"
                                min="15"
                                max="600"
                                value={data.duration_minutes}
                                onChange={(e) =>
                                    setData('duration_minutes', e.target.value)
                                }
                            />
                            {errors.duration_minutes && (
                                <p className="text-sm text-destructive">
                                    {errors.duration_minutes}
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

                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="is_locked"
                                checked={data.is_locked}
                                onCheckedChange={(checked) =>
                                    setData('is_locked', checked as boolean)
                                }
                            />
                            <Label htmlFor="is_locked">
                                Lock exam (prevent changes)
                            </Label>
                        </div>

                        <Button type="submit" disabled={processing}>
                            {processing ? 'Creating...' : 'Create Exam'}
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
}

ExamsCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Exams', href: '/admin/exams' },
        { title: 'Create', href: '' },
    ],
};
